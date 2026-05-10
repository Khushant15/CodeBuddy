"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthGuard } from "@/components/AuthGuard";
import { Trophy, Flame, BookOpen, Bug, Target, ArrowRight, Star, Zap } from "lucide-react";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { 
  getOrCreateUserProfile, 
  updateStreak, 
  xpToLevel, 
  getAllLessonProgress, 
  getAllChallengeProgress,
  type UserProfile,
  type LessonProgress,
  type ChallengeProgress
} from "@/lib/userService";
import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import { ReviewQueue } from "@/components/ReviewQueue";

const tooltipStyle = {
  contentStyle: { background: "rgba(8,7,23,0.97)", border: "1px solid rgba(0,255,135,0.15)", borderRadius: 8, color: "#e2e0f5", fontFamily: "Fira Code, monospace", fontSize: 11 },
  labelStyle: { color: "rgba(0,255,135,0.7)" },
};

const goals = [
  { id: 1, title: "Complete Fundamentals", desc: "Finish all core lessons", target: 5, key: "fundamental" },
  { id: 2, title: "Solve 5 Challenges", desc: "Complete debug challenges", target: 5, key: "challenge" },
  { id: 3, title: "Earn 1000 XP", desc: "Reach milestone total XP", target: 1000, key: "xp" },
];

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [challengeProgress, setChallengeProgress] = useState<ChallengeProgress[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          await updateStreak(u.uid);
          const [p, lp, cp, dc] = await Promise.all([
            getOrCreateUserProfile(u.uid, u.email || "", u.displayName || "Developer"),
            getAllLessonProgress(u.uid),
            getAllChallengeProgress(u.uid),
            fetch("/api/challenges/daily").then(res => res.json()).catch(() => ({ challenge: null }))
          ]);
          setProfile(p);
          setLessonProgress(lp);
          setChallengeProgress(cp);
          setDailyChallenge(dc.challenge);
        } catch (error) {
          console.error("Dashboard Load Error:", error);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // Process data for charts
  const getChartData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (6 - i));
      return { 
        date: days[d.getDay()], 
        fullDate: d.toISOString().split("T")[0],
        hours: 0, 
        lessons: 0, 
        challenges: 0 
      };
    });

    lessonProgress.forEach(lp => {
      if (!lp.lastAttempt) return;
      const d = (lp.lastAttempt as any)?.toDate?.() || new Date(lp.lastAttempt as any);
      const dStr = d.toISOString().split("T")[0];
      const entry = last7.find(e => e.fullDate === dStr);
      if (entry) {
        entry.lessons += 1;
        entry.hours += (lp.timeSpent || 0) / 3600; 
      }
    });

    challengeProgress.forEach(cp => {
      if (!cp.solvedAt) return;
      const d = (cp.solvedAt as any)?.toDate?.() || new Date(cp.solvedAt as any);
      const dStr = d.toISOString().split("T")[0];
      const entry = last7.find(e => e.fullDate === dStr);
      if (entry) {
        entry.challenges += 1;
        entry.hours += (cp.timeSpent || 0) / 3600;
      }
    });

    return last7;
  };

  const chartData = getChartData();

  const xp = profile?.xp ?? 0;
  const level = xpToLevel(xp);
  const xpInLevel = xp % 100;
  const lessons = profile?.completedLessons?.length ?? 0;
  const challenges = profile?.completedChallenges?.length ?? 0;
  const streak = profile?.streak ?? 0;

  const reviewsDue = lessonProgress
    .filter((lp: LessonProgress) => lp.reviewState && lp.reviewState.dueDate <= Date.now())
    .map((lp: LessonProgress) => ({
      lessonId: lp.lessonId,
      title: lp.lessonId.split("-").map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(" "),
      dueToday: true
    }));

  const getGoalProgress = (g: typeof goals[0]) => {
    if (g.key === "xp") return Math.min(xp, g.target);
    if (g.key === "fundamental") return lessons;
    if (g.key === "challenge") return challenges;
    return 0;
  };

  return (
    <AuthGuard>
      <div className="container py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono text-[var(--neon-green)] uppercase tracking-widest mb-2">Overview</p>
            <h1 className="font-heading text-3xl md:text-5xl font-800 text-white mb-2">
              YOUR <span className="gradient-heading">DASHBOARD</span>
            </h1>
            {profile && (
              <p className="text-white/40 text-sm font-mono">
                Welcome back, <span className="text-[var(--neon-green)]">{profile.displayName}</span> · Level {level}
              </p>
            )}
          </div>
          <Link href="/dashboard/analytics" className="btn-neon btn-neon-solid py-2.5 px-5 text-sm flex items-center gap-2 shrink-0">
            View Analytics <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Level bar */}
        {!loading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,255,135,0.1)] border border-[rgba(0,255,135,0.2)] flex items-center justify-center">
                  <Star className="w-5 h-5 text-[var(--neon-green)]" />
                </div>
                <div>
                  <div className="font-heading text-xs font-700 tracking-wider text-white">LEVEL {level}</div>
                  <div className="text-[10px] font-mono text-white/30 mt-0.5">{xpInLevel}/100 XP to next level</div>
                </div>
              </div>
              <div className="font-heading text-2xl font-800 neon-text-green">{xp} XP</div>
            </div>
            <div className="progress-track h-2">
              <div className="progress-fill" style={{ width: `${xpInLevel}%` }} />
            </div>
          </motion.div>
        )}

        {/* Stats & Daily Debug */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Learning Streak", value: `${streak}d`, icon: Flame, card: "", iconBg: "bg-[rgba(255,107,43,0.1)]", iconColor: "text-[var(--neon-orange)]", val: "neon-text-orange" },
              { title: "Total XP", value: xp.toString(), icon: Trophy, card: "card-cyan", iconBg: "bg-[rgba(0,229,255,0.1)]", iconColor: "text-[var(--neon-cyan)]", val: "neon-text-cyan" },
              { title: "Lessons Done", value: lessons.toString(), icon: BookOpen, card: "card-violet", iconBg: "bg-[rgba(191,95,255,0.1)]", iconColor: "text-[var(--neon-violet)]", val: "neon-text-violet" },
              { title: "Challenges", value: challenges.toString(), icon: Bug, card: "", iconBg: "bg-[rgba(0,255,135,0.1)]", iconColor: "text-[var(--neon-green)]", val: "neon-text-green" },
            ].map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.08 }}>
                <div className={`card ${s.card} p-5 h-full flex flex-col justify-center`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                      <s.icon className={`w-4 h-4 ${s.iconColor}`} />
                    </div>
                  </div>
                  <div className={`text-2xl font-heading font-800 ${s.val}`}>{loading ? "—" : s.value}</div>
                  <div className="text-[11px] text-white/35 mt-0.5">{s.title}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Daily Debug Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="card border-[rgba(255,45,120,0.3)] bg-gradient-to-br from-[rgba(255,45,120,0.05)] to-transparent p-5 h-full flex flex-col relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-3 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                <Zap className="w-24 h-24 text-[var(--neon-pink)]" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[rgba(255,45,120,0.1)] flex items-center justify-center border border-[rgba(255,45,120,0.2)]">
                  <Zap className="w-4 h-4 text-[var(--neon-pink)]" />
                </div>
                <span className="text-[10px] font-mono text-[var(--neon-pink)] uppercase tracking-widest font-bold">Daily Debug</span>
              </div>
              
              {loading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              ) : dailyChallenge ? (
                <>
                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[var(--neon-pink)] transition-colors">{dailyChallenge.title}</h3>
                  <p className="text-[10px] text-white/40 line-clamp-2 mb-4 font-mono leading-relaxed">{dailyChallenge.description}</p>
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">Reward</span>
                      <div className="text-[11px] font-mono text-[var(--neon-pink)] font-bold drop-shadow-[0_0_8px_rgba(255,45,120,0.4)]">
                         + {dailyChallenge.xpReward * 2} XP
                      </div>
                    </div>
                    <Link 
                      href={`/practice?id=${dailyChallenge.id}&daily=true`} 
                      className="btn-neon border-[rgba(255,45,120,0.4)] text-[var(--neon-pink)] hover:bg-[rgba(255,45,120,0.1)] py-1.5 px-3 text-[10px] flex items-center gap-1.5"
                    >
                      Solve <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-[10px] text-white/20 font-mono">No challenge available today.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="card p-6">
              <h2 className="font-heading text-sm font-700 tracking-wider text-white/70 mb-6">LEARNING PROGRESS</h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 10, fontFamily: "Fira Code" }} />
                    <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 10, fontFamily: "Fira Code" }} />
                    <Tooltip {...tooltipStyle} />
                    <Line type="monotone" dataKey="hours" stroke="var(--neon-green)" strokeWidth={2} dot={{ fill: "var(--neon-green)", strokeWidth: 0, r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <div className="card p-6">
              <h2 className="font-heading text-sm font-700 tracking-wider text-white/70 mb-6">WEEKLY ACTIVITY</h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barGap={3}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 10, fontFamily: "Fira Code" }} />
                    <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 10, fontFamily: "Fira Code" }} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="lessons" fill="var(--neon-green)" radius={[3,3,0,0]} fillOpacity={0.8} />
                    <Bar dataKey="challenges" fill="var(--neon-violet)" radius={[3,3,0,0]} fillOpacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Goals + Completed lessons + Review Queue */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="card p-6">
              <h2 className="font-heading text-sm font-700 tracking-wider text-white/70 mb-6">CURRENT GOALS</h2>
              <div className="space-y-5">
                {goals.map((g: typeof goals[0], i: number) => {
                  const progress = getGoalProgress(g);
                  const pct = Math.min(Math.round((progress / g.target) * 100), 100);
                  return (
                    <motion.div key={g.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <p className="text-sm font-mono text-white/70">{g.title}</p>
                          <p className="text-[10px] text-white/30 mt-0.5">{g.desc}</p>
                        </div>
                        <span className="text-xs font-mono text-white/35 flex-shrink-0 ml-4">{progress}/{g.target}</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-end mt-1">
                        <span className="text-[10px] font-mono text-[var(--neon-green)]">{pct}%</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Completed lessons list */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <div className="card p-6 h-full">
              <h2 className="font-heading text-sm font-700 tracking-wider text-white/70 mb-6">COMPLETED LESSONS</h2>
              {!loading && lessons === 0 && challenges === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Trophy className="w-12 h-12 mb-4 text-white/10" />
                  <p className="text-sm font-mono text-white/25">No activity yet</p>
                  <p className="text-xs text-white/15 mt-1 mb-5">Complete lessons to see progress here</p>
                  <Link href="/learn" className="btn-neon btn-neon-solid py-2.5 px-5 text-[11px]">
                    Start Learning <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {profile?.completedLessons?.map((l, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3 border border-white/5">
                      <div className="w-5 h-5 rounded-full bg-[rgba(0,255,135,0.15)] flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)]" />
                      </div>
                      <span className="text-xs font-mono text-white/50 capitalize">{l.replace(/-/g, " · ")}</span>
                    </div>
                  ))}
                  {profile?.completedChallenges?.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3 border border-white/5">
                      <div className="w-5 h-5 rounded-full bg-[rgba(191,95,255,0.15)] flex items-center justify-center flex-shrink-0">
                        <Bug className="w-2.5 h-2.5 text-[var(--neon-violet)]" />
                      </div>
                      <span className="text-xs font-mono text-white/50">{c}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Spaced Repetition Review Queue */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <ReviewQueue reviews={reviewsDue} />
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}
