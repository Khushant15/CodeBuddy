"use client";

import { motion } from "framer-motion";
import { CodeFeedback } from "@/lib/codeAnalyzer";
import { CheckCircle, AlertTriangle, Lightbulb, Shield, Code, Zap } from "lucide-react";

export function CodeFeedbackDisplay({ feedback, earnedXp }: { feedback: CodeFeedback, earnedXp: number }) {
  if (!feedback) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 border border-[rgba(0,255,135,0.2)] bg-gradient-to-br from-[rgba(0,255,135,0.02)] to-transparent"
    >
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <h2 className="font-heading text-lg font-700 tracking-wider text-[var(--neon-green)] flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> Code Quality Analysis
        </h2>
        <div className="text-right">
          <p className="text-[10px] font-mono text-white/50 uppercase">Quality Score</p>
          <p className="font-heading text-2xl font-800 text-white leading-none">{feedback.score}<span className="text-lg text-white/30">/10</span></p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-5">
          <div>
            <h3 className="flex items-center gap-2 text-[11px] font-mono text-white/50 uppercase tracking-widest mb-3 bg-white/5 inline-flex px-2 py-0.5 rounded-full">
              <Code className="w-3.5 h-3.5 text-[var(--neon-cyan)]" /> Style & Format
            </h3>
            <ul className="space-y-2 text-sm text-white/70 font-mono text-xs">
              {feedback.style.variableNaming.map((s, i) => <li key={`vn-${i}`} className="flex gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" /> {s}</li>)}
              {feedback.style.comments.map((s, i) => <li key={`c-${i}`} className="flex gap-2"><AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" /> {s}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-[11px] font-mono text-white/50 uppercase tracking-widest mb-3 bg-white/5 inline-flex px-2 py-0.5 rounded-full">
               <Shield className="w-3.5 h-3.5 text-[var(--neon-violet)]" /> Security Checks
             </h3>
             <ul className="space-y-2 text-sm text-white/70 font-mono text-xs">
                {feedback.security.map((s, i) => <li key={`sec-${i}`} className="flex gap-2"><CheckCircle className="w-3.5 h-3.5 text-[var(--neon-violet)] shrink-0 mt-0.5" /> {s}</li>)}
             </ul>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <h3 className="flex items-center gap-2 text-[11px] font-mono text-white/50 uppercase tracking-widest mb-3 bg-white/5 inline-flex px-2 py-0.5 rounded-full">
              <Zap className="w-3.5 h-3.5 text-[var(--neon-orange)]" /> Performance
            </h3>
            <div className="bg-black/20 rounded-lg p-3 mb-3 grid grid-cols-2 gap-2 text-center border border-white/5">
               <div>
                  <span className="block text-[10px] uppercase font-mono text-white/40 mb-1">Time Complextity</span>
                  <span className="font-heading text-[var(--neon-orange)] text-lg">{feedback.performance.timeComplexity}</span>
               </div>
               <div>
                  <span className="block text-[10px] uppercase font-mono text-white/40 mb-1">Space Complexity</span>
                  <span className="font-heading text-[var(--neon-orange)] text-lg">{feedback.performance.spaceComplexity}</span>
               </div>
            </div>
            <ul className="space-y-2 text-sm text-white/70 font-mono text-xs">
               {feedback.performance.optimizations.map((s, i) => <li key={`opt-${i}`} className="flex gap-2"><Lightbulb className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" /> {s}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[rgba(0,255,135,0.05)] rounded-xl p-4 flex items-center justify-between border border-[rgba(0,255,135,0.1)]">
        <div>
          <p className="font-heading text-[11px] text-white/60 mb-1">TOTAL XP EARNED</p>
          <div className="flex items-center gap-3">
             <span className="text-[11px] font-mono text-white/40">Base: <span className="text-[var(--neon-green)]">+{earnedXp - 10}XP</span></span>
             <span className="text-[11px] font-mono text-white/40">Bonus: <span className="text-[var(--neon-violet)]">+10XP</span></span>
          </div>
        </div>
        <div className="font-heading text-4xl font-800 text-[var(--neon-green)] drop-shadow-[0_0_10px_rgba(0,255,135,0.3)]">
           +{earnedXp}
        </div>
      </div>
    </motion.div>
  );
}
