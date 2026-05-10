'use client';

import React, { useRef, useEffect } from 'react';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';
import {
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  Terminal,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Zap,
} from 'lucide-react';

import { usePyodide } from '@/hooks/usePyodide';
import { useCodeExecution, EditorLanguage, TestCase } from '@/hooks/useCodeExecution';
import { useEditorState } from '@/hooks/useEditorState';
import { WebSandbox } from './editor/WebSandbox';
import { TraceDisplay } from './editor/TraceDisplay';
import { TestResults } from './editor/TestResults';

export interface CodeEditorProps {
  language?: EditorLanguage;
  initialCode: string;
  solution?: string;
  testCases?: TestCase[];
  onRun?: (code: string, output: string, passed: boolean, error?: string) => void;
  onSolutionRevealed?: () => void;
  solutionXpCost?: number;
  readOnly?: boolean;
  minHeight?: string;
  showPreview?: boolean;
  runTrigger?: number;
  onChange?: (code: string) => void;
  className?: string;
}

const PYTHON_BUILTINS = [
  'print','input','len','range','type','int','float','str','bool','list',
  'dict','set','tuple','enumerate','zip','map','filter','sorted','reversed',
  'any','all','sum','min','max','abs','round','open','isinstance','issubclass',
  'hasattr','getattr','setattr','delattr','dir','vars','repr','format',
  'iter','next','id','hash','hex','bin','oct','chr','ord','format',
  'staticmethod','classmethod','property','super','object',
].map(label => ({ label, type: 'function' }));

const pythonBuiltinCompletion = autocompletion({
  override: [
    context => {
      const word = context.matchBefore(/\w*/);
      if (!word || (word.from === word.to && !context.explicit)) return null;
      return {
        from: word.from,
        options: PYTHON_BUILTINS,
      };
    },
  ],
});

function getExtensions(language: EditorLanguage) {
  const base = [EditorView.lineWrapping, autocompletion()];
  switch (language) {
    case 'python': return [...base, python(), pythonBuiltinCompletion];
    case 'html': return [...base, html()];
    case 'css': return [...base, css()];
    case 'javascript': return [...base, javascript()];
    default: return base;
  }
}

export function CodeEditor({
  language = 'python',
  initialCode,
  solution,
  testCases = [],
  onRun,
  onSolutionRevealed,
  solutionXpCost = 5,
  readOnly = false,
  minHeight = '240px',
  showPreview = true,
  runTrigger,
  className = '',
}: CodeEditorProps) {
  const { isLoading: pyLoading } = usePyodide();
  
  const {
    code,
    setCode,
    solutionVisible,
    solutionRevealed,
    handleReset,
    handleShowSolution,
  } = useEditorState({ initialCode, solution, onSolutionRevealed, solutionXpCost });

  const {
    runCode,
    output,
    error,
    isRunning,
    testResults,
    traces,
    runCount,
  } = useCodeExecution({ language, testCases, onRun });

  useEffect(() => {
    if (onChange) onChange(code);
  }, [code, onChange]);

  // External run trigger
  const prevTriggerRef = useRef(runTrigger);
  useEffect(() => {
    if (runTrigger !== undefined && runTrigger !== prevTriggerRef.current) {
      prevTriggerRef.current = runTrigger;
      runCode(code);
    }
  }, [runTrigger, code, runCode]);

  const withPreview = showPreview && (language === 'html' || language === 'css' || language === 'javascript');
  const isWebLang = language !== 'python';
  const isPyLoading = language === 'python' && pyLoading;
  const allPassed = testResults.length > 0 && testResults.every(r => r.passed);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className={`grid ${withPreview ? 'md:grid-cols-2' : 'grid-cols-1'} gap-3`}>
        <div className="flex flex-col rounded-xl overflow-hidden border border-gray-700 bg-[#1e1e2e] shadow-xl">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <code className="ml-2 text-xs text-gray-400 font-mono">
                main.{language === 'javascript' ? 'js' : language}
              </code>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {isPyLoading && (
                <span className="flex items-center gap-1 text-cyan-400 animate-pulse">
                  <Loader2 size={12} className="animate-spin" /> Loading Python runtime…
                </span>
              )}
              {language === 'python' && !pyLoading && (
                <span className="text-green-400">● Runtime ready</span>
              )}
            </div>
          </div>

          <CodeMirror
            value={solutionVisible && solution ? solution : code}
            theme={okaidia}
            extensions={getExtensions(language)}
            onChange={solutionVisible ? undefined : setCode}
            readOnly={readOnly || solutionVisible}
            minHeight={minHeight}
            style={{ fontSize: '0.875rem' }}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: !readOnly,
              foldGutter: true,
              autocompletion: true,
              bracketMatching: true,
              closeBrackets: true,
              indentOnInput: true,
              tabSize: language === 'python' ? 4 : 2,
            }}
          />
        </div>

        {withPreview && (
          <div className="rounded-xl overflow-hidden border border-gray-700 shadow-xl min-h-[220px]">
            <WebSandbox code={solutionVisible && solution ? solution : code} language={language} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => runCode(code)}
          disabled={isRunning || isPyLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 active:scale-95"
        >
          {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
          {isRunning ? 'Running…' : isWebLang ? 'Run & Preview' : 'Run & Test'}
        </button>

        <button
          onClick={() => { if (handleReset()) { /* output cleared by hook */ } }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white text-sm transition-all active:scale-95"
        >
          <RotateCcw size={15} />
          Reset
        </button>

        {solution && (
          <button
            onClick={handleShowSolution}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-all active:scale-95 ml-auto ${
              solutionVisible
                ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20'
                : 'border-gray-600 text-gray-400 hover:border-yellow-500/60 hover:text-yellow-400'
            }`}
          >
            {solutionVisible ? <EyeOff size={15} /> : <Eye size={15} />}
            {solutionVisible ? 'Hide Solution' : `Show Solution`}
            {!solutionRevealed && (
              <span className="flex items-center gap-0.5 text-xs text-yellow-500 font-mono">
                <Zap size={11} /> {solutionXpCost} XP
              </span>
            )}
          </button>
        )}
      </div>

      {(output || error || traces.length > 0 || testResults.length > 0) && (
        <div className="rounded-xl border border-gray-700 bg-gray-950 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-700 text-xs font-mono text-gray-400 uppercase tracking-widest">
            <Terminal size={13} />
            Output Console
            {runCount > 0 && <span className="ml-auto text-gray-600">Run #{runCount}</span>}
          </div>

          <div className="p-4 space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-400 mb-1 text-xs font-bold uppercase">
                  <AlertCircle size={14} /> Runtime Error
                </div>
                <pre className="text-red-300 font-mono text-xs whitespace-pre-wrap break-all">{error}</pre>
              </div>
            )}

            {output && !error && (
              <div>
                <div className="text-xs text-gray-500 font-mono uppercase mb-1">stdout</div>
                <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap break-all">{output}</pre>
              </div>
            )}

            {traces.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 font-mono uppercase mb-2">Execution trace</div>
                <TraceDisplay traces={traces} />
              </div>
            )}

            {testResults.length > 0 && <TestResults results={testResults} />}

            {allPassed && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold animate-in fade-in">
                <CheckCircle2 size={18} />
                All tests passed! 🎉
              </div>
            )}
          </div>
        </div>
      )}

      {solutionVisible && solution && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20 text-xs text-yellow-400 font-mono uppercase tracking-widest">
            <Eye size={13} /> Reference Solution
          </div>
          <pre className="p-4 text-sm text-yellow-200 font-mono whitespace-pre-wrap break-all">{solution}</pre>
        </div>
      )}
    </div>
  );
}
