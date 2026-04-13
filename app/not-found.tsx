"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="font-heading text-[8rem] md:text-[12rem] font-900 leading-none mb-4 gradient-heading opacity-20 select-none">
          404
        </div>
        <div className="relative -mt-16 mb-8">
          <div className="terminal max-w-xs mx-auto">
            <div className="terminal-header">
              <div className="terminal-dot bg-[#ff5f57]" />
              <div className="terminal-dot bg-[#ffbd2e]" />
              <div className="terminal-dot bg-[#28ca42]" />
            </div>
            <div className="terminal-body text-xs">
              <div><span className="terminal-prompt">$</span> cd /requested-page</div>
              <div className="text-[var(--neon-pink)] mt-1">bash: cd: /requested-page: No such file or directory</div>
              <div className="mt-2"><span className="terminal-prompt">$</span> <span className="terminal-cursor" /></div>
            </div>
          </div>
        </div>

        <h1 className="font-heading text-2xl font-700 tracking-wider text-white mb-3">
          PAGE NOT FOUND
        </h1>
        <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-neon btn-neon-solid py-3 px-6 text-[11px] justify-center">
            <Home className="w-3.5 h-3.5" /> Go Home
          </Link>
          <Link href="/learn" className="btn-neon py-3 px-6 text-[11px] justify-center">
            <ArrowLeft className="w-3.5 h-3.5" /> Start Learning
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
