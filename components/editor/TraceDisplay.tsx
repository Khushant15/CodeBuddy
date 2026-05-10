'use client';
import { ChevronRight } from 'lucide-react';
import { ExecutionTrace } from '@/hooks/useCodeExecution';

export function TraceDisplay({ traces }: { traces: ExecutionTrace[] }) {
  if (traces.length === 0) return null;

  return (
    <div className="space-y-0.5">
      {traces.map((t, i) => (
        <div
          key={i}
          className={`flex items-start gap-2 text-xs font-mono px-2 py-0.5 rounded transition-all animate-in fade-in slide-in-from-left-2 duration-200 ${
            t.type === 'stderr'
              ? 'text-red-400 bg-red-500/5'
              : t.type === 'info'
              ? 'text-blue-400 bg-blue-500/5'
              : 'text-green-300'
          }`}
          style={{ animationDelay: `${i * 30}ms` }}
        >
          <ChevronRight size={10} className="mt-0.5 shrink-0 opacity-60" />
          <span className="text-gray-500 shrink-0">Line {t.line}:</span>
          <span className="whitespace-pre-wrap break-all">{t.output}</span>
        </div>
      ))}
    </div>
  );
}
