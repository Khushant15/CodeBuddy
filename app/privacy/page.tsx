"use client";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPage() {
  const policies = [
    {
      icon: Database,
      title: "Data Collection",
      content: "We collect basic profile information (email, name) and learning progress data to provide a personalized experience."
    },
    {
      icon: Eye,
      title: "Usage Transparency",
      content: "We track how you interact with lessons and challenges to improve our curriculum and AI help features."
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "Your data is stored securely using industry-standard encryption and Firebase security protocols."
    },
    {
      icon: Shield,
      title: "Third Parties",
      content: "We do not sell your personal data. We only share anonymized data with service providers necessary for platform operation."
    }
  ];

  return (
    <div className="container py-20 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-violet-500/20 shadow-[0_0_20px_-5px_rgba(191,95,255,0.3)]">
          <Shield className="text-[var(--neon-violet)] w-8 h-8" />
        </div>
        <h1 className="font-heading text-4xl font-900 text-white mb-4 tracking-tighter uppercase">
          Privacy <span className="neon-text-violet">Policy</span>
        </h1>
        <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Your data is yours. We just protect it.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {policies.map((p, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="card p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <p.icon className="w-5 h-5 text-[var(--neon-violet)]" />
            </div>
            <h2 className="text-lg font-bold text-white mb-3 tracking-wide">{p.title}</h2>
            <p className="text-white/40 leading-relaxed text-sm">
              {p.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
