'use client';
import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle } from 'lucide-react';
import { useExercise } from '@/hooks/useExercise';

export function MultipleChoiceExercise({ exercise, onComplete }: any) {
  const [selected, setSelected] = useState<string | null>(null);
  const { submitted, showHint, hintIndex, submit, toggleHint } = useExercise({ onComplete });
  
  const hints = exercise.hints || [];
  const options = exercise.options || [];
  
  const isCorrect = submitted && selected === exercise.correctAnswer;
  
  return (
    <div className="exercise-container card p-6 space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-[var(--neon-green)]">Question</h3>
        {hints.length > 0 && (
          <button
            onClick={() => toggleHint(hints.length)}
            className="text-[var(--neon-cyan)] text-sm flex items-center gap-1 hover:underline"
          >
            <HelpCircle size={16} />
            Hint ({hintIndex + 1}/{hints.length})
          </button>
        )}
      </div>
      
      <p className="text-gray-200">{exercise.question}</p>
      
      {showHint && hints[hintIndex] && (
        <div className="bg-[rgba(0,229,255,0.1)] border border-[rgba(0,229,255,0.3)] rounded p-3">
          <p className="text-sm text-[var(--neon-cyan)]">💡 {hints[hintIndex]}</p>
        </div>
      )}
      
      <div className="space-y-2">
        {options.map((option: string, index: number) => {
          const isThisCorrect = option === exercise.correctAnswer;
          const isSelected = option === selected;
          
          let className = 'option-button p-4 border-2 rounded-lg cursor-pointer transition-all';
          if (!submitted) {
            className += isSelected 
              ? ' border-[var(--neon-green)] bg-[rgba(0,255,135,0.1)]' 
              : ' border-gray-700 hover:border-[var(--neon-green)]/50';
          } else {
            if (isThisCorrect) className += ' border-[var(--neon-green)] bg-[rgba(0,255,135,0.2)]';
            else if (isSelected) className += ' border-red-500 bg-red-500/20';
            else className += ' border-gray-700 opacity-50';
          }
          
          return (
            <div key={index} className={className} onClick={() => !submitted && setSelected(option)}>
              <div className="flex items-center justify-between">
                <span className="text-gray-200">{option}</span>
                {submitted && isThisCorrect && <CheckCircle className="text-[var(--neon-green)]" size={20} />}
                {submitted && isSelected && !isThisCorrect && <XCircle className="text-red-500" size={20} />}
              </div>
            </div>
          );
        })}
      </div>
      
      {!submitted ? (
        <button onClick={() => selected && submit(selected === exercise.correctAnswer)} disabled={!selected} className="btn-neon btn-neon-solid w-full">
          Submit Answer
        </button>
      ) : (
        <div className={`p-4 rounded-lg ${isCorrect ? 'bg-[rgba(0,255,135,0.1)] border border-[var(--neon-green)]' : 'bg-red-500/10 border border-red-500'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? <CheckCircle className="text-[var(--neon-green)]" size={24} /> : <XCircle className="text-red-500" size={24} />}
            <span className={`font-semibold ${isCorrect ? 'text-[var(--neon-green)]' : 'text-red-500'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </span>
          </div>
          <p className="text-gray-300 text-sm">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}
