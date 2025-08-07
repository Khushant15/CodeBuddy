"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function HeroAnimation() {
  const [currentLine, setCurrentLine] = useState(0)

  const codeLines = [
    "def welcome_to_codebuddy():",
    '    print("Ready to code? Let\'s go! 🚀")',
    '    return "Happy Learning!"',
    "",
    "welcome_to_codebuddy()",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % codeLines.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [codeLines.length])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.8 }}
      className="mt-20 relative"
    >
      <div className="glass-card p-8 max-w-4xl mx-auto animate-float">
        <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-4 text-gray-400">welcome.py</span>
          </div>
          <div className="space-y-1">
            {codeLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity: index <= currentLine ? 1 : 0.3,
                  color: index === currentLine ? "#10B981" : "#E5E7EB",
                }}
                transition={{ duration: 0.5 }}
                className="min-h-[1.5rem]"
              >
                {line === "def welcome_to_codebuddy():" && (
                  <>
                    <span className="text-purple-400">def</span>{" "}
                    <span className="text-blue-400">welcome_to_codebuddy</span>():
                  </>
                )}
                {line.includes("print") && (
                  <>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">print</span>(
                    <span className="text-yellow-300">"Ready to code? Let's go! 🚀"</span>)
                  </>
                )}
                {line.includes("return") && (
                  <>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span>{" "}
                    <span className="text-yellow-300">"Happy Learning!"</span>
                  </>
                )}
                {line === "welcome_to_codebuddy()" && (<span className="text-blue-400">welcome_to_codebuddy</span>)()}
                {line === "" && <br />}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
