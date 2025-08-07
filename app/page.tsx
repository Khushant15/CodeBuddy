"use client"

import { motion } from "framer-motion"
import { NeonButton } from "@/components/neon-button"
import { InfoCard } from "@/components/info-card"
import { ArrowRight, Zap, Users, Trophy, Github, ExternalLink, Code2, Gamepad2 } from "lucide-react"
import Link from "next/link"
import { TerminalHero } from "@/components/terminal-hero"

export default function WelcomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full neon-card mb-8"
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">{"Start Your Coding Journey"} </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="glow-text text-cyan-400">Code</span>
              <span className="glow-text text-purple-400">Buddy</span>
              <br />
              <span className="text-3xl md:text-4xl text-gray-300">Level Up Your Skills</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Master programming through gamified lessons, debugging challenges, and hands-on projects. Earn XP, unlock
              achievements, and become a coding legend! 🚀
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <NeonButton asChild size="lg">
                <Link href="/signup">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </NeonButton>

              <NeonButton asChild variant="outline" size="lg">
                <Link href="/login">Login</Link>
              </NeonButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>50,000+ Developers Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>1M+ XP Earned Daily</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Terminal Hero Animation */}
          <TerminalHero />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="glow-text text-cyan-400">CodeBuddy</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of coding education with our gamified platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <InfoCard className="p-8 h-full transition-all duration-300 group-hover:pulse-glow">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-cyan-400">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </InfoCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900/50 to-purple-900/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Explore <span className="glow-text text-purple-400">More</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover additional resources and connect with the community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {infoCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Link href={card.href} target={card.external ? "_blank" : undefined}>
                  <InfoCard className="p-6 h-full info-card-glow cursor-pointer group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <card.icon className="w-5 h-5 text-white" />
                      </div>
                      {card.external && <ExternalLink className="w-4 h-4 text-gray-400" />}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-cyan-400">{card.title}</h3>
                    <p className="text-gray-300 text-sm">{card.description}</p>
                  </InfoCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <InfoCard className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 glow-text text-cyan-400">Ready to Level Up? 🎮</h2>
              <p className="text-xl text-gray-300 mb-8">Join thousands of developers on their coding journey</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NeonButton asChild size="lg">
                  <Link href="/signup">
                    Start Learning Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </NeonButton>
                <NeonButton asChild variant="outline" size="lg">
                  <Link href="/contact">Get in Touch</Link>
                </NeonButton>
              </div>
            </InfoCard>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: Code2,
    title: "Interactive IDE",
    description: "Code directly in your browser with our built-in IDE featuring syntax highlighting and live preview.",
  },
  {
    icon: Gamepad2,
    title: "Gamified Learning",
    description: "Earn XP, unlock achievements, and compete with friends as you master programming concepts.",
  },
  {
    icon: Zap,
    title: "AI-Powered Hints",
    description: "Get instant help from our AI assistant when you're stuck on debugging challenges.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Learn alongside thousands of developers and share your progress with the community.",
  },
  {
    icon: Trophy,
    title: "Achievement System",
    description: "Unlock badges, maintain streaks, and climb the leaderboards as you progress.",
  },
  {
    icon: Code2,
    title: "Real Projects",
    description: "Build portfolio-worthy projects with step-by-step guidance and debugging practice.",
  },
]

const infoCards = [
  {
    title: "About CodeBuddy",
    description: "Learn more about our mission and the team behind the platform",
    icon: Users,
    href: "/about",
    external: false,
  },
  {
    title: "Debug Practice",
    description: "Sharpen your debugging skills with real-world challenges",
    icon: Code2,
    href: "/practice",
    external: false,
  },
  {
    title: "GitHub Repository",
    description: "Check out our open-source codebase and contribute",
    icon: Github,
    href: "https://github.com/Khushant15",
    external: true,
  },
  {
    title: "Developer Portfolio",
    description: "Explore the creator's portfolio and other projects",
    icon: ExternalLink,
    href: "https://your-portfolio-link-here",
    external: true,
  },
]
