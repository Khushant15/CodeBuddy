"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { AnimatedSection } from "@/components/animated-section"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Flame, BookOpen, Bug } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function DashboardPage() {
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
              Your <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Track your progress and achievements</p>
          </motion.div>
        </AnimatedSection>

        {/* Stats Overview */}
        <AnimatedSection className="mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-6 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.gradient} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        stat.change > 0
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {stat.change > 0 ? "+" : ""}
                      {stat.change}%
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{stat.title}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Learning Progress Chart */}
          <AnimatedSection>
            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold font-poppins mb-6">Learning Progress</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Skills Distribution */}
          <AnimatedSection>
            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold font-poppins mb-6">Skills Distribution</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={skillsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {skillsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>

        {/* Activity Chart */}
        <AnimatedSection className="mb-12">
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold font-poppins mb-6">Weekly Activity</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="lessons" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="challenges" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Achievements and Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Achievements */}
          <AnimatedSection>
            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold font-poppins mb-6">Recent Achievements</h2>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50"
                  >
                    <div className={`w-12 h-12 ${achievement.color} rounded-full flex items-center justify-center`}>
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="mb-1">{achievement.xp} XP</Badge>
                      <p className="text-xs text-gray-500">{achievement.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Current Goals */}
          <AnimatedSection>
            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold font-poppins mb-6">Current Goals</h2>
              <div className="space-y-6">
                {goals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{goal.title}</h3>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span>{goal.description}</span>
                      <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}

const stats = [
  {
    title: "Learning Streak",
    value: "12 days",
    icon: Flame,
    gradient: "bg-gradient-to-r from-orange-500 to-red-500",
    change: 20,
  },
  {
    title: "Total XP",
    value: "2,450",
    icon: Trophy,
    gradient: "bg-gradient-to-r from-yellow-500 to-orange-500",
    change: 15,
  },
  {
    title: "Lessons Completed",
    value: "47",
    icon: BookOpen,
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500",
    change: 8,
  },
  {
    title: "Challenges Solved",
    value: "24",
    icon: Bug,
    gradient: "bg-gradient-to-r from-green-500 to-blue-500",
    change: 12,
  },
]

const progressData = [
  { date: "Mon", hours: 2 },
  { date: "Tue", hours: 3 },
  { date: "Wed", hours: 1.5 },
  { date: "Thu", hours: 4 },
  { date: "Fri", hours: 2.5 },
  { date: "Sat", hours: 3.5 },
  { date: "Sun", hours: 2 },
]

const skillsData = [
  { name: "Python", value: 40, color: "#3B82F6" },
  { name: "HTML/CSS", value: 30, color: "#10B981" },
  { name: "JavaScript", value: 20, color: "#F59E0B" },
  { name: "Other", value: 10, color: "#8B5CF6" },
]

const activityData = [
  { day: "Mon", lessons: 3, challenges: 2 },
  { day: "Tue", lessons: 4, challenges: 1 },
  { day: "Wed", lessons: 2, challenges: 3 },
  { day: "Thu", lessons: 5, challenges: 2 },
  { day: "Fri", lessons: 3, challenges: 4 },
  { day: "Sat", lessons: 4, challenges: 3 },
  { day: "Sun", lessons: 2, challenges: 1 },
]

const achievements = [
  {
    id: 1,
    title: "Python Master",
    description: "Completed all Python fundamentals lessons",
    xp: 500,
    date: "2 days ago",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Debug Detective",
    description: "Solved 10 debugging challenges in a row",
    xp: 250,
    date: "5 days ago",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Streak Warrior",
    description: "Maintained a 7-day learning streak",
    xp: 200,
    date: "1 week ago",
    color: "bg-orange-500",
  },
]

const goals = [
  {
    id: 1,
    title: "Complete Python Track",
    description: "Finish all Python lessons and projects",
    current: 17,
    target: 20,
  },
  {
    id: 2,
    title: "Solve 50 Challenges",
    description: "Complete debugging and coding challenges",
    current: 24,
    target: 50,
  },
  {
    id: 3,
    title: "Build 3 Projects",
    description: "Complete portfolio-worthy projects",
    current: 1,
    target: 3,
  },
]
