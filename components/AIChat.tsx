"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Bot, User, Loader2 } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string; }

interface AIChatProps { onClose: () => void; }

export function AIChat({ onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey developer! 👋 I'm CodeBuddy AI. Ask me anything — debugging help, code explanations, algorithms, or best practices. What are you working on?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || data.error || "Error getting response." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please check your network." }]);
    } finally { setLoading(false); }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      style={{ background: "rgba(2,2,8,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-2xl h-[80vh] md:h-[600px] flex flex-col"
        style={{ background: "rgba(8,7,23,0.97)", border: "1px solid rgba(0,255,135,0.18)", borderRadius: 16 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(0,255,135,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[rgba(191,95,255,0.12)] border border-[rgba(191,95,255,0.25)] flex items-center justify-center">
              <Bot className="w-4.5 h-4.5" style={{ color: "var(--neon-violet)" }} />
            </div>
            <div>
              <div className="font-heading text-xs font-700 tracking-wider text-white">CODEBUDDY AI</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)]" style={{ boxShadow: "0 0 6px var(--neon-green)" }} />
                <span className="text-[10px] font-mono text-white/35">Groq · llama-3.3-70b</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${m.role === "assistant" ? "bg-[rgba(191,95,255,0.12)] border border-[rgba(191,95,255,0.2)]" : "bg-[rgba(0,255,135,0.1)] border border-[rgba(0,255,135,0.2)]"}`}>
                {m.role === "assistant"
                  ? <Bot className="w-3.5 h-3.5" style={{ color: "var(--neon-violet)" }} />
                  : <User className="w-3.5 h-3.5" style={{ color: "var(--neon-green)" }} />}
              </div>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === "assistant" ? "bg-[rgba(255,255,255,0.04)] border border-white/6 text-white/80" : "bg-[rgba(0,255,135,0.08)] border border-[rgba(0,255,135,0.15)] text-white/85"}`}
                style={{ fontFamily: "var(--font-body)", whiteSpace: "pre-wrap" }}>
                {m.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(191,95,255,0.12)] border border-[rgba(191,95,255,0.2)]">
                <Bot className="w-3.5 h-3.5" style={{ color: "var(--neon-violet)" }} />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-white/6 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--neon-violet)]" />
                <span className="text-xs font-mono text-white/30">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 pb-5 pt-3 border-t border-[rgba(0,255,135,0.08)]">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask a coding question… (Enter to send)"
              className="input-neon flex-1 resize-none min-h-[44px] max-h-[120px] py-3"
              style={{ lineHeight: 1.5 }}
            />
            <button onClick={send} disabled={!input.trim() || loading}
              className="btn-neon btn-neon-solid w-11 h-11 p-0 flex-shrink-0 rounded-xl self-end justify-center">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] font-mono text-white/20 mt-2 text-center">⇧↵ for new line · ↵ to send</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
