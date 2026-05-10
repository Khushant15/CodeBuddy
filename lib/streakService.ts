import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { UserProfile } from "./userService";

/**
 * Update user daily streak.
 * Logic:
 * - If last active was today, do nothing.
 * - If last active was yesterday, increment streak.
 * - If last active was before yesterday, reset streak to 1.
 */
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
  const newStreak = data.lastActiveDate === yStr ? (data.streak || 0) + 1 : 1;

  await updateDoc(ref, {
    streak: newStreak,
    lastActiveDate: today,
    updatedAt: serverTimestamp(),
  });
}
