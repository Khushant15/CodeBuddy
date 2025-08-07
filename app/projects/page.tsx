"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { FolderOpen, Search, Star, Clock, Users, Code, Database, Globe, Smartphone, Gamepad2 } from "lucide-react"

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("all")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === "all" || project.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

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
              Build Real <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Learn by building practical applications that you can add to your portfolio
            </p>
          </motion.div>
        </AnimatedSection>

        {/* Search and Filter */}
        <AnimatedSection className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {projectTags.map((tag) => (
                <Button
                  key={tag.id}
                  variant={selectedTag === tag.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag.id)}
                  className="flex items-center gap-2"
                >
                  <tag.icon className="w-4 h-4" />
                  {tag.label}
                </Button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Featured Project */}
        <AnimatedSection className="mb-12">
          <h2 className="text-3xl font-bold font-poppins mb-8">Featured Project</h2>

          <GlassCard className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">Featured</Badge>
                  <Badge variant="outline">Intermediate</Badge>
                </div>

                <h3 className="text-3xl font-bold mb-4 font-poppins">Personal Portfolio Website</h3>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Create a stunning personal portfolio website using HTML, CSS, and JavaScript. Learn responsive design,
                  animations, and modern web development practices.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {["Frontend", "HTML", "CSS", "JavaScript"].map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300 mb-6">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    8-12 hours
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    1,234 completed
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    4.8/5
                  </span>
                </div>

                <Button size="lg" className="mr-4">
                  Start Project
                </Button>
                <Button variant="outline" size="lg">
                  View Demo
                </Button>
              </div>

              <div className="glass rounded-lg p-6">
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="ml-4 text-gray-400">index.html</span>
                  </div>
                  <div className="text-blue-400">
                    {"<"}!DOCTYPE html{">"}
                    <br />
                    {"<"}
                    <span className="text-red-400">html</span> <span className="text-green-400">lang</span>=
                    <span className="text-yellow-300">"en"</span>
                    {">"}
                    <br />
                    {"<"}
                    <span className="text-red-400">head</span>
                    {">"}
                    <br />
                    &nbsp;&nbsp;{"<"}
                    <span className="text-red-400">title</span>
                    {">"}My Portfolio{"</"}
                    <span className="text-red-400">title</span>
                    {">"}
                    <br />
                    {"</"}
                    <span className="text-red-400">head</span>
                    {">"}
                    <br />
                    {"<"}
                    <span className="text-red-400">body</span>
                    {">"}
                    <br />
                    &nbsp;&nbsp;{"<"}
                    <span className="text-red-400">h1</span>
                    {">"}Welcome!{"</"}
                    <span className="text-red-400">h1</span>
                    {">"}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Projects Grid */}
        <AnimatedSection>
          <h2 className="text-3xl font-bold font-poppins mb-8">All Projects</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6 hover:scale-105 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${project.gradient} rounded-lg flex items-center justify-center`}>
                      <project.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant={getDifficultyVariant(project.difficulty)}>{project.difficulty}</Badge>
                  </div>

                  <h3 className="text-xl font-bold mb-2 font-poppins">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1">{project.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {project.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {project.rating}
                    </span>
                  </div>

                  {project.progress > 0 && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  )}

                  <Button className="w-full">{project.progress > 0 ? "Continue Project" : "Start Project"}</Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

const projectTags = [
  { id: "all", label: "All", icon: FolderOpen },
  { id: "Frontend", label: "Frontend", icon: Globe },
  { id: "Backend", label: "Backend", icon: Database },
  { id: "Mobile", label: "Mobile", icon: Smartphone },
  { id: "Game", label: "Game", icon: Gamepad2 },
]

const projects = [
  {
    id: 1,
    title: "Todo List App",
    description: "Build a fully functional todo application with add, edit, delete, and filter functionality.",
    icon: Code,
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500",
    difficulty: "Beginner",
    duration: "4-6 hours",
    rating: "4.7",
    tags: ["Frontend", "JavaScript", "HTML", "CSS"],
    progress: 75,
  },
  {
    id: 2,
    title: "Weather Dashboard",
    description: "Create a weather app that fetches data from APIs and displays beautiful weather information.",
    icon: Globe,
    gradient: "bg-gradient-to-r from-green-500 to-blue-500",
    difficulty: "Intermediate",
    duration: "6-8 hours",
    rating: "4.5",
    tags: ["Frontend", "API", "JavaScript", "CSS"],
    progress: 0,
  },
  {
    id: 3,
    title: "E-commerce Store",
    description: "Build a complete online store with product listings, cart functionality, and checkout process.",
    icon: Database,
    gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
    difficulty: "Advanced",
    duration: "15-20 hours",
    rating: "4.9",
    tags: ["Frontend", "Backend", "Database", "Payment"],
    progress: 0,
  },
  {
    id: 4,
    title: "Blog Platform",
    description: "Create a blogging platform with user authentication, post creation, and comment system.",
    icon: Globe,
    gradient: "bg-gradient-to-r from-orange-500 to-red-500",
    difficulty: "Intermediate",
    duration: "10-12 hours",
    rating: "4.6",
    tags: ["Frontend", "Backend", "Database", "Auth"],
    progress: 30,
  },
  {
    id: 5,
    title: "Mobile Game",
    description: "Develop a simple mobile game using HTML5 Canvas and JavaScript with scoring system.",
    icon: Gamepad2,
    gradient: "bg-gradient-to-r from-teal-500 to-green-500",
    difficulty: "Intermediate",
    duration: "8-10 hours",
    rating: "4.4",
    tags: ["Game", "JavaScript", "Canvas", "Mobile"],
    progress: 0,
  },
  {
    id: 6,
    title: "Chat Application",
    description: "Build a real-time chat app with WebSocket connections and user presence indicators.",
    icon: Database,
    gradient: "bg-gradient-to-r from-indigo-500 to-purple-500",
    difficulty: "Advanced",
    duration: "12-15 hours",
    rating: "4.8",
    tags: ["Backend", "WebSocket", "Real-time", "Database"],
    progress: 0,
  },
]

function getDifficultyVariant(difficulty: string): "default" | "secondary" | "destructive" | "outline" {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "secondary"
    case "intermediate":
      return "default"
    case "advanced":
      return "destructive"
    default:
      return "outline"
  }
}
