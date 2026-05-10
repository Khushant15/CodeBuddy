'use client';

import { motion } from 'framer-motion';
import { ChallengeSolution } from '@/lib/challenges';
import { Lightbulb, Info, AlertTriangle, GitBranch, Video, X } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface Props {
  solution: ChallengeSolution;
  onClose: () => void;
}

export function SolutionWalkthrough({ solution, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
       <motion.div 
         initial={{ opacity: 0, scale: 0.95, y: 10 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         className="bg-gray-900 border border-gray-700 w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden"
       >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 shrink-0">
             <div className="flex items-center gap-2 text-cyan-400">
                <Lightbulb size={24} />
                <h3 className="font-bold text-lg">Solution Breakdown</h3>
             </div>
             <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors">
                <X size={20} />
             </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-8 flex-1">
             
             {/* Ideal Implementation */}
             <div>
                <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-500 mb-3"><CheckIcon /> Ideal Implementation</h4>
                <div className="h-[200px] rounded-xl overflow-hidden border border-gray-800">
                    <Editor
                      height="100%"
                      language="python"
                      theme="vs-dark"
                      value={solution.code}
                      options={{ readOnly: true, minimap: { enabled: false } }}
                    />
                </div>
             </div>

             {/* Step by Step Explanation */}
             <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-5">
                <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400 mb-3"><Info size={16}/> Approach</h4>
                <div className="text-gray-300 leading-relaxed space-y-2 whitespace-pre-wrap">
                   {solution.explanation.approach}
                </div>
             </div>

             {/* Pitfalls */}
             {solution.explanation.pitfalls.length > 0 && (
               <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
                  <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-red-400 mb-3"><AlertTriangle size={16}/> Common Pitfalls</h4>
                  <ul className="list-disc pl-5 text-gray-300 space-y-1">
                    {solution.explanation.pitfalls.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
               </div>
             )}

             {/* Alternatives */}
             {solution.explanation.alternatives && solution.explanation.alternatives.length > 0 && (
               <div>
                  <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-purple-400 mb-3"><GitBranch size={16} /> Alternative Approaches</h4>
                  <div className="space-y-4">
                     {solution.explanation.alternatives.map((alt, i) => (
                        <div key={i} className="border border-gray-800 rounded-xl p-4 bg-gray-900/50">
                           <div className="h-[100px] mb-4 rounded-lg overflow-hidden">
                             <Editor
                               height="100%"
                               language="python"
                               theme="vs-dark"
                               value={alt.code}
                               options={{ readOnly: true, minimap: { enabled: false } }}
                             />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-xs text-green-400 uppercase font-mono mb-1 block">Pros</span>
                                <p className="text-sm text-gray-400">{alt.pros}</p>
                              </div>
                              <div>
                                <span className="text-xs text-red-400 uppercase font-mono mb-1 block">Cons</span>
                                <p className="text-sm text-gray-400">{alt.cons}</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             )}

             {/* Video Walkthrough */}
             {solution.videoWalkthrough && (
               <div>
                  <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-yellow-400 mb-3"><Video size={16} /> Video Walkthrough</h4>
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-800 bg-gray-900 flex items-center justify-center relative">
                     <iframe 
                       src={solution.videoWalkthrough.url}
                       title="Solution Walkthrough"
                       className="w-full h-full"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowFullScreen
                     />
                  </div>
               </div>
             )}

          </div>
       </motion.div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
  );
}
