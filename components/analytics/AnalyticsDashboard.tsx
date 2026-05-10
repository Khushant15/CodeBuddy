"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SkillRadar } from "./SkillRadar";
import { TrendChart } from "./TrendChart";
import { StruggleAlert } from "./StruggleAlert";
import { Trophy, Activity, Brain, Zap, Clock, TrendingUp, Target, Award } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from "recharts";

export function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/insights")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to load analytics", e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--neon-green)] font-mono text-sm animate-pulse">
        [LOADING_ANALYTICS_DATA...]
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Struggle Alerts */}
      <StruggleAlert struggles={data.struggles} />

      {/* Hero Stats: Progress + Time */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Overall Progress */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-[var(--neon-green)] w-5 h-5" />
            <h2 className="font-heading text-sm font-700 tracking-wider text-white/70">OVERALL PROGRESS</h2>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xl font-bold text-white">{data.overallProgress.track}</span>
                <span className="text-[var(--neon-green)] font-mono text-sm">{data.overallProgress.percentage}%</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: `${data.overallProgress.percentage}%` }} 
                  className="h-full bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-cyan)] shadow-[0_0_15px_rgba(0,255,135,0.4)]"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
              <div className="text-center">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Level</p>
                <p className="text-lg font-bold text-white">{data.overallProgress.level} <span className="text-[10px] text-white/40">/ {data.overallProgress.maxLevel}</span></p>
              </div>
              <div className="text-center border-x border-white/5">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Streak</p>
                <p className="text-lg font-bold text-[var(--neon-pink)]">{data.overallProgress.streak} Days</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Total XP</p>
                <p className="text-lg font-bold text-[var(--neon-violet)]">{data.overallProgress.totalXp.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Time Investment */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }} className="card p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="text-[var(--neon-cyan)] w-5 h-5" />
            <h2 className="font-heading text-sm font-700 tracking-wider text-white/70">TIME INVESTMENT</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full pb-6">
            {[
              { label: "This Week", value: data.timeInvestment.thisWeek, color: "var(--neon-green)" },
              { label: "This Month", value: data.timeInvestment.thisMonth, color: "var(--neon-violet)" },
              { label: "All Time", value: data.timeInvestment.allTime, color: "var(--neon-cyan)" }
            ].map((t, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/3 border border-white/5">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1 text-center">{t.label}</p>
                <div className="text-xl font-bold text-white flex items-baseline gap-1">
                  {t.value}
                  <span className="text-[10px] font-mono text-white/20">HRS</span>
                </div>
                <div className="mt-3 w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full" style={{ width: '60%', backgroundColor: t.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Stats: Mastery + Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Concept Mastery (Radar) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 border border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="text-[var(--neon-violet)] w-5 h-5" />
            <h2 className="font-heading text-sm font-700 tracking-wider text-white/70">CONCEPT MASTERY</h2>
          </div>
          <div className="h-64">
            <SkillRadar data={data.conceptMastery} />
          </div>
        </motion.div>

        {/* Performance Trends (Sparklines) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6 border border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-[var(--neon-pink)] w-5 h-5" />
            <h2 className="font-heading text-sm font-700 tracking-wider text-white/70">PERFORMANCE TRENDS</h2>
          </div>
          <div className="space-y-6">
             {[
               { label: "Success Rate", data: data.performanceTrends.successRate, suffix: "%", color: "var(--neon-green)" },
               { label: "Avg Attempts", data: data.performanceTrends.avgAttempts, suffix: "", color: "var(--neon-violet)" },
               { label: "Challenge Speed", data: data.performanceTrends.challengeSpeed, suffix: "m", color: "var(--neon-cyan)" }
             ].map((trend, i) => (
               <div key={i} className="flex items-center gap-6">
                 <div className="w-24 flex-shrink-0">
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{trend.label}</p>
                    <p className="text-lg font-bold text-white">
                      {trend.data[trend.data.length-1]}{trend.suffix}
                      <span className="text-[10px] text-green-400 ml-2">↑</span>
                    </p>
                 </div>
                 <div className="flex-1 h-12">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={trend.data.map((v: number, idx: number) => ({ value: v, idx }))}>
                       <Line type="monotone" dataKey="value" stroke={trend.color} strokeWidth={2} dot={false} />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
               </div>
             ))}
          </div>
        </motion.div>
      </div>

      {/* Activity Chart + Strengths */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6 border border-white/10 h-full">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-[var(--neon-green)] w-5 h-5" />
            <h2 className="font-heading text-sm font-700 tracking-wider text-white/70">XP PROGRESSION</h2>
          </div>
          <TrendChart data={data.trends} />
        </motion.div>

        <div className="space-y-6">
          {/* Strengths Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="card p-6 border border-white/10 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-transparent">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-[var(--neon-cyan)] w-5 h-5" />
              <h2 className="font-heading text-sm font-700 tracking-wider text-white/70">YOUR STRENGTHS</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.strengths.map((s: string, idx: number) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] text-[10px] font-mono tracking-widest uppercase">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Badges Gallery */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card p-6 border border-white/10 bg-gradient-to-br from-[var(--neon-violet)]/5 to-transparent">
            <div className="flex items-center gap-3 mb-4">
              <Award className="text-[var(--neon-violet)] w-5 h-5" />
              <h2 className="font-heading text-sm font-700 tracking-wider text-white/70">BADGES EARNED</h2>
            </div>
            <div className="flex gap-4">
              {data.badges.map((b: any) => (
                <div key={b.id} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-white/10 transition-colors cursor-help" title={b.name}>
                  {b.icon}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
