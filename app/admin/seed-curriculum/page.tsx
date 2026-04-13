'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SeedResult {
  success: boolean;
  message?: string;
  error?: string;
  stats?: {
    modules: number;
    lessons: number;
    tracks: number;
    skipped: number;
  };
}

export default function SeedCurriculumPage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<SeedResult | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const runSeed = async () => {
    setStatus('running');
    setLog(['🚀 Starting curriculum sync to Firestore...']);
    setResult(null);

    try {
      setLog(prev => [...prev, '📂 Reading curriculum JSON files from lib/curriculum/...']);
      const res = await fetch('/api/seed-curriculum?secret=codebuddy-seed-2025');
      const data: SeedResult = await res.json();

      if (data.success) {
        setStatus('done');
        setLog(prev => [
          ...prev,
          `✅ Tracks synced: ${data.stats?.tracks}`,
          `✅ Modules synced: ${data.stats?.modules}`,
          `✅ Lessons synced: ${data.stats?.lessons}`,
          data.stats?.skipped ? `⚠️  Skipped (missing files): ${data.stats.skipped}` : '',
          '🎉 All curriculum data is now live in Firestore!',
        ].filter(Boolean));
      } else {
        setStatus('error');
        setLog(prev => [...prev, `❌ Error: ${data.error}`]);
      }
      setResult(data);
    } catch (err: any) {
      setStatus('error');
      setLog(prev => [...prev, `❌ Network error: ${err.message}`]);
      setResult({ success: false, error: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7928ca, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #00ff87, transparent)', filter: 'blur(80px)' }} />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl border border-neon-green/30 bg-neon-green/10 mb-6">
            <Database size={36} className="text-neon-green" />
          </div>
          <h1 className="text-4xl font-orbitron font-extrabold text-white mb-3">
            Sync Curriculum
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Uploads all curriculum JSON files from <code className="text-neon-green bg-neon-green/10 px-1 rounded">lib/curriculum/</code> into
            Firestore. Modules and lessons are stored as documents and subcollections.
            Safe to run multiple times — uses <strong className="text-white">merge</strong> mode.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-8"
        >
          {/* Firestore Schema */}
          <div className="mb-8 p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-gray-400 leading-relaxed">
            <p className="text-neon-cyan mb-2">// Firestore structure after sync:</p>
            <p>curriculumTracks/<span className="text-neon-green">{'{track}'}</span>  → index + metadata</p>
            <p>curriculum/<span className="text-neon-green">{'{moduleId}'}</span>  → module metadata</p>
            <p className="pl-4">└── lessons/<span className="text-neon-green">{'{lessonId}'}</span>  → full lesson + exercises</p>
          </div>

          {/* Log Output */}
          <AnimatePresence>
            {log.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-xs space-y-1 max-h-52 overflow-y-auto"
              >
                {log.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={
                      line.startsWith('✅') ? 'text-neon-green' :
                      line.startsWith('❌') ? 'text-red-400' :
                      line.startsWith('⚠️') ? 'text-neon-orange' :
                      line.startsWith('🎉') ? 'text-neon-cyan' :
                      'text-gray-400'
                    }
                  >
                    {line}
                  </motion.p>
                ))}
                {status === 'running' && (
                  <motion.p
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="text-neon-green"
                  >
                    ▌ Writing to Firestore...
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          <AnimatePresence>
            {status === 'done' && result?.stats && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-3 gap-4 mb-6"
              >
                {[
                  { label: 'Tracks', value: result.stats.tracks, color: 'neon-cyan' },
                  { label: 'Modules', value: result.stats.modules, color: 'neon-green' },
                  { label: 'Lessons', value: result.stats.lessons, color: 'neon-violet' },
                ].map(s => (
                  <div key={s.label}
                    className={`text-center p-4 rounded-xl border border-${s.color}/30 bg-${s.color}/10`}>
                    <p className={`text-3xl font-orbitron font-extrabold text-${s.color}`}>{s.value}</p>
                    <p className="text-gray-400 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <button
            onClick={runSeed}
            disabled={status === 'running'}
            className={`w-full py-4 rounded-xl font-orbitron font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 ${
              status === 'running'
                ? 'bg-neon-green/10 border border-neon-green/20 text-neon-green/50 cursor-not-allowed'
                : status === 'done'
                ? 'bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/20'
                : status === 'error'
                ? 'bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20'
                : 'bg-neon-green/10 border border-neon-green/40 text-neon-green hover:bg-neon-green/20 hover:border-neon-green/60'
            }`}
          >
            {status === 'running' && <Loader2 size={18} className="animate-spin" />}
            {status === 'done' && <CheckCircle2 size={18} />}
            {status === 'error' && <XCircle size={18} />}
            {status === 'idle' && <Database size={18} />}
            {status === 'running' ? 'Syncing to Firestore...' :
             status === 'done'    ? 'Sync Complete — Run Again?' :
             status === 'error'   ? 'Failed — Retry?' :
                                    'Sync Curriculum to Firestore'}
          </button>

          {/* Warning */}
          <p className="text-xs text-gray-600 text-center mt-4">
            ⚠️ Requires <code className="text-gray-500">FIREBASE_SERVICE_ACCOUNT_JSON</code> in <code className="text-gray-500">.env.local</code> for Firestore Admin access.
          </p>

          {/* Back link */}
          {status === 'done' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center">
              <Link href="/learn" className="inline-flex items-center gap-2 text-neon-cyan text-sm hover:underline">
                Go to Learn <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
