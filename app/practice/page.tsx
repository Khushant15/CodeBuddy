"use client";

// app/practice/page.tsx
// Upgraded Practice Arena — 4-tier difficulty browser, CodeEditor, solution walkthroughs

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthGuard } from "@/components/AuthGuard";
import {
  Bug, Clock, Trophy, Zap, Target, Search, Lock, Filter,
  Lightbulb, CheckCircle, XCircle, ChevronLeft, Play,
  RotateCcw, Eye, EyeOff, BookOpen, ChevronDown, ChevronUp,
  Sparkles, AlertCircle, Loader2, Star,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import {
  completeChallengeInFirebase,
  saveChallengeProgress,
  getOrCreateUserProfile,
} from "@/lib/userService";
import { formatTime } from "@/lib/utils";
import {
  CHALLENGES, getChallengeSummary, DIFFICULTY_XP,
  type Challenge, type ChallengeDifficulty, type ChallengeCategory,
} from "@/lib/challenges";
import { CodeEditor } from "@/components/CodeEditor";
import { analyzeCode, type CodeFeedback } from "@/lib/codeAnalyzer";
import { CodeFeedbackDisplay } from "@/components/CodeFeedback";

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = "list" | "challenge" | "result";

const TIER_COLOR: Record<ChallengeDifficulty, string> = {
  beginner:     "text-green-400  border-green-500/30  bg-green-500/10",
  intermediate: "text-blue-400   border-blue-500/30   bg-blue-500/10",
  advanced:     "text-orange-400 border-orange-500/30 bg-orange-500/10",
  expert:       "text-red-400    border-red-500/30    bg-red-500/10",
};

const TIER_BADGE: Record<ChallengeDifficulty, string> = {
  beginner:     "bg-green-500/15  text-green-400  border border-green-500/30",
  intermediate: "bg-blue-500/15   text-blue-400   border border-blue-500/30",
  advanced:     "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  expert:       "bg-red-500/15    text-red-400    border border-red-500/30",
};

const CAT_BADGE: Record<ChallengeCategory, string> = {
  syntax:       "bg-cyan-500/10    text-cyan-400    border border-cyan-500/20",
  logic:        "bg-purple-500/10  text-purple-400  border border-purple-500/20",
  optimization: "bg-yellow-500/10  text-yellow-400  border border-yellow-500/20",
  debugging:    "bg-pink-500/10    text-pink-400    border border-pink-500/20",
  "edge-cases": "bg-gray-500/10    text-gray-400    border border-gray-500/20",
};

const DIFFICULTY_ORDER: ChallengeDifficulty[] = ['beginner','intermediate','advanced','expert'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isUnlocked(c: Challenge, completedIds: string[], completedLessons: string[]): boolean {
  if (c.prerequisiteLessons.length === 0) return true;
  return c.prerequisiteLessons.every(l => completedLessons.includes(l));
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TierHeader({
  tier, summary, expanded, onToggle,
}: {
  tier: ChallengeDifficulty;
  summary: { total: number; completed: number };
  expanded: boolean;
  onToggle: () => void;
}) {
  const pct = summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 0;
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${TIER_COLOR[tier]}`}
    >
      <span className="capitalize font-bold text-sm font-mono tracking-wider">{tier}</span>
      <span className="text-xs opacity-70 font-mono">
        {summary.completed}/{summary.total} completed
      </span>
      <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden mx-2">
        <div
          className="h-full bg-current rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, opacity: 0.8 }}
        />
      </div>
      <span className="text-xs font-mono opacity-60">{pct}%</span>
      {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
    </button>
  );
}

function SolutionWalkthrough({ challenge }: { challenge: Challenge }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors"
      >
        <BookOpen size={13} />
        {open ? 'Hide walkthrough' : 'View solution walkthrough'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-4">
              {/* Explanation */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">📖 Explanation</p>
                <p className="text-sm text-gray-300 leading-relaxed">{challenge.solution.explanation}</p>
              </div>

              {/* Common mistakes */}
              {challenge.solution.commonMistakes.length > 0 && (
                <div className="bg-gray-900 border border-red-500/20 rounded-xl p-4">
                  <p className="text-xs font-mono text-red-400 uppercase tracking-widest mb-2">⚠️ Common Mistakes</p>
                  <ul className="space-y-1">
                    {challenge.solution.commonMistakes.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                        <AlertCircle size={13} className="text-red-400 mt-0.5 shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related concepts */}
              {challenge.solution.relatedConcepts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500 font-mono">Related:</span>
                  {challenge.solution.relatedConcepts.map(c => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-mono">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function PracticePage() {
  const [stage,           setStage]           = useState<Stage>("list");
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [diffFilter,      setDiffFilter]      = useState<ChallengeDifficulty | 'all'>('all');
  const [catFilter,       setCatFilter]       = useState<ChallengeCategory | 'all'>('all');
  const [search,          setSearch]          = useState("");
  const [expandedTiers,   setExpandedTiers]   = useState<Set<ChallengeDifficulty>>(new Set(['beginner']));
  const [timeLeft,        setTimeLeft]        = useState(0);
  const [timerRunning,    setTimerRunning]    = useState(false);
  const [hintsUsed,       setHintsUsed]       = useState(0);
  const [currentHint,     setCurrentHint]     = useState(0);
  const [showHint,        setShowHint]        = useState(false);
  const [verdict,         setVerdict]         = useState<'correct' | 'wrong' | null>(null);
  const [showSolution,    setShowSolution]    = useState(false);
  const [completedIds,    setCompletedIds]    = useState<string[]>([]);
  const [completedLessons,setCompletedLessons]= useState<string[]>([]);
  const [uid,             setUid]             = useState<string | null>(null);
  const [xpEarned,        setXpEarned]        = useState(0);
  const [runCount,        setRunCount]        = useState(0);
  const [codeFeedback,    setCodeFeedback]    = useState<CodeFeedback | null>(null);
  const [isAnalyzing,     setIsAnalyzing]     = useState(false);
  const [aiHelp,          setAiHelp]          = useState<string | null>(null);
  const [isGettingHelp,   setIsGettingHelp]   = useState(false);
  const [lastRunError,    setLastRunError]    = useState<string | null>(null);
  const [userCode,        setUserCode]        = useState("");
  const searchParams = useSearchParams();
  const isDaily = searchParams.get('daily') === 'true';
  const challengeId = searchParams.get('id');
  const startTimeRef = useRef<number | null>(null);
  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUid(u.uid);
      const profile = await getOrCreateUserProfile(u.uid, u.email ?? "", u.displayName ?? "Developer");
      setCompletedIds(profile.completedChallenges ?? []);
      setCompletedLessons(profile.completedLessons ?? []);

      // If ID in URL, auto-start
      if (challengeId) {
        const found = CHALLENGES.find(c => c.id === challengeId);
        if (found) startChallenge(found);
      }
    });
    return unsub;
  }, [challengeId]);

  // Timer countdown
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      setStage("result");
      setVerdict("wrong");
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning, timeLeft]);

  const startChallenge = (ch: Challenge) => {
    setActiveChallenge(ch);
    setTimeLeft(ch.timeLimit);
    setTimerRunning(true);
    setHintsUsed(0);
    setCurrentHint(0);
    setShowHint(false);
    setVerdict(null);
    setShowSolution(false);
    setRunCount(0);
    setCodeFeedback(null);
    setIsAnalyzing(false);
    startTimeRef.current = Date.now();
    setStage("challenge");
  };

  // Called by CodeEditor on each run
  const handleCodeRun = useCallback(async (code: string, output: string, passed: boolean, error?: string) => {
    setLastRunError(error || null);
    setUserCode(code);
    setRunCount(rc => rc + 1);
    if (!passed || verdict === 'correct') return;

    const elapsed = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0;

    // Stop timer
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const earned = Math.max(
      activeChallenge!.xpReward - hintsUsed * 5,
      Math.floor(activeChallenge!.xpReward * 0.3)
    ) * (isDaily ? 2 : 1);
    setXpEarned(earned);
    setVerdict('correct');

    if (uid && !completedIds.includes(activeChallenge!.id)) {
      await completeChallengeInFirebase(uid, activeChallenge!.id, earned);
      await saveChallengeProgress(uid, {
        challengeId:      activeChallenge!.id,
        difficulty:       activeChallenge!.difficulty,
        category:         activeChallenge!.category,
        solved:           true,
        hintsUsed,
        hintXpCost:       hintsUsed * 5,
        timeSpentSeconds: elapsed,
        userCode:         code,
        xpEarned:         earned,
      });
      setCompletedIds(prev => [...prev, activeChallenge!.id]);
    }

    setTimeout(async () => {
       setStage("result");
       setIsAnalyzing(true);
       try {
          const feedback = await analyzeCode(code, activeChallenge!.lang);
          setCodeFeedback(feedback);
          setXpEarned(prev => prev + 10);
       } catch (err) {
          console.error(err);
       } finally {
          setIsAnalyzing(false);
       }
    }, 1200);
  }, [activeChallenge, hintsUsed, uid, completedIds, verdict]);

  const useHint = () => {
    if (!activeChallenge || currentHint >= activeChallenge.hints.length) return;
    setShowHint(true);
    setHintsUsed(h => h + 1);
  };

  const nextHint = () => {
    if (!activeChallenge || currentHint + 1 >= activeChallenge.hints.length) return;
    setCurrentHint(h => h + 1);
    setHintsUsed(h => h + 1);
  };

  const getAiHelp = async () => {
    if (!activeChallenge || !uid || isGettingHelp) return;
    
    setIsGettingHelp(true);
    setAiHelp(null);
    try {
      const res = await fetch("/api/practice/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: userCode || activeChallenge.buggyCode,
          language: activeChallenge.lang,
          challengeTitle: activeChallenge.title,
          challengeDescription: activeChallenge.description,
          error: lastRunError
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setAiHelp(data.reply);
        setHintsUsed(h => h + 2); // AI help costs more (equivalent to 2 hints)
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGettingHelp(false);
    }
  };

  const toggleTier = (tier: ChallengeDifficulty) =>
    setExpandedTiers(prev => {
      const next = new Set(prev);
      next.has(tier) ? next.delete(tier) : next.add(tier);
      return next;
    });

  // Filter challenges
  const filtered = CHALLENGES.filter(c => {
    if (diffFilter !== 'all' && c.difficulty !== diffFilter) return false;
    if (catFilter  !== 'all' && c.category   !== catFilter)  return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.title.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const summary = getChallengeSummary(completedIds);
  const timerColor = !activeChallenge ? '#00ff87' :
    timeLeft > activeChallenge.timeLimit * 0.5  ? '#00ff87' :
    timeLeft > activeChallenge.timeLimit * 0.25 ? '#ff6b2b' :
    '#ff2d78';

  /* ═══════════ LIST VIEW ═══════════ */
  if (stage === "list") return (
    <AuthGuard>
      <div className="container py-10">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-2">Debug Arena</p>
          <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-white mb-3">
            PRACTICE <span className="text-orange-400">&amp; DEBUG</span>
          </h1>
          <p className="text-white/40 text-sm max-w-xl">
            28 challenges across 4 difficulty tiers. Fix bugs, optimise code, handle edge cases.
          </p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Solved',     value: completedIds.length, color: 'text-green-400' },
            { label: 'Total XP',   value: completedIds.reduce((s,id) => s + (CHALLENGES.find(c => c.id === id)?.xpReward ?? 0), 0), color: 'text-cyan-400' },
            { label: 'Available',  value: CHALLENGES.filter(c => isUnlocked(c, completedIds, completedLessons)).length, color: 'text-purple-400' },
            { label: 'Completion', value: `${Math.round((completedIds.length / CHALLENGES.length) * 100)}%`, color: 'text-orange-400' },
          ].map((s,i) => (
            <motion.div key={s.label} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay: 0.1 + i*0.07 }}>
              <div className="card p-4 text-center">
                <div className={`text-2xl font-extrabold font-mono ${s.color}`}>{s.value}</div>
                <div className="text-xs font-mono text-white/25 mt-0.5 uppercase tracking-wider">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }} className="card p-4 mb-7 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search challenges…"
                className="input-neon pl-10 py-2.5 text-sm w-full"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-white/30" />
              {(['all', ...DIFFICULTY_ORDER] as const).map(d => (
                <button key={d} onClick={() => setDiffFilter(d as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all border
                    ${diffFilter === d
                      ? d === 'all' ? 'bg-white/10 text-white border-white/20'
                        : TIER_COLOR[d as ChallengeDifficulty]
                      : 'text-white/30 border-white/8 hover:text-white/60'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {(['all','syntax','logic','optimization','debugging','edge-cases'] as const).map(cat => (
              <button key={cat} onClick={() => setCatFilter(cat as any)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border
                  ${catFilter === cat
                    ? cat === 'all' ? 'bg-white/10 text-white border-white/20'
                      : CAT_BADGE[cat as ChallengeCategory]
                    : 'text-white/25 border-white/8 hover:text-white/50'}`}>
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tier groups */}
        <div className="space-y-4">
          {DIFFICULTY_ORDER.map((tier, ti) => {
            const sum  = summary.find(s => s.tier === tier) ?? { total: 0, completed: 0 };
            const rows = filtered.filter(c => c.difficulty === tier);
            if (rows.length === 0 && (diffFilter !== 'all' || catFilter !== 'all' || search)) return null;
            const expanded = expandedTiers.has(tier);

            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + ti * 0.08 }}
              >
                <TierHeader
                  tier={tier}
                  summary={{ total: sum.total, completed: sum.completed }}
                  expanded={expanded}
                  onToggle={() => toggleTier(tier)}
                />

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="grid md:grid-cols-2 gap-3 pt-3 pl-3">
                        {rows.length === 0 ? (
                          <p className="text-xs text-gray-600 font-mono col-span-2 py-2">No challenges match your filters.</p>
                        ) : rows.map((c, i) => {
                          const done     = completedIds.includes(c.id);
                          const unlocked = isUnlocked(c, completedIds, completedLessons);
                          return (
                            <motion.div
                              key={c.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04 }}
                            >
                              <div className={`card p-4 group ${done ? 'ring-1 ring-green-500/20' : !unlocked ? 'opacity-60' : ''}`}>
                                <div className="flex items-start gap-3 mb-3">
                                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                                    ${!unlocked ? 'bg-white/5 border border-white/8' : done ? 'bg-green-500/10 border border-green-500/20' : 'bg-orange-500/10 border border-orange-500/20'}`}>
                                    {!unlocked ? <Lock  className="w-4 h-4 text-white/20" />
                                    : done      ? <CheckCircle className="w-4 h-4 text-green-400" />
                                    :             <Bug   className="w-4 h-4 text-orange-400" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap gap-1.5 mb-1">
                                      <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${TIER_BADGE[c.difficulty]}`}>{c.difficulty}</span>
                                      <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${CAT_BADGE[c.category]}`}>{c.category}</span>
                                      <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-gray-800 text-gray-400">{c.lang}</span>
                                      {done && <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-green-500/10 text-green-400 border border-green-500/20">✓ Solved</span>}
                                    </div>
                                    <h3 className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{c.title}</h3>
                                    <p className="text-xs text-white/35 mt-0.5 leading-relaxed line-clamp-2">{c.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                  <div className="flex items-center gap-3 text-xs font-mono text-white/25">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(c.timeLimit)}</span>
                                    <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />+{c.xpReward} XP</span>
                                    <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3" />{c.hints.length}</span>
                                  </div>
                                  <button
                                    disabled={!unlocked}
                                    onClick={() => unlocked && startChallenge(c)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all
                                      ${!unlocked ? 'opacity-30 cursor-not-allowed bg-gray-800 text-gray-500'
                                      : done ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                      : 'bg-green-500 text-black hover:bg-green-400'}`}
                                  >
                                    {!unlocked ? <><Lock className="w-3 h-3" /> Locked</>
                                    : done      ? <><RotateCcw className="w-3 h-3" /> Retry</>
                                    :             <><Play className="w-3 h-3" fill="currentColor" /> Start</>}
                                  </button>
                                </div>
                                {!unlocked && c.prerequisiteLessons.length > 0 && (
                                  <p className="text-xs text-gray-600 font-mono mt-2">
                                    Complete lesson: {c.prerequisiteLessons.join(', ')} to unlock
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AuthGuard>
  );

  /* ═══════════ CHALLENGE VIEW ═══════════ */
  if (stage === "challenge" && activeChallenge) return (
    <AuthGuard>
      <div className="container py-8">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => { setStage("list"); setTimerRunning(false); }}
            className="flex items-center gap-2 text-xs font-mono text-white/30 hover:text-white/70 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to challenges
          </button>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm font-bold"
            style={{ borderColor: timerColor + '40', background: timerColor + '10', color: timerColor }}
          >
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* Left: Problem info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title card */}
            <div className="card p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                  <Bug className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-sm">{activeChallenge.title}</h2>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${TIER_BADGE[activeChallenge.difficulty]}`}>{activeChallenge.difficulty}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${CAT_BADGE[activeChallenge.category]}`}>{activeChallenge.category}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">+{activeChallenge.xpReward} XP</span>
                    {isDaily && (
                      <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Daily Double XP
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mt-3">{activeChallenge.description}</p>
            </div>

            {/* Buggy reference */}
            <div>
              <p className="text-xs font-mono text-pink-400 uppercase tracking-widest mb-2">🐛 Buggy Code (reference)</p>
              <div className="bg-gray-950 border border-pink-500/20 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-pink-500/10 text-xs font-mono text-pink-400">
                  <span className="w-2 h-2 rounded-full bg-pink-500 inline-block" />
                  buggy.{activeChallenge.lang}
                </div>
                <pre className="p-4 text-xs text-pink-300 font-mono whitespace-pre-wrap leading-relaxed">
                  {activeChallenge.buggyCode}
                </pre>
              </div>
            </div>

            {/* Test cases */}
            <div className="card p-4">
              <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Expected Output</p>
              <div className="space-y-1.5">
                {activeChallenge.testCases.map((tc, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-mono p-2 rounded-lg bg-white/3">
                    <span className="text-white/40">{tc.input}</span>
                    <span className="text-green-400">→ {tc.expected}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hints */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-mono text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Hints ({hintsUsed}/{activeChallenge.hints.length} · −5 XP each)
                </p>
                {showHint && currentHint < activeChallenge.hints.length - 1 && (
                  <button onClick={nextHint} className="text-xs font-mono text-orange-400 hover:underline">Next →</button>
                )}
              </div>
              
              <div className="space-y-3">
                {!showHint ? (
                  <button onClick={useHint} className="btn-neon border-orange-500/30 text-orange-400 py-2 px-4 text-xs w-full justify-center hover:bg-orange-500/10">
                    <Lightbulb className="w-3.5 h-3.5" /> Use a Static Hint (−5 XP)
                  </button>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div key={currentHint} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                      className="bg-orange-500/5 border border-orange-500/15 rounded-xl p-3">
                      <p className="text-xs font-mono text-white/60 leading-relaxed">
                        💡 Hint {currentHint + 1}: {activeChallenge.hints[currentHint]}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                )}

                <button 
                  onClick={getAiHelp} 
                  disabled={isGettingHelp}
                  className="btn-neon border-purple-500/30 text-purple-400 py-2 px-4 text-xs w-full justify-center hover:bg-purple-500/10 flex items-center gap-2"
                >
                  {isGettingHelp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {isGettingHelp ? "Thinking..." : "Get AI Help (−10 XP)"}
                </button>

                <AnimatePresence>
                  {aiHelp && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-purple-500/5 border border-purple-500/15 rounded-xl p-4 mt-3"
                    >
                      <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-[10px] uppercase tracking-widest">
                        <Sparkles size={12} /> AI Guidance
                      </div>
                      <div className="text-xs text-purple-200/70 prose prose-invert prose-p:my-1 prose-pre:bg-black/40 prose-pre:p-2 prose-pre:rounded-lg">
                        {/* We use a simple whitespace preservation or Markdown renderer if available. 
                            Since we have LessonRenderer/Markdown components elsewhere, let's keep it simple for now. */}
                        <p className="whitespace-pre-wrap leading-relaxed">{aiHelp}</p>
                      </div>
                      <button 
                        onClick={() => setAiHelp(null)}
                        className="text-[10px] text-purple-400/50 hover:text-purple-400 mt-2 font-mono"
                      >
                        [Dismiss]
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: CodeEditor (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-mono text-green-400 uppercase tracking-widest">
              ✏️ Your Fix — edit below and click Run &amp; Test
            </p>
            <CodeEditor
              language={activeChallenge.lang as any}
              initialCode={activeChallenge.buggyCode}
              solution={activeChallenge.solution.code}
              testCases={activeChallenge.testCases.map(tc => ({
                expectedOutput: tc.expected,
                description:    tc.input,
              }))}
              onRun={handleCodeRun}
              onSolutionRevealed={() => setHintsUsed(h => h + 1)}
              solutionXpCost={5}
              showPreview={activeChallenge.lang !== 'python'}
              minHeight="280px"
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );

  /* ═══════════ RESULT VIEW ═══════════ */
  if (stage === "result" && activeChallenge) return (
    <AuthGuard>
      <div className="container py-16 flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
          <div className={`card p-8 text-center`}>
            {/* Verdict icon */}
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
              className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6
                ${verdict === 'correct' ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}
            >
              {verdict === 'correct'
                ? <CheckCircle className="w-10 h-10 text-green-400" />
                : <XCircle className="w-10 h-10 text-red-400" />}
            </motion.div>

            <h2 className={`font-heading text-3xl font-extrabold tracking-wider mb-2 ${verdict === 'correct' ? 'text-green-400' : 'text-purple-400'}`}>
              {verdict === 'correct' ? 'FIXED IT!' : 'TIME\'S UP'}
            </h2>
            <p className="text-white/45 text-sm mb-6">
              {verdict === 'correct'
                ? `Great debugging! ${hintsUsed > 0 ? `${hintsUsed} hint${hintsUsed > 1 ? 's' : ''} used.` : ''} You earned +${xpEarned} XP.`
                : "Don't worry — review the walkthrough below to understand the fix."}
            </p>

            {/* XP badge or CodeFeedback */}
            {verdict === 'correct' && isAnalyzing && (
               <div className="flex flex-col items-center justify-center my-6 text-white/50 animate-pulse">
                  <div className="flex gap-2 items-center text-xs font-mono mb-2 text-cyan-400">
                     <span className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"/> AI is analyzing your code snippet...
                  </div>
               </div>
            )}

            {verdict === 'correct' && !isAnalyzing && codeFeedback && (
              <div className="text-left mb-6">
                <CodeFeedbackDisplay feedback={codeFeedback} earnedXp={xpEarned} />
              </div>
            )}

            {verdict === 'correct' && !isAnalyzing && !codeFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-500/10 border border-green-500/25 mb-6"
              >
                <Zap className="w-4 h-4 text-green-400" />
                <span className="font-bold text-sm text-green-400">+{xpEarned} XP EARNED</span>
              </motion.div>
            )}

            {/* Solution walkthrough */}
            <div className="text-left">
              <SolutionWalkthrough challenge={activeChallenge} />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <button
                onClick={() => startChallenge(activeChallenge)}
                className="btn-neon py-3 px-6 text-xs justify-center"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Try Again
              </button>
              <button
                onClick={() => setStage("list")}
                className="btn-neon btn-neon-solid py-3 px-6 text-xs justify-center"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> All Challenges
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AuthGuard>
  );

  return null;
}
