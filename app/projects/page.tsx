"use client";
import { motion } from "framer-motion";
import { AuthGuard } from "@/components/AuthGuard";
import { FolderOpen, Lock, Clock, Trophy, ArrowRight, Code2, Globe, Palette } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    id: 1, title: "CLI Calculator", track: "Python", icon: Code2, locked: false,
    desc: "Build a command-line calculator that handles +, -, *, / operations with error handling.",
    skills: ["Functions", "Loops", "Input/Output", "Error handling"],
    time: "2–3 hours", xp: 200, cardClass: "",
    iconBg: "bg-[rgba(0,255,135,0.1)]", iconColor: "text-[var(--neon-green)]",
    diffBadge: "badge-green", diff: "Beginner",
  },
  {
    id: 2, title: "Personal Portfolio", track: "HTML/CSS", icon: Globe, locked: false,
    desc: "Design and build a beautiful personal portfolio page showcasing your projects and skills.",
    skills: ["Semantic HTML", "CSS Grid", "Flexbox", "Responsive Design"],
    time: "4–6 hours", xp: 300, cardClass: "card-violet",
    iconBg: "bg-[rgba(191,95,255,0.1)]", iconColor: "text-[var(--neon-violet)]",
    diffBadge: "badge-violet", diff: "Beginner",
  },
  {
    id: 3, title: "Todo App", track: "Python", icon: Code2, locked: true,
    desc: "Create a terminal-based todo application with file persistence to save your tasks.",
    skills: ["File I/O", "Lists", "Functions", "OOP basics"],
    time: "3–4 hours", xp: 250, cardClass: "",
    iconBg: "bg-[rgba(0,255,135,0.1)]", iconColor: "text-[var(--neon-green)]",
    diffBadge: "badge-green", diff: "Beginner",
  },
  {
    id: 4, title: "Animated Landing Page", track: "CSS", icon: Palette, locked: true,
    desc: "Build a stunning animated landing page with CSS keyframes, transitions, and hover effects.",
    skills: ["Animations", "Pseudo-elements", "Grid", "Custom properties"],
    time: "5–8 hours", xp: 350, cardClass: "card-cyan",
    iconBg: "bg-[rgba(0,229,255,0.1)]", iconColor: "text-[var(--neon-cyan)]",
    diffBadge: "badge-cyan", diff: "Intermediate",
  },
  {
    id: 5, title: "Number Guessing Game", track: "Python", icon: Code2, locked: true,
    desc: "Build an interactive guessing game with difficulty levels, hints, and score tracking.",
    skills: ["Random module", "Loops", "Conditionals", "Functions"],
    time: "2–3 hours", xp: 200, cardClass: "card-violet",
    iconBg: "bg-[rgba(191,95,255,0.1)]", iconColor: "text-[var(--neon-violet)]",
    diffBadge: "badge-green", diff: "Beginner",
  },
  {
    id: 6, title: "CSS Art — Neon Card", track: "CSS", icon: Palette, locked: true,
    desc: "Create a glowing neon-styled card component purely with CSS — no images allowed.",
    skills: ["box-shadow", "Gradients", "Pseudo-elements", "Animations"],
    time: "2–3 hours", xp: 180, cardClass: "card-cyan",
    iconBg: "bg-[rgba(0,229,255,0.1)]", iconColor: "text-[var(--neon-cyan)]",
    diffBadge: "badge-cyan", diff: "Intermediate",
  },
];

export default function ProjectsPage() {
  return (
    <AuthGuard>
      <div className="container py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-[11px] font-mono text-[var(--neon-violet)] uppercase tracking-widest mb-2">Build Real Things</p>
          <h1 className="font-heading text-3xl md:text-5xl font-800 text-white mb-4">
            PROJECTS <span className="neon-text-violet">GALLERY</span>
          </h1>
          <p className="text-white/40 text-sm max-w-xl leading-relaxed">
            Apply what you've learned by building real projects. Each project unlocks after completing the relevant lessons.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
              <div className={`card ${p.cardClass} p-6 h-full flex flex-col group`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${p.iconBg} border ${p.cardClass ? "border-[rgba(191,95,255,0.15)]" : "border-[rgba(0,255,135,0.15)]"}`}>
                    {p.locked ? <Lock className="w-5 h-5 text-white/20" /> : <p.icon className={`w-5 h-5 ${p.iconColor}`} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`badge ${p.diffBadge} text-[9px]`}>{p.diff}</span>
                      <span className="badge badge-cyan text-[9px]">{p.track}</span>
                      {p.locked && <span className="badge text-[9px] bg-white/5 border-white/10 text-white/25">Locked</span>}
                    </div>
                    <h3 className="font-heading text-sm font-700 tracking-wider text-white group-hover:neon-text-green transition-colors">{p.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-white/45 leading-relaxed mb-4 flex-1">{p.desc}</p>

                <div className="mb-4">
                  <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-2">Skills practiced</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.skills.map(s => (
                      <span key={s} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/4 border border-white/8 text-white/40">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-3 text-[10px] font-mono text-white/25">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.time}</span>
                    <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />+{p.xp} XP</span>
                  </div>
                  {p.locked ? (
                    <Link href="/learn" className="btn-neon py-2 px-4 text-[10px] opacity-50">Unlock via Learn</Link>
                  ) : (
                    <Link href="/learn" className="btn-neon btn-neon-solid py-2 px-4 text-[10px]">
                      Start <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
