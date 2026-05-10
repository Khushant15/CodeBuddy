import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Struggle {
  type: string;
  concept: string;
  suggestion: string;
  bonus: string;
  actionLabel: string;
  actionLink: string;
}

export function StruggleAlert({ struggles }: { struggles: Struggle[] }) {
  if (!struggles || struggles.length === 0) return null;

  return (
    <div className="space-y-4">
      {struggles.map((struggle, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * idx }}
          className="bg-[rgba(255,107,43,0.05)] border border-[rgba(255,107,43,0.3)] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="bg-[rgba(255,107,43,0.1)] p-2 rounded-lg shrink-0">
              <AlertTriangle className="text-[var(--neon-orange)] w-5 h-5" />
            </div>
            <div>
              <p className="font-heading text-sm text-[var(--neon-orange)] uppercase tracking-wider mb-1">
                {struggle.type}: {struggle.concept}
              </p>
              <p className="text-white/60 text-xs font-mono">
                {struggle.suggestion}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] font-mono text-[var(--neon-green)] px-2 py-1 bg-[rgba(0,255,135,0.1)] rounded-full">
              {struggle.bonus}
            </span>
            <Link href={struggle.actionLink} className="btn-neon border-[rgba(255,107,43,0.4)] text-[var(--neon-orange)] hover:bg-[rgba(255,107,43,0.1)] py-1.5 px-3 text-[11px] flex items-center gap-2">
              {struggle.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
