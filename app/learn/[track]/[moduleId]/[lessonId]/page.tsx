'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getModule } from '@/lib/curriculum/contentLoader';
import { Curriculum, Lesson, Track } from '@/lib/curriculum/types';
import { LessonRenderer } from '@/components/LessonRenderer';
import { ExerciseRenderer } from '@/components/ExerciseComponents';
import { CurriculumSidebar } from '@/components/CurriculumSidebar';
import { LessonNavigation } from '@/components/LessonNavigation';
import { AuthGuard } from '@/components/AuthGuard';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import {
  completeLessonInFirebase,
  completeModuleInFirebase,
  getOrCreateUserProfile,
  getTrackProgress,
} from '@/lib/userService';
import { BookOpen, Code, Trophy, Star, Zap } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    track: Track;
    moduleId: string;
    lessonId: string;
  }>;
}

export default function DynamicLessonPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { track, moduleId, lessonId } = resolvedParams;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [module, setModule] = useState<Curriculum | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  // Level-up / module complete toast state
  const [toast, setToast] = useState<{ message: string; type: 'xp' | 'level' | 'module' } | null>(null);

  const showToast = (message: string, type: 'xp' | 'level' | 'module') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Find next/prev lessons
  const lessonIndex = module?.lessons.findIndex(l => l.id === lessonId) ?? -1;
  const prevLesson = lessonIndex > 0 ? module?.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < (module?.lessons.length ?? 0) - 1 ? module?.lessons[lessonIndex + 1] : null;
  const isLastLesson = nextLesson === null && lessonIndex >= 0;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const profile = await getOrCreateUserProfile(user.uid, user.email || '', user.displayName || 'Developer');
        setCompletedLessons(profile.completedLessons || []);
        setCompletedModules(profile.completedModules || []);
        if (profile.completedLessons?.includes(lessonId)) {
          setCompleted(true);
        }
      }
    });

    async function loadContent() {
      setLoading(true);
      try {
        const modData = await getModule(moduleId, track);
        setModule(modData);
        const lessonData = modData.lessons.find(l => l.id === lessonId);
        if (lessonData) setLesson(lessonData);
      } catch (err) {
        console.error('Failed to load lesson:', err);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
    return unsub;
  }, [moduleId, lessonId]);

  const handleLessonComplete = async (exercisePassed: boolean) => {
    if (!exercisePassed || completed || !uid || !module) return;

    setCompleted(true);
    const newCompletedLessons = [...completedLessons, lessonId];
    setCompletedLessons(newCompletedLessons);

    // 1. Save lesson + XP + streak to Firestore
    const { newXp, newLevel, leveledUp } = await completeLessonInFirebase(
      uid,
      lessonId,
      lesson?.xpReward || 50,
      track
    );

    // 2. Show XP toast
    showToast(`+${lesson?.xpReward || 50} XP earned!`, 'xp');

    // 3. Level-up toast
    if (leveledUp) {
      setTimeout(() => showToast(`🎉 Level Up! You're now Level ${newLevel}!`, 'level'), 1500);
    }

    // 4. Check if ALL lessons in this module are now done
    const allModuleLessonIds = module.lessons.map(l => l.id);
    const allDone = allModuleLessonIds.every(id => newCompletedLessons.includes(id));

    if (allDone && !completedModules.includes(moduleId)) {
      await completeModuleInFirebase(uid, moduleId, track, 200);
      setCompletedModules(prev => [...prev, moduleId]);
      setTimeout(() => showToast(`🏆 Module Complete! +200 Bonus XP!`, 'module'), 3000);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-neon-green/30 border-t-neon-green rounded-full animate-spin" />
        <p className="text-neon-green font-orbitron text-sm">Loading Neural Path...</p>
      </div>
    </div>
  );

  if (!lesson) return <div className="p-10 text-white">Lesson not found.</div>;

  return (
    <AuthGuard>
      <div className="flex h-screen bg-black overflow-hidden">

        {/* Sidebar */}
        <div className="hidden lg:block h-full">
          <CurriculumSidebar
            track={track}
            currentLessonId={lessonId}
            completedLessons={completedLessons}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto px-6 py-12">

            {/* Lesson Header */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">
                <Link href={`/learn/${track}`} className="hover:text-neon-cyan transition-colors">
                  {track}
                </Link>
                <span>/</span>
                <span className="text-gray-400">{module?.title}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-orbitron font-extrabold text-white mb-4">
                {lesson.title}
              </h1>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-neon-green bg-neon-green/10 px-3 py-1 rounded-full border border-neon-green/20">
                  <Trophy size={14} />
                  <span className="text-xs font-bold font-mono">+{lesson.xpReward || 50} XP</span>
                </div>
                <div className="text-gray-500 text-xs flex items-center gap-2">
                  <BookOpen size={14} />
                  <span>{lesson.estimatedMinutes || 10} min read</span>
                </div>
                {completed && (
                  <div className="flex items-center gap-2 text-neon-cyan text-xs font-mono">
                    <Star size={14} className="fill-neon-cyan" />
                    <span>Completed</span>
                  </div>
                )}
                {isLastLesson && (
                  <div className="flex items-center gap-2 text-neon-violet text-xs font-mono border border-neon-violet/30 bg-neon-violet/10 px-3 py-1 rounded-full">
                    <Zap size={14} />
                    <span>Final Lesson</span>
                  </div>
                )}
              </div>
            </motion.header>

            {/* Theory */}
            <section className="prose prose-invert max-w-none">
              {lesson.theory && <LessonRenderer content={lesson.theory} />}
            </section>

            {/* Exercises */}
            {(() => {
              const l = lesson as any;
              const exercises = [
                ...(l.exercises || []),
                ...(l.quiz ? (Array.isArray(l.quiz) ? l.quiz : [l.quiz]) : []),
                ...(l.exercise ? [l.exercise] : [])
              ];
              if (exercises.length === 0) return null;

              return (
                <section className="mt-16 space-y-12">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                      <Code className="text-neon-cyan" size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-wider">Practice Challenge</h2>
                      <p className="text-xs text-gray-500">Apply what you've just learned</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {exercises.map((ex: any, i: number) => (
                      <ExerciseRenderer
                        key={ex.id || `ex-${i}`}
                        exercise={ex}
                        onComplete={handleLessonComplete}
                      />
                    ))}
                  </div>
                </section>
              );
            })()}

            {/* Navigation */}
            <LessonNavigation
              isCompleted={completed}
              prevLesson={prevLesson ? { id: prevLesson.id, module: moduleId, track } : undefined}
              nextLesson={nextLesson ? { id: nextLesson.id, module: moduleId, track } : undefined}
            />
          </div>
        </main>

        {/* Toast Notifications */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.message}
              initial={{ opacity: 0, y: 60, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 40, x: '-50%' }}
              className={`fixed bottom-8 left-1/2 z-50 px-6 py-3 rounded-2xl font-bold font-orbitron text-sm shadow-2xl border ${
                toast.type === 'module'
                  ? 'bg-neon-violet/20 border-neon-violet text-neon-violet'
                  : toast.type === 'level'
                  ? 'bg-neon-orange/20 border-neon-orange text-neon-orange'
                  : 'bg-neon-green/20 border-neon-green text-neon-green'
              }`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AuthGuard>
  );
}
