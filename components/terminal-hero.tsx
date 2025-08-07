"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function TerminalHero() {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayText, setDisplayText] = useState("")

  const terminalLines = [
    "$ initializing CodeBuddy...",
    "$ loading gamified learning modules...",
    "$ connecting to AI assistant...",
    "$ ready to debug and learn! 🚀",
    "$ welcome_developer()",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % terminalLines.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [terminalLines.length])

  useEffect(() => {
    const currentText = terminalLines[currentLine]
    let index = 0
    setDisplayText("")

    const typingInterval = setInterval(() => {
      if (index < currentText.length) {
        setDisplayText(currentText.slice(0, index + 1))
        index++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [currentLine, terminalLines])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.8 }}
      className="mt-20 relative"
    >
      <div className="neon-card p-8 max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-4 text-gray-400">terminal</span>
          </div>
          <div className="space-y-2">
            {terminalLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity: index <= currentLine ? 1 : 0.3,
                }}
                transition={{ duration: 0.5 }}
                className="min-h-[1.5rem] text-green-400"
              >
                {index === currentLine ? (
                  <span className="typing-animation">{displayText}</span>
                ) : index < currentLine ? (
                  line
                ) : (
                  ""
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
