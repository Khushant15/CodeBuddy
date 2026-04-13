"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Trash2 } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  ts: Date;
}

const WELCOME: Message = {
  id: 0,
  role: "assistant",
  ts: new Date(),
  content: "Hey! 👋 I'm **CodeBuddy AI** — your personal coding assistant.\n\nAsk me anything:\n• Debug your code\n• Explain concepts\n• Help with exercises\n• Career advice\n\nWhat are you working on?",
};

function renderContent(text: string) {
  // Bold **text**, inline code `code`, and newlines
  return text
    .split("\n")
    .map((line, i) => {
      const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith("`") && part.endsWith("`"))
          return <code key={j} className="bg-[rgba(0,255,135,0.12)] text-[var(--neon-green)] px-1 py-0.5 rounded text-[11px] font-mono">{part.slice(1, -1)}</code>;
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={j} className="text-white/90 font-semibold">{part.slice(2, -2)}</strong>;
        return <span key={j}>{part}</span>;
      });
      return <div key={i} className={i < text.split("\n").length - 1 ? "mb-1" : ""}>{parts}</div>;
    });
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [open, messages]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: Message = { id: Date.now(), role: "user", content: msg, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      const botMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply || data.error || "⚠️ Something went wrong.",
        ts: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: "assistant", ts: new Date(),
        content: "⚠️ Connection error. Please check your network.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all"
        style={{
          background: open ? "rgba(191,95,255,0.2)" : "var(--neon-green)",
          border: open ? "1.5px solid var(--neon-violet)" : "none",
          boxShadow: open ? "0 0 20px rgba(191,95,255,0.4)" : "0 0 30px rgba(0,255,135,0.5)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        title="CodeBuddy AI"
      >
        {open
          ? <X className="w-5 h-5 text-[var(--neon-violet)]" />
          : <MessageCircle className="w-6 h-6 text-[var(--void-950)]" />
        }
        {!open && unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--neon-pink)] text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] sm:w-[400px] flex flex-col"
            style={{
              height: "520px",
              background: "rgba(6,5,18,0.97)",
              border: "1px solid rgba(191,95,255,0.2)",
              borderRadius: "20px",
              boxShadow: "0 0 60px rgba(0,0,0,0.6), 0 0 30px rgba(191,95,255,0.08)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[rgba(191,95,255,0.15)] border border-[rgba(191,95,255,0.3)] flex items-center justify-center relative">
                  <Sparkles className="w-4 h-4 text-[var(--neon-violet)]" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[var(--neon-green)] border-2 border-[rgba(6,5,18,1)]" style={{ boxShadow: "0 0 6px var(--neon-green)" }} />
                </div>
                <div>
                  <div className="font-heading text-xs font-700 tracking-wider text-white">CODEBUDDY AI</div>
                  <div className="text-[10px] font-mono text-[var(--neon-green)]">● Online · Groq llama-3.3-70b</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setMessages([WELCOME])} title="Clear chat"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-[var(--neon-pink)] hover:bg-[rgba(255,45,120,0.08)] transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/5 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${m.role === "assistant" ? "bg-[rgba(191,95,255,0.12)] border border-[rgba(191,95,255,0.2)]" : "bg-[rgba(0,255,135,0.1)] border border-[rgba(0,255,135,0.2)]"}`}>
                    {m.role === "assistant"
                      ? <Bot className="w-3 h-3 text-[var(--neon-violet)]" />
                      : <User className="w-3 h-3 text-[var(--neon-green)]" />}
                  </div>
                  <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${m.role === "assistant" ? "bg-[rgba(255,255,255,0.04)] border border-white/6 text-white/75 rounded-tl-sm" : "bg-[rgba(0,255,135,0.08)] border border-[rgba(0,255,135,0.15)] text-white/85 rounded-tr-sm"}`}>
                    {renderContent(m.content)}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[rgba(191,95,255,0.12)] border border-[rgba(191,95,255,0.2)]">
                    <Bot className="w-3 h-3 text-[var(--neon-violet)]" />
                  </div>
                  <div className="px-3.5 py-3 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-white/6 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin text-[var(--neon-violet)]" />
                    <span className="text-[11px] font-mono text-white/30">Thinking…</span>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-2 border-t border-[rgba(255,255,255,0.05)] flex-shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask a coding question…"
                  className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl px-3.5 py-2.5 text-[13px] text-white/80 placeholder:text-white/20 outline-none resize-none max-h-[100px] font-body leading-relaxed"
                  style={{ minHeight: 40 }}
                  onInput={e => {
                    const t = e.currentTarget;
                    t.style.height = "auto";
                    t.style.height = Math.min(t.scrollHeight, 100) + "px";
                  }}
                />
                <button onClick={send} disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30"
                  style={{
                    background: input.trim() && !loading ? "var(--neon-green)" : "rgba(255,255,255,0.05)",
                    boxShadow: input.trim() && !loading ? "0 0 16px rgba(0,255,135,0.4)" : "none",
                  }}>
                  <Send className="w-4 h-4" style={{ color: input.trim() && !loading ? "var(--void-950)" : "rgba(255,255,255,0.2)" }} />
                </button>
              </div>
              <p className="text-[9px] font-mono text-white/15 mt-1.5 text-center">⇧↵ newline · ↵ send · Powered by Groq</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
