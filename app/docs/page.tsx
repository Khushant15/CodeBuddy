"use client";
import { motion } from "framer-motion";
import { Book, Code, Zap, Trophy, MessageSquare, Terminal } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const categories = [
    {
      title: "Getting Started",
      icon: Zap,
      links: ["Platform Overview", "Your First Lesson", "Setting up Profile"]
    },
    {
      title: "Learning Tracks",
      icon: Code,
      links: ["Python Basics", "Web Development", "Interactive Roadmaps"]
    },
    {
      title: "Gamification",
      icon: Trophy,
      links: ["XP & Leveling System", "Daily Debug Streaks", "Leaderboard Rules"]
    },
    {
      title: "AI Assistant",
      icon: MessageSquare,
      links: ["Using the Chatbot", "Pedagogical AI Help", "Token Usage"]
    }
  ];

  return (
    <div className="container py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <p className="text-[11px] font-mono text-[var(--neon-cyan)] uppercase tracking-[0.3em] mb-4">Documentation</p>
          <h1 className="font-heading text-5xl md:text-7xl font-900 text-white mb-6 tracking-tighter">
            HELP <span className="neon-text-cyan">CENTER</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl leading-relaxed">
            Everything you need to know about mastering code on CodeBuddy. Browse categories or start a lesson.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:shadow-[0_0_20px_-5px_rgba(0,229,255,0.4)] transition-all">
                  <cat.icon className="text-[var(--neon-cyan)] w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">{cat.title}</h2>
              </div>
              <ul className="space-y-4 ml-2">
                {cat.links.map((link, lidx) => (
                  <li key={lidx}>
                    <Link href="#" className="flex items-center gap-3 text-white/30 hover:text-white transition-colors group/link">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover/link:bg-[var(--neon-cyan)] transition-colors" />
                      <span className="text-sm font-medium">{link}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 p-10 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 text-center"
        >
          <Terminal className="w-10 h-10 mx-auto mb-6 text-white/20" />
          <h3 className="text-2xl font-bold text-white mb-4">Still need help?</h3>
          <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">Our AI assistant is available 24/7 to help you with technical questions or platform navigation.</p>
          <Link href="/dashboard" className="btn-neon py-3 px-8 text-xs inline-flex items-center gap-2">
            Go to Dashboard <Zap className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
