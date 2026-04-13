// components/ExerciseComponents.tsx
// Different exercise type components with interactive functionality

'use client';

import React, { useState, useEffect } from 'react';
import type { Exercise, TestCase } from '@/lib/curriculum/types';
import { CheckCircle, XCircle, HelpCircle, Play, Terminal, RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import { usePyodide } from '@/hooks/usePyodide';
import { WebPreview } from '@/components/WebPreview';

// Base Exercise Wrapper
interface ExerciseWrapperProps {
  exercise: any;  // Covers all curriculum exercise shapes (typed union is too narrow for runtime data)
  onComplete: (correct: boolean) => void;
}

export function ExerciseRenderer({ exercise, onComplete }: ExerciseWrapperProps) {
  switch (exercise.type as any) {
    case 'multiple-choice':
      return <MultipleChoiceExercise exercise={exercise} onComplete={onComplete} />;
    case 'fill-blank':
      return <FillBlankExercise exercise={exercise} onComplete={onComplete} />;
    case 'code-output':
      return <CodeOutputExercise exercise={exercise} onComplete={onComplete} />;
    case 'code-write':
    case 'code':
    case 'practice': 
      return <CodeWriteExercise exercise={exercise} onComplete={onComplete} />;
    case 'code-fix':
      return <CodeFixExercise exercise={exercise} onComplete={onComplete} />;
    case 'arrange-code':
      return <ArrangeCodeExercise exercise={exercise} onComplete={onComplete} />;
    case 'trace-execution':
      return <TraceExecutionExercise exercise={exercise} onComplete={onComplete} />;
    default:
      return <div>Exercise type not implemented: {exercise.type}</div>;
  }
}

// Multiple Choice Exercise
function MultipleChoiceExercise({ exercise, onComplete }: ExerciseWrapperProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  
  const ex = exercise as any;
  const hints = ex.hints || [];
  const options = ex.options || [];
  
  const handleSubmit = () => {
    if (!selected) return;
    
    setSubmitted(true);
    const isCorrect = selected === exercise.correctAnswer;
    
    setTimeout(() => {
      onComplete(isCorrect);
    }, 2000);
  };
  
  const isCorrect = submitted && selected === exercise.correctAnswer;
  const isWrong = submitted && selected !== exercise.correctAnswer;
  
  return (
    <div className="exercise-container card p-6 space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-neon-green">
          Question
        </h3>
        {hints.length > 0 && (
          <button
            onClick={() => {
              setShowHint(true);
              if (hintIndex < hints.length - 1) {
                setHintIndex(prev => prev + 1);
              }
            }}
            className="text-neon-cyan text-sm flex items-center gap-1 hover:underline"
          >
            <HelpCircle size={16} />
            Hint ({hintIndex + 1}/{hints.length})
          </button>
        )}
      </div>
      
      <p className="text-gray-200">{exercise.question}</p>
      
      {showHint && hints[hintIndex] && (
        <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded p-3">
          <p className="text-sm text-neon-cyan">
            💡 {hints[hintIndex]}
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        {options.map((option: string, index: number) => {
          const isThisCorrect = option === exercise.correctAnswer;
          const isSelected = option === selected;
          
          let className = 'option-button p-4 border-2 rounded-lg cursor-pointer transition-all';
          
          if (!submitted) {
            className += isSelected 
              ? ' border-neon-green bg-neon-green/10' 
              : ' border-gray-700 hover:border-neon-green/50';
          } else {
            if (isThisCorrect) {
              className += ' border-neon-green bg-neon-green/20';
            } else if (isSelected && !isThisCorrect) {
              className += ' border-neon-pink bg-neon-pink/20';
            } else {
              className += ' border-gray-700 opacity-50';
            }
          }
          
          return (
            <div
              key={index}
              className={className}
              onClick={() => !submitted && setSelected(option)}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-200">{option}</span>
                {submitted && isThisCorrect && (
                  <CheckCircle className="text-neon-green" size={20} />
                )}
                {submitted && isSelected && !isThisCorrect && (
                  <XCircle className="text-neon-pink" size={20} />
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="btn-neon-solid w-full"
        >
          Submit Answer
        </button>
      ) : (
        <div className={`p-4 rounded-lg ${isCorrect ? 'bg-neon-green/10 border border-neon-green' : 'bg-neon-pink/10 border border-neon-pink'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <CheckCircle className="text-neon-green" size={24} />
            ) : (
              <XCircle className="text-neon-pink" size={24} />
            )}
            <span className={`font-semibold ${isCorrect ? 'text-neon-green' : 'text-neon-pink'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </span>
          </div>
          <p className="text-gray-300 text-sm">
            {exercise.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

// Fill in the Blank Exercise
function FillBlankExercise({ exercise, onComplete }: ExerciseWrapperProps) {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  
  const ex = exercise as any;
  const blanks = ex.blanks || [];
  
  const handleSubmit = () => {
    setSubmitted(true);
    
    // Check if all answers are correct
    const blanks = exercise.blanks || [];
    const allCorrect = blanks.every((blank: string, index: number) => {
      const userAnswer = answers[blank]?.trim().toLowerCase();
      const correctAnswer = exercise.correctAnswer?.[index]?.toLowerCase();
      return userAnswer === correctAnswer;
    });
    
    setTimeout(() => {
      onComplete(allCorrect);
    }, 2000);
  };
  
  // Render question with input fields for blanks
  const renderQuestion = () => {
    let questionText = exercise.question || "";
    const blanks = exercise.blanks || [];
    
    if (blanks.length === 0) return <p>{questionText}</p>;

    return blanks.map((blank: string, index: number) => {
      const parts = questionText.split(blank);
      questionText = parts.slice(1).join(blank);
      
      return (
        <span key={index}>
          {parts[0]}
          <input
            type="text"
            value={answers[blank] || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnswers({ ...answers, [blank]: e.target.value })}
            disabled={submitted}
            className="input-neon inline-block w-32 mx-1"
            placeholder="..."
          />
        </span>
      );
    });
  };
  
  const allFilled = exercise.blanks.every((blank: string) => answers[blank]?.trim());
  
  return (
    <div className="exercise-container card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-neon-green">
        Fill in the Blanks
      </h3>
      
      <div className="text-gray-200 text-lg font-mono">
        {renderQuestion()}
      </div>
      
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allFilled}
          className="btn-neon-solid w-full"
        >
          Check Answer
        </button>
      ) : (
        <div className="bg-neon-green/10 border border-neon-green rounded p-4">
          <p className="text-gray-300 text-sm">
            {exercise.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

// Code Output Prediction
function CodeOutputExercise({ exercise, onComplete }: ExerciseWrapperProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const ex = exercise as any;
  const handleSubmit = () => {
    setSubmitted(true);
    const isCorrect = userAnswer.trim() === (ex.correctAnswer || "").trim();
    
    setTimeout(() => {
      onComplete(isCorrect);
    }, 2000);
  };
  
  const isCorrect = submitted && userAnswer.trim() === (ex.correctAnswer || "").trim();
  
  return (
    <div className="exercise-container card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-neon-green">
        Predict the Output
      </h3>
      
      <p className="text-gray-200">{exercise.question}</p>
      
      <div className="terminal p-4">
        <pre className="text-neon-green font-mono text-sm">
          {exercise.code}
        </pre>
      </div>
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Your answer:
        </label>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={submitted}
          className="input-neon w-full"
          placeholder="Enter the output..."
        />
      </div>
      
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!userAnswer.trim()}
          className="btn-neon-solid w-full"
        >
          Submit
        </button>
      ) : (
        <div className={`p-4 rounded-lg ${isCorrect ? 'bg-neon-green/10 border border-neon-green' : 'bg-neon-pink/10 border border-neon-pink'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <CheckCircle className="text-neon-green" size={24} />
            ) : (
              <XCircle className="text-neon-pink" size={24} />
            )}
            <span className={`font-semibold ${isCorrect ? 'text-neon-green' : 'text-neon-pink'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </span>
          </div>
          {!isCorrect && (
            <p className="text-gray-300 text-sm mb-2">
              Correct answer: <code className="text-neon-green">{exercise.correctAnswer}</code>
            </p>
          )}
          <p className="text-gray-300 text-sm">
            {exercise.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

// Code Write Exercise (with Real Code Execution)
function CodeWriteExercise({ exercise, onComplete }: ExerciseWrapperProps) {
  const ex = exercise as any;
  const [code, setCode] = useState(ex.starterCode || '');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  
  const { isLoading, runPython } = usePyodide();

  const handleReview = async () => {
    setIsReviewing(true);
    setAiReview(null);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          language: ex.language || 'python',
          context: ex.question
        }),
      });
      const data = await res.json();
      if (data.review) setAiReview(data.review);
      else setAiReview("Sorry, I couldn't generate a review right now.");
    } catch (err) {
      setAiReview("Connection error. AI Review failed.");
    } finally {
      setIsReviewing(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    setError('');
    
    try {
      if (ex.language === 'python' || !ex.language) {
        const result = await runPython(code);
        if (result.error) {
          setError(result.error);
        } else {
          setOutput(result.output);
          
          // Check test cases
          const results = checkTestCases(result.output, ex.testCases);
          setTestResults(results);
          
          const allPassed = results.every(r => r.passed);
          if (allPassed && results.length > 0) {
            setSubmitted(true);
            setTimeout(() => onComplete(true), 1500);
          }
        }
      } else {
        // Web execution (HTML/CSS/JS)
        // For web, we evaluate the code itself against test cases
        const results = checkTestCases(code, ex.testCases);
        setTestResults(results);
        
        const allPassed = results.every(r => r.passed);
        if (allPassed && results.length > 0) {
          setSubmitted(true);
          setTimeout(() => onComplete(true), 1500);
        }
        
        if (results.length === 0) {
          setOutput('Preview updated!');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    if (confirm('Are you sure you want to reset your code to the starter template?')) {
      setCode(ex.starterCode || '');
    }
  };

  return (
    <div className="exercise-container card p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-neon-green">Solve the Challenge</h3>
        <button 
          onClick={resetCode}
          className="text-gray-500 hover:text-white transition-colors"
          title="Reset to starter code"
        >
          <RotateCcw size={18} />
        </button>
      </div>
      
      <p className="text-gray-200">{exercise.question}</p>
      
      <div className={`grid ${ex.language !== 'python' && ex.language ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
        <div className="code-editor border border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 flex justify-between">
            <span>{ex.language || 'python'}</span>
            {isLoading && ex.language === 'python' && <span className="text-neon-cyan animate-pulse">Loading Runtime...</span>}
          </div>
          <textarea
            value={code}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCode(e.target.value)}
            className="input-neon w-full h-64 font-mono text-sm border-none focus:ring-0 p-4"
            spellCheck={false}
            placeholder="# Write your code here..."
          />
        </div>

        {ex.language !== 'python' && ex.language && (
          <div className="preview-pane flex flex-col gap-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Play size={12} /> Live Preview
            </h4>
            <WebPreview 
              html={ex.language === 'html' ? code : ''} 
              css={ex.language === 'css' ? code : ''}
              js={ex.language === 'javascript' ? code : ''}
              className="min-h-[256px]"
            />
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleRun}
          disabled={isRunning || isLoading}
          className={`btn-neon-solid flex-1 flex items-center justify-center gap-2 ${isRunning ? 'opacity-50' : ''}`}
        >
          <Play size={18} fill="currentColor" />
          {isRunning ? 'Executing...' : 'Run & Test'}
        </button>
        
        <button
          onClick={handleReview}
          disabled={isReviewing}
          className="btn-neon px-4 flex items-center gap-2 border-neon-violet text-neon-violet hover:bg-neon-violet/10"
          title="Get AI Code Review"
        >
          {isReviewing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          AI Review
        </button>
      </div>

      {/* AI Review Results */}
      {aiReview && (
        <div className="bg-neon-violet/5 border border-neon-violet/30 p-5 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-neon-violet">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">AI Mentor Review</span>
          </div>
          <div className="text-sm text-gray-300 prose prose-invert max-w-none prose-sm">
            {aiReview.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('#') ? 'text-white font-bold mt-4' : 'mb-2'}>
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Results Section */}
      {(output || error || testResults.length > 0) && (
        <div className="space-y-4">
          {error && (
            <div className="bg-neon-pink/10 border border-neon-pink p-4 rounded-lg">
              <h4 className="text-neon-pink text-xs font-bold uppercase mb-2">Error</h4>
              <pre className="text-neon-pink font-mono text-xs whitespace-pre-wrap">{error}</pre>
            </div>
          )}
          
          {output && (
            <div className="terminal p-4">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <Terminal size={14} />
                <span className="text-xs uppercase font-bold tracking-widest">Output</span>
              </div>
              <pre className="text-neon-green font-mono text-sm whitespace-pre-wrap">{output}</pre>
            </div>
          )}

          {testResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Test Cases</h4>
              {testResults.map((test: any, i: number) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded border ${test.passed ? 'bg-neon-green/5 border-neon-green/30' : 'bg-neon-pink/5 border-neon-pink/30'}`}>
                  <div className="flex items-center gap-3">
                    {test.passed ? <CheckCircle className="text-neon-green" size={16} /> : <XCircle className="text-neon-pink" size={16} />}
                    <span className="text-sm text-gray-300">
                      {test.description || `Test Case ${i + 1}`}
                    </span>
                  </div>
                  {!test.passed && !test.hidden && (
                    <span className="text-xs text-gray-500">
                      Expected: <code className="text-neon-cyan">{test.expected}</code>
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Code Fix Exercise
function CodeFixExercise({ exercise, onComplete }: ExerciseWrapperProps) {
  const ex = exercise as any;
  const [code, setCode] = useState(ex.brokenCode || '');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleReview = async () => {
    setIsReviewing(true);
    setAiReview(null);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          language: ex.language || 'python',
          context: ex.question
        }),
      });
      const data = await res.json();
      if (data.review) setAiReview(data.review);
      else setAiReview("Sorry, I couldn't generate a review right now.");
    } catch (err) {
      setAiReview("Connection error. AI Review failed.");
    } finally {
      setIsReviewing(false);
    }
  };
  
  const handleSubmit = () => {
    setSubmitted(true);
    // Basic solution check (could be improved with code execution/normalization)
    const normalizedSelected = code.replace(/\s+/g, ' ').trim();
    const normalizedSolution = (ex.solution || "").replace(/\s+/g, ' ').trim();
    
    const correct = normalizedSelected === normalizedSolution;
    setIsCorrect(correct);
    
    setTimeout(() => {
      onComplete(correct);
    }, 2000);
  };
  
  return (
    <div className="exercise-container card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-neon-green">Fix the Code</h3>
      <p className="text-gray-200">{ex.question}</p>
      
      <div className="code-editor">
        <textarea
          value={code}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCode(e.target.value)}
          disabled={submitted}
          className="input-neon w-full h-48 font-mono text-sm border-neon-pink/30 hover:border-neon-pink/50"
          spellCheck={false}
        />
      </div>
      
      <div className="flex gap-2">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="btn-neon-solid flex-1"
          >
            Check Fix
          </button>
        ) : (
          <div className={`p-4 rounded-lg flex-1 ${isCorrect ? 'bg-neon-green/10 border border-neon-green' : 'bg-neon-pink/10 border border-neon-pink'}`}>
            <p className="text-gray-300 text-sm">{ex.explanation}</p>
          </div>
        )}
        
        <button
          onClick={handleReview}
          disabled={isReviewing}
          className="btn-neon px-4 flex items-center gap-2 border-neon-violet text-neon-violet hover:bg-neon-violet/10"
          title="Get AI Code Review"
        >
          {isReviewing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          AI Review
        </button>
      </div>

      {/* AI Review Results */}
      {aiReview && (
        <div className="bg-neon-violet/5 border border-neon-violet/30 p-5 rounded-xl space-y-3 mt-4">
          <div className="flex items-center gap-2 text-neon-violet">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">AI Mentor Review</span>
          </div>
          <div className="text-sm text-gray-300 prose prose-invert max-w-none prose-sm">
            {aiReview.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('#') ? 'text-white font-bold mt-4' : 'mb-2'}>
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Arrange Code Blocks Exercise
function ArrangeCodeExercise({ exercise, onComplete }: ExerciseWrapperProps) {
  const ex = exercise as any;
  const [blocks, setBlocks] = useState<{id: number, content: string}[]>(
    (ex.blocks || []).map((b: string, i: number) => ({ id: i, content: b }))
  );
  const [submitted, setSubmitted] = useState(false);
  
  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (submitted) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, moved);
    setBlocks(newBlocks);
  };
  
  const handleSubmit = () => {
    setSubmitted(true);
    const currentOrder = blocks.map(b => b.id);
    const correct = currentOrder.every((id, idx) => id === ex.correctOrder[idx]);
    
    setTimeout(() => {
      onComplete(correct);
    }, 2000);
  };
  
  return (
    <div className="exercise-container card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-neon-green">Arrange Blocks</h3>
      <p className="text-gray-200">{exercise.question}</p>
      
      <div className="space-y-2">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="p-3 bg-gray-800 border border-gray-700 rounded cursor-move flex items-center justify-between"
          >
            <code className="text-sm text-neon-cyan">{block.content}</code>
            {!submitted && (
              <div className="flex gap-2">
                <button onClick={() => index > 0 && moveBlock(index, index - 1)} className="text-gray-500 hover:text-white">↑</button>
                <button onClick={() => index < blocks.length - 1 && moveBlock(index, index + 1)} className="text-gray-500 hover:text-white">↓</button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!submitted && (
        <button onClick={handleSubmit} className="btn-neon-solid w-full">Verify Order</button>
      )}
    </div>
  );
}

// Trace Execution Exercise
function TraceExecutionExercise({ exercise, onComplete }: ExerciseWrapperProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = () => {
    setSubmitted(true);
    const correct = answer.trim() === exercise.correctAnswer.trim();
    setTimeout(() => onComplete(correct), 2000);
  };
  
  return (
    <div className="exercise-container card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-neon-green">Trace Execution</h3>
      <p className="text-gray-200">{exercise.question}</p>
      
      <div className="terminal p-4">
        <pre className="text-neon-green font-mono text-sm">{exercise.code}</pre>
      </div>
      
      <input
        type="text"
        value={answer}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnswer(e.target.value)}
        disabled={submitted}
        className="input-neon w-full"
        placeholder="What is the final value?"
      />
      
      {!submitted && (
        <button onClick={handleSubmit} className="btn-neon-solid w-full">Submit</button>
      )}
    </div>
  );
}

// Placeholder functions (implement with actual code execution)
async function executeCode(code: string, language: string) {
  // Implement with Pyodide or Judge0
  return { output: 'Code execution not implemented yet' };
}

function checkTestCases(output: string, testCases: TestCase[]) {
  if (!testCases || testCases.length === 0) return [];
  
  return testCases.map(test => {
    // Normalize outputs for comparison
    const normalizedOutput = output.trim().replace(/\r\n/g, '\n');
    const normalizedExpected = test.expectedOutput.trim().replace(/\r\n/g, '\n');
    
    // In a real environment, you might support regex or partial matches
    const passed = normalizedOutput === normalizedExpected;
    
    return {
      passed,
      description: test.description,
      hidden: test.hidden,
      expected: test.expectedOutput,
      received: output
    };
  });
}
