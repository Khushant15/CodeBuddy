'use client';

import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LessonNavigationProps {
  prevLesson?: { id: string; module: string; track: string };
  nextLesson?: { id: string; module: string; track: string };
  isCompleted?: boolean;
  onNextClick?: () => void;
}

export function LessonNavigation({ 
  prevLesson, 
  nextLesson, 
  isCompleted,
  onNextClick 
}: LessonNavigationProps) {
  const router = useRouter();

  const handleNav = (lesson: any) => {
    router.push(`/learn/${lesson.track}/${lesson.module}/${lesson.id}`);
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-6">
      <div className="flex-1 w-full sm:w-auto">
        {prevLesson && (
          <button
            onClick={() => handleNav(prevLesson)}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-800 hover:border-gray-600 hover:bg-gray-900 transition-all group w-full sm:w-auto"
          >
            <ArrowLeft className="text-gray-500 group-hover:text-neon-cyan transition-transform group-hover:-translate-x-1" />
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Previous Lesson</p>
              <p className="text-sm font-medium text-gray-300">Back Track</p>
            </div>
          </button>
        )}
      </div>

      <div className="flex-shrink-0 order-first sm:order-none">
        {isCompleted && (
          <div className="flex items-center gap-2 bg-neon-green/10 text-neon-green px-4 py-2 rounded-full border border-neon-green/30 animate-bounce">
            <CheckCircle size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Lesson Complete!</span>
          </div>
        )}
      </div>

      <div className="flex-1 w-full sm:w-auto flex justify-end">
        {nextLesson ? (
          <button
            onClick={() => onNextClick ? onNextClick() : handleNav(nextLesson)}
            className={`
              flex items-center justify-between gap-3 p-4 rounded-xl border transition-all group w-full sm:w-auto
              ${isCompleted 
                ? 'border-neon-green bg-neon-green/10 hover:bg-neon-green/20' 
                : 'border-gray-800 hover:border-gray-600 hover:bg-gray-900'}
            `}
          >
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Next Lesson</p>
              <p className={`text-sm font-medium ${isCompleted ? 'text-neon-green' : 'text-gray-300'}`}>
                {isCompleted ? 'Continue Journey' : 'Up Next'}
              </p>
            </div>
            <ArrowRight className={`
              ${isCompleted ? 'text-neon-green' : 'text-gray-500'} 
              transition-transform group-hover:translate-x-1
            `} />
          </button>
        ) : (
          <Link
            href={`/learn/${prevLesson?.track || ''}`}
            className="flex items-center justify-between gap-3 p-4 rounded-xl border border-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan/20 transition-all group w-full sm:w-auto text-right"
          >
            <div>
              <p className="text-[10px] uppercase font-bold text-neon-cyan tracking-widest">Module Finish</p>
              <p className="text-sm font-medium text-white">Back to Dashboard</p>
            </div>
            <ArrowRight className="text-neon-cyan transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
