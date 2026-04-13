import { auth } from "./config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const signupWithEmail = async (email: string, password: string): Promise<User> => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const loginWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const getCurrentUser = (): User | null => auth.currentUser;
