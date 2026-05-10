"use client";
import { AuthGuard } from "@/components/AuthGuard";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <div className="container py-10 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-mono mb-6 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="font-heading text-3xl md:text-5xl font-800 text-white mb-2">
            LEARNING <span className="text-[var(--neon-violet)] drop-shadow-[0_0_15px_rgba(191,95,255,0.5)]">ANALYTICS</span>
          </h1>
          <p className="text-white/40 text-sm font-mono max-w-2xl">
            Deep dive into your progression, concept mastery, and areas for improvement.
          </p>
        </motion.div>
        
        <AnalyticsDashboard />
      </div>
    </AuthGuard>
  );
}
