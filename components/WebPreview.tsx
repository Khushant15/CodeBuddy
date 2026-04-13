'use client';

import { useEffect, useRef } from 'react';

interface WebPreviewProps {
  html: string;
  css?: string;
  js?: string;
  className?: string;
}

export function WebPreview({ html, css = '', js = '', className = '' }: WebPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const updatePreview = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const document = iframe.contentDocument;
      if (!document) return;

      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { margin: 0; font-family: sans-serif; color: white; }
              ${css}
            </style>
          </head>
          <body>
            ${html}
            <script>
              try {
                ${js}
              } catch (err) {
                console.error(err);
              }
            </script>
          </body>
        </html>
      `;

      document.open();
      document.write(content);
      document.close();
    };

    updatePreview();
  }, [html, css, js]);

  return (
    <div className={`web-preview-container bg-white rounded-lg overflow-hidden border border-gray-700 h-full ${className}`}>
      <iframe
        ref={iframeRef}
        title="Web Preview"
        className="w-full h-full border-none bg-white"
        sandbox="allow-scripts"
      />
    </div>
  );
}
