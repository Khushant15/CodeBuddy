"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  CheckCircle,
  Lock,
  Code,
  Palette,
  Globe,
  ArrowRight,
  Clock,
  Terminal,
  Cpu,
  Database,
  Zap,
  Binary,
} from "lucide-react"
import Link from "next/link"
import { CodeBlock } from "@/components/code-block"

export default function LearnPage() {
  const [selectedTrack, setSelectedTrack] = useState("python")

  return (
    <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto max-w-6xl">
        {/* Techie Header */}
        <AnimatedSection className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative"
          >
            {/* Matrix-style background */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="text-green-400 font-mono text-xs leading-none">
                {Array.from({ length: 50 }, (_, i) => (
                  <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                    01001000 01100101 01101100 01101100 01101111
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full neon-card mb-6"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-mono text-cyan-400">./learn --mode=interactive</span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold font-mono mb-4">
                <span className="gradient-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  &lt;LEARN/&gt;
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
                $ sudo learn --recursive --verbose --interactive
              </p>
              <div className="mt-4 text-sm text-green-400 font-mono">
                [INFO] Neural pathways optimized for maximum knowledge absorption
              </div>
            </div>
          </motion.div>
        </AnimatedSection>

        {/* System Status */}
        <AnimatedSection className="mb-12">
          <GlassCard className="p-6 bg-gray-900/50 border border-cyan-500/30">
            <div className="grid md:grid-cols-4 gap-6">
              {systemStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-cyan-400">{stat.value}</div>
                  <div className="text-sm text-gray-400 font-mono">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Learning Tracks - Techie Style */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Cpu className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold font-mono text-cyan-400">LEARNING_MODULES.exe</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {learningTracks.map((track, index) => (
              <motion.div
                key={track.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedTrack(track.slug)}
              >
                <GlassCard
                  className={`p-6 transition-all duration-300 group-hover:shadow-2xl h-full border ${
                    selectedTrack === track.slug ? "border-cyan-500 bg-cyan-500/5" : "border-gray-700"
                  }`}
                >
                  {/* Terminal Header */}
                  <div className="bg-gray-900 rounded-t-lg p-2 mb-4 -mx-6 -mt-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="ml-4 text-gray-400 font-mono text-sm">{track.slug}.py</span>
                    </div>
                  </div>

                  <div
                    className={`w-16 h-16 ${track.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <track.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-2 font-mono text-cyan-400">&lt;{track.title}/&gt;</h3>
                  <p className="text-gray-300 mb-4 font-mono text-sm"># {track.description}</p>

                  {/* Progress Bar with Techie Style */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm font-mono">
                      <span className="text-green-400">PROGRESS:</span>
                      <span className="text-cyan-400">{track.progress}%</span>
                    </div>
                    <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${track.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 font-mono">
                      <span>
                        [{track.completed}/{track.total}] modules
                      </span>
                      <span>ETA: {track.duration}</span>
                    </div>
                  </div>

                  <Button className="w-full group-hover:scale-105 transition-transform font-mono" asChild>
                    <Link href={`/learn/${track.slug}`}>
                      {track.progress > 0 ? "$ ./continue" : "$ ./initialize"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Current Session - Enhanced */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Binary className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold font-mono text-purple-400">ACTIVE_SESSION.log</h2>
          </div>

          <GlassCard className="p-8 bg-gradient-to-r from-gray-900/80 to-purple-900/20 border border-purple-500/30">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 font-mono">
                    PYTHON.exe • LEVEL_02
                  </Badge>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-mono text-sm">ACTIVE</span>
                </div>

                <h3 className="text-2xl font-bold mb-4 font-mono text-cyan-400">&gt; data_structures.py --advanced</h3>
                <p className="text-gray-300 mb-6 font-mono text-sm">
                  // Manipulating arrays, dictionaries, and nested structures
                  <br />
                  // Implementing list comprehensions and lambda functions
                  <br />
                  // Memory optimization techniques
                </p>

                <div className="flex gap-4">
                  <Button size="lg" className="group font-mono">
                    <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    EXECUTE
                  </Button>
                  <Button variant="outline" size="lg" className="font-mono bg-transparent">
                    VIEW_LOGS
                  </Button>
                </div>
              </div>

              <div className="relative">
                <CodeBlock
                  language="python"
                  code={`# Advanced Data Structures
import numpy as np
from collections import defaultdict

class DataProcessor:
    def __init__(self):
        self.cache = defaultdict(list)
    
    def process_matrix(self, data):
        # Optimized matrix operations
        matrix = np.array(data)
        return matrix.T @ matrix
    
    def lambda_filter(self, items):
        return list(filter(
            lambda x: x % 2 == 0 and x > 10, 
            items
        ))

# Execute quantum algorithms
processor = DataProcessor()
result = processor.process_matrix([[1,2],[3,4]])`}
                />
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Recent Modules */}
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-8">
            <Database className="w-8 h-8 text-green-400" />
            <h2 className="text-3xl font-bold font-mono text-green-400">RECENT_MODULES.db</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recentLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <GlassCard className="p-6 transition-all duration-300 hover:shadow-xl border border-gray-700 hover:border-cyan-500/50">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 ${lesson.completed ? "bg-green-500" : "bg-gray-600"} rounded-lg flex items-center justify-center relative`}
                    >
                      {lesson.completed ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Lock className="w-6 h-6 text-white" />
                      )}
                      {lesson.completed && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-black">✓</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {lesson.track}.exe
                        </Badge>
                        <Badge variant="outline" className="font-mono text-xs">
                          LVL_{lesson.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-2 font-mono text-cyan-400">{lesson.title}</h3>
                      <p className="text-sm text-gray-300 mb-3 font-mono">// {lesson.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1 text-gray-500 font-mono">
                          <Clock className="w-4 h-4" />
                          <span>RUNTIME: {lesson.duration}</span>
                        </div>
                        {lesson.completed && (
                          <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-mono text-xs">
                            EXECUTED
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

const systemStats = [
  {
    label: "CPU_USAGE",
    value: "85%",
    icon: Cpu,
    color: "bg-gradient-to-r from-green-500 to-blue-500",
  },
  {
    label: "MEMORY",
    value: "2.4GB",
    icon: Database,
    color: "bg-gradient-to-r from-blue-500 to-purple-500",
  },
  {
    label: "THREADS",
    value: "17",
    icon: Zap,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    label: "UPTIME",
    value: "40h",
    icon: Clock,
    color: "bg-gradient-to-r from-orange-500 to-red-500",
  },
]

const learningTracks = [
  {
    title: "Python",
    description: "Advanced algorithms, data structures, and system programming",
    icon: Code,
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500",
    progress: 85,
    completed: 17,
    total: 20,
    duration: "40h",
    slug: "python",
  },
  {
    title: "HTML",
    description: "Semantic markup, accessibility, and modern web standards",
    icon: Globe,
    gradient: "bg-gradient-to-r from-orange-500 to-red-500",
    progress: 60,
    completed: 9,
    total: 15,
    duration: "25h",
    slug: "html",
  },
  {
    title: "CSS",
    description: "Advanced layouts, animations, and responsive frameworks",
    icon: Palette,
    gradient: "bg-gradient-to-r from-pink-500 to-purple-500",
    progress: 40,
    completed: 6,
    total: 18,
    duration: "35h",
    slug: "css",
  },
]

const recentLessons = [
  {
    id: 1,
    title: "lambda_functions.py --advanced",
    description: "Functional programming paradigms and closure implementations",
    track: "PYTHON",
    difficulty: "intermediate",
    duration: "45min",
    completed: true,
  },
  {
    id: 2,
    title: "semantic_html.html --accessibility",
    description: "ARIA attributes, screen readers, and inclusive design patterns",
    track: "HTML",
    difficulty: "intermediate",
    duration: "30min",
    completed: true,
  },
  {
    id: 3,
    title: "flexbox_grid.css --responsive",
    description: "Advanced layout systems and mobile-first design principles",
    track: "CSS",
    difficulty: "intermediate",
    duration: "50min",
    completed: false,
  },
  {
    id: 4,
    title: "exception_handling.py --robust",
    description: "Error management, logging systems, and debugging techniques",
    track: "PYTHON",
    difficulty: "advanced",
    duration: "40min",
    completed: false,
  },
]
