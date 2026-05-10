'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthGuard } from '@/components/AuthGuard';
import { auth, db } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { LessonProgress, saveReviewOutcome } from '@/lib/userService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { BrainCircuit, Star, ArrowRight, BookOpen, CircleCheck, Frown, Meh, Smile, Loader2 } from 'lucide-react';
import Link from 'next/link';
// Using our dummy content loader for MVP
import { getModule } from '@/lib/curriculum/contentLoader';

export default function ReviewPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [dueReviews, setDueReviews] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [xpEarnedTotal, setXpEarnedTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);

  // Lesson data for current review
  const [currentLessonData, setCurrentLessonData] = useState<any | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUid(u.uid);
        // Find due reviews
        // For MVP, since we don't have indexes on reviewState.dueDate yet, we'll fetch all completed lessons and filter locally
        const q = query(
          collection(db, "users", u.uid, "lessonProgress"),
          where("status", "==", "completed")
        );
        const snap = await getDocs(q);
        const allProgress = snap.docs.map(d => d.data() as LessonProgress);
        
        const now = Date.now();
        const due = allProgress.filter(p => {
          if (!p.reviewState) return true; // Never reviewed -> due
          return p.reviewState.dueDate <= now;
        });

        // Sort by oldest due date or most struggling
        due.sort((a, b) => {
          const aDue = a.reviewState?.dueDate ?? 0;
          const bDue = b.reviewState?.dueDate ?? 0;
          return aDue - bDue;
        });

        setDueReviews(due);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // Fetch lesson data when index changes
  useEffect(() => {
    async function loadLesson() {
      if (currentIndex < dueReviews.length) {
        const item = dueReviews[currentIndex];
        const mod = await getModule(item.moduleId, item.trackId as any);
        const l = mod.lessons.find(x => x.id === item.lessonId);
        setCurrentLessonData(l);
      }
    }
    loadLesson();
  }, [currentIndex, dueReviews]);

  const handleRate = async (rating: number) => {
    if (!uid) return;
    setSubmitting(true);
    
    const currentItem = dueReviews[currentIndex];
    const earned = await saveReviewOutcome(uid, currentItem.lessonId, rating);
    setXpEarnedTotal(prev => prev + earned);

    if (currentIndex + 1 >= dueReviews.length) {
      setFinished(true);
    } else {
      setCurrentIndex(c => c + 1);
    }
    setSubmitting(false);
  };

  if (loading || (dueReviews.length > 0 && !currentLessonData && !finished)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (dueReviews.length === 0) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6">
           <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CircleCheck className="text-green-400 w-10 h-10" />
           </div>
           <h1 className="text-3xl font-bold mb-4">All caught up!</h1>
           <p className="text-gray-400 max-w-md text-center mb-8">
             Your neural pathways are strong. You have no Spaced Repetition reviews due today. Check back tomorrow!
           </p>
           <Link href="/dashboard" className="btn-neon font-mono">
              Return to Dashboard
           </Link>
        </div>
      </AuthGuard>
    );
  }

  if (finished) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6">
           <div className="w-24 h-24 bg-yellow-400/10 border border-yellow-400/30 rounded-full flex flex-col items-center justify-center mb-6 shadow-[0_0_40px_rgba(250,204,21,0.2)]">
              <Star className="text-yellow-400 w-12 h-12" fill="currentColor" />
           </div>
           <h1 className="text-4xl font-bold mb-3">Review Complete</h1>
           <p className="text-gray-400 mb-6 font-mono">Memory synaptic links strengthened.</p>
           
           <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 mb-8">
             <BrainCircuit className="text-cyan-400" />
             <span className="font-bold">{dueReviews.length}</span> <span className="text-gray-400">Concepts Reviewed</span>
             <div className="w-px h-6 bg-gray-700 mx-3" />
             <span className="text-yellow-400 font-bold">+{xpEarnedTotal} XP</span>
           </div>

           <Link href="/dashboard" className="btn-neon">
              <ArrowRight size={18} /> Continue Learning
           </Link>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 flex items-center px-6 shrink-0 justify-between">
           <div className="flex items-center gap-3">
             <BrainCircuit className="text-cyan-400" />
             <span className="font-bold tracking-wider uppercase text-sm">Spaced Repetition</span>
           </div>
           <div className="text-xs font-mono text-gray-500">
             {currentIndex + 1} of {dueReviews.length}
           </div>
        </header>

        {/* Progress bar */}
        <div className="h-1 w-full bg-gray-900">
          <div 
            className="h-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${(currentIndex / dueReviews.length) * 100}%` }}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center justify-center">
           <AnimatePresence mode="wait">
             <motion.div
               key={currentIndex}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.05 }}
               className="max-w-2xl w-full"
             >
               <div className="text-center mb-8">
                 <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                   <BookOpen size={14}/> Concept Recall
                 </p>
                 <h2 className="text-3xl font-bold">{currentLessonData?.title}</h2>
               </div>

               <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-10 min-h-[200px] flex items-center justify-center">
                  <div className="text-gray-300 text-lg leading-relaxed text-center">
                    {/* For MVP, we just render the description or summary of the concept. 
                        In production, we'd render the exact quiz or flashcard here. */}
                    Think back to this lesson. Do you remember the core concepts involved?
                    <br/><br/>
                    <em className="text-gray-500 text-base">{currentLessonData?.theory?.sections?.[0]?.content.substring(0, 150)}...</em>
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="text-center text-sm text-gray-500 font-mono">How well did you remember this?</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <button 
                       disabled={submitting}
                       onClick={() => handleRate(1)}
                       className="flex flex-col items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl p-4 transition-colors disabled:opacity-50"
                     >
                       <Frown className="text-red-400" />
                       <span className="text-sm font-bold text-red-200">Forgot it</span>
                       <span className="text-xs text-red-400/50">Reset memory</span>
                     </button>
                     
                     <button 
                       disabled={submitting}
                       onClick={() => handleRate(3)}
                       className="flex flex-col items-center justify-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 transition-colors disabled:opacity-50"
                     >
                       <Meh className="text-yellow-400" />
                       <span className="text-sm font-bold text-yellow-200">Hard to recall</span>
                       <span className="text-xs text-yellow-400/50">Review sooner</span>
                     </button>

                     <button 
                       disabled={submitting}
                       onClick={() => handleRate(5)}
                       className="flex flex-col items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-xl p-4 transition-colors disabled:opacity-50"
                     >
                       <Smile className="text-green-400" />
                       <span className="text-sm font-bold text-green-200">Easy peasy</span>
                       <span className="text-xs text-green-400/50">Review much later</span>
                     </button>
                  </div>
               </div>

             </motion.div>
           </AnimatePresence>
        </main>
      </div>
    </AuthGuard>
  );
}
