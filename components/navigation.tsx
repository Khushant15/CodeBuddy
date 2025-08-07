"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { NeonButton } from "@/components/neon-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Code2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isLoggedIn =
    pathname.startsWith("/home") ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/practice") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/roadmap") ||
    pathname.startsWith("/dashboard")

  const navItems = isLoggedIn
    ? [
        { href: "/home", label: "Home" },
        { href: "/learn", label: "Learn" },
        { href: "/practice", label: "Debug" },
        { href: "/projects", label: "Projects" },
        { href: "/roadmap", label: "Roadmap" },
        { href: "/dashboard", label: "Dashboard" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/contact", label: "Contact" },
      ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "neon-card shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isLoggedIn ? "/home" : "/"} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold glow-text text-cyan-400">CodeBuddy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
                  pathname === item.href ? "text-cyan-400 glow-text" : "text-gray-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {!isLoggedIn ? (
              <>
                <NeonButton asChild variant="outline">
                  <Link href="/login">Login</Link>
                </NeonButton>
                <NeonButton asChild>
                  <Link href="/signup">Sign Up</Link>
                </NeonButton>
              </>
            ) : (
              <NeonButton asChild variant="outline">
                <Link href="/">Logout</Link>
              </NeonButton>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <NeonButton variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </NeonButton>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden neon-card mt-2 rounded-lg overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block text-sm font-medium transition-colors hover:text-cyan-400 ${
                    pathname === item.href ? "text-cyan-400 glow-text" : "text-gray-300"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-700 space-y-2">
                {!isLoggedIn ? (
                  <>
                    <NeonButton asChild variant="outline" className="w-full">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </NeonButton>
                    <NeonButton asChild className="w-full">
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        Sign Up
                      </Link>
                    </NeonButton>
                  </>
                ) : (
                  <NeonButton asChild variant="outline" className="w-full">
                    <Link href="/" onClick={() => setIsOpen(false)}>
                      Logout
                    </Link>
                  </NeonButton>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
