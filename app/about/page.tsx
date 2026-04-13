"use client";
import { motion } from "framer-motion";
import { Users, Target, Code2, Zap, Globe, Star } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center max-w-3xl mx-auto">
        <p className="text-[11px] font-mono text-[var(--neon-green)] uppercase tracking-widest mb-3">About Us</p>
        <h1 className="font-heading text-4xl md:text-6xl font-800 text-white mb-6">
          ABOUT <span className="gradient-heading">CODEBUDDY</span>
        </h1>
        <p className="text-white/45 text-base leading-relaxed">
          CodeBuddy is a gamified learning platform designed to make coding interactive, fun, and effective.
          Whether you&apos;re a beginner or experienced developer, CodeBuddy helps you improve through real projects,
          debugging challenges, and a supportive developer community.
        </p>
      </motion.div>

      {/* Mission + Vision */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid md:grid-cols-2 gap-6 mb-16">
        {[
          { title: "OUR MISSION", icon: Target, color: "neon-text-green", cardClass: "", iconBg: "bg-[rgba(0,255,135,0.1)]", iconColor: "text-[var(--neon-green)]", text: "To empower developers worldwide by providing an engaging and practical learning experience that builds both knowledge and confidence in coding." },
          { title: "OUR VISION", icon: Globe, color: "neon-text-violet", cardClass: "card-violet", iconBg: "bg-[rgba(191,95,255,0.1)]", iconColor: "text-[var(--neon-violet)]", text: "To create a global community of developers who continuously learn, collaborate, and achieve their programming goals in a fun and rewarding way." },
        ].map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
            <div className={`card ${item.cardClass} p-7 h-full`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${item.iconBg}`}>
                <item.icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
              <h3 className={`font-heading text-sm font-700 tracking-widest mb-4 ${item.color}`}>{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Features grid */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16">
        <h2 className="font-heading text-center text-2xl font-700 tracking-wider text-white mb-10">
          WHAT MAKES <span className="gradient-heading">US DIFFERENT</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {differentiators.map((d, i) => (
            <motion.div key={d.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
              <div className={`card ${d.cardClass} p-5 h-full`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${d.iconBg}`}>
                  <d.icon className={`w-5 h-5 ${d.iconColor}`} />
                </div>
                <h4 className="font-heading text-xs font-700 tracking-wider text-white mb-2">{d.title}</h4>
                <p className="text-xs text-white/40 leading-relaxed">{d.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team / Creator */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="card p-8 text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[rgba(0,255,135,0.15)] to-[rgba(191,95,255,0.15)] border border-[rgba(0,255,135,0.2)] flex items-center justify-center mx-auto mb-5">
            <Users className="w-9 h-9 text-[var(--neon-green)]" />
          </div>
          <h3 className="font-heading text-sm font-700 tracking-wider text-white mb-2">BUILT BY A DEVELOPER</h3>
          <p className="text-xs font-mono text-[var(--neon-green)] mb-3">Khushant Sharma</p>
          <p className="text-sm text-white/40 leading-relaxed">Mumbai, India · Full-stack developer passionate about making coding education accessible and engaging for everyone.</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <a href="mailto:khushantsharma766@gmail.com" className="text-xs font-mono text-[var(--neon-green)] hover:underline">khushantsharma766@gmail.com</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const differentiators = [
  { title: "Gamified Learning", desc: "XP, streaks, and achievements make every lesson rewarding and motivating.", icon: Star, cardClass: "", iconBg: "bg-[rgba(0,255,135,0.1)]", iconColor: "text-[var(--neon-green)]" },
  { title: "AI-Powered Help", desc: "Groq-powered AI assistant gives instant, context-aware coding help.", icon: Zap, cardClass: "card-violet", iconBg: "bg-[rgba(191,95,255,0.1)]", iconColor: "text-[var(--neon-violet)]" },
  { title: "Real Challenges", desc: "Debug actual code bugs, not toy examples — just like on the job.", icon: Code2, cardClass: "card-cyan", iconBg: "bg-[rgba(0,229,255,0.1)]", iconColor: "text-[var(--neon-cyan)]" },
  { title: "Progress Tracking", desc: "Detailed analytics on your learning habits, streaks, and achievements.", icon: Target, cardClass: "", iconBg: "bg-[rgba(255,107,43,0.1)]", iconColor: "text-[var(--neon-orange)]" },
  { title: "Structured Paths", desc: "Carefully curated tracks from beginner to advanced — no guesswork.", icon: Users, cardClass: "card-violet", iconBg: "bg-[rgba(191,95,255,0.1)]", iconColor: "text-[var(--neon-violet)]" },
  { title: "Community First", desc: "Built for and by developers. Open feedback loop and continuous improvement.", icon: Globe, cardClass: "card-cyan", iconBg: "bg-[rgba(0,229,255,0.1)]", iconColor: "text-[var(--neon-cyan)]" },
];
