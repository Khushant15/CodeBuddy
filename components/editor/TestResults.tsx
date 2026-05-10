'use client';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface TestResult {
  passed: boolean;
  description?: string;
  expected: string;
  hidden?: boolean;
}

export function TestResults({ results }: { results: TestResult[] }) {
  if (results.length === 0) return null;
  const passed = results.filter(r => r.passed).length;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Test Cases
        </span>
        <span
          className={`text-xs font-mono font-bold ${
            passed === results.length ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {passed}/{results.length} passed
        </span>
      </div>
      {results.map((r, i) => (
        <div
          key={i}
          className={`flex items-center justify-between px-3 py-2 rounded border text-xs font-mono ${
            r.passed
              ? 'bg-green-500/5 border-green-500/30 text-green-300'
              : 'bg-red-500/5 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {r.passed ? (
              <CheckCircle2 size={14} className="text-green-400" />
            ) : (
              <AlertCircle size={14} className="text-red-400" />
            )}
            <span>{r.description || `Test ${i + 1}`}</span>
          </div>
          {!r.passed && !r.hidden && (
            <span className="text-gray-500">
              Expected:{' '}
              <code className="text-cyan-400">{r.expected}</code>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
