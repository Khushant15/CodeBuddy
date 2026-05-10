import { useState, useCallback } from 'react';

export interface UseExerciseProps {
  onComplete: (correct: boolean, xpOverride?: number, xpLabel?: string) => void;
  correctAnswer?: string | string[];
}

export function useExercise({ onComplete, correctAnswer }: UseExerciseProps) {
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  const submit = useCallback((isCorrect: boolean, delay = 2000) => {
    setSubmitted(true);
    setTimeout(() => {
      onComplete(isCorrect);
    }, delay);
  }, [onComplete]);

  const toggleHint = useCallback((totalHints: number) => {
    setShowHint(true);
    if (hintIndex < totalHints - 1) {
      setHintIndex(prev => prev + 1);
    }
  }, [hintIndex]);

  return {
    submitted,
    setSubmitted,
    showHint,
    setShowHint,
    hintIndex,
    setHintIndex,
    submit,
    toggleHint,
  };
}
