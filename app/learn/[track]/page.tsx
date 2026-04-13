'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { getTrack } from '@/lib/curriculum/contentLoader';
import { Curriculum, Track } from '@/lib/curriculum/types';
import { AuthGuard } from '@/components/AuthGuard';
import { ArrowLeft, Code, PlayCircle, Lock, CheckCircle2, Clock, Zap } from 'lucide-react';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getOrCreateUserProfile } from '@/lib/userService';
import Link from 'next/link';

interface TrackPageProps {
  params: Promise<{ track: Track }>;
}

export default function TrackDashboard({ params }: TrackPageProps) {
  const { track } = use(params);
  const [modules, setModules] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await getOrCreateUserProfile(user.uid, user.email || '', user.displayName || 'Developer');
        setCompletedLessons(profile.completedLessons || []);
      }
    });

    async function load() {
      try {
        const data = await getTrack(track);
        setModules(data);
      } finally {
        setLoading(false);
      }
    }
    load();
    return unsub;
  }, [track]);

  const getModuleProgress = (module: Curriculum) => {
    if (!module.lessons || module.lessons.length === 0) return 0;
    const completedCount = module.lessons.filter(l => completedLessons.includes(l.id)).length;
    return Math.round((completedCount / module.lessons.length) * 100);
  };

  if (loading) return (
    <div className="min-h-screen bg-black p-10 space-y-8">
      <div className="h-40 bg-gray-900 rounded-2xl animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-gray-900 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  );

  return (
    <AuthGuard>
      <div className="container py-12 max-w-6xl">
        <header className="mb-12">
          <Link href="/learn" className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-neon-green mb-6 transition-colors">
            <ArrowLeft size={14} /> Back to all Tracks
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h1 className="text-5xl font-orbitron font-extrabold text-white uppercase tracking-tighter">
                {track} <span className="text-neon-green">Mastery</span>
              </h1>
              <p className="text-gray-400 mt-2 max-w-xl">
                Master {track} from the ground up with interactive challenges and real-world projects.
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl text-center min-w-[120px]">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Total Modules</p>
                <p className="text-2xl font-orbitron font-bold text-white">{modules.length}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl text-center min-w-[120px]">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Total XP</p>
                <p className="text-2xl font-orbitron font-bold text-neon-cyan">
                  {modules.reduce((acc, m) => acc + (m.lessons?.reduce((lacc, l) => lacc + (l.xpReward || 50), 0) || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((module, idx) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group card p-6 hover:border-neon-green/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Code size={120} />
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green">
                  <span className="text-xl font-orbitron font-bold">{module.order}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest ${idx === 0 ? 'bg-neon-green/10 border-neon-green/30 text-neon-green' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                    {idx === 0 ? 'Start Here' : 'Prerequisite'}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-orbitron font-bold text-white mb-2 group-hover:text-neon-green transition-colors">
                {module.title}
              </h2>
              <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                {module.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-4 text-gray-400">
                    <span className="flex items-center gap-1"><Zap size={12} className="text-neon-cyan" /> {module.lessons.length} Lessons</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {module.estimatedHours}h</span>
                  </div>
                  <span className="text-gray-500">{getModuleProgress(module)}% Complete</span>
                </div>
                
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-neon-green transition-all duration-1000" style={{ width: `${getModuleProgress(module)}%` }} />
                </div>

                <Link
                  href={`/learn/${track}/${module.id}/${module.lessons[0]?.id}`}
                  className="btn-neon-solid w-full flex items-center justify-center gap-2 group-hover:bg-neon-green group-hover:text-black transition-all"
                >
                  <PlayCircle size={18} />
                  Start Module
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
