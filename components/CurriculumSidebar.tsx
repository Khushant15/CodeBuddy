'use client';

import { useState, useEffect } from 'react';
import { getTrack } from '@/lib/curriculum/contentLoader';
import { Curriculum, Track } from '@/lib/curriculum/types';
import { ChevronRight, CheckCircle2, Circle, Lock } from 'lucide-react';
import Link from 'next/link';

interface CurriculumSidebarProps {
  track: Track;
  currentLessonId?: string;
  completedLessons?: string[];
}

export function CurriculumSidebar({ 
  track, 
  currentLessonId, 
  completedLessons = [] 
}: CurriculumSidebarProps) {
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTrack(track);
        setCurricula(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [track]);

  if (loading) return <div className="p-4 animate-pulse space-y-4">
    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-800 rounded-lg" />)}
  </div>;

  return (
    <aside className="w-80 h-full overflow-y-auto bg-gray-950 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-orbitron font-bold text-neon-green uppercase tracking-wider">
          {track} Track
        </h2>
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
          <span>{curricula.length} Modules</span>
          <span className="w-1 h-1 bg-gray-700 rounded-full" />
          <span>{curricula.reduce((acc, c) => acc + c.lessons.length, 0)} Lessons</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-8">
        {curricula.map((module) => (
          <div key={module.id} className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
              Module {module.order}: {module.title}
            </h3>
            
            <div className="space-y-1">
              {module.lessons.map((lesson) => {
                const isActive = lesson.id === currentLessonId;
                const isCompleted = completedLessons.includes(lesson.id);
                
                return (
                  <Link
                    key={lesson.id}
                    href={`/learn/${track}/${module.id}/${lesson.id}`}
                    className={`
                      group flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                      ${isActive ? 'bg-neon-green/10 border border-neon-green/30' : 'hover:bg-gray-900 border border-transparent'}
                    `}
                  >
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 size={18} className="text-neon-green" />
                      ) : isActive ? (
                        <Circle size={18} className="text-neon-cyan animate-pulse" />
                      ) : (
                        <Circle size={18} className="text-gray-700 group-hover:text-gray-500" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${isActive ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-600">
                        <span>{lesson.estimatedMinutes}m</span>
                        <span className="w-1 h-1 bg-gray-800 rounded-full" />
                        <span>{lesson.xpReward} XP</span>
                      </div>
                    </div>

                    {isActive && <ChevronRight size={14} className="text-neon-green" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
