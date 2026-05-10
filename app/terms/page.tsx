"use client";
import { motion } from "framer-motion";
import { Shield, FileText, CheckCircle } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing CodeBuddy, you agree to be bound by these Terms of Service and all applicable laws and regulations."
    },
    {
      title: "2. User Conduct",
      content: "Users are expected to maintain professional conduct. Any attempts to bypass security, scrape content, or harass other users will result in account termination."
    },
    {
      title: "3. Intellectual Property",
      content: "All learning materials, code challenges, and curriculum content are the property of CodeBuddy. Users retain ownership of the code they write."
    },
    {
      title: "4. Gamification & XP",
      content: "XP and levels are virtual rewards for educational progress and have no monetary value."
    }
  ];

  return (
    <div className="container py-20 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/20">
          <FileText className="text-[var(--neon-green)] w-8 h-8" />
        </div>
        <h1 className="font-heading text-4xl font-900 text-white mb-4 tracking-tighter">
          TERMS OF <span className="neon-text-green">SERVICE</span>
        </h1>
        <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Last updated: May 2025</p>
      </motion.div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="card p-8 border-white/5 bg-white/[0.02]"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[var(--neon-green)]" />
              {section.title}
            </h2>
            <p className="text-white/50 leading-relaxed text-sm">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
