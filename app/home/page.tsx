"use client"

import { motion } from "framer-motion"
import { InfoCard } from "@/components/info-card"
import { NeonButton } from "@/components/neon-button"
import { XPBadge } from "@/components/xp-badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Bug,
  FolderOpen,
  Map,
  BarChart3,
  MessageCircle,
  Trophy,
  Flame,
  Target,
  Clock,
  ArrowRight,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, <span className="glow-text text-cyan-400">CodeNinja</span>! 🥷
          </h1>
          <p className="text-xl text-gray-300">Ready to level up your coding skills?</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <InfoCard className="p-8">
            <div className="grid md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <div
                    className={`w-16 h-16 ${stat.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:pulse-glow transition-all`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    className="text-2xl font-bold mb-1 text-cyan-400"
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-sm text-gray-300">{stat.title}</p>
                </motion.div>
              ))}
            </div>
          </InfoCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-center glow-text text-purple-400">Continue Learning</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link href={action.href}>
                  <InfoCard className="p-6 cursor-pointer transition-all duration-300 group-hover:pulse-glow h-full">
                    <div
                      className={`w-12 h-12 ${action.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-cyan-400">{action.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{action.description}</p>
                    {action.progress && (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-cyan-400">{action.progress}%</span>
                        </div>
                        <Progress value={action.progress} className="h-2" />
                      </div>
                    )}
                    <div className="flex items-center text-cyan-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Continue <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </InfoCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-center glow-text text-purple-400">Recent Activity</h2>

          <InfoCard className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors border border-gray-700/50"
                >
                  <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center`}>
                    <activity.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-200">{activity.title}</p>
                    <p className="text-sm text-gray-400">{activity.time}</p>
                  </div>
                  {activity.badge && (
                    <XPBadge xp={Number.parseInt(activity.badge.replace("+", "").replace(" XP", ""))} />
                  )}
                </motion.div>
              ))}
            </div>
          </InfoCard>
        </motion.div>

        {/* Daily Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <InfoCard className="p-8 text-center info-card-glow">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-8 h-8 text-yellow-400" />
              <h2 className="text-2xl font-bold glow-text text-yellow-400">Daily Challenge</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Complete today's coding challenge to maintain your streak and earn bonus XP!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NeonButton size="lg" asChild>
                <Link href="/practice">
                  Take Challenge
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </NeonButton>
              <NeonButton variant="outline" size="lg" asChild>
                <Link href="/dashboard">View Progress</Link>
              </NeonButton>
            </div>
          </InfoCard>
        </motion.div>
      </div>
    </div>
  )
}

const stats = [
  {
    title: "Day Streak",
    value: "15",
    icon: Flame,
    gradient: "bg-gradient-to-r from-orange-500 to-red-500",
  },
  {
    title: "Total XP",
    value: "2,450",
    icon: Trophy,
    gradient: "bg-gradient-to-r from-yellow-500 to-orange-500",
  },
  {
    title: "Level Progress",
    value: "85%",
    icon: Target,
    gradient: "bg-gradient-to-r from-green-500 to-blue-500",
  },
  {
    title: "This Week",
    value: "32h",
    icon: Clock,
    gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
]

const quickActions = [
  {
    title: "Learn",
    description: "Continue with Python fundamentals and explore new concepts",
    icon: BookOpen,
    href: "/learn",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500",
    progress: 85,
  },
  {
    title: "Debug Practice",
    description: "Solve debugging challenges and improve your skills",
    icon: Bug,
    href: "/practice",
    gradient: "bg-gradient-to-r from-green-500 to-blue-500",
    progress: 60,
  },
  {
    title: "Projects",
    description: "Build real-world applications and expand your portfolio",
    icon: FolderOpen,
    href: "/projects",
    gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
    progress: 40,
  },
  {
    title: "Roadmap",
    description: "Follow structured learning paths for your career goals",
    icon: Map,
    href: "/roadmap",
    gradient: "bg-gradient-to-r from-orange-500 to-red-500",
  },
  {
    title: "Dashboard",
    description: "Track your progress and view detailed analytics",
    icon: BarChart3,
    href: "/dashboard",
    gradient: "bg-gradient-to-r from-teal-500 to-green-500",
  },
  {
    title: "AI Help",
    description: "Get instant help from our AI programming assistant",
    icon: MessageCircle,
    href: "#",
    gradient: "bg-gradient-to-r from-indigo-500 to-purple-500",
  },
]

const recentActivity = [
  {
    title: 'Completed "Python Lists and Tuples" lesson',
    time: "2 hours ago",
    icon: BookOpen,
    color: "bg-blue-500",
    badge: "+50 XP",
  },
  {
    title: 'Solved debugging challenge: "Fix the Loop"',
    time: "5 hours ago",
    icon: Bug,
    color: "bg-green-500",
    badge: "+75 XP",
  },
  {
    title: 'Started project: "Personal Portfolio Website"',
    time: "1 day ago",
    icon: FolderOpen,
    color: "bg-purple-500",
  },
  {
    title: 'Earned badge: "Python Beginner"',
    time: "2 days ago",
    icon: Trophy,
    color: "bg-yellow-500",
    badge: "+100 XP",
  },
]
