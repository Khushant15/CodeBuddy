import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  increment,
  serverTimestamp,
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { auth } from "@/app/firebase/config";

export const db = getFirestore(auth.app);

// ─── Types ──────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];   // flat list: "py-001-variables"
  completedModules: string[];   // flat list: "python-module-01-fundamentals"
  completedChallenges: string[];
  chatHistory: ChatMessage[];
  createdAt: unknown;
  updatedAt: unknown;
}

/** Per-track progress sub-document at users/{uid}/progress/{track} */
export interface TrackProgress {
  track: string;
  completedLessons: string[];
  completedModules: string[];
  totalXpEarned: number;
  lastActivity: unknown;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

// ─── XP / Level helpers ──────────────────────────────────────────────────────

export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function xpToLevel(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  return level;
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getOrCreateUserProfile(
  uid: string,
  email: string,
  displayName: string
): Promise<UserProfile> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data() as UserProfile;
  }

  const profile: UserProfile = {
    uid,
    email,
    displayName,
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: new Date().toISOString().split("T")[0],
    completedLessons: [],
    completedModules: [],
    completedChallenges: [],
    chatHistory: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, profile);
  return profile;
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export async function getLeaderboard(limitCount = 10): Promise<UserProfile[]> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("xp", "desc"), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as UserProfile);
}

// ─── Track Progress ───────────────────────────────────────────────────────────

export async function getTrackProgress(
  uid: string,
  track: string
): Promise<TrackProgress | null> {
  const ref = doc(db, "users", uid, "progress", track);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as TrackProgress) : null;
}

// ─── Lesson Completion ────────────────────────────────────────────────────────

/**
 * Mark a lesson complete in Firestore.
 * - Awards XP, recalculates level, updates streak
 * - Updates per-track progress sub-document
 * - Returns new XP, level, and whether user leveled up
 */
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

  // Prevent double-awarding XP
  if (userData.completedLessons?.includes(lessonId)) {
    return { newXp: userData.xp, newLevel: userData.level, leveledUp: false };
  }

  const newXp = (userData.xp || 0) + xpReward;
  const oldLevel = userData.level || 1;
  const newLevel = xpToLevel(newXp);
  const leveledUp = newLevel > oldLevel;

  // Streak
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
    xp: newXp,
    level: newLevel,
    streak: newStreak,
    lastActiveDate: today,
    updatedAt: serverTimestamp(),
  });

  // Per-track sub-document
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

// ─── Module Completion ────────────────────────────────────────────────────────

/**
 * Called when ALL lessons in a module are completed.
 * Awards 200 bonus XP and marks the module complete on both
 * the user profile and the per-track progress sub-document.
 */
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

// ─── Challenge / Streak ──────────────────────────────────────────────────────

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

export async function updateStreak(uid: string): Promise<void> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data() as UserProfile;
  const today = new Date().toISOString().split("T")[0];
  if (data.lastActiveDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split("T")[0];
  const newStreak = data.lastActiveDate === yStr ? data.streak + 1 : 1;

  await updateDoc(ref, {
    streak: newStreak,
    lastActiveDate: today,
    updatedAt: serverTimestamp(),
  });
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export async function saveChatMessage(
  uid: string,
  msg: ChatMessage
): Promise<void> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data() as UserProfile;
  const history = [...(data.chatHistory || []), msg].slice(-50);

  await updateDoc(ref, {
    chatHistory: history,
    updatedAt: serverTimestamp(),
  });
}
