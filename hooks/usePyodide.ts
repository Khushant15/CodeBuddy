'use client';

import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    loadPyodide: any;
  }
}

// Global state to share across hook instances
let globalPyodide: any = null;
let globalLoading = false;
let globalError: string | null = null;
let globalStdout = '';
const listeners: Set<(state: any) => void> = new Set();

export function usePyodide() {
  const [pyodide, setPyodide] = useState<any>(globalPyodide);
  const [isLoading, setIsLoading] = useState(globalLoading);
  const [error, setError] = useState<string | null>(globalError);
  const [stdout, setStdout] = useState(globalStdout);

  useEffect(() => {
    const listener = () => {
      setPyodide(globalPyodide);
      setIsLoading(globalLoading);
      setError(globalError);
      setStdout(globalStdout);
    };
    listeners.add(listener);

    const init = async () => {
      if (globalPyodide || globalLoading) return;
      
      if (!window.loadPyodide) return;

      globalLoading = true;
      listeners.forEach(l => l({}));
      
      console.log('usePyodide: Loading v0.24.1...');
      
      const timeout = setTimeout(() => {
        if (globalLoading && !globalPyodide) {
          console.error('usePyodide: Load timed out');
          globalLoading = false;
          globalError = 'Initialization timed out. Please refresh.';
          listeners.forEach(l => l({}));
        }
      }, 15000);

      try {
        const py = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
        });
        clearTimeout(timeout);
        globalPyodide = py;
        globalLoading = false;
        console.log('usePyodide: Ready');
      } catch (err: any) {
        clearTimeout(timeout);
        console.error('usePyodide: Load error', err);
        globalError = err.message;
        globalLoading = false;
      }
      listeners.forEach(l => l({}));
    };

    if (!document.getElementById('pyodide-script')) {
      const script = document.createElement('script');
      script.id = 'pyodide-script';
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
      script.async = true;
      script.onload = init;
      document.body.appendChild(script);
    } else {
      init();
    }

    const interval = setInterval(() => {
      if (window.loadPyodide && !globalPyodide && !globalLoading) {
        init();
        clearInterval(interval);
      } else if (globalPyodide || globalError) {
        clearInterval(interval);
      }
    }, 500);

    return () => {
      listeners.delete(listener);
      clearInterval(interval);
    };
  }, []);

  const runPython = useCallback(async (code: string) => {
    if (!globalPyodide) return { output: '', error: 'Python is still loading...' };

    try {
      await globalPyodide.runPythonAsync(`
        import sys
        import io
        sys.stdout = io.StringIO()
      `);
      await globalPyodide.runPythonAsync(code);
      const output = await globalPyodide.runPythonAsync('sys.stdout.getvalue()');
      
      return { output: output || '', error: null };
    } catch (err: any) {
      return { output: '', error: err.message };
    }
  }, []);

  return { pyodide, isLoading, error, runPython, stdout };
}
