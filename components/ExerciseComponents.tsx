// components/ExerciseComponents.tsx
// Different exercise type components with interactive functionality

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Exercise, TestCase } from '@/lib/curriculum/types';
import { CheckCircle, XCircle, HelpCircle, Play, Terminal, RotateCcw, Sparkles, Loader2, Zap } from 'lucide-react';
import { usePyodide } from '@/hooks/usePyodide';
import { WebPreview } from '@/components/WebPreview';
import { CodeEditor } from '@/components/CodeEditor';
import { calculateExerciseXp } from '@/lib/userService';

import { MultipleChoiceExercise } from './exercises/MultipleChoice';
import { CodeWriteExercise } from './exercises/CodeWrite';

// Base Exercise Wrapper
interface ExerciseWrapperProps {
  exercise: any;  // Covers all curriculum exercise shapes
  onComplete: (correct: boolean, xpOverride?: number, xpLabel?: string) => void;
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


// Code Fix Exercise (now uses rich CodeEditor)
function CodeFixExercise({ exercise, onComplete }: ExerciseWrapperProps) {
  const ex = exercise as any;
  const language = ex.language || 'python';

  const startedAtRef        = useRef<number | null>(null);
  const runAttemptsRef      = useRef(0);
  const solutionRevealedRef = useRef(false);
  const [submitted, setSubmitted] = useState(false);
  const [xpResult, setXpResult]   = useState<{ xp: number; label: string } | null>(null);

  const [aiReview, setAiReview]     = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleReview = async () => {
    setIsReviewing(true);
    setAiReview(null);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: ex.brokenCode || '', language, context: ex.question }),
      });
      const data = await res.json();
      setAiReview(data.review ?? "Sorry, I couldn't generate a review right now.");
    } catch {
      setAiReview('Connection error. AI Review failed.');
    } finally {
      setIsReviewing(false);
    }
  };

  const handleRun = useCallback((code: string, output: string, passed: boolean, error?: string) => {
    if (startedAtRef.current === null) startedAtRef.current = Date.now();
    runAttemptsRef.current += 1;

    // For fix exercises, match against solution string when no testCases
    const hasTests = (ex.testCases || []).length > 0;
    let isCorrect = passed;

    if (!hasTests && ex.solution) {
      const n1 = code.replace(/\s+/g, ' ').trim();
      const n2 = (ex.solution as string).replace(/\s+/g, ' ').trim();
      isCorrect = n1 === n2;
    }

    if (isCorrect && !submitted) {
      setSubmitted(true);
      const elapsed = startedAtRef.current
        ? Math.floor((Date.now() - startedAtRef.current) / 1000)
        : 0;

      const result = calculateExerciseXp({
        baseXp:           ex.xpReward ?? 50,
        runAttempts:      runAttemptsRef.current,
        solutionRevealed: solutionRevealedRef.current,
        timeSpentSeconds: elapsed,
      });
      setXpResult(result);
      setTimeout(() => onComplete(true, result.xp, result.label), 1500);
    }
  }, [submitted, ex, onComplete]);

  const handleSolutionRevealed = useCallback(() => {
    solutionRevealedRef.current = true;
  }, []);

  return (
    <div className="exercise-container card p-6 space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-neon-green">Fix the Code</h3>
        <p className="text-gray-300 mt-1 text-sm">{ex.question}</p>
      </div>

      <CodeEditor
        language={language}
        initialCode={ex.brokenCode || ''}
        solution={ex.solution}
        testCases={ex.testCases || []}
        onRun={handleRun}
        onSolutionRevealed={handleSolutionRevealed}
        solutionXpCost={5}
        showPreview={language !== 'python'}
        minHeight="200px"
      />

      {xpResult && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 animate-in fade-in">
          <Zap size={20} className="text-yellow-400" />
          <div>
            <p className="text-yellow-300 font-bold text-sm">+{xpResult.xp} XP earned!</p>
            <p className="text-gray-400 text-xs mt-0.5">{xpResult.label}</p>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleReview}
          disabled={isReviewing}
          className="btn-neon px-4 py-2 flex items-center gap-2 border-neon-violet text-neon-violet hover:bg-neon-violet/10 text-sm"
        >
          {isReviewing ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          AI Review
        </button>
      </div>

      {aiReview && (
        <div className="bg-neon-violet/5 border border-neon-violet/30 p-5 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-neon-violet">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">AI Mentor Review</span>
          </div>
          <div className="text-sm text-gray-300 space-y-1">
            {aiReview.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('#') ? 'text-white font-bold mt-3' : ''}>{line}</p>
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
