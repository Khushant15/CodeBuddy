import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "sonner";
import { ChatBot } from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "CodeBuddy — Gamified Coding Platform",
  description: "Learn to code through gamified lessons, challenges, and AI-powered help.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Outfit:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Background orbs */}
        <div className="bg-orbs">
          <div className="orb w-[600px] h-[600px] bg-[#00ff87] top-[-100px] left-[-100px]" />
          <div className="orb w-[500px] h-[500px] bg-[#bf5fff] bottom-[-100px] right-[-100px]" style={{opacity:0.08}} />
          <div className="orb w-[400px] h-[400px] bg-[#00e5ff] top-[40%] left-[40%]" style={{opacity:0.05}} />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <footer className="border-t border-[rgba(0,255,135,0.08)] py-8 mt-16">
            <div className="container">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--neon-green)] font-heading text-sm tracking-widest">CODEBUDDY</span>
                </div>
                <p className="text-xs text-white/25 font-mono">© 2025 CodeBuddy · Built for developers, by developers</p>
                <div className="flex gap-6">
                  {["Terms","Privacy","Docs"].map(l => (
                    <a key={l} href="#" className="text-xs text-white/30 hover:text-[var(--neon-green)] transition-colors font-mono">{l}</a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </div>

        <ChatBot />
        <Toaster position="bottom-right" toastOptions={{
          style: { background: "rgba(13,11,28,0.95)", border: "1px solid rgba(0,255,135,0.2)", color: "#e2e0f5" }
        }} />
      </body>
    </html>
  );
}
