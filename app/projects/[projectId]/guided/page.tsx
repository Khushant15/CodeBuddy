'use client';

// app/projects/[projectId]/guided/page.tsx
import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthGuard } from '@/components/AuthGuard';
import { CodeEditor } from '@/components/CodeEditor';
import { getProjectById, GuidedProject, GuidedProjectStage } from '@/lib/projects';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getProjectProgress, saveProjectStageProgress, ProjectStageProgress } from '@/lib/userService';
import { 
  CheckCircle2, Circle, Play, ChevronRight, Lock, 
  Lightbulb, ExternalLink, Zap, ArrowLeft, Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function GuidedProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  
  const [project, setProject] = useState<GuidedProject | null>(null);
  const [currentStageNum, setCurrentStageNum] = useState<number>(1);
  const [uid, setUid] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProjectStageProgress[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; passed: boolean } | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [userCode, setUserCode] = useState("");

  useEffect(() => {
    const p = getProjectById(projectId);
    setProject(p ?? null);

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          setUid(u.uid);
          if (p) {
            const prog = await getProjectProgress(u.uid, projectId);
            setProgress(prog);
            // Auto-resume to lowest unpassed stage
            const highestPassed = prog.filter(x => x.passed).map(x => x.stageNumber);
            const maxPassed = highestPassed.length > 0 ? Math.max(...highestPassed) : 0;
            if (maxPassed < p.stages.length) {
              setCurrentStageNum(maxPassed + 1);
            } else {
              setCurrentStageNum(p.stages.length);
            }
          }
        } catch (error) {
          console.error("Project Load Error:", error);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Project not found</div>;
  }

  const currentStage = project.stages.find(s => s.number === currentStageNum)!;
  
  // A stage is unlocked if it's stage 1, or if the (stageNum - 1) stage has been passed
  const isStageUnlocked = (num: number) => {
    if (num === 1) return true;
    return progress.some(p => p.stageNumber === num - 1 && p.passed);
  };
  
  const isStagePassed = (num: number) => progress.some(p => p.stageNumber === num && p.passed);
  
  const currentProgress = progress.find(p => p.stageNumber === currentStageNum);
  const initialCode = currentProgress?.lastCode || currentStage.starterCode || "";

  const handleSubmitCode = async (code: string, output: string, passed: boolean, error?: string) => {
    if (!uid) return;
    
    // Prevent submission of empty code
    if (!code || code.trim().length < 10) {
      setFeedback({ message: "Please write some code before submitting! Try following the requirements.", passed: false });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/projects/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          stage: currentStageNum,
          code
        })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      setFeedback({ message: data.feedback, passed: data.passed });

      // Consolidate progress into user profile if possible, or handle gracefully
      try {
        await saveProjectStageProgress(
          uid,
          project.id,
          currentStageNum,
          data.passed,
          data.xpEarned,
          code
        );
      } catch (fsErr: any) {
        console.error("Firestore Save Error:", fsErr);
        // If Firestore fails, we still show the feedback from the API
        if (fsErr.message?.includes("permissions")) {
          setFeedback(prev => ({ 
            message: (prev?.message || "") + "\n\n(Note: Progress could not be saved to cloud due to sync issues. Please try logging in again.)", 
            passed: prev?.passed || false 
          }));
        }
      }

      // Refresh progress
      const newProg = await getProjectProgress(uid, project.id);
      setProgress(newProg);

      // Auto-advance after 2 seconds if passed
      if (data.passed && data.nextStageUnlocked) {
        setTimeout(() => {
          setCurrentStageNum(s => s + 1);
          setFeedback(null);
          setHintsUsed(0);
        }, 2500);
      }

    } catch (err: any) {
      setFeedback({ message: err.message || 'Submission failed.', passed: false });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGetAIHelp = async () => {
    if (!project) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/practice/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: `${project.id}_stage_${currentStageNum}`,
          userCode: userCode,
          error: feedback?.message || "",
          context: `This is a guided project called "${project.title}". The user is on Stage ${currentStageNum}: ${currentStage.title}. The goal is: ${currentStage.description}.`
        })
      });
      const data = await res.json();
      setFeedback({ message: data.hint || data.reply, passed: false });
    } catch (err) {
      setFeedback({ message: "Could not reach AI guide. Try again later.", passed: false });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white flex flex-col">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-gray-800 bg-gray-950 flex items-center px-6 shrink-0">
          <Link href="/practice" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-mono transition-colors">
            <ArrowLeft size={16} /> Back to Projects
          </Link>
          <div className="mx-auto flex flex-col items-center">
             <span className="text-xs text-cyan-400 font-mono uppercase tracking-widest">Guided Project</span>
             <h1 className="font-bold text-sm">{project.title}</h1>
          </div>
          <div className="w-32" /> {/* Spacer */}
        </header>

        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT SIDEBAR - Stages & Instructions */}
          <div className="w-1/3 min-w-[320px] max-w-[400px] border-r border-gray-800 bg-gray-900/50 flex flex-col overflow-y-auto custom-scrollbar">
            
            {/* Stages Nav */}
            <div className="p-6 border-b border-gray-800 space-y-3">
              <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Project Stages</h2>
              <div className="flex justify-between items-center bg-gray-950 rounded-full p-1 relative border border-gray-800">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -z-10 -translate-y-1/2 mx-4" />
                {project.stages.map((stage) => {
                  const unlocked = isStageUnlocked(stage.number);
                  const passed = isStagePassed(stage.number);
                  const active = currentStageNum === stage.number;
                  return (
                    <button
                      key={stage.number}
                      disabled={!unlocked}
                      onClick={() => { setCurrentStageNum(stage.number); setFeedback(null); setHintsUsed(0); }}
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs transition-colors shrink-0
                        ${active ? 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-gray-950 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 
                          passed ? 'bg-green-500 text-black border border-green-500' :
                          unlocked ? 'bg-gray-800 text-white cursor-pointer hover:bg-gray-700' : 
                          'bg-gray-900 text-gray-600 cursor-not-allowed border border-gray-800'}
                      `}
                    >
                      {!unlocked ? <Lock size={12} /> : passed ? <CheckCircle2 size={14} /> : stage.number}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Stage Instructions */}
            <div className="p-6 flex-1 flex flex-col gap-6">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStageNum}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold mb-2">Stage {currentStage.number}: {currentStage.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{currentStage.description}</p>
                  </div>

                  {/* Checklist */}
                  <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                    <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Requirements</h4>
                    <ul className="space-y-2">
                      {currentStage.checklist.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-300">
                          {isStagePassed(currentStage.number) ? (
                            <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <Circle size={16} className="text-gray-600 shrink-0 mt-0.5" />
                          )}
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                    {/* Hints */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-mono text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Lightbulb size={14} /> Hints ({hintsUsed}/{currentStage.hints.length})
                        </h4>
                        {hintsUsed < currentStage.hints.length && (
                          <button 
                            onClick={() => setHintsUsed(h => h + 1)}
                            className="text-xs text-yellow-500 hover:underline"
                          >
                            Reveal Hint
                          </button>
                        )}
                      </div>
                      
                      {currentStage.hints.slice(0, hintsUsed).map((hint, i) => (
                        <div key={i} className="text-sm text-yellow-200/80 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg leading-relaxed">
                          {hint}
                        </div>
                      ))}

                      <button 
                        onClick={handleGetAIHelp}
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-bold hover:bg-violet-500/20 transition-all mt-2"
                      >
                        {submitting ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                        Ask AI for Guide
                      </button>
                    </div>

                </motion.div>
              </AnimatePresence>

              <div className="mt-auto pt-6">
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className="text-gray-500">Reward</span>
                  <span className="text-cyan-400 flex items-center gap-1"><Zap size={12}/>{currentStage.xpReward} XP</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT MAIN - Code Editor */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e2e]">
            
            {/* Feedback Banner */}
            {feedback && (
              <div className={`p-4 shrink-0 flex items-start gap-3 border-b ${feedback.passed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                {feedback.passed ? <CheckCircle2 className="text-green-400 mt-0.5 shrink-0" size={18} /> : <Circle className="text-red-400 mt-0.5 shrink-0" size={18} />}
                <div>
                  <p className={`text-sm font-bold ${feedback.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {feedback.passed ? 'Stage Completed!' : 'Feedback'}
                  </p>
                  <p className={`text-sm mt-1 ${feedback.passed ? 'text-green-200' : 'text-red-200'}`}>
                    {feedback.message}
                  </p>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col">
              <CodeEditor
                language={project.lang as any}
                initialCode={initialCode}
                onChange={setUserCode}
                onRun={handleSubmitCode}
                showPreview={project.lang !== 'python'}
                className="flex-1" // make it stretch
                minHeight="400px" // give it height
              />
            </div>
            
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
