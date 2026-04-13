"use client";
import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[rgba(0,255,135,0.1)] border border-[rgba(0,255,135,0.2)] flex items-center justify-center mx-auto mb-4">
            <div className="w-5 h-5 border-2 border-[var(--neon-green)] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-xs font-mono text-white/25">Authenticating…</p>
        </div>
      </div>
    );
  }

  if (!user) return null; // router.replace already triggered
  return <>{children}</>;
}
