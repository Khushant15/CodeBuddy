'use client';
import React, { useState, useRef, useCallback } from 'react';
import { CheckCircle, XCircle, Zap, Sparkles, Loader2 } from 'lucide-react';
import { CodeEditor } from '@/components/CodeEditor';
import { calculateExerciseXp } from '@/lib/xpService';

export function CodeWriteExercise({ exercise, onComplete }: any) {
  const language = exercise.language || 'python';
  const startedAtRef = useRef<number | null>(null);
  const runAttemptsRef = useRef(0);
  const solutionRevealedRef = useRef(false);
  
  const [submitted, setSubmitted] = useState(false);
  const [xpResult, setXpResult] = useState<{ xp: number; label: string } | null>(null);
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleRun = useCallback((code: string, output: string, passed: boolean, error?: string) => {
    if (startedAtRef.current === null) startedAtRef.current = Date.now();
    runAttemptsRef.current += 1;

    if (passed && !submitted) {
      setSubmitted(true);
      const elapsed = startedAtRef.current ? Math.floor((Date.now() - startedAtRef.current) / 1000) : 0;
      const result = calculateExerciseXp({
        baseXp: exercise.xpReward ?? 50,
        runAttempts: runAttemptsRef.current,
        solutionRevealed: solutionRevealedRef.current,
        timeSpentSeconds: elapsed,
      });
      setXpResult(result);
      setTimeout(() => onComplete(true, result.xp, result.label), 1500);
    }
  }, [submitted, exercise.xpReward, onComplete]);

  const handleReview = async () => {
    setIsReviewing(true);
    setAiReview(null);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: exercise.starterCode || '', language, context: exercise.question }),
      });
      const data = await res.json();
      setAiReview(data.review ?? "Sorry, I couldn't generate a review right now.");
    } catch {
      setAiReview('Connection error. AI Review failed.');
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="exercise-container card p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--neon-green)]">Solve the Challenge</h3>
          <p className="text-gray-300 mt-1 text-sm">{exercise.question}</p>
        </div>
        <div className="shrink-0 flex items-center gap-2 text-xs font-mono text-gray-500 border border-gray-700 rounded-lg px-3 py-1.5">
          <Zap size={12} className="text-yellow-400" />
          Up to {(exercise.xpReward ?? 50) + 40} XP
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><CheckCircle size={11} className="text-green-400" /> 1st try: +25 bonus</span>
        <span className="flex items-center gap-1"><CheckCircle size={11} className="text-cyan-400" /> Under 5 min: +15 speed</span>
        <span className="flex items-center gap-1"><XCircle size={11} className="text-red-400" /> 3+ attempts: half XP</span>
      </div>

      <CodeEditor
        language={language}
        initialCode={exercise.starterCode || ''}
        solution={exercise.solution}
        testCases={exercise.testCases || []}
        onRun={handleRun}
        onSolutionRevealed={() => { solutionRevealedRef.current = true; }}
        showPreview={language !== 'python'}
        minHeight="260px"
      />

      {xpResult && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 animate-in fade-in">
          <Zap size={20} className="text-yellow-400" />
          <div>
            <p className="text-yellow-300 font-bold text-sm">+{xpResult.xp} XP earned!</p>
            <p className="text-gray-400 text-xs mt-0.5">{xpResult.label}</p>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={handleReview} disabled={isReviewing} className="btn-neon px-4 py-2 flex items-center gap-2 border-[var(--neon-violet)] text-[var(--neon-violet)] hover:bg-[var(--neon-violet)]/10 text-sm">
          {isReviewing ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          AI Review
        </button>
      </div>

      {aiReview && (
        <div className="bg-[rgba(191,95,255,0.05)] border border-[rgba(191,95,255,0.3)] p-5 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-[var(--neon-violet)]">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">AI Mentor Review</span>
          </div>
          <div className="text-sm text-gray-300 space-y-1">
            {aiReview.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('#') ? 'text-white font-bold mt-3' : ''}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
