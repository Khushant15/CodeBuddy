"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupWithEmail, loginWithGoogle } from "@/app/firebase/authMethods";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await signupWithEmail(form.email, form.password);
      toast.success("Account created! Let's code.");
      router.push("/home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setErrors({ email: message.includes("email-already-in-use") ? "Email already registered" : "Signup failed" });
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Welcome to CodeBuddy!");
      router.push("/home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google signup failed";
      toast.error(message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(0,255,135,0.08)] border border-[rgba(0,255,135,0.2)] flex items-center justify-center mx-auto mb-4">
              <User className="w-7 h-7" style={{ color: "var(--neon-green)" }} />
            </div>
            <h1 className="font-heading text-xl font-700 tracking-wider text-white">CREATE ACCOUNT</h1>
            <p className="text-sm text-white/35 mt-1 font-mono">Join the developer community</p>
          </div>

          <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-[rgba(255,255,255,0.1)] bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-mono transition-all mb-6">
            <Chrome className="w-4 h-4" />
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs font-mono text-white/25">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: "Display Name", icon: User, type: "text", ph: "Your name" },
              { key: "email", label: "Email", icon: Mail, type: "email", ph: "you@example.com" },
            ].map(f => (
              <div key={f.key}>
                <label className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--neon-green)] mb-2 uppercase tracking-wider">
                  <f.icon className="w-3 h-3" /> {f.label}
                </label>
                <input type={f.type} placeholder={f.ph}
                  value={form[f.key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="input-neon" />
                {errors[f.key] && <p className="text-[11px] text-[var(--neon-pink)] mt-1 font-mono">{errors[f.key]}</p>}
              </div>
            ))}

            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--neon-green)] mb-2 uppercase tracking-wider">
                <Lock className="w-3 h-3" /> Password
              </label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} placeholder="Min 6 chars" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} className="input-neon pr-12" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-[var(--neon-pink)] mt-1 font-mono">{errors.password}</p>}
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--neon-green)] mb-2 uppercase tracking-wider">
                <Lock className="w-3 h-3" /> Confirm Password
              </label>
              <input type="password" placeholder="Repeat password" value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })} className="input-neon" />
              {errors.confirm && <p className="text-[11px] text-[var(--neon-pink)] mt-1 font-mono">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-neon btn-neon-solid w-full py-3 mt-2 justify-center">
              {loading ? "Creating account..." : <><ArrowRight className="w-4 h-4" /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-xs text-white/30 mt-6 font-mono">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--neon-green)] hover:underline">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
