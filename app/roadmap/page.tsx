"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Lock, Globe, Database, Code, Server, Smartphone, Cloud } from "lucide-react"

export default function RoadmapPage() {
  const [selectedRoadmap, setSelectedRoadmap] = useState("frontend")

  const currentRoadmap = roadmaps.find((r) => r.id === selectedRoadmap) || roadmaps[0]

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <AnimatedSection className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
              Learning <span className="gradient-text">Roadmaps</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Follow structured paths to master different areas of programming
            </p>
          </motion.div>
        </AnimatedSection>

        {/* Roadmap Selection */}
        <AnimatedSection className="mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((roadmap, index) => (
              <motion.div
                key={roadmap.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard
                  className={`p-6 cursor-pointer transition-all duration-300 ${
                    selectedRoadmap === roadmap.id ? "ring-2 ring-blue-500 scale-105" : "hover:scale-105"
                  }`}
                  onClick={() => setSelectedRoadmap(roadmap.id)}
                >
                  <div className={`w-16 h-16 ${roadmap.gradient} rounded-xl flex items-center justify-center mb-4`}>
                    <roadmap.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-2 font-poppins">{roadmap.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{roadmap.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{roadmap.progress}%</span>
                    </div>
                    <Progress value={roadmap.progress} className="h-2" />
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>
                      {roadmap.completed}/{roadmap.total} steps
                    </span>
                    <span>{roadmap.duration}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Selected Roadmap Details */}
        <AnimatedSection className="mb-12">
          <GlassCard className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 ${currentRoadmap.gradient} rounded-xl flex items-center justify-center`}>
                <currentRoadmap.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold font-poppins">{currentRoadmap.title} Roadmap</h2>
                <p className="text-gray-600 dark:text-gray-300">{currentRoadmap.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">{currentRoadmap.progress}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">{currentRoadmap.duration}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Est. Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">{currentRoadmap.difficulty}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Difficulty</div>
              </div>
            </div>

            <Progress value={currentRoadmap.progress} className="h-3 mb-6" />

            <Button size="lg">{currentRoadmap.progress > 0 ? "Continue Learning" : "Start Roadmap"}</Button>
          </GlassCard>
        </AnimatedSection>

        {/* Roadmap Steps */}
        <AnimatedSection>
          <h2 className="text-3xl font-bold font-poppins mb-8">Learning Path</h2>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 opacity-30"></div>

            <div className="space-y-6">
              {currentRoadmap.steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex items-start gap-6"
                >
                  {/* Step Icon */}
                  <div
                    className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${
                      step.status === "completed"
                        ? "bg-green-500"
                        : step.status === "current"
                          ? "bg-blue-500"
                          : step.status === "locked"
                            ? "bg-gray-400"
                            : "bg-gray-300"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : step.status === "locked" ? (
                      <Lock className="w-8 h-8 text-white" />
                    ) : (
                      <Circle className="w-8 h-8 text-white" />
                    )}
                  </div>

                  {/* Step Content */}
                  <GlassCard className={`flex-1 p-6 ${step.status === "current" ? "ring-2 ring-blue-500" : ""}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold font-poppins">{step.title}</h3>
                          <Badge variant={getStatusVariant(step.status)}>{step.status}</Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{step.description}</p>
                      </div>
                      <div className="text-right text-sm text-gray-600 dark:text-gray-300">
                        <div>{step.duration}</div>
                        <div>{step.lessons} lessons</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {step.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {step.progress > 0 && (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{step.progress}%</span>
                        </div>
                        <Progress value={step.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        disabled={step.status === "locked"}
                        variant={step.status === "completed" ? "outline" : "default"}
                      >
                        {step.status === "completed"
                          ? "Review"
                          : step.status === "current"
                            ? "Continue"
                            : step.status === "locked"
                              ? "Locked"
                              : "Start"}
                      </Button>
                      {step.status !== "locked" && (
                        <Button variant="ghost" size="sm">
                          View Resources
                        </Button>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

const roadmaps = [
  {
    id: "frontend",
    title: "Frontend Developer",
    description: "Master HTML, CSS, JavaScript, and modern frameworks to build beautiful user interfaces.",
    icon: Globe,
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500",
    progress: 65,
    completed: 13,
    total: 20,
    duration: "6-8 months",
    difficulty: "Beginner to Intermediate",
    steps: [
      {
        id: 1,
        title: "HTML Fundamentals",
        description: "Learn the building blocks of web pages with semantic HTML elements and structure.",
        duration: "2-3 weeks",
        lessons: 12,
        skills: ["HTML5", "Semantic Elements", "Forms", "Accessibility"],
        status: "completed",
        progress: 100,
      },
      {
        id: 2,
        title: "CSS Styling & Layout",
        description: "Master CSS for styling, layouts, responsive design, and modern CSS features.",
        duration: "3-4 weeks",
        lessons: 18,
        skills: ["CSS3", "Flexbox", "Grid", "Responsive Design", "Animations"],
        status: "completed",
        progress: 100,
      },
      {
        id: 3,
        title: "JavaScript Basics",
        description: "Learn programming fundamentals with JavaScript, DOM manipulation, and events.",
        duration: "4-5 weeks",
        lessons: 24,
        skills: ["ES6+", "DOM", "Events", "Async/Await", "APIs"],
        status: "current",
        progress: 75,
      },
      {
        id: 4,
        title: "React Framework",
        description: "Build dynamic user interfaces with React components, hooks, and state management.",
        duration: "6-8 weeks",
        lessons: 32,
        skills: ["React", "JSX", "Hooks", "State Management", "Routing"],
        status: "available",
        progress: 0,
      },
      {
        id: 5,
        title: "Advanced Frontend",
        description: "Learn testing, performance optimization, and deployment strategies.",
        duration: "4-6 weeks",
        lessons: 20,
        skills: ["Testing", "Performance", "Build Tools", "Deployment"],
        status: "locked",
        progress: 0,
      },
    ],
  },
  {
    id: "backend",
    title: "Backend Developer",
    description: "Build robust server-side applications with databases, APIs, and cloud services.",
    icon: Server,
    gradient: "bg-gradient-to-r from-green-500 to-blue-500",
    progress: 30,
    completed: 6,
    total: 18,
    duration: "8-10 months",
    difficulty: "Intermediate to Advanced",
    steps: [
      {
        id: 1,
        title: "Python Fundamentals",
        description: "Master Python programming language and its core concepts.",
        duration: "3-4 weeks",
        lessons: 20,
        skills: ["Python", "OOP", "Data Structures", "File Handling"],
        status: "completed",
        progress: 100,
      },
      {
        id: 2,
        title: "Database Design",
        description: "Learn SQL, database design principles, and data modeling.",
        duration: "4-5 weeks",
        lessons: 16,
        skills: ["SQL", "PostgreSQL", "Database Design", "Normalization"],
        status: "current",
        progress: 60,
      },
      {
        id: 3,
        title: "Web APIs & REST",
        description: "Build RESTful APIs with Flask/Django and handle HTTP requests.",
        duration: "5-6 weeks",
        lessons: 22,
        skills: ["REST APIs", "Flask", "Django", "Authentication"],
        status: "available",
        progress: 0,
      },
    ],
  },
  {
    id: "fullstack",
    title: "Full Stack Developer",
    description: "Combine frontend and backend skills to build complete web applications.",
    icon: Code,
    gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
    progress: 45,
    completed: 9,
    total: 25,
    duration: "10-12 months",
    difficulty: "Intermediate to Advanced",
    steps: [
      {
        id: 1,
        title: "Frontend Foundations",
        description: "HTML, CSS, JavaScript, and React fundamentals.",
        duration: "6-8 weeks",
        lessons: 30,
        skills: ["HTML", "CSS", "JavaScript", "React"],
        status: "completed",
        progress: 100,
      },
      {
        id: 2,
        title: "Backend Development",
        description: "Server-side programming with Node.js and databases.",
        duration: "8-10 weeks",
        lessons: 35,
        skills: ["Node.js", "Express", "MongoDB", "APIs"],
        status: "current",
        progress: 40,
      },
    ],
  },
  {
    id: "mobile",
    title: "Mobile Developer",
    description: "Create mobile applications for iOS and Android platforms.",
    icon: Smartphone,
    gradient: "bg-gradient-to-r from-orange-500 to-red-500",
    progress: 15,
    completed: 3,
    total: 22,
    duration: "8-10 months",
    difficulty: "Intermediate",
    steps: [
      {
        id: 1,
        title: "Mobile Fundamentals",
        description: "Learn mobile development concepts and platform differences.",
        duration: "2-3 weeks",
        lessons: 15,
        skills: ["Mobile UI/UX", "Platform Guidelines", "Development Tools"],
        status: "completed",
        progress: 100,
      },
    ],
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    description: "Learn deployment, monitoring, and infrastructure management.",
    icon: Cloud,
    gradient: "bg-gradient-to-r from-teal-500 to-green-500",
    progress: 20,
    completed: 4,
    total: 16,
    duration: "6-8 months",
    difficulty: "Advanced",
    steps: [
      {
        id: 1,
        title: "Linux & Command Line",
        description: "Master Linux systems and command line tools.",
        duration: "3-4 weeks",
        lessons: 18,
        skills: ["Linux", "Bash", "System Administration", "Networking"],
        status: "completed",
        progress: 100,
      },
    ],
  },
  {
    id: "data",
    title: "Data Scientist",
    description: "Analyze data, build models, and extract insights using Python and ML.",
    icon: Database,
    gradient: "bg-gradient-to-r from-indigo-500 to-purple-500",
    progress: 10,
    completed: 2,
    total: 20,
    duration: "10-12 months",
    difficulty: "Intermediate to Advanced",
    steps: [
      {
        id: 1,
        title: "Python for Data Science",
        description: "Learn Python libraries for data manipulation and analysis.",
        duration: "4-5 weeks",
        lessons: 25,
        skills: ["Python", "Pandas", "NumPy", "Matplotlib"],
        status: "current",
        progress: 50,
      },
    ],
  },
]

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "secondary"
    case "current":
      return "default"
    case "locked":
      return "outline"
    default:
      return "outline"
  }
}
