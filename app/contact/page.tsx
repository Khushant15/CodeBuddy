"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "Required";
    if (!form.email) e.email = "Required";
    if (!form.subject) e.subject = "Required";
    if (!form.message) e.message = "Required";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
    toast.success("Message sent!");
  };

  if (sent) return (
    <div className="container py-10 min-h-[80vh] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-12 max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(0,255,135,0.1)] border border-[rgba(0,255,135,0.25)] flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-[var(--neon-green)]" />
        </div>
        <h2 className="font-heading text-lg font-700 tracking-wider text-white mb-2">MESSAGE SENT</h2>
        <p className="text-sm text-white/40 mb-6">We&apos;ll get back to you within 24 hours.</p>
        <button onClick={() => setSent(false)} className="btn-neon btn-neon-solid py-2.5 px-6 text-[11px] justify-center w-full">Send Another</button>
      </motion.div>
    </div>
  );

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
        <p className="text-[11px] font-mono text-[var(--neon-green)] uppercase tracking-widest mb-3">Contact</p>
        <h1 className="font-heading text-4xl md:text-5xl font-800 text-white mb-4">
          GET IN <span className="gradient-heading">TOUCH</span>
        </h1>
        <p className="text-white/40 max-w-lg mx-auto text-sm">Have questions, feedback, or just want to say hi? We&apos;d love to hear from you.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <div className="card p-7">
            <h2 className="font-heading text-sm font-700 tracking-wider text-white/70 mb-6">SEND MESSAGE</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: "name", label: "Name", ph: "Your name", type: "text" },
                  { key: "email", label: "Email", ph: "you@example.com", type: "email" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-[10px] font-mono text-[var(--neon-green)] uppercase tracking-wider block mb-1.5">{f.label}</label>
                    <input type={f.type} placeholder={f.ph} value={form[f.key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="input-neon" />
                    {errors[f.key] && <p className="text-[10px] font-mono text-[var(--neon-pink)] mt-1">{errors[f.key]}</p>}
                  </div>
                ))}
              </div>
              <div>
                <label className="text-[10px] font-mono text-[var(--neon-green)] uppercase tracking-wider block mb-1.5">Subject</label>
                <input type="text" placeholder="What's this about?" value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })} className="input-neon" />
                {errors.subject && <p className="text-[10px] font-mono text-[var(--neon-pink)] mt-1">{errors.subject}</p>}
              </div>
              <div>
                <label className="text-[10px] font-mono text-[var(--neon-green)] uppercase tracking-wider block mb-1.5">Message</label>
                <textarea rows={5} placeholder="Tell us more…" value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="input-neon resize-none" />
                {errors.message && <p className="text-[10px] font-mono text-[var(--neon-pink)] mt-1">{errors.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-neon btn-neon-solid w-full py-3 justify-center text-[11px]">
                {loading ? "Sending…" : <><Send className="w-3.5 h-3.5" /> Send Message</>}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-5">
          <div className="card p-6">
            <h3 className="font-heading text-xs font-700 tracking-wider text-white/60 mb-5">CONTACT INFO</h3>
            <div className="space-y-4">
              {contactInfo.map((c, i) => (
                <motion.div key={c.title} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.iconBg}`}>
                    <c.icon className={`w-4.5 h-4.5 ${c.iconColor}`} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider">{c.title}</div>
                    <div className="text-sm text-white/65 mt-0.5">{c.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="card card-violet p-6">
            <h3 className="font-heading text-xs font-700 tracking-wider text-white/60 mb-5">FAQ</h3>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <div key={i} className="border-b border-white/6 pb-4 last:border-0 last:pb-0">
                  <h4 className="text-xs font-mono text-white/65 mb-1.5">{f.q}</h4>
                  <p className="text-xs text-white/35 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const contactInfo = [
  { title: "Email", value: "khushantsharma766@gmail.com", icon: Mail, iconBg: "bg-[rgba(0,255,135,0.1)]", iconColor: "text-[var(--neon-green)]" },
  { title: "Support", value: "Available 24/7 via AI assistant", icon: MessageCircle, iconBg: "bg-[rgba(0,229,255,0.1)]", iconColor: "text-[var(--neon-cyan)]" },
  { title: "Phone", value: "+91 720-850-0953", icon: Phone, iconBg: "bg-[rgba(255,107,43,0.1)]", iconColor: "text-[var(--neon-orange)]" },
  { title: "Location", value: "Mumbai, India", icon: MapPin, iconBg: "bg-[rgba(191,95,255,0.1)]", iconColor: "text-[var(--neon-violet)]" },
];

const faqs = [
  { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page and follow the email instructions." },
  { q: "Is CodeBuddy free?", a: "Yes! CodeBuddy offers a comprehensive free tier with access to most features." },
  { q: "Do you offer certificates?", a: "Yes, we provide certificates of completion for finished learning tracks." },
  { q: "Can I export my progress?", a: "You can export your learning progress and achievements from your dashboard." },
];
