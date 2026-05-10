'use client';

// app/learn/[track]/[moduleId]/[lessonId]/progress/page.tsx
// Per-lesson analytics dashboard — shows attempts, time, mastery, concept breakdown

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getModule } from '@/lib/curriculum/contentLoader';
import { getLessonProgress, getOrCreateUserProfile } from '@/lib/userService';
import type { LessonProgress } from '@/lib/userService';
import type { Curriculum, Lesson, Track } from '@/lib/curriculum/types';
import { AuthGuard } from '@/components/AuthGuard';
import Link from 'next/link';
import {
  BookOpen, Clock, Zap, CheckCircle2, XCircle, AlertCircle,
  ChevronRight, BarChart2, ArrowLeft, Trophy, Target, Flame,
} from 'lucide-react';

// ─── Sub-components ──────────────────────────────────────────────────────────

function AnimatedBar({ pct, color = 'bg-green-500' }: { pct: number; color?: string }) {
  return (
    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
      />
    </div>
  );
}

function StatCard({
  icon, label, value, sub, color = 'text-green-400',
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start gap-3">
      <div className={`mt-0.5 ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{label}</p>
        <p className={`text-2xl font-bold font-mono mt-0.5 ${color}`}>{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function ConceptRow({
  label, status, detail,
}: {
  label: string;
  status: 'done' | 'partial' | 'missing';
  detail?: string;
}) {
  const cfg = {
    done:    { icon: <CheckCircle2 size={16} className="text-green-400" />, text: 'text-green-300' },
    partial: { icon: <AlertCircle  size={16} className="text-yellow-400" />, text: 'text-yellow-300' },
    missing: { icon: <XCircle      size={16} className="text-gray-600" />,  text: 'text-gray-500' },
  }[status];

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-800 last:border-0">
      {cfg.icon}
      <span className={`text-sm flex-1 ${cfg.text}`}>{label}</span>
      {detail && <span className="text-xs text-gray-500 font-mono">{detail}</span>}
    </div>
  );
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtTime(seconds: number) {
  if (seconds < 60)  return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function computeMastery(progress: LessonProgress | null, exerciseCount: number): number {
  if (!progress) return 0;
  const correctRuns  = progress.codeSolutions?.correctRuns ?? 0;
  const theoryRead   = progress.status !== 'started' ? 40 : 0;
  const practiceRaw  = exerciseCount > 0 ? Math.min(correctRuns / exerciseCount, 1) * 50 : 0;
  const completedAdd = progress.status === 'completed' || progress.status === 'mastered' ? 10 : 0;
  return Math.round(theoryRead + practiceRaw + completedAdd);
}

// ─── Page ────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ track: Track; moduleId: string; lessonId: string }>;
}

export default function LessonProgressPage({ params }: PageProps) {
  const { track, moduleId, lessonId } = use(params);

  const [lesson,   setLesson]   = useState<Lesson | null>(null);
  const [module,   setModule]   = useState<Curriculum | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [xp,       setXp]       = useState(0);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        const [modData, prof, prog] = await Promise.all([
          getModule(moduleId, track),
          getOrCreateUserProfile(user.uid, user.email ?? '', user.displayName ?? 'Developer'),
          getLessonProgress(user.uid, lessonId),
        ]);
        setModule(modData);
        setLesson(modData.lessons.find(l => l.id === lessonId) ?? null);
        setProgress(prog);
        setXp(prof.xp);
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, [moduleId, lessonId, track]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
    </div>
  );

  if (!lesson) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
      Lesson not found.
    </div>
  );

  // ── Derived values ───────────────────────────────────────────────────────
  const ex = lesson as any;
  const exercises: any[] = [
    ...(ex.exercises || []),
    ...(ex.quiz ? (Array.isArray(ex.quiz) ? ex.quiz : [ex.quiz]) : []),
    ...(ex.exercise ? [ex.exercise] : []),
  ];

  const mastery       = computeMastery(progress, exercises.length);
  const attempts      = progress?.attempts ?? 0;
  const timeSpent     = progress?.timeSpent ?? 0;
  const runsTotal     = progress?.codeSolutions?.codeRunAttempts ?? 0;
  const correctRuns   = progress?.codeSolutions?.correctRuns ?? 0;
  const solRevealed   = progress?.codeSolutions?.solutionRevealed ?? false;
  const xpEarned      = progress?.xpEarned ?? 0;
  const status        = progress?.status ?? 'not-started';

  const theoryDone    = status !== 'not-started';
  const practiceStatus: 'done' | 'partial' | 'missing' =
    correctRuns === exercises.length && exercises.length > 0 ? 'done'
    : correctRuns > 0 ? 'partial'
    : 'missing';

  // Next lesson in module
  const lessonIndex = module?.lessons.findIndex(l => l.id === lessonId) ?? -1;
  const nextLesson  = lessonIndex >= 0 && lessonIndex < (module?.lessons.length ?? 0) - 1
    ? module?.lessons[lessonIndex + 1]
    : null;

  const masteryColor =
    mastery >= 80 ? 'bg-green-500' :
    mastery >= 50 ? 'bg-yellow-500' :
    'bg-red-500';

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto px-5 py-12 space-y-8">

          {/* Back link */}
          <Link
            href={`/learn/${track}/${moduleId}/${lessonId}`}
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to lesson
          </Link>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-mono text-green-400 uppercase tracking-widest mb-1">
              {track} / {module?.title}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
            <div className="flex items-center gap-3 mt-3">
              <span className={`text-xs font-mono px-2 py-1 rounded-full border
                ${status === 'completed' || status === 'mastered'
                  ? 'border-green-500/30 bg-green-500/10 text-green-400'
                  : status === 'in-progress'
                  ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                  : 'border-gray-700 text-gray-500'
                }`}>
                {status === 'not-started' ? 'Not Started' : status.replace('-', ' ')}
              </span>
              {xpEarned > 0 && (
                <span className="text-xs font-mono text-yellow-400 flex items-center gap-1">
                  <Zap size={12} /> {xpEarned} XP earned
                </span>
              )}
            </div>
          </motion.div>

          {/* ── Stats grid ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <StatCard icon={<BarChart2 size={18} />} label="Attempts"   value={attempts}   color="text-cyan-400" />
            <StatCard icon={<Clock     size={18} />} label="Time Spent" value={fmtTime(timeSpent)} sub="cumulative" color="text-purple-400" />
            <StatCard icon={<Trophy    size={18} />} label="Best Run"    value={runsTotal > 0 ? `${runsTotal} run${runsTotal > 1 ? 's' : ''}` : '—'} color="text-yellow-400" />
            <StatCard icon={<Zap       size={18} />} label="XP Earned"  value={xpEarned > 0 ? `+${xpEarned}` : '—'} color="text-green-400" />
          </motion.div>

          {/* ── Mastery bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <Target size={18} className="text-green-400" />
              <h2 className="font-semibold text-sm uppercase tracking-widest text-gray-300">Mastery Level</h2>
              <span className={`ml-auto text-lg font-bold font-mono
                ${mastery >= 80 ? 'text-green-400' : mastery >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {mastery}%
              </span>
            </div>
            <AnimatedBar pct={mastery} color={masteryColor} />
            <p className="text-xs text-gray-500">
              {mastery >= 80 ? '🏆 Mastered — great work!' :
               mastery >= 50 ? '⏳ In progress — keep going!' :
               '🚀 Get started by reading the theory and running exercises.'}
            </p>
          </motion.div>

          {/* ── Concept breakdown ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-cyan-400" />
              <h2 className="font-semibold text-sm uppercase tracking-widest text-gray-300">Concept Breakdown</h2>
            </div>
            <div>
              <ConceptRow
                label="Theory understood"
                status={theoryDone ? 'done' : 'missing'}
                detail={theoryDone ? 'Read' : 'Not read'}
              />
              <ConceptRow
                label={`Practice exercises (${correctRuns}/${exercises.length} correct)`}
                status={practiceStatus}
                detail={
                  exercises.length === 0 ? 'No exercises'
                  : practiceStatus === 'done' ? 'All passed'
                  : practiceStatus === 'partial' ? `${runsTotal} total run${runsTotal !== 1 ? 's' : ''}`
                  : 'Not attempted'
                }
              />
              <ConceptRow
                label="Solution revealed"
                status={solRevealed ? 'partial' : 'done'}
                detail={solRevealed ? '−5 XP' : 'No penalty'}
              />
              <ConceptRow
                label="Lesson completed"
                status={status === 'completed' || status === 'mastered' ? 'done' : status === 'in-progress' ? 'partial' : 'missing'}
                detail={status === 'completed' || status === 'mastered' ? 'Done' : 'Pending'}
              />
            </div>
          </motion.div>

          {/* ── XP breakdown ── */}
          {xpEarned > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap size={18} className="text-yellow-400" />
                <h2 className="font-semibold text-sm uppercase tracking-widest text-yellow-300">XP Summary</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total earned</span>
                  <span className="text-yellow-400 font-bold">+{xpEarned} XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Run efficiency</span>
                  <span className={runsTotal === 1 ? 'text-green-400' : runsTotal >= 3 ? 'text-red-400' : 'text-gray-300'}>
                    {runsTotal === 1 ? '+25 bonus' : runsTotal >= 3 ? 'Half base' : 'Normal'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Solution penalty</span>
                  <span className={solRevealed ? 'text-red-400' : 'text-gray-500'}>
                    {solRevealed ? '−5 XP' : 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time bonus</span>
                  <span className={timeSpent <= 300 ? 'text-cyan-400' : 'text-gray-500'}>
                    {timeSpent <= 300 ? '+15 speed' : 'None'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Next lesson ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {nextLesson ? (
              <Link
                href={`/learn/${track}/${moduleId}/${nextLesson.id}`}
                className="flex items-center justify-between p-4 rounded-xl border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-all group"
              >
                <div>
                  <p className="text-xs font-mono text-green-400 uppercase tracking-widest mb-0.5">Up Next</p>
                  <p className="text-white font-semibold">{nextLesson.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">+{nextLesson.xpReward} XP · {nextLesson.estimatedMinutes} min</p>
                </div>
                <ChevronRight size={20} className="text-green-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                href={`/learn/${track}`}
                className="flex items-center justify-between p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 transition-all group"
              >
                <div>
                  <p className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-0.5">Module Complete!</p>
                  <p className="text-white font-semibold">Browse other modules</p>
                </div>
                <ChevronRight size={20} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </motion.div>

        </div>
      </div>
    </AuthGuard>
  );
}
