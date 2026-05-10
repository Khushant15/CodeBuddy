import { useState, useCallback } from 'react';

export interface UseEditorStateProps {
  initialCode: string;
  solution?: string;
  onSolutionRevealed?: () => void;
  solutionXpCost?: number;
}

export function useEditorState({ 
  initialCode, 
  solution, 
  onSolutionRevealed, 
  solutionXpCost = 5 
}: UseEditorStateProps) {
  const [code, setCode] = useState(initialCode);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [solutionRevealed, setSolutionRevealed] = useState(false);

  const handleReset = useCallback(() => {
    if (confirm('Reset code to starter template?')) {
      setCode(initialCode);
      return true;
    }
    return false;
  }, [initialCode]);

  const handleShowSolution = useCallback(() => {
    if (!solution) return;
    if (!solutionRevealed) {
      if (!confirm(`Revealing the solution costs ${solutionXpCost} XP. Continue?`)) {
        return;
      }
      setSolutionRevealed(true);
      onSolutionRevealed?.();
    }
    setSolutionVisible(v => !v);
  }, [solution, solutionRevealed, solutionXpCost, onSolutionRevealed]);

  return {
    code,
    setCode,
    solutionVisible,
    solutionRevealed,
    handleReset,
    handleShowSolution,
  };
}
