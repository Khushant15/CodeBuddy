// components/LessonRenderer.tsx
// Renders lesson theory content with various section types

import { TheoryContent, TheorySection } from '@/lib/curriculum/types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface LessonRendererProps {
  content: TheoryContent;
}

export function LessonRenderer({ content }: LessonRendererProps) {
  return (
    <div className="lesson-content space-y-6">
      {content.sections.map((section, index) => (
        <SectionRenderer key={index} section={section} />
      ))}
    </div>
  );
}

interface SectionRendererProps {
  section: TheorySection;
}

function SectionRenderer({ section }: SectionRendererProps) {
  switch (section.type) {
    case 'heading':
      return <HeadingSection content={section.content} />;
    
    case 'text':
      return <TextSection content={section.content} />;
    
    case 'code':
      return (
        <CodeSection 
          code={section.content} 
          language={section.language || 'python'} 
        />
      );
    
    case 'callout':
      return (
        <CalloutSection 
          content={section.content} 
          variant={section.variant || 'info'} 
        />
      );
    
    case 'image':
      return <ImageSection src={section.content} />;
    
    case 'video':
      return <VideoSection url={section.content} />;
    
    default:
      return null;
  }
}

// Section Components

function HeadingSection({ content }: { content: string }) {
  return (
    <h2 className="text-2xl font-bold text-neon-green mb-4 font-orbitron">
      {content}
    </h2>
  );
}

function TextSection({ content }: { content: string }) {
  // Support for markdown-style formatting
  const formattedContent = content
    .split('\n')
    .map((line, i) => {
      // Bold text: **text**
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic: *text*
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      // Code: `code`
      line = line.replace(/`(.*?)`/g, '<code>$1</code>');
      
      return <p key={i} dangerouslySetInnerHTML={{ __html: line }} />;
    });
  
  return (
    <div className="text-gray-200 leading-relaxed space-y-2">
      {formattedContent}
    </div>
  );
}

function CodeSection({ code, language }: { code: string; language: string }) {
  return (
    <div className="code-block rounded-lg overflow-hidden border border-neon-green/30">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          background: 'rgba(0, 255, 135, 0.05)',
          fontSize: '0.9rem',
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function CalloutSection({ 
  content, 
  variant 
}: { 
  content: string; 
  variant: 'info' | 'tip' | 'warning' | 'error' 
}) {
  const styles = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/50',
      icon: '💡',
      text: 'text-blue-300',
    },
    tip: {
      bg: 'bg-neon-green/10',
      border: 'border-neon-green/50',
      icon: '🎯',
      text: 'text-neon-green',
    },
    warning: {
      bg: 'bg-neon-orange/10',
      border: 'border-neon-orange/50',
      icon: '⚠️',
      text: 'text-neon-orange',
    },
    error: {
      bg: 'bg-neon-pink/10',
      border: 'border-neon-pink/50',
      icon: '❌',
      text: 'text-neon-pink',
    },
  };
  
  const style = styles[variant];
  
  return (
    <div 
      className={`${style.bg} ${style.border} border rounded-lg p-4`}
    >
      <p className={`${style.text} leading-relaxed`}>
        <span className="mr-2">{style.icon}</span>
        {content}
      </p>
    </div>
  );
}

function ImageSection({ src }: { src: string }) {
  return (
    <div className="image-container rounded-lg overflow-hidden border border-neon-green/30">
      <img 
        src={src} 
        alt="Lesson illustration" 
        className="w-full h-auto"
      />
    </div>
  );
}

function VideoSection({ url }: { url: string }) {
  // Extract video ID from YouTube URL
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };
  
  const videoId = getYouTubeId(url);
  
  if (!videoId) {
    return (
      <div className="text-gray-400">
        Unable to load video. Invalid URL.
      </div>
    );
  }
  
  return (
    <div className="video-container aspect-video rounded-lg overflow-hidden border border-neon-green/30">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Lesson video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

// Code Example Renderer

interface CodeExampleProps {
  title: string;
  code: string;
  output?: string;
  explanation: string;
  language?: string;
}

export function CodeExample({
  title,
  code,
  output,
  explanation,
  language = 'python'
}: CodeExampleProps) {
  return (
    <div className="code-example card p-6 space-y-4">
      <h3 className="text-xl font-semibold text-neon-violet">
        {title}
      </h3>
      
      <CodeSection code={code} language={language} />
      
      {output && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-2">
            Output:
          </h4>
          <div className="terminal p-3">
            <pre className="text-neon-green font-mono text-sm">
              {output}
            </pre>
          </div>
        </div>
      )}
      
      <div className="explanation text-gray-300">
        <p className="text-sm leading-relaxed">
          {explanation}
        </p>
      </div>
    </div>
  );
}
