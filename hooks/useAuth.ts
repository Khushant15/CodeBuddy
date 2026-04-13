"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/app/firebase/config";

export function useAuth(redirectTo = "/login") {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace(redirectTo);
      } else {
        setUser(u);
      }
      setLoading(false);
    });
    return unsub;
  }, [router, redirectTo]);

  return { user, loading };
}
