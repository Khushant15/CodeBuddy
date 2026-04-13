"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AuthGuard } from "@/components/AuthGuard";
import {
  BookOpen, Bug, FolderOpen, Map, BarChart3, MessageCircle,
  Trophy, Flame, Target, Clock, ArrowRight, Zap, Code2
} from "lucide-react";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { AIChat } from "@/components/AIChat";
import { getOrCreateUserProfile, updateStreak, xpToLevel, type UserProfile } from "@/lib/userService";

export default function HomePage() {
  const [userName, setUserName] = useState("Developer");
  const [showChat, setShowChat] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUserName(u.displayName || u.email?.split("@")[0] || "Developer");
        await updateStreak(u.uid);
        const p = await getOrCreateUserProfile(u.uid, u.email || "", u.displayName || "Developer");
        setProfile(p);
      }
    });
    return unsub;
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <AuthGuard>
      <div className="container py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-[var(--neon-green)] uppercase tracking-widest mb-1">{greeting}</p>
              <h1 className="font-heading text-3xl md:text-4xl font-800 text-white">
                WELCOME BACK, <span className="neon-text-green">{userName.toUpperCase()}</span>
              </h1>
              <p className="text-white/40 mt-2 text-sm">Ready to level up your skills today?</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="badge badge-green">🔥 {profile?.streak ?? 0} Day Streak</div>
              <div className="badge badge-violet">⚡ {profile?.xp ?? 0} XP · Lv.{xpToLevel(profile?.xp ?? 0)}</div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.08 }}>
              <div className={`card ${s.cardClass} p-5`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.iconBg}`}>
                  <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                </div>
                <div className={`text-2xl font-heading font-800 ${s.valueColor}`}>{s.value}</div>
                <div className="text-xs text-white/35 mt-0.5 font-mono">{s.title}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
          <h2 className="font-heading text-sm font-700 tracking-widest text-white/50 mb-5 uppercase">Quick Start</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((a, i) => (
              <motion.div key={a.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }}>
                {a.href === "#ai" ? (
                  <button onClick={() => setShowChat(true)} className="w-full text-left">
                    <div className={`card ${a.cardClass} p-5 cursor-pointer group h-full`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${a.iconBg}`}>
                          <a.icon className={`w-5 h-5 ${a.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading text-xs font-700 tracking-wider text-white group-hover:neon-text-green transition-colors">{a.title}</h3>
                          <p className="text-xs text-white/35 mt-1 leading-relaxed">{a.desc}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 mt-3 text-[11px] font-mono ${a.linkColor} group-hover:translate-x-1 transition-transform`}>
                        Open Chat <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </button>
                ) : (
                  <Link href={a.href}>
                    <div className={`card ${a.cardClass} p-5 cursor-pointer group h-full`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${a.iconBg}`}>
                          <a.icon className={`w-5 h-5 ${a.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading text-xs font-700 tracking-wider text-white group-hover:neon-text-green transition-colors">{a.title}</h3>
                          <p className="text-xs text-white/35 mt-1 leading-relaxed">{a.desc}</p>
                        </div>
                      </div>
                      {a.progress !== undefined && (
                        <div className="mt-4">
                          <div className="flex justify-between text-[10px] font-mono text-white/30 mb-1.5">
                            <span>Progress</span>
                            <span className="text-[var(--neon-green)]">{a.progress}%</span>
                          </div>
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${a.progress}%` }} />
                          </div>
                        </div>
                      )}
                      <div className={`flex items-center gap-1 mt-3 text-[11px] font-mono ${a.linkColor} group-hover:translate-x-1 transition-transform`}>
                        {a.progress === 0 ? "Start now" : "Continue"} <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA cards row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="grid md:grid-cols-2 gap-5">
          {/* Daily challenge */}
          <div className="card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--neon-green)] opacity-[0.03] rounded-full translate-x-8 -translate-y-8" />
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5" style={{ color: "var(--neon-green)" }} />
              <span className="font-heading text-xs font-700 tracking-wider neon-text-green">DAILY CHALLENGE</span>
            </div>
            <p className="text-sm text-white/50 mb-5">Take on today&apos;s debugging challenge. Practice makes permanent.</p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/practice" className="btn-neon btn-neon-solid py-2.5 px-5 text-[11px]">
                <Zap className="w-3.5 h-3.5" /> Start Challenge
              </Link>
              <Link href="/dashboard" className="btn-neon py-2.5 px-5 text-[11px]">View Progress</Link>
            </div>
          </div>

          {/* AI assistant */}
          <div className="card card-violet p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--neon-violet)] opacity-[0.04] rounded-full translate-x-8 -translate-y-8" />
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-5 h-5" style={{ color: "var(--neon-violet)" }} />
              <span className="font-heading text-xs font-700 tracking-wider neon-text-violet">AI CODE ASSISTANT</span>
            </div>
            <p className="text-sm text-white/50 mb-5">Stuck? Ask CodeBuddy AI for instant help with any programming question.</p>
            <button onClick={() => setShowChat(true)} className="btn-neon btn-violet py-2.5 px-5 text-[11px]">
              <MessageCircle className="w-3.5 h-3.5" /> Ask AI
            </button>
          </div>
        </motion.div>

        {/* AI Chat modal */}
        {showChat && <AIChat onClose={() => setShowChat(false)} />}
      </div>
    </AuthGuard>
  );
}

const stats = [
  { title: "Day Streak",     value: "0",  icon: Flame,    cardClass: "",           iconBg: "bg-[rgba(255,107,43,0.1)]", iconColor: "text-[var(--neon-orange)]", valueColor: "neon-text-orange" },
  { title: "Total XP",       value: "0",  icon: Trophy,   cardClass: "card-cyan",  iconBg: "bg-[rgba(0,229,255,0.1)]",  iconColor: "text-[var(--neon-cyan)]",   valueColor: "neon-text-cyan"   },
  { title: "Level Progress", value: "0%", icon: Target,   cardClass: "",           iconBg: "bg-[rgba(0,255,135,0.1)]",  iconColor: "text-[var(--neon-green)]",  valueColor: "neon-text-green"  },
  { title: "This Week",      value: "0h", icon: Clock,    cardClass: "card-violet",iconBg: "bg-[rgba(191,95,255,0.1)]", iconColor: "text-[var(--neon-violet)]", valueColor: "neon-text-violet" },
];

const quickActions = [
  { title: "Learn",          desc: "Python, HTML, CSS interactive lessons",    icon: BookOpen,     href: "/learn",     cardClass: "",           iconBg: "bg-[rgba(0,255,135,0.1)]",  iconColor: "text-[var(--neon-green)]",  linkColor: "text-[var(--neon-green)]",  progress: 0 },
  { title: "Debug Practice", desc: "Solve real debugging challenges",           icon: Bug,          href: "/practice",  cardClass: "card-violet",iconBg: "bg-[rgba(191,95,255,0.1)]", iconColor: "text-[var(--neon-violet)]", linkColor: "text-[var(--neon-violet)]", progress: 0 },
  { title: "Projects",       desc: "Build portfolio-worthy applications",       icon: FolderOpen,   href: "/projects",  cardClass: "card-cyan",  iconBg: "bg-[rgba(0,229,255,0.1)]",  iconColor: "text-[var(--neon-cyan)]",   linkColor: "text-[var(--neon-cyan)]",   progress: 0 },
  { title: "Roadmaps",       desc: "Follow structured career learning paths",   icon: Map,          href: "/roadmap",   cardClass: "",           iconBg: "bg-[rgba(255,107,43,0.1)]", iconColor: "text-[var(--neon-orange)]", linkColor: "text-[var(--neon-orange)]" },
  { title: "Dashboard",      desc: "View detailed analytics & achievements",    icon: BarChart3,    href: "/dashboard", cardClass: "card-violet",iconBg: "bg-[rgba(191,95,255,0.1)]", iconColor: "text-[var(--neon-violet)]", linkColor: "text-[var(--neon-violet)]" },
  { title: "AI Help",        desc: "Get instant AI coding assistance",          icon: MessageCircle,href: "#ai",         cardClass: "card-cyan",  iconBg: "bg-[rgba(0,229,255,0.1)]",  iconColor: "text-[var(--neon-cyan)]",   linkColor: "text-[var(--neon-cyan)]"   },
];
