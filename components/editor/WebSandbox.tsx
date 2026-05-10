'use client';
import { useRef, useEffect, memo } from 'react';
import { EditorLanguage } from '@/hooks/useCodeExecution';

interface WebSandboxProps {
  code: string;
  language: EditorLanguage;
}

export const WebSandbox = memo(function WebSandbox({ code, language }: WebSandboxProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;

    let content = '';
    if (language === 'html') {
      content = `<!DOCTYPE html><html><head><style>body{margin:0;font-family:sans-serif;}</style></head><body>${code}</body></html>`;
    } else if (language === 'css') {
      content = `<!DOCTYPE html><html><head><style>body{margin:0;padding:1rem;background:#fff;font-family:sans-serif;}${code}</style></head><body><h1>CSS Preview</h1><p>Apply your styles here.</p><div class="box">A styled box</div></body></html>`;
    } else if (language === 'javascript') {
      content = `<!DOCTYPE html><html><head></head><body><div id="output" style="font-family:monospace;padding:1rem;white-space:pre-wrap;"></div><script>const _out=[];const _old=console.log;console.log=(...a)=>{_out.push(a.join(' '));_old(...a);};try{${code}}catch(e){document.getElementById('output').textContent='Error: '+e.message;return;}document.getElementById('output').textContent=_out.join('\\n');<\/script></body></html>`;
    }

    doc.open();
    doc.write(content);
    doc.close();
  }, [code, language]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 border-b border-gray-700 text-xs text-gray-400 font-mono">
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
        Live Preview
      </div>
      <iframe
        ref={iframeRef}
        title="Code Preview"
        className="flex-1 w-full border-none bg-white"
        sandbox="allow-scripts"
      />
    </div>
  );
});
