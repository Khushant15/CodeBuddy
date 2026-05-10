import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];   
  completedModules: string[];   
  completedChallenges: string[];
  chatHistory: ChatMessage[];
  createdAt: unknown;
  updatedAt: unknown;
}

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

export interface LessonProgress {
  lessonId: string;
  trackId: string;
  moduleId: string;
  attempts: number;           
  lastAttempt: unknown;       
  codeSolutions: {
    codeRunAttempts: number;  
    correctRuns: number;      
    solutionRevealed: boolean;
    solutionRevealedAt?: unknown;
  };
  timeSpent: number;          
  startedAt: unknown;         
  status: 'started' | 'in-progress' | 'completed' | 'mastered';
  xpEarned: number;
  reviewState?: {
    dueDate: number;         
    repetition: number;      
    easeFactor: number;      
    lastReviewDate: number;  
    lastConfidence: number;  
  };
}

export interface ChallengeProgress {
  challengeId: string;
  difficulty: string;
  category: string;
  attempts: number;
  solved: boolean;
  solvedAt?: unknown;
  hints: {
    revealedCount: number;
    costXP: number;
  };
  bestTime: number;    
  timeSpent: number;   
  userCode: string;
  feedbackViewed: boolean;
  xpEarned: number;
}

export interface ProjectStageProgress {
  projectId: string;
  stageNumber: number;
  passed: boolean;
  xpEarned: number;
  attempts: number;
  lastCode: string;
}

// ─── Profile Management ──────────────────────────────────────────────────────

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

export async function getLeaderboard(limitCount = 10): Promise<UserProfile[]> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("xp", "desc"), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as UserProfile);
}

export async function getTrackProgress(
  uid: string,
  track: string
): Promise<TrackProgress | null> {
  const ref = doc(db, "users", uid, "progress", track);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as TrackProgress) : null;
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

// ─── Re-exports for Backward Compatibility ───────────────────────────────────

export * from "./xpService";
export * from "./progressService";
export * from "./streakService";
