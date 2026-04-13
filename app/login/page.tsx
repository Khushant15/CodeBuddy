"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome, Terminal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginWithEmail, loginWithGoogle } from "@/app/firebase/authMethods";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [terminalLine, setTerminalLine] = useState(0);

  const termLines = [
    "$ sudo auth --mode=secure",
    "✓ Encryption protocol loaded",
    "✓ Session manager initialized",
    "✓ Ready for authentication >_",
  ];

  useEffect(() => {
    const t = setInterval(() => setTerminalLine(p => p < termLines.length - 1 ? p + 1 : p), 800);
    return () => clearInterval(t);
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleEmail = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await loginWithEmail(form.email, form.password);
      toast.success("Welcome back!");
      router.push("/home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setErrors({ email: message.includes("user-not-found") ? "Account not found" : message.includes("wrong-password") ? "Incorrect password" : "Login failed. Check credentials." });
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Welcome back!");
      router.push("/home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google login failed";
      toast.error(message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        {/* Terminal header */}
        <div className="terminal mb-6">
          <div className="terminal-header">
            <div className="terminal-dot bg-[#ff5f57]" />
            <div className="terminal-dot bg-[#ffbd2e]" />
            <div className="terminal-dot bg-[#28ca42]" />
            <span className="ml-3 text-[10px] font-mono text-white/30">auth.system</span>
          </div>
          <div className="terminal-body text-[11px]">
            {termLines.slice(0, terminalLine + 1).map((l, i) => (
              <div key={i} className={i === terminalLine ? "text-[var(--neon-green)]" : "text-white/30"}>{l}</div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(0,255,135,0.08)] border border-[rgba(0,255,135,0.2)] flex items-center justify-center mx-auto mb-4">
              <Terminal className="w-7 h-7" style={{ color: "var(--neon-green)" }} />
            </div>
            <h1 className="font-heading text-xl font-700 tracking-wider text-white">SYSTEM ACCESS</h1>
            <p className="text-sm text-white/35 mt-1 font-mono">Welcome back, developer</p>
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-[rgba(255,255,255,0.1)] bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-mono transition-all mb-6">
            <Chrome className="w-4 h-4" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs font-mono text-white/25">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <form onSubmit={handleEmail} className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--neon-green)] mb-2 uppercase tracking-wider">
                <Mail className="w-3 h-3" /> Email
              </label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} className="input-neon" />
              {errors.email && <p className="text-[11px] text-[var(--neon-pink)] mt-1 font-mono">{errors.email}</p>}
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--neon-green)] mb-2 uppercase tracking-wider">
                <Lock className="w-3 h-3" /> Password
              </label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} className="input-neon pr-12" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-[var(--neon-pink)] mt-1 font-mono">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-neon btn-neon-solid w-full py-3 mt-2 justify-center">
              {loading ? "Authenticating..." : <><ArrowRight className="w-4 h-4" /> Access System</>}
            </button>
          </form>

          <p className="text-center text-xs text-white/30 mt-6 font-mono">
            No account?{" "}
            <Link href="/signup" className="text-[var(--neon-green)] hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
