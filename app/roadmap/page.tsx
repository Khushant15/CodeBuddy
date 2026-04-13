"use client";
import { motion } from "framer-motion";
import { AuthGuard } from "@/components/AuthGuard";
import { CheckCircle, Circle, Lock, ArrowRight, Code2, Globe, Palette, Zap, ArrowDown } from "lucide-react";
import Link from "next/link";

const roadmaps = [
  {
    id: "python",
    title: "Python Developer",
    subtitle: "From zero to backend developer",
    icon: Code2,
    color: "var(--neon-green)",
    cardClass: "",
    href: "/learn/python",
    phases: [
      {
        phase: "Phase 1 — Foundations",
        weeks: "Weeks 1–2",
        steps: [
          { label: "Variables & Data Types", done: false, link: "/learn/python" },
          { label: "Operators & Expressions", done: false, link: "/learn/python" },
          { label: "Conditionals (if/else)", done: false, link: "/learn/python" },
          { label: "Loops (for & while)", done: false, link: "/learn/python" },
        ],
      },
      {
        phase: "Phase 2 — Functions & Data",
        weeks: "Weeks 3–4",
        steps: [
          { label: "Functions & Scope", done: false, link: "/learn/python" },
          { label: "Lists & Tuples", done: false, link: "/learn/python" },
          { label: "Dictionaries & Sets", done: false },
          { label: "String Methods", done: false },
        ],
      },
      {
        phase: "Phase 3 — OOP & Files",
        weeks: "Weeks 5–6",
        steps: [
          { label: "Classes & Objects", done: false },
          { label: "Inheritance & Polymorphism", done: false },
          { label: "File I/O", done: false },
          { label: "Error Handling (try/except)", done: false },
        ],
      },
      {
        phase: "Phase 4 — Real Projects",
        weeks: "Weeks 7–8",
        steps: [
          { label: "Build a CLI Calculator", done: false },
          { label: "Build a Todo App", done: false },
          { label: "Web Scraper with BeautifulSoup", done: false },
          { label: "REST API with Flask", done: false },
        ],
      },
    ],
  },
  {
    id: "webdev",
    title: "Web Developer",
    subtitle: "HTML → CSS → JavaScript → React",
    icon: Globe,
    color: "var(--neon-violet)",
    cardClass: "card-violet",
    href: "/learn/html",
    phases: [
      {
        phase: "Phase 1 — HTML",
        weeks: "Weeks 1–2",
        steps: [
          { label: "HTML Structure & DOCTYPE", done: false, link: "/learn/html" },
          { label: "Headings, Paragraphs, Lists", done: false, link: "/learn/html" },
          { label: "Links & Images", done: false, link: "/learn/html" },
          { label: "Forms & Inputs", done: false, link: "/learn/html" },
          { label: "Semantic HTML5", done: false, link: "/learn/html" },
        ],
      },
      {
        phase: "Phase 2 — CSS",
        weeks: "Weeks 3–4",
        steps: [
          { label: "Selectors & Box Model", done: false, link: "/learn/css" },
          { label: "Flexbox Layout", done: false, link: "/learn/css" },
          { label: "CSS Grid", done: false, link: "/learn/css" },
          { label: "Animations & Transitions", done: false, link: "/learn/css" },
          { label: "Responsive Design", done: false, link: "/learn/css" },
        ],
      },
      {
        phase: "Phase 3 — JavaScript",
        weeks: "Weeks 5–7",
        steps: [
          { label: "Variables, Types & Functions", done: false },
          { label: "DOM Manipulation", done: false },
          { label: "Events & Listeners", done: false },
          { label: "Fetch API & Promises", done: false },
          { label: "ES6+ Features", done: false },
        ],
      },
      {
        phase: "Phase 4 — React",
        weeks: "Weeks 8–10",
        steps: [
          { label: "Components & JSX", done: false },
          { label: "Props & State", done: false },
          { label: "Hooks (useState, useEffect)", done: false },
          { label: "Build a Portfolio Site", done: false },
        ],
      },
    ],
  },
  {
    id: "css",
    title: "CSS & Design",
    subtitle: "Become a CSS expert",
    icon: Palette,
    color: "var(--neon-cyan)",
    cardClass: "card-cyan",
    href: "/learn/css",
    phases: [
      {
        phase: "Phase 1 — CSS Foundations",
        weeks: "Weeks 1–2",
        steps: [
          { label: "Syntax & Selectors", done: false, link: "/learn/css" },
          { label: "Colors & Typography", done: false, link: "/learn/css" },
          { label: "Box Model", done: false, link: "/learn/css" },
          { label: "Display & Positioning", done: false, link: "/learn/css" },
        ],
      },
      {
        phase: "Phase 2 — Layouts",
        weeks: "Weeks 3–4",
        steps: [
          { label: "Flexbox Mastery", done: false, link: "/learn/css" },
          { label: "CSS Grid", done: false, link: "/learn/css" },
          { label: "Responsive & Media Queries", done: false, link: "/learn/css" },
          { label: "Mobile-First Design", done: false },
        ],
      },
      {
        phase: "Phase 3 — Advanced CSS",
        weeks: "Weeks 5–6",
        steps: [
          { label: "CSS Variables & Custom Properties", done: false },
          { label: "Animations & Keyframes", done: false },
          { label: "CSS Transitions", done: false },
          { label: "Pseudo-classes & Pseudo-elements", done: false },
        ],
      },
      {
        phase: "Phase 4 — Frameworks",
        weeks: "Weeks 7–8",
        steps: [
          { label: "Tailwind CSS Basics", done: false },
          { label: "Component Design Systems", done: false },
          { label: "Dark Mode Theming", done: false },
          { label: "Build a Design System", done: false },
        ],
      },
    ],
  },
];

export default function RoadmapPage() {
  return (
    <AuthGuard>
      <div className="container py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-[11px] font-mono text-[var(--neon-green)] uppercase tracking-widest mb-2">Learning Roadmaps</p>
          <h1 className="font-heading text-3xl md:text-5xl font-800 text-white mb-4">
            YOUR PATH TO <span className="gradient-heading">MASTERY</span>
          </h1>
          <p className="text-white/40 text-sm max-w-xl leading-relaxed">
            Structured learning paths from beginner to job-ready developer. Pick a track and follow the phases week by week.
          </p>
        </motion.div>

        <div className="space-y-12">
          {roadmaps.map((rm, ri) => (
            <motion.div key={rm.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: ri * 0.1 }} viewport={{ once: true }}>
              {/* Roadmap header */}
              <div className={`card ${rm.cardClass} p-6 mb-6`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: rm.color + "15", border: `1px solid ${rm.color}30` }}>
                      <rm.icon className="w-6 h-6" style={{ color: rm.color }} />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-700 tracking-wider text-white">{rm.title}</h2>
                      <p className="text-xs text-white/40 mt-0.5">{rm.subtitle}</p>
                    </div>
                  </div>
                  <Link href={rm.href} className="btn-neon py-2.5 px-5 text-[10px] self-start sm:self-auto" style={{ borderColor: rm.color + "60", color: rm.color, background: rm.color + "08" }}>
                    Start This Track <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Phases timeline */}
              <div className="grid md:grid-cols-2 gap-5">
                {rm.phases.map((phase, pi) => (
                  <motion.div key={pi} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: pi * 0.08 }} viewport={{ once: true }}>
                    <div className="card p-5 h-full">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-heading text-xs font-800" style={{ background: rm.color + "15", color: rm.color }}>
                          {pi + 1}
                        </div>
                        <div>
                          <h3 className="font-heading text-xs font-700 tracking-wider text-white/80">{phase.phase}</h3>
                          <p className="text-[10px] font-mono text-white/25 mt-0.5">{phase.weeks}</p>
                        </div>
                      </div>

                      <div className="space-y-2.5 ml-10">
                        {phase.steps.map((step, si) => (
                          <div key={si} className="flex items-center gap-2.5">
                            {step.done
                              ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: rm.color }} />
                              : <Circle className="w-3.5 h-3.5 flex-shrink-0 text-white/15" />}
                            {step.link ? (
                              <Link href={step.link} className="text-xs font-mono text-white/50 hover:text-white/80 hover:underline transition-colors">
                                {step.label}
                              </Link>
                            ) : (
                              <span className="text-xs font-mono text-white/30 flex items-center gap-1.5">
                                {step.label}
                                <Lock className="w-2.5 h-2.5 text-white/15" />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-14">
          <div className="card p-8 text-center">
            <Zap className="w-10 h-10 mx-auto mb-4 text-[var(--neon-green)]" />
            <h3 className="font-heading text-xl font-700 tracking-wider text-white mb-2">NOT SURE WHERE TO START?</h3>
            <p className="text-sm text-white/40 mb-6 max-w-md mx-auto">If you&apos;re completely new to coding, start with Python. If you want to build websites, go with the Web Developer track.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/learn/python" className="btn-neon btn-neon-solid py-3 px-6 text-[11px] justify-center">Start Python →</Link>
              <Link href="/learn/html" className="btn-neon py-3 px-6 text-[11px] justify-center">Start Web Dev →</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AuthGuard>
  );
}
