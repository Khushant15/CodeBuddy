import { useState, useCallback } from 'react';
import { usePyodide } from './usePyodide';

export type EditorLanguage = 'python' | 'html' | 'css' | 'javascript';

export interface TestCase {
  description?: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface ExecutionTrace {
  line: number;
  output: string;
  type: 'stdout' | 'stderr' | 'info';
}

export interface UseCodeExecutionProps {
  language: EditorLanguage;
  testCases?: TestCase[];
  onRun?: (code: string, output: string, passed: boolean, error?: string) => void;
}

export function useCodeExecution({ language, testCases = [], onRun }: UseCodeExecutionProps) {
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; description?: string; expected: string; hidden?: boolean }[]>([]);
  const [traces, setTraces] = useState<ExecutionTrace[]>([]);
  const [runCount, setRunCount] = useState(0);

  const { runPython } = usePyodide();

  const checkTests = useCallback(
    (actualOutput: string) =>
      testCases.map(tc => ({
        passed:
          actualOutput.trim().replace(/\r\n/g, '\n') ===
          tc.expectedOutput.trim().replace(/\r\n/g, '\n'),
        description: tc.description,
        expected: tc.expectedOutput,
        hidden: tc.hidden,
      })),
    [testCases]
  );

  const buildTrace = useCallback(
    (rawOutput: string, sourceCode: string): ExecutionTrace[] => {
      const lines = sourceCode.split('\n');
      const outputLines = rawOutput.split('\n').filter(Boolean);
      const printLines = lines
        .map((l, idx) => ({ idx: idx + 1, hasPrint: /^\s*(print)\s*\(/.test(l) }))
        .filter(l => l.hasPrint);

      return outputLines.map((out, i) => ({
        line: printLines[i]?.idx ?? i + 1,
        output: out,
        type: 'stdout' as const,
      }));
    },
    []
  );

  const runCode = useCallback(async (code: string) => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput('');
    setError('');
    setTestResults([]);
    setTraces([]);

    try {
      if (language === 'python') {
        const result = await runPython(code);
        if (result.error) {
          setError(result.error);
          setTraces([{ line: 0, output: result.error, type: 'stderr' }]);
          onRun?.(code, '', false, result.error);
        } else {
          const out = result.output;
          setOutput(out);
          setTraces(buildTrace(out, code));
          const results = checkTests(out);
          setTestResults(results);
          const allPassed = results.length === 0 || results.every(r => r.passed);
          onRun?.(code, out, allPassed, undefined);
        }
      } else {
        // Web languages
        const results = checkTests(code);
        setTestResults(results);
        const allPassed = results.length === 0 || results.every(r => r.passed);
        setOutput('Preview updated.');
        onRun?.(code, code, allPassed, undefined);
      }
    } catch (err: any) {
      setError(err.message ?? 'Unknown error');
    } finally {
      setIsRunning(false);
      setRunCount(c => c + 1);
    }
  }, [isRunning, language, runPython, buildTrace, checkTests, onRun]);

  return {
    runCode,
    output,
    error,
    isRunning,
    testResults,
    traces,
    runCount,
  };
}
