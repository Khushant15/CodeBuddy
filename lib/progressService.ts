import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  increment,
  serverTimestamp,
  collection,
  query,
  getDocs,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { 
  UserProfile, 
  TrackProgress, 
  LessonProgress, 
  ChallengeProgress, 
  ProjectStageProgress 
} from "./userService";
import { xpToLevel, calculateNextReview } from "./xpService";

// ─── Lesson Progress ─────────────────────────────────────────────────────────

export async function saveReviewOutcome(uid: string, lessonId: string, confidence: number): Promise<number> {
  const ref = doc(db, "users", uid, "lessonProgress", lessonId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return 0;

  const data = snap.data() as LessonProgress;
  const currentReview = data.reviewState || { dueDate: Date.now(), repetition: 0, easeFactor: 2.5, lastReviewDate: 0, lastConfidence: 0 };
  const { dueInDays, repetition, newEaseFactor } = calculateNextReview(currentReview.repetition, currentReview.easeFactor, confidence);
  const newDueDate = Date.now() + dueInDays * 24 * 60 * 60 * 1000;

  await updateDoc(ref, {
    reviewState: { dueDate: newDueDate, repetition, easeFactor: newEaseFactor, lastReviewDate: Date.now(), lastConfidence: confidence }
  });

  const xpBonus = Math.min(50, repetition * 10);
  if (xpBonus > 0) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { xp: increment(xpBonus) });
  }

  return xpBonus;
}

export async function completeLessonInFirebase(
  uid: string,
  lessonId: string,
  xpReward: number,
  track?: string
): Promise<{ newXp: number; newLevel: number; leveledUp: boolean }> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return { newXp: xpReward, newLevel: 1, leveledUp: false };
  }

  const userData = userSnap.data() as UserProfile;

  if (userData.completedLessons?.includes(lessonId)) {
    return { newXp: userData.xp, newLevel: userData.level, leveledUp: false };
  }

  const newXp = (userData.xp || 0) + xpReward;
  const oldLevel = userData.level || 1;
  const newLevel = xpToLevel(newXp);
  const leveledUp = newLevel > oldLevel;

  // Streak logic (mirrored from streakService but using batch here)
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split("T")[0];
  const last = userData.lastActiveDate;
  const newStreak =
    last === today ? userData.streak
    : last === yStr ? (userData.streak || 0) + 1
    : 1;

  const batch = writeBatch(db);

  batch.update(userRef, {
    completedLessons: arrayUnion(lessonId),
    xp: increment(xpReward),
    // We update level here but it's better to calculate it on the fly in the UI or use a cloud function.
    // For now, keeping the current level calculation but it might be slightly off if multiple updates happen.
    level: newLevel, 
    streak: newStreak,
    lastActiveDate: today,
    updatedAt: serverTimestamp(),
  });

  if (track) {
    const trackRef = doc(db, "users", uid, "progress", track);
    const trackSnap = await getDoc(trackRef);

    if (trackSnap.exists()) {
      batch.update(trackRef, {
        completedLessons: arrayUnion(lessonId),
        totalXpEarned: increment(xpReward),
        lastActivity: serverTimestamp(),
      });
    } else {
      batch.set(trackRef, {
        track,
        completedLessons: [lessonId],
        completedModules: [],
        totalXpEarned: xpReward,
        lastActivity: serverTimestamp(),
      } as TrackProgress);
    }
  }

  await batch.commit();
  return { newXp, newLevel, leveledUp };
}

export async function completeModuleInFirebase(
  uid: string,
  moduleId: string,
  track: string,
  bonusXp: number = 200
): Promise<void> {
  const batch = writeBatch(db);

  const userRef = doc(db, "users", uid);
  batch.update(userRef, {
    completedModules: arrayUnion(moduleId),
    xp: increment(bonusXp),
    updatedAt: serverTimestamp(),
  });

  const trackRef = doc(db, "users", uid, "progress", track);
  const trackSnap = await getDoc(trackRef);

  if (trackSnap.exists()) {
    batch.update(trackRef, {
      completedModules: arrayUnion(moduleId),
      totalXpEarned: increment(bonusXp),
      lastActivity: serverTimestamp(),
    });
  } else {
    batch.set(trackRef, {
      track,
      completedLessons: [],
      completedModules: [moduleId],
      totalXpEarned: bonusXp,
      lastActivity: serverTimestamp(),
    } as TrackProgress);
  }

  await batch.commit();
}

// ─── Challenge Progress ──────────────────────────────────────────────────────

export async function completeChallengeInFirebase(
  uid: string,
  challengeKey: string,
  xpReward: number
): Promise<void> {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    completedChallenges: arrayUnion(challengeKey),
    xp: increment(xpReward),
    updatedAt: serverTimestamp(),
  });
}

export async function saveChallengeProgress(
  uid: string,
  data: {
    challengeId: string;
    difficulty: string;
    category: string;
    solved: boolean;
    hintsUsed: number;
    hintXpCost: number;
    timeSpentSeconds: number;
    userCode: string;
    xpEarned: number;
  }
): Promise<void> {
  const ref  = doc(db, "users", uid, "challengeProgress", data.challengeId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const existing = snap.data() as ChallengeProgress;
    await updateDoc(ref, {
      attempts:   increment(1),
      solved:     data.solved || existing.solved,
      ...(data.solved && !existing.solved && { solvedAt: serverTimestamp() }),
      "hints.revealedCount": increment(data.hintsUsed),
      "hints.costXP":        increment(data.hintXpCost),
      bestTime:   data.solved
        ? Math.min(existing.bestTime || Infinity, data.timeSpentSeconds)
        : existing.bestTime,
      timeSpent:  increment(data.timeSpentSeconds),
      userCode:   data.userCode,
      xpEarned:   Math.max(existing.xpEarned, data.xpEarned),
    });
  } else {
    await setDoc(ref, {
      challengeId:     data.challengeId,
      difficulty:      data.difficulty,
      category:        data.category,
      attempts:        1,
      solved:          data.solved,
      ...(data.solved && { solvedAt: serverTimestamp() }),
      hints: { revealedCount: data.hintsUsed, costXP: data.hintXpCost },
      bestTime:        data.solved ? data.timeSpentSeconds : 0,
      timeSpent:       data.timeSpentSeconds,
      userCode:        data.userCode,
      feedbackViewed:  false,
      xpEarned:        data.xpEarned,
    } as ChallengeProgress);
  }
}

export async function getChallengeProgress(
  uid: string,
  challengeId: string
): Promise<ChallengeProgress | null> {
  const ref  = doc(db, "users", uid, "challengeProgress", challengeId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as ChallengeProgress) : null;
}

export async function getAllChallengeProgress(uid: string): Promise<ChallengeProgress[]> {
  const q = query(collection(db, "users", uid, "challengeProgress"));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as ChallengeProgress);
}

// ─── Project Progress ─────────────────────────────────────────────────────────

export async function saveProjectStageProgress(
  uid: string,
  projectId: string,
  stageNumber: number,
  passed: boolean,
  xpEarned: number,
  lastCode: string
): Promise<void> {
  const ref = doc(db, "users", uid, "projectProgress", `${projectId}_stage_${stageNumber}`);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const existing = snap.data() as ProjectStageProgress;
    await updateDoc(ref, {
      attempts: increment(1),
      passed: passed || existing.passed,
      xpEarned: Math.max(existing.xpEarned, xpEarned),
      lastCode: lastCode
    });
  } else {
    await setDoc(ref, {
      projectId,
      stageNumber,
      passed,
      xpEarned,
      attempts: 1,
      lastCode
    } as ProjectStageProgress);
  }

  if (passed) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      xp: increment(xpEarned),
      updatedAt: serverTimestamp()
    });
  }
}

export async function getProjectProgress(uid: string, projectId: string): Promise<ProjectStageProgress[]> {
  const q = query(collection(db, "users", uid, "projectProgress")); 
  const snap = await getDocs(q);
  const all = snap.docs.map(d => d.data() as ProjectStageProgress);
  return all.filter(p => p.projectId === projectId).sort((a,b) => a.stageNumber - b.stageNumber);
}

// ─── Granular Lesson Progress ────────────────────────────────────────────────

export async function saveLessonProgress(
  uid: string,
  data: {
    lessonId: string;
    trackId: string;
    moduleId: string;
    codeRunAttempts: number;
    correctRuns: number;
    solutionRevealed: boolean;
    timeSpentSeconds: number;
    xpEarned: number;
    status: LessonProgress['status'];
  }
): Promise<void> {
  const ref  = doc(db, "users", uid, "lessonProgress", data.lessonId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const existing = snap.data() as LessonProgress;
    await updateDoc(ref, {
      attempts:    increment(1),
      lastAttempt: serverTimestamp(),
      "codeSolutions.codeRunAttempts": increment(data.codeRunAttempts),
      "codeSolutions.correctRuns":     increment(data.correctRuns),
      ...(data.solutionRevealed && {
        "codeSolutions.solutionRevealed": true,
        "codeSolutions.solutionRevealedAt": serverTimestamp(),
      }),
      timeSpent: increment(data.timeSpentSeconds),
      status:    data.status,
      xpEarned:  data.xpEarned,
    });
  } else {
    const progress: LessonProgress = {
      lessonId:  data.lessonId,
      trackId:   data.trackId,
      moduleId:  data.moduleId,
      attempts:  1,
      lastAttempt: serverTimestamp(),
      codeSolutions: {
        codeRunAttempts:  data.codeRunAttempts,
        correctRuns:      data.correctRuns,
        solutionRevealed: data.solutionRevealed,
        ...(data.solutionRevealed && { solutionRevealedAt: serverTimestamp() }),
      },
      timeSpent:  data.timeSpentSeconds,
      startedAt:  serverTimestamp(),
      status:     data.status,
      xpEarned:   data.xpEarned,
    };
    await setDoc(ref, progress);
  }
}

export async function getLessonProgress(
  uid: string,
  lessonId: string
): Promise<LessonProgress | null> {
  const ref  = doc(db, "users", uid, "lessonProgress", lessonId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as LessonProgress) : null;
}

export async function getAllLessonProgress(uid: string): Promise<LessonProgress[]> {
  const q = query(collection(db, "users", uid, "lessonProgress"));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as LessonProgress);
}
