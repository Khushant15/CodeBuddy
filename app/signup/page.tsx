"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { NeonButton } from "@/components/neon-button"
import { TerminalInput } from "@/components/terminal-input"
import { InfoCard } from "@/components/info-card"
import { Eye, EyeOff, UserPlus, ArrowRight, Chrome } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"

// Firebase imports
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/config";

const googleProvider = new GoogleAuthProvider();

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Beginner",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [terminalText, setTerminalText] = useState("")
  const router = useRouter()

  const terminalMessages = [
    "Initializing new developer profile...",
    "Setting up gamified learning environment...",
    "Ready to begin your coding journey!",
    "Choose your path and level up >_",
  ]

  useEffect(() => {
    let messageIndex = 0
    let charIndex = 0

    const typeMessage = () => {
      if (messageIndex < terminalMessages.length) {
        const currentMessage = terminalMessages[messageIndex]
        if (charIndex < currentMessage.length) {
          setTerminalText(currentMessage.slice(0, charIndex + 1))
          charIndex++
          setTimeout(typeMessage, 50)
        } else {
          setTimeout(() => {
            messageIndex++
            charIndex = 0
            if (messageIndex < terminalMessages.length) {
              setTerminalText("")
              setTimeout(typeMessage, 500)
            }
          }, 2000)
        }
      }
    }

    typeMessage()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    // TODO: Replace this with your signup API call!
    setTimeout(() => {
      setIsLoading(false)
      router.push("/home")
    }, 1500)
  }

  // Firebase Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google user:", result.user);
      setIsLoading(false)
      router.push("/home");
    } catch (error: any) {
      setIsLoading(false)
      console.error("Google sign-in error:", error.message)
      setErrors({ google: error.message || "Google sign-in failed" })
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <InfoCard className="p-8">
          {/* Terminal Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <UserPlus className="w-8 h-8 text-white" />
            </motion.div>

            <div className="bg-gray-900 rounded-lg p-4 mb-6 font-mono text-sm">
              <div className="text-green-400 min-h-[1.5rem]">
                $ {terminalText}
                <span className="animate-pulse">|</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold glow-text text-purple-400 mb-2">Create Account</h1>
            <p className="text-gray-300">Join the developer community</p>
          </div>

          {/* Google Signup Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <NeonButton
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 border-0"
              size="lg"
            >
              <Chrome className="w-5 h-5 mr-3" />
              {isLoading ? "Connecting..." : "Continue with Google"}
            </NeonButton>
            {errors.google && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400 mt-2">
                {errors.google}
              </motion.p>
            )}
          </motion.div>

          {/* Email/Password Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="name" className="text-purple-400">
                Full Name
              </Label>
              <TerminalInput
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400">
                  {errors.name}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-purple-400">
                Email Address
              </Label>
              <TerminalInput
                id="email"
                type="email"
                placeholder="developer@codebuddy.dev"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400">
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="role" className="text-purple-400">
                Developer Level
              </Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="terminal-input w-full"
              >
                <option value="Beginner">Beginner</option>
                <option value="Debugger Pro">Debugger Pro</option>
                <option value="Code Ninja">Code Ninja</option>
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="password" className="text-purple-400">
                Password
              </Label>
              <div className="relative">
                <TerminalInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400">
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="confirmPassword" className="text-purple-400">
                Confirm Password
              </Label>
              <TerminalInput
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              {errors.confirmPassword && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400">
                  {errors.confirmPassword}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <NeonButton type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  "Creating Account..."
                ) : (
                  <>
                    Start Journey
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </NeonButton>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                Login
              </Link>
            </p>
          </motion.div>
        </InfoCard>
      </motion.div>
    </div>
  )
}