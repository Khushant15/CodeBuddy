"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { NeonButton } from "@/components/neon-button"
import { TerminalInput } from "@/components/terminal-input"
import { InfoCard } from "@/components/info-card"
import { Eye, EyeOff, Terminal, ArrowRight, Mail, Phone, Shield, Chrome } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [terminalText, setTerminalText] = useState("")
  const router = useRouter()

  const terminalMessages = [
    "$ sudo access-granted --user=developer",
    "$ initializing secure authentication protocol...",
    "$ loading biometric scanners... ✓",
    "$ quantum encryption enabled... ✓",
    "$ multi-factor authentication ready >_",
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
          setTimeout(typeMessage, 30)
        } else {
          setTimeout(() => {
            messageIndex++
            charIndex = 0
            if (messageIndex < terminalMessages.length) {
              setTerminalText("")
              setTimeout(typeMessage, 800)
            }
          }, 1500)
        }
      }
    }

    typeMessage()
  }, [])

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [otpTimer])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      setIsLoading(false)
      router.push("/home")
    }, 1500)
  }

  const handleSendOTP = async () => {
    if (!formData.phone) {
      setErrors({ phone: "Phone number is required" })
      return
    }

    setIsLoading(true)
    setErrors({})

    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true)
      setOtpTimer(60)
      setIsLoading(false)
    }, 1000)
  }

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.otp) {
      setErrors({ otp: "OTP is required" })
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/home")
    }, 1500)
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)
    // Simulate Google OAuth
    setTimeout(() => {
      router.push("/home")
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-2xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <InfoCard className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Terminal className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold glow-text text-cyan-400 mb-2">System Access</h1>
            <p className="text-gray-300 mb-6">Choose your authentication method</p>

            {/* Terminal Animation */}
            <div className="bg-gray-900 rounded-lg p-4 mb-6 font-mono text-sm border border-green-500/30">
              <div className="text-green-400 min-h-[1.5rem]">
                {terminalText}
                <span className="animate-pulse">|</span>
              </div>
            </div>
          </div>

          {/* Google Sign-In */}
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
          </motion.div>

          <div className="relative mb-6">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-gray-900 px-4 text-sm text-gray-400">or</span>
            </div>
          </div>

          {/* Method Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex rounded-lg bg-gray-800/50 p-1 mb-6"
          >
            <button
              onClick={() => setLoginMethod("email")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === "email" ? "bg-cyan-500 text-white shadow-lg" : "text-gray-400 hover:text-cyan-400"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={() => setLoginMethod("phone")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === "phone" ? "bg-cyan-500 text-white shadow-lg" : "text-gray-400 hover:text-cyan-400"
              }`}
            >
              <Phone className="w-4 h-4" />
              Phone
            </button>
          </motion.div>

          {/* Email Login Form */}
          {loginMethod === "email" && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleEmailLogin}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cyan-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-cyan-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <TerminalInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
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
              </div>

              <NeonButton type="submit" className="w-full" disabled={isLoading} size="lg">
                {isLoading ? (
                  "Authenticating..."
                ) : (
                  <>
                    Access System
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </NeonButton>
            </motion.form>
          )}

          {/* Phone Login Form */}
          {loginMethod === "phone" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-cyan-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <div className="flex gap-2">
                  <TerminalInput
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="flex-1"
                    disabled={otpSent}
                  />
                  <NeonButton
                    type="button"
                    onClick={handleSendOTP}
                    disabled={isLoading || otpTimer > 0}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    {otpTimer > 0 ? `${otpTimer}s` : otpSent ? "Resend" : "Send OTP"}
                  </NeonButton>
                </div>
                {errors.phone && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400">
                    {errors.phone}
                  </motion.p>
                )}
              </div>

              {otpSent && (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleOTPLogin}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-cyan-400 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Enter OTP
                    </Label>
                    <TerminalInput
                      id="otp"
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      value={formData.otp}
                      onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    />
                    {errors.otp && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400">
                        {errors.otp}
                      </motion.p>
                    )}
                  </div>

                  <NeonButton type="submit" className="w-full" disabled={isLoading} size="lg">
                    {isLoading ? (
                      "Verifying..."
                    ) : (
                      <>
                        Verify & Login
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </NeonButton>
                </motion.form>
              )}
            </motion.div>
          )}

          {/* reCAPTCHA Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
          >
            <div
              id="recaptcha-container"
              className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 text-center text-sm text-gray-400"
            >
              🤖 reCAPTCHA verification will appear here
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 text-center space-y-4"
          >
            <p className="text-sm text-gray-400">
              New to CodeBuddy?{" "}
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Create Account
              </Link>
            </p>
            <p className="text-xs text-gray-500">Protected by quantum encryption & multi-factor authentication</p>
          </motion.div>
        </InfoCard>
      </motion.div>
    </div>
  )
}
