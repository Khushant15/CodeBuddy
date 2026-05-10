"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Repeat, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface ReviewItem {
  lessonId: string;
  title: string;
  dueToday: boolean;
}

export function ReviewQueue({ reviews = [] }: { reviews?: ReviewItem[] }) {
  const [items, setItems] = useState<ReviewItem[]>(reviews.filter(r => r.dueToday));

  if (items.length === 0) {
    return (
      <div className="card p-6 flex flex-col items-center justify-center text-center border-dashed border-white/10 h-full">
        <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
           <CheckCircle className="w-6 h-6 text-green-400" />
        </div>
        <h3 className="font-heading text-sm text-white/80 font-700 tracking-wider mb-1">ALL CAUGHT UP</h3>
        <p className="text-[11px] text-white/40 font-mono">You have no spaced-repetition reviews due today.</p>
      </div>
    );
  }

  return (
    <div className="card p-6 border border-[rgba(191,95,255,0.2)] bg-gradient-to-br from-[rgba(191,95,255,0.05)] to-transparent h-full">
      <div className="flex items-center gap-3 mb-5">
        <Repeat className="text-[var(--neon-violet)] w-5 h-5" />
        <h2 className="font-heading text-sm font-700 tracking-wider text-white/70">SPACED REPETITION</h2>
        <span className="ml-auto text-xs font-mono bg-[rgba(191,95,255,0.15)] text-[var(--neon-violet)] px-2 py-0.5 rounded-full border border-[rgba(191,95,255,0.3)]">{items.length} Due</span>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.lessonId} className="bg-black/20 border border-[rgba(191,95,255,0.1)] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono text-[var(--neon-violet)] uppercase tracking-widest mb-1">Review</p>
              <p className="text-sm text-white/80 font-semibold">{item.title}</p>
            </div>
            <Link 
              href={`/learn?review=${item.lessonId}`}
              className="btn-neon border-[rgba(191,95,255,0.3)] text-[var(--neon-violet)] hover:bg-[rgba(191,95,255,0.1)] py-1.5 px-3 text-xs"
            >
              Start <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
