"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Zap, Trophy, Bug, BookOpen, Star } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase/config";

export default function LandingPage() {
  const router = useRouter();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) router.replace("/home");
    });
    return unsub;
  }, [router]);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="container pt-16 pb-24 md:pt-24 md:pb-32">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,255,135,0.2)] bg-[rgba(0,255,135,0.04)] mb-8">
            <Zap className="w-3.5 h-3.5" style={{ color: "var(--neon-green)" }} />
            <span className="text-xs font-mono" style={{ color: "var(--neon-green)" }}>Powered by Groq AI · Ultra-fast responses</span>
          </div>

          <h1 className="font-heading font-900 leading-none mb-6">
            <span className="block text-5xl md:text-7xl lg:text-8xl text-white">LEVEL UP</span>
            <span className="block text-5xl md:text-7xl lg:text-8xl gradient-heading">YOUR CODE</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            The gamified coding platform where you learn by doing.
            Earn XP, crush challenges, and unlock your developer potential.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-neon btn-neon-solid px-8 py-4 text-[13px] w-full sm:w-auto justify-center">
              Start Coding Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/learn" className="btn-neon px-8 py-4 text-[13px] w-full sm:w-auto justify-center">
              Explore Tracks <Code2 className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Terminal demo */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="mt-16 max-w-2xl mx-auto">
          <div className="terminal">
            <div className="terminal-header">
              <div className="terminal-dot bg-[#ff5f57]" />
              <div className="terminal-dot bg-[#ffbd2e]" />
              <div className="terminal-dot bg-[#28ca42]" />
              <span className="ml-3 text-[10px] font-mono text-white/30">codebuddy ~ python</span>
            </div>
            <div className="terminal-body">
              <div><span className="terminal-prompt">$</span> codebuddy init --user=developer</div>
              <div className="text-white/40 mt-1">✓ Account created — welcome aboard</div>
              <div className="mt-2"><span className="terminal-prompt">$</span> learn python --track=beginner</div>
              <div className="text-white/40 mt-1">✓ Loading 20 interactive lessons...</div>
              <div className="text-white/40">✓ AI assistant ready</div>
              <div className="mt-2"><span className="terminal-prompt">$</span> <span className="terminal-cursor" /></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-[rgba(0,255,135,0.08)] py-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Lessons", value: "50+", color: "neon-text-green" },
              { label: "Challenges", value: "30+", color: "neon-text-violet" },
              { label: "AI Powered", value: "Groq", color: "neon-text-cyan" },
              { label: "Tracks", value: "3", color: "neon-text-orange" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className={`text-3xl font-heading font-800 ${s.color}`}>{s.value}</div>
                <div className="text-xs text-white/40 mt-1 font-mono uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-700 text-white mb-4">WHY <span className="gradient-heading">CODEBUDDY?</span></h2>
          <p className="text-white/40 max-w-xl mx-auto">Everything you need to go from zero to developer — in one place.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
              <div className={`card ${f.cardClass} p-6 h-full`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.iconBg}`}>
                  <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                <h3 className="font-heading text-sm font-700 tracking-wider text-white mb-3">{f.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <div className="card p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,255,135,0.04)] to-[rgba(191,95,255,0.04)]" />
            <div className="relative z-10">
              <Star className="w-12 h-12 mx-auto mb-6" style={{ color: "var(--neon-green)" }} />
              <h2 className="font-heading text-3xl md:text-5xl font-800 text-white mb-4">READY TO <span className="gradient-heading">SHIP CODE?</span></h2>
              <p className="text-white/40 max-w-lg mx-auto mb-8">Join thousands of developers leveling up their skills with CodeBuddy's interactive platform.</p>
              <Link href="/signup" className="btn-neon btn-neon-solid px-10 py-4 text-[13px] inline-flex items-center gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

const features = [
  { title: "Interactive Lessons", desc: "Step-by-step lessons for Python, HTML, CSS with live code examples and instant feedback.", icon: BookOpen, cardClass: "", iconBg: "bg-[rgba(0,255,135,0.1)]", iconColor: "text-[var(--neon-green)]" },
  { title: "Debug Challenges", desc: "Real-world debugging puzzles that sharpen your problem-solving skills and pattern recognition.", icon: Bug, cardClass: "card-violet", iconBg: "bg-[rgba(191,95,255,0.1)]", iconColor: "text-[var(--neon-violet)]" },
  { title: "XP & Achievements", desc: "Earn experience points, level up your profile, and unlock badges as you complete milestones.", icon: Trophy, cardClass: "card-cyan", iconBg: "bg-[rgba(0,229,255,0.1)]", iconColor: "text-[var(--neon-cyan)]" },
  { title: "AI Coding Assistant", desc: "Powered by Groq's ultra-fast AI. Get explanations, code reviews, and debugging help instantly.", icon: Zap, cardClass: "", iconBg: "bg-[rgba(0,255,135,0.1)]", iconColor: "text-[var(--neon-green)]" },
  { title: "Learning Tracks", desc: "Structured paths from beginner to advanced. Follow Python, HTML, or CSS tracks at your own pace.", icon: Code2, cardClass: "card-violet", iconBg: "bg-[rgba(191,95,255,0.1)]", iconColor: "text-[var(--neon-violet)]" },
  { title: "Progress Dashboard", desc: "Visual analytics showing your streak, XP gain, weekly activity, and goal completion rates.", icon: Star, cardClass: "card-cyan", iconBg: "bg-[rgba(0,229,255,0.1)]", iconColor: "text-[var(--neon-cyan)]" },
];
