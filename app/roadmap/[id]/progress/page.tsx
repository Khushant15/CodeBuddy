'use client';

// app/roadmap/[id]/progress/page.tsx
import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { AuthGuard } from '@/components/AuthGuard';
import { getRoadmapById, Roadmap } from '@/lib/roadmaps';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getOrCreateUserProfile } from '@/lib/userService';
import { CheckCircle2, Circle, Target, Lock, Play, ChevronRight, Zap, Loader2, Map as MapIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RoadmapProgressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = getRoadmapById(id);
    setRoadmap(r ?? null);

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const profile = await getOrCreateUserProfile(u.uid, u.email ?? "", u.displayName ?? "Developer");
        setCompletedLessons(profile.completedLessons || []);
      }
      setLoading(false);
    });
    return unsub;
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
         <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!roadmap) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Roadmap not found.</div>;
  }

  // Calculate overall progress
  const totalItems = roadmap.weeks.reduce((acc, week) => acc + week.lessons.length, 0);
  const completedItemCount = roadmap.weeks.reduce((acc, week) => {
    return acc + week.lessons.filter(l => completedLessons.includes(l)).length;
  }, 0);
  
  const overallPct = totalItems > 0 ? Math.round((completedItemCount / totalItems) * 100) : 0;

  let isPreviousWeekCompleted = true; // Week 1 is always unlocked

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-10">

          {/* Header */}
          <header>
             <Link href="/dashboard" className="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-mono mb-6 transition-colors w-max">
                <ArrowLeft size={16} /> Back to Dashboard
             </Link>
             <div className="flex items-start justify-between">
                <div>
                   <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2"><MapIcon size={14}/> Career Track</p>
                   <h1 className="text-3xl md:text-5xl font-bold mb-3">{roadmap.title}</h1>
                   <p className="text-gray-400 max-w-xl">{roadmap.description}</p>
                </div>
             </div>
             
             {/* Overall Progress Bar */}
             <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-5">
               <div className="flex justify-between items-end mb-3">
                 <div>
                   <h3 className="text-sm font-bold text-gray-300">Overall Progress</h3>
                   <p className="text-xs text-gray-500 mt-1 font-mono">{completedItemCount} of {totalItems} lessons completed</p>
                 </div>
                 <span className="text-2xl font-bold font-mono text-cyan-400">{overallPct}%</span>
               </div>
               <div className="h-2 w-full bg-black rounded-full overflow-hidden">
                 <motion.div 
                    className="h-full bg-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${overallPct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                 />
               </div>
             </div>
          </header>

          {/* Timeline */}
          <div className="space-y-8 relative">
            <div className="absolute left-6 top-8 bottom-8 w-px bg-gray-800" />

            {roadmap.weeks.map((week, idx) => {
              const weekLessonsCompleted = week.lessons.filter(l => completedLessons.includes(l)).length;
              const isWeekCompleted = weekLessonsCompleted === week.lessons.length && week.lessons.length > 0;
              const weekPct = week.lessons.length > 0 ? Math.round((weekLessonsCompleted / week.lessons.length) * 100) : 0;
              
              // Unlock logic: week is unlocked if previous week is fully completed
              const unlocked = idx === 0 || isPreviousWeekCompleted;
              
              // Update state for NEXT iteration
              isPreviousWeekCompleted = isWeekCompleted;

              return (
                <div key={week.week} className={`relative pl-16 transition-opacity duration-500 ${!unlocked ? 'opacity-40' : 'opacity-100'}`}>
                  {/* Timeline Dot */}
                  <div className={`absolute left-[20px] top-6 w-3 h-3 rounded-full border-2 ${
                    isWeekCompleted ? 'bg-cyan-400 border-cyan-400' : 
                    unlocked ? 'bg-black border-cyan-400' : 'bg-black border-gray-600'
                  }`} />
                  
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-6">
                       <div>
                         <h2 className="text-xl font-bold mb-1 flex items-center gap-3">
                           Week {week.week}: {week.title}
                           {!unlocked && <Lock size={16} className="text-gray-500" />}
                           {isWeekCompleted && <CheckCircle2 size={18} className="text-green-500" />}
                         </h2>
                         {unlocked && !isWeekCompleted && (
                           <p className="text-xs font-mono text-cyan-400 mt-2">
                             You're {weekPct}% through Week {week.week}.
                           </p>
                         )}
                       </div>
                    </div>

                    <div className="space-y-3">
                      {week.lessons.map(lessonId => {
                        const done = completedLessons.includes(lessonId);
                        return (
                          <div key={lessonId} className="flex items-center gap-3 text-sm">
                            {done ? (
                              <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                            ) : unlocked ? (
                              <Circle size={16} className="text-gray-500 shrink-0" />
                            ) : (
                              <Lock size={16} className="text-gray-700 shrink-0" />
                            )}
                            <span className={done ? 'text-gray-400 line-through' : 'text-gray-200'}>
                              {/* In a real app we'd fetch the title. For MVP we format the ID */}
                              Lesson: {lessonId.replace('py-', '').replace(/-/g, ' ')}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Milestone Card */}
                    <div className="mt-6 border border-gray-700 bg-gray-950 rounded-xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-purple-500" />
                      <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
                        <Target size={14} /> Milestone Challenge
                      </div>
                      <h4 className="font-bold text-lg mb-2">{week.milestone.title}</h4>
                      <p className="text-sm text-gray-400 mb-4">{week.milestone.description}</p>
                      
                      <div className="mb-5 space-y-1">
                         <span className="text-xs text-gray-500 font-mono">Criteria:</span>
                         <ul className="text-sm text-gray-300 list-disc list-inside">
                           {week.milestone.criteria.map((c, i) => <li key={i}>{c}</li>)}
                         </ul>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-yellow-400">
                           <Zap size={14} /> +{week.milestone.xpReward} XP Reward
                        </div>
                        {unlocked && week.milestone.projectId && (
                           <Link 
                             href={`/projects/${week.milestone.projectId}/guided`}
                             className="flex items-center gap-2 bg-cyan-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-cyan-400 transition-colors"
                           >
                             Start Project <Play size={14} fill="currentColor"/>
                           </Link>
                        )}
                        {!week.milestone.projectId && (
                           <span className="text-xs text-gray-500 italic">Auto-graded on completion</span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
    </AuthGuard>
  );
}
