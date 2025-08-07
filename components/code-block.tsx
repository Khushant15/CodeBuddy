"use client"

import { motion } from "framer-motion"

interface CodeBlockProps {
  language: string
  code: string
  className?: string
}

export function CodeBlock({ language, code, className }: CodeBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`glass rounded-lg p-6 ${className}`}
    >
      <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-4 text-gray-400">{language}</span>
        </div>
        <pre className="text-gray-300">
          <code dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }} />
        </pre>
      </div>
    </motion.div>
  )
}

function highlightCode(code: string, language: string): string {
  // Simple syntax highlighting for demo purposes
  let highlighted = code

  if (language === "python") {
    highlighted = highlighted
      .replace(
        /(def|class|if|else|elif|for|while|import|from|return|print)/g,
        '<span class="text-purple-400">$1</span>',
      )
      .replace(/(#.*$)/gm, '<span class="text-green-400">$1</span>')
      .replace(/(".*?")/g, '<span class="text-yellow-300">$1</span>')
      .replace(/(\d+)/g, '<span class="text-blue-400">$1</span>')
  }

  return highlighted
}
