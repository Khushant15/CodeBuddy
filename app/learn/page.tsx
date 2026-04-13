"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Globe, Palette, ArrowRight, Clock, Lock, BookOpen, Zap, Database, CheckCircle } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/AuthGuard";
import { Leaderboard } from "@/components/Leaderboard";

export default function LearnPage() {
  const [activeTrack, setActiveTrack] = useState("python");

  return (
    <AuthGuard>
    <div className="container py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <p className="text-[11px] font-mono text-[var(--neon-green)] uppercase tracking-widest mb-2">Learning Tracks</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-white mb-4">
          LEARN TO <span className="gradient-heading">CODE</span>
        </h1>
        <p className="text-white/40 max-w-xl text-sm leading-relaxed">
          Structured, interactive courses designed to take you from zero to developer.
          Choose a track and start your journey.
        </p>
      </motion.div>

      {/* System stats */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {sysStats.map((s, i) => (
          <div key={s.label} className={`card ${s.cardClass} p-4 text-center`} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className={`text-xl font-heading font-800 ${s.color}`}>{s.value}</div>
            <div className="text-[10px] font-mono text-white/30 mt-1 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Track selector */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-10">
        <h2 className="font-heading text-xs font-700 tracking-widest text-white/40 mb-5 uppercase">Choose Your Track</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {tracks.map((t, i) => (
            <motion.div key={t.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
            <Link href={`/learn/${t.slug}`}
              className={`card text-left p-6 transition-all block ${t.cardClass} ${activeTrack === t.slug ? "ring-1 ring-[var(--neon-green)] ring-offset-0" : ""}`}
            >
              {/* Terminal header */}
              <div className="flex items-center gap-1.5 mb-4 pb-3 border-b border-white/6">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28ca42]" />
                <span className="ml-2 text-[10px] font-mono text-white/25">{t.slug}.course</span>
              </div>

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${t.iconBg}`}>
                <t.icon className={`w-6 h-6 ${t.iconColor}`} />
              </div>
              <h3 className={`font-heading text-base font-700 tracking-wider mb-1.5 ${t.titleColor}`}>{t.title}</h3>
              <p className="text-xs text-white/40 mb-4 leading-relaxed">{t.desc}</p>

              <div className="space-y-2.5 mb-4">
                <div className="flex justify-between text-[10px] font-mono text-white/30">
                  <span>Progress</span><span className={t.titleColor}>{t.progress}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${t.progress}%`, background: `linear-gradient(90deg, ${t.gradFrom}, ${t.gradTo})` }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-white/25">
                  <span>{t.completed}/{t.total} modules</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.duration}</span>
                </div>
              </div>

              <div className={`btn-neon w-full justify-center py-2.5 text-[10px] ${t.btnClass}`}>
                {t.progress > 0 ? "Continue" : "Initialize"} <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Lesson preview */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <Database className="w-5 h-5 text-[var(--neon-green)]" />
          <h2 className="font-heading text-xs font-700 tracking-widest text-white/50 uppercase">Available Lessons Preview</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {previewLessons.map((l, i) => (
            <motion.div key={l.id} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
              <div className="card p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${l.locked ? "bg-white/5" : "bg-[rgba(0,255,135,0.1)]"}`}>
                  {l.locked ? <Lock className="w-4 h-4 text-white/20" /> : <CheckCircle className="w-4 h-4 text-[var(--neon-green)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${l.trackBadge} text-[9px]`}>{l.track}</span>
                    <span className={`badge ${l.diffBadge} text-[9px]`}>{l.diff}</span>
                  </div>
                  <h4 className="text-sm font-mono text-white/70 truncate">{l.title}</h4>
                  <p className="text-[11px] text-white/30 mt-0.5">{l.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-white/25 flex-shrink-0">
                  <Clock className="w-3 h-3" />{l.time}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Leaderboard Section */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
        <Leaderboard />
      </motion.div>

      {/* Getting started CTA */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="card p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,255,135,0.03)] to-[rgba(0,229,255,0.02)]" />
          <BookOpen className="w-10 h-10 mx-auto mb-4" style={{ color: "var(--neon-green)" }} />
          <h3 className="font-heading text-xl font-700 tracking-wider text-white mb-2">START YOUR JOURNEY</h3>
          <p className="text-sm text-white/40 mb-6 max-w-md mx-auto">Pick a track above and begin learning. All lessons are interactive with code examples, quizzes, and challenges.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/learn" className="btn-neon btn-neon-solid px-6 py-3 text-[11px] justify-center"><Play className="w-3.5 h-3.5" />Start Python</Link>
            <Link href="/practice" className="btn-neon px-6 py-3 text-[11px] justify-center">View Challenges</Link>
          </div>
        </div>
      </motion.div>
    </div>
    </AuthGuard>
  );
}

function Play(props: React.ComponentProps<typeof Zap>) { return <Zap {...props} />; }

const sysStats = [
  { label: "Lessons", value: "100+", color: "neon-text-green", cardClass: "" },
  { label: "Tracks", value: "5", color: "neon-text-cyan", cardClass: "card-cyan" },
  { label: "XP Earned", value: "0", color: "neon-text-violet", cardClass: "card-violet" },
  { label: "Streak", value: "0d", color: "neon-text-orange", cardClass: "" },
];

const tracks = [
  { title: "Python", slug: "python", desc: "Master Python from basics to decorators, generators, testing, and best practices. 8 modules.", icon: Code, cardClass: "", iconBg: "bg-[rgba(0,255,135,0.1)]", iconColor: "text-[var(--neon-green)]", titleColor: "neon-text-green", progress: 0, completed: 0, total: 8, duration: "77h", gradFrom: "var(--neon-green)", gradTo: "var(--neon-cyan)", btnClass: "" },
  { title: "HTML", slug: "html", desc: "Go from your first tag to SEO-optimised, accessible, production-ready pages. 7 modules.", icon: Globe, cardClass: "card-violet", iconBg: "bg-[rgba(191,95,255,0.1)]", iconColor: "text-[var(--neon-violet)]", titleColor: "neon-text-violet", progress: 0, completed: 0, total: 7, duration: "54h", gradFrom: "var(--neon-violet)", gradTo: "var(--neon-pink)", btnClass: "btn-violet" },
  { title: "CSS", slug: "css", desc: "Master modern CSS — from the box model to Flexbox, Grid, animations and responsive design.", icon: Palette, cardClass: "card-cyan", iconBg: "bg-[rgba(0,229,255,0.1)]", iconColor: "text-[var(--neon-cyan)]", titleColor: "neon-text-cyan", progress: 0, completed: 0, total: 4, duration: "48h", gradFrom: "var(--neon-cyan)", gradTo: "var(--neon-green)", btnClass: "border-[var(--neon-cyan)] text-[var(--neon-cyan)]" },
  { title: "JavaScript", slug: "javascript", desc: "The language of the web — variables, DOM, async/await, Fetch API, and ES6+ features.", icon: Code, cardClass: "", iconBg: "bg-[rgba(255,200,0,0.1)]", iconColor: "text-[var(--neon-orange)]", titleColor: "neon-text-orange", progress: 0, completed: 0, total: 4, duration: "50h", gradFrom: "var(--neon-orange)", gradTo: "var(--neon-green)", btnClass: "border-[var(--neon-orange)] text-[var(--neon-orange)]" },
  { title: "React", slug: "react", desc: "Build modern, reactive UIs with components, hooks, Context API, and React Router.", icon: Globe, cardClass: "card-violet", iconBg: "bg-[rgba(0,229,255,0.08)]", iconColor: "text-[var(--neon-cyan)]", titleColor: "neon-text-cyan", progress: 0, completed: 0, total: 4, duration: "52h", gradFrom: "var(--neon-cyan)", gradTo: "var(--neon-violet)", btnClass: "border-[var(--neon-cyan)] text-[var(--neon-cyan)]" },
];

const previewLessons = [
  { id: 1, title: "py-001-intro-variables", desc: "Variables and Assignment", track: "PYTHON", trackBadge: "badge-green", diff: "BEGINNER", diffBadge: "badge-cyan", time: "25m", locked: false },
  { id: 2, title: "html-lesson-01-intro", desc: "Introduction to HTML", track: "HTML", trackBadge: "badge-violet", diff: "BEGINNER", diffBadge: "badge-cyan", time: "25m", locked: false },
  { id: 3, title: "py-005-lists-basics", desc: "Intro to Python Lists", track: "PYTHON", trackBadge: "badge-green", diff: "BEGINNER", diffBadge: "badge-cyan", time: "30m", locked: false },
  { id: 4, title: "html-lesson-09-forms", desc: "HTML Forms & Inputs", track: "HTML", trackBadge: "badge-violet", diff: "INTERMEDIATE", diffBadge: "badge-violet", time: "40m", locked: false },
];
