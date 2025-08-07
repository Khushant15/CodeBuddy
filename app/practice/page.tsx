"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"
import {
  Bug,
  Play,
  CheckCircle,
  Clock,
  Trophy,
  Zap,
  Target,
  Filter,
  Search,
  Cpu,
  AlertTriangle,
  Shield,
  Binary,
  Braces,
} from "lucide-react"
import { Input } from "@/components/ui/input"

export default function PracticePage() {
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredChallenges = debuggingChallenges.filter((challenge) => {
    const matchesLevel = selectedLevel === "all" || challenge.difficulty.toLowerCase() === selectedLevel
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesLevel && matchesSearch
  })

  return (
    <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-gray-900 via-red-900/10 to-gray-900">
      <div className="container mx-auto max-w-6xl">
        {/* Techie Header */}
        <AnimatedSection className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative"
          >
            {/* Glitch Effect Background */}
            <div className="absolute inset-0 overflow-hidden opacity-5">
              <div className="text-red-400 font-mono text-xs leading-none animate-pulse">
                {Array.from({ length: 30 }, (_, i) => (
                  <div key={i} className="glitch-text" style={{ animationDelay: `${i * 0.2}s` }}>
                    ERROR ERROR ERROR SEGFAULT EXCEPTION OVERFLOW
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full neon-card mb-6 border border-red-500/30"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-sm font-mono text-red-400">./debug --mode=hardcore</span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold font-mono mb-4">
                <span className="gradient-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  &lt;DEBUG/&gt;
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
                $ sudo debug --recursive --fix-all --no-mercy
              </p>
              <div className="mt-4 text-sm text-red-400 font-mono animate-pulse">
                [WARNING] High-intensity debugging environment detected
              </div>
            </div>
          </motion.div>
        </AnimatedSection>

        {/* System Diagnostics */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-red-400" />
            <h2 className="text-2xl font-bold font-mono text-red-400">SYSTEM_DIAGNOSTICS.exe</h2>
          </div>

          <GlassCard className="p-8 bg-gradient-to-r from-gray-900/80 to-red-900/20 border border-red-500/30">
            <div className="grid md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className={`w-16 h-16 ${stat.gradient} rounded-full flex items-center justify-center mx-auto mb-4 relative`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1 font-mono text-cyan-400">{stat.value}</h3>
                  <p className="text-sm text-gray-300 font-mono">{stat.title}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Search and Filter - Enhanced */}
        <AnimatedSection className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Binary className="w-8 h-8 text-orange-400" />
            <h2 className="text-2xl font-bold font-mono text-orange-400">CHALLENGE_FILTER.db</h2>
          </div>

          <GlassCard className="p-6 border border-orange-500/30">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="$ grep -i 'bug_pattern'"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-mono bg-gray-800/50 border-gray-600"
                />
              </div>

              <div className="flex gap-2 items-center">
                <Filter className="w-5 h-5 text-gray-400" />
                {["all", "easy", "intermediate", "hard"].map((level) => (
                  <Button
                    key={level}
                    variant={selectedLevel === level ? "default" : "outline"}
                    onClick={() => setSelectedLevel(level)}
                    className="capitalize font-mono"
                    size="sm"
                  >
                    {level === "all" ? "ALL_LEVELS" : level.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Featured Challenge - Enhanced */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Cpu className="w-8 h-8 text-yellow-400 animate-pulse" />
            <h2 className="text-3xl font-bold font-mono text-yellow-400">CRITICAL_ERROR.exe</h2>
          </div>

          <GlassCard className="p-8 bg-gradient-to-r from-gray-900/80 to-yellow-900/20 border border-yellow-500/50">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center relative">
                    <Bug className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-mono text-red-400">INFINITE_LOOP.py</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="destructive" className="font-mono">
                        CRITICAL
                      </Badge>
                      <Badge variant="outline" className="font-mono">
                        PYTHON.exe
                      </Badge>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mt-2"></div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 font-mono text-sm">
                  // SYSTEM ALERT: Infinite loop detected in countdown function
                  <br />
                  // Memory usage: CRITICAL (99.8%)
                  <br />
                  // CPU temperature: OVERHEATING
                  <br />
                  // Time to fix: URGENT
                </p>

                <div className="flex gap-4">
                  <Button size="lg" className="group font-mono bg-red-600 hover:bg-red-700">
                    <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    EMERGENCY_DEBUG
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="font-mono border-yellow-500 text-yellow-400 bg-transparent"
                  >
                    GET_HINT
                  </Button>
                </div>
              </div>

              <div className="relative">
                <CodeBlock
                  language="python"
                  code={`# CRITICAL ERROR DETECTED
def countdown(n):
    print(f"Starting countdown from {n}")
    while n > 0:
        print(f"T-minus {n}")
        # BUG LOCATION: Missing decrement!
        # n -= 1  # <-- This line is commented out!
        time.sleep(1)
    print("🚀 Launch!")

# DANGER: This will run forever!
countdown(10)  # SYSTEM OVERLOAD IMMINENT`}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div
                    className="w-3 h-3 bg-red-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Debugging Challenges - Enhanced */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Braces className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold font-mono text-purple-400">CHALLENGE_QUEUE.db</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <GlassCard className="p-6 transition-all duration-300 hover:shadow-xl border border-gray-700 hover:border-purple-500/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 ${getDifficultyColor(challenge.difficulty)} rounded-full flex items-center justify-center relative`}
                      >
                        <Bug className="w-5 h-5 text-white" />
                        {!challenge.completed && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold font-mono text-cyan-400">{challenge.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getDifficultyVariant(challenge.difficulty)} className="font-mono text-xs">
                            {challenge.difficulty.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="font-mono text-xs">
                            {challenge.language}.exe
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {challenge.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>

                  <p className="text-gray-300 text-sm mb-4 font-mono">// {challenge.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 font-mono">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        MAX_TIME: {challenge.timeLimit}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        REWARD: {challenge.xp}XP
                      </span>
                    </div>
                    <span>ATTEMPTS: {challenge.attempts}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm font-mono">
                      <span className="text-green-400">SUCCESS_RATE:</span>
                      <span className="text-cyan-400">{challenge.successRate}%</span>
                    </div>
                    <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${challenge.successRate}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full rounded-full ${
                          challenge.successRate > 70
                            ? "bg-green-500"
                            : challenge.successRate > 40
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                    </div>
                  </div>

                  <Button className="w-full font-mono" disabled={challenge.locked}>
                    {challenge.locked ? (
                      "LOCKED"
                    ) : challenge.completed ? (
                      "RE_EXECUTE"
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        INITIALIZE_DEBUG
                      </>
                    )}
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

const stats = [
  {
    title: "BUGS_FIXED",
    value: "24",
    icon: CheckCircle,
    gradient: "bg-gradient-to-r from-green-500 to-blue-500",
  },
  {
    title: "XP_EARNED",
    value: "1,250",
    icon: Trophy,
    gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    title: "SUCCESS_RATE",
    value: "89%",
    icon: Target,
    gradient: "bg-gradient-to-r from-orange-500 to-red-500",
  },
  {
    title: "DEBUG_STREAK",
    value: "12",
    icon: Zap,
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500",
  },
]

const debuggingChallenges = [
  {
    id: 1,
    title: "loop_error.py",
    description: "For loop with off-by-one error causing array overflow",
    difficulty: "Easy",
    language: "Python",
    timeLimit: "10min",
    xp: 50,
    attempts: 156,
    successRate: 85,
    completed: true,
    locked: false,
  },
  {
    id: 2,
    title: "array_bounds.py",
    description: "IndexError exception when accessing array elements beyond bounds",
    difficulty: "Easy",
    language: "Python",
    timeLimit: "15min",
    xp: 75,
    attempts: 203,
    successRate: 72,
    completed: true,
    locked: false,
  },
  {
    id: 3,
    title: "string_parser.py",
    description: "Text processing function with regex pattern matching errors",
    difficulty: "Intermediate",
    language: "Python",
    timeLimit: "20min",
    xp: 100,
    attempts: 89,
    successRate: 64,
    completed: false,
    locked: false,
  },
  {
    id: 4,
    title: "flexbox_layout.css",
    description: "CSS Grid and Flexbox alignment issues causing layout breaks",
    difficulty: "Intermediate",
    language: "CSS",
    timeLimit: "25min",
    xp: 125,
    attempts: 134,
    successRate: 58,
    completed: false,
    locked: false,
  },
  {
    id: 5,
    title: "recursive_overflow.py",
    description: "Stack overflow in recursive function with missing base case",
    difficulty: "Hard",
    language: "Python",
    timeLimit: "30min",
    xp: 200,
    attempts: 45,
    successRate: 42,
    completed: false,
    locked: false,
  },
  {
    id: 6,
    title: "memory_leak.py",
    description: "Advanced memory management and garbage collection optimization",
    difficulty: "Hard",
    language: "Python",
    timeLimit: "45min",
    xp: 300,
    attempts: 23,
    successRate: 35,
    completed: false,
    locked: true,
  },
]

function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-500"
    case "intermediate":
      return "bg-yellow-500"
    case "hard":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

function getDifficultyVariant(difficulty: string): "default" | "secondary" | "destructive" | "outline" {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "secondary"
    case "intermediate":
      return "default"
    case "hard":
      return "destructive"
    default:
      return "outline"
  }
}
