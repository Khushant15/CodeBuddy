import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { ChatBot } from "@/components/chat-bot"
import { ToastProvider } from "@/components/toast-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "CodeBuddy - Gamified Developer Learning Platform",
  description:
    "Master programming through gamified lessons, debugging challenges, and hands-on projects. Learn Python, HTML, CSS with neon-themed interactive experience.",
  keywords: "programming, coding, education, debugging, projects, Python, HTML, CSS, gamified learning",
  authors: [{ name: "CodeBuddy Team" }],
  openGraph: {
    title: "CodeBuddy - Gamified Developer Learning",
    description: "Level up your coding skills with our neon-themed learning platform",
    type: "website",
    url: "https://codebuddy.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeBuddy - Gamified Developer Learning",
    description: "Level up your coding skills with our neon-themed learning platform",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "CodeBuddy",
              description: "Gamified developer learning platform",
              url: "https://codebuddy.dev",
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-inter antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ToastProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
              <Navigation />
              <main className="relative">{children}</main>
              <ChatBot />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
