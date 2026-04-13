"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthGuard } from "@/components/AuthGuard";
import { Bug, Clock, Trophy, Zap, Target, Search, Lock, Filter, Lightbulb, CheckCircle, XCircle, ChevronLeft, Play, RotateCcw, Eye, EyeOff } from "lucide-react";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { completeChallengeInFirebase, getOrCreateUserProfile } from "@/lib/userService";
import { formatTime } from "@/lib/utils";

/* ─────────────────── CHALLENGE DATA ─────────────────── */
const challenges = [
  {
    id: "ch-1", title: "Fix the Greeting", difficulty: "Easy", lang: "Python", time: 600, xp: 50, locked: false,
    desc: "The function should return 'Hello, [name]!' but it has a bug.",
    buggyCode: `def greet(name):
    message = "Hello, " + Name + "!"
    return message

print(greet("Alex"))`,
    hints: [
      "Python is case-sensitive — check variable names carefully.",
      "Look at line 2 — what variable was defined vs what's being used?",
      "The parameter is 'name' (lowercase), not 'Name'.",
    ],
    solution: `def greet(name):
    message = "Hello, " + name + "!"
    return message

print(greet("Alex"))`,
    explanation: "Python is case-sensitive. 'Name' (capital N) is undefined — the parameter is 'name' (lowercase). Changing 'Name' to 'name' fixes it.",
    testCases: [
      { input: 'greet("Alex")', expected: "Hello, Alex!" },
      { input: 'greet("World")', expected: "Hello, World!" },
    ],
  },
  {
    id: "ch-2", title: "Infinite Loop Fix", difficulty: "Easy", lang: "Python", time: 600, xp: 60, locked: false,
    desc: "This while loop runs forever. Fix it to print numbers 1–5.",
    buggyCode: `count = 1
while count <= 5:
    print(count)

print("Done!")`,
    hints: [
      "The loop condition checks 'count <= 5', but does 'count' ever change?",
      "Inside the loop, you need to increment count.",
      "Add 'count += 1' as the last line inside the while loop.",
    ],
    solution: `count = 1
while count <= 5:
    print(count)
    count += 1

print("Done!")`,
    explanation: "Without 'count += 1', the variable never changes, so 'count <= 5' is always True. Adding the increment makes the loop terminate after 5 iterations.",
    testCases: [
      { input: "Loop output", expected: "1, 2, 3, 4, 5, Done!" },
    ],
  },
  {
    id: "ch-3", title: "Wrong Division Result", difficulty: "Easy", lang: "Python", time: 480, xp: 55, locked: false,
    desc: "The function should return the average of two numbers but gives wrong results.",
    buggyCode: `def average(a, b):
    return a + b / 2

print(average(4, 8))   # Expected: 6.0
print(average(10, 20)) # Expected: 15.0`,
    hints: [
      "Think about operator precedence — which operator runs first?",
      "Division (/) has higher precedence than addition (+).",
      "Use parentheses to group the addition: (a + b) / 2",
    ],
    solution: `def average(a, b):
    return (a + b) / 2

print(average(4, 8))
print(average(10, 20))`,
    explanation: "Without parentheses, Python evaluates 'b / 2' first (operator precedence), then adds 'a'. Wrapping '(a + b)' in parentheses forces the addition first.",
    testCases: [
      { input: "average(4, 8)", expected: "6.0" },
      { input: "average(10, 20)", expected: "15.0" },
    ],
  },
  {
    id: "ch-4", title: "Off-By-One in Range", difficulty: "Intermediate", lang: "Python", time: 720, xp: 80, locked: true,
    desc: "The loop should print numbers 1 to 10 inclusive, but it stops at 9.",
    buggyCode: `for i in range(1, 10):
    print(i)`,
    hints: [
      "How does Python's range() function work with its end argument?",
      "range(1, 10) generates numbers from 1 up to BUT NOT including 10.",
      "Change the end value to 11 to include 10.",
    ],
    solution: `for i in range(1, 11):
    print(i)`,
    explanation: "Python's range(start, stop) excludes the stop value. So range(1, 10) gives 1–9. Changing to range(1, 11) gives 1–10 inclusive.",
    testCases: [{ input: "Last printed value", expected: "10" }],
  },
  {
    id: "ch-5", title: "List Index Error", difficulty: "Intermediate", lang: "Python", time: 720, xp: 90, locked: true,
    desc: "The code crashes with an IndexError when trying to get the last item.",
    buggyCode: `fruits = ["apple", "banana", "cherry"]
last = fruits[3]
print("Last fruit:", last)`,
    hints: [
      "List indices start at 0. A list with 3 items has indices 0, 1, 2.",
      "Index 3 doesn't exist — it would be the 4th item.",
      "To get the last item, use index 2 or the shorthand -1.",
    ],
    solution: `fruits = ["apple", "banana", "cherry"]
last = fruits[-1]
print("Last fruit:", last)`,
    explanation: "With 3 items (indices 0, 1, 2), accessing index 3 causes IndexError. Use fruits[2] or the Pythonic fruits[-1] which always gets the last element.",
    testCases: [{ input: "Output", expected: "Last fruit: cherry" }],
  },
  {
    id: "ch-6", title: "Missing Return", difficulty: "Intermediate", lang: "Python", time: 600, xp: 85, locked: true,
    desc: "The function should return True if a number is even, but it always returns None.",
    buggyCode: `def is_even(n):
    if n % 2 == 0:
        True

print(is_even(4))   # Expected: True
print(is_even(7))   # Expected: False`,
    hints: [
      "The function has the right logic but the return keyword is missing.",
      "Writing just 'True' inside an if block does nothing — you need to return it.",
      "Add 'return' before 'True', and add 'return False' in an else block.",
    ],
    solution: `def is_even(n):
    if n % 2 == 0:
        return True
    return False

print(is_even(4))
print(is_even(7))`,
    explanation: "Without the 'return' keyword, the function exits returning None by default. Adding 'return True' and 'return False' makes it actually return values.",
    testCases: [
      { input: "is_even(4)", expected: "True" },
      { input: "is_even(7)", expected: "False" },
    ],
  },
  {
    id: "ch-7", title: "String Concatenation Bug", difficulty: "Hard", lang: "Python", time: 900, xp: 120, locked: true,
    desc: "The function should build a sentence from a list of words but crashes.",
    buggyCode: `def build_sentence(words):
    sentence = ""
    for i in range(len(words)):
        sentence = sentence + words[i]
        if i < len(words):
            sentence += " "
    return sentence.strip()

print(build_sentence(["Hello", "World"]))`,
    hints: [
      "Look at the condition inside the loop — is it checking the right thing?",
      "To avoid trailing space, the space should be added before the last word, not after every word.",
      "The condition should be 'i < len(words) - 1' to skip the space after the last word.",
    ],
    solution: `def build_sentence(words):
    sentence = ""
    for i in range(len(words)):
        sentence = sentence + words[i]
        if i < len(words) - 1:
            sentence += " "
    return sentence

print(build_sentence(["Hello", "World"]))`,
    explanation: "The condition 'i < len(words)' is always True for valid indices. It should be 'i < len(words) - 1' to skip adding a space after the last word. The .strip() can also be removed now.",
    testCases: [
      { input: 'build_sentence(["Hello", "World"])', expected: "Hello World" },
    ],
  },
  {
    id: "ch-8", title: "HTML Broken Link", difficulty: "Easy", lang: "HTML", time: 480, xp: 45, locked: false,
    desc: "The link doesn't work. It should open 'https://github.com' in a new tab.",
    buggyCode: `<a href="github.com" target="blank">
  Visit GitHub
</a>`,
    hints: [
      "Web URLs need a protocol prefix. What's missing at the start of the URL?",
      "Add 'https://' before 'github.com'.",
      "Also check the target attribute — '_blank' needs an underscore prefix.",
    ],
    solution: `<a href="https://github.com" target="_blank">
  Visit GitHub
</a>`,
    explanation: "Two bugs: (1) 'github.com' needs 'https://' prefix to be a valid URL. (2) target='blank' should be target='_blank' — the underscore is required.",
    testCases: [{ input: "Link behavior", expected: "Opens https://github.com in new tab" }],
  },
];

type Stage = "list" | "challenge" | "result";

export default function PracticePage() {
  const [stage, setStage] = useState<Stage>("list");
  const [activeChallenge, setActiveChallenge] = useState<typeof challenges[0] | null>(null);
  const [level, setLevel] = useState("all");
  const [search, setSearch] = useState("");
  const [userCode, setUserCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [verdict, setVerdict] = useState<"correct" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUid(u.uid);
        const profile = await getOrCreateUserProfile(u.uid, u.email || "", u.displayName || "Developer");
        setCompletedIds(profile.completedChallenges);
      }
    });
    return unsub;
  }, []);

  // Timer
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      setStage("result");
      setVerdict("wrong");
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning, timeLeft]);

  const startChallenge = (ch: typeof challenges[0]) => {
    setActiveChallenge(ch);
    setUserCode(ch.buggyCode);
    setTimeLeft(ch.time);
    setTimerRunning(true);
    setHintsUsed(0);
    setShowHint(false);
    setCurrentHint(0);
    setVerdict(null);
    setShowSolution(false);
    setStage("challenge");
  };

  const submitAnswer = () => {
    if (!activeChallenge) return;
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Smart check: compare normalized code with solution
    const normalize = (s: string) => s.replace(/\s+/g, " ").replace(/\s*#.*$/gm, "").trim();
    const isCorrect = normalize(userCode) === normalize(activeChallenge.solution);

    setVerdict(isCorrect ? "correct" : "wrong");

    if (isCorrect && uid && !completedIds.includes(activeChallenge.id)) {
      const earned = Math.max(activeChallenge.xp - hintsUsed * 10, 10);
      setXpEarned(earned);
      completeChallengeInFirebase(uid, activeChallenge.id, earned);
      setCompletedIds(prev => [...prev, activeChallenge.id]);
    }

    setStage("result");
  };

  const useHint = () => {
    if (!activeChallenge || currentHint >= activeChallenge.hints.length) return;
    setShowHint(true);
    setHintsUsed(h => h + 1);
  };

  const nextHint = () => {
    if (!activeChallenge || currentHint + 1 >= activeChallenge.hints.length) return;
    setCurrentHint(h => h + 1);
    setHintsUsed(h => h + 1);
  };

  const filtered = challenges.filter(c => {
    const matchLevel = level === "all" || c.difficulty.toLowerCase() === level;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  const timerColor = timeLeft > activeChallenge?.time! * 0.5 ? "var(--neon-green)"
    : timeLeft > activeChallenge?.time! * 0.25 ? "var(--neon-orange)"
    : "var(--neon-pink)";

  /* ─── LIST VIEW ─── */
  if (stage === "list") return (
    <AuthGuard>
      <div className="container py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-[11px] font-mono text-[var(--neon-orange)] uppercase tracking-widest mb-2">Debug Arena</p>
          <h1 className="font-heading text-3xl md:text-5xl font-800 text-white mb-3">
            PRACTICE <span className="neon-text-orange">&amp; DEBUG</span>
          </h1>
          <p className="text-white/40 text-sm max-w-xl">Real coding bugs to find and fix. Timer, hints, and instant feedback on every challenge.</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Solved", value: completedIds.length, color: "neon-text-green", card: "" },
            { label: "Total XP", value: completedIds.reduce((s, id) => s + (challenges.find(c => c.id === id)?.xp || 0), 0), color: "neon-text-cyan", card: "card-cyan" },
            { label: "Available", value: challenges.filter(c => !c.locked).length, color: "neon-text-violet", card: "card-violet" },
            { label: "Completion", value: `${Math.round((completedIds.length / challenges.length) * 100)}%`, color: "neon-text-orange", card: "" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.07 }}>
              <div className={`card ${s.card} p-4 text-center`}>
                <div className={`text-2xl font-heading font-800 ${s.color}`}>{s.value}</div>
                <div className="text-[10px] font-mono text-white/25 mt-0.5 uppercase tracking-wider">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="card p-4 mb-7 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search challenges…" className="input-neon pl-10 py-2.5 text-sm" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-white/30" />
            {["all", "easy", "intermediate", "hard"].map(l => (
              <button key={l} onClick={() => setLevel(l)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-600 uppercase tracking-wider transition-all border ${level === l ? "bg-[rgba(0,255,135,0.15)] text-[var(--neon-green)] border-[rgba(0,255,135,0.3)]" : "text-white/30 border-white/8 hover:text-white/60"}`}>
                {l === "all" ? "All" : l}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Challenge cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((c, i) => {
            const done = completedIds.includes(c.id);
            const diffColor = c.difficulty === "Easy" ? "badge-green" : c.difficulty === "Intermediate" ? "badge-violet" : "badge-pink";
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} viewport={{ once: true }}>
                <div className={`card p-5 group ${done ? "ring-1 ring-[rgba(0,255,135,0.2)]" : ""}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${c.locked ? "bg-white/5" : done ? "bg-[rgba(0,255,135,0.12)]" : "bg-[rgba(255,107,43,0.1)]"} border ${c.locked ? "border-white/8" : done ? "border-[rgba(0,255,135,0.2)]" : "border-[rgba(255,107,43,0.2)]"}`}>
                      {c.locked ? <Lock className="w-4.5 h-4.5 text-white/20" />
                        : done ? <CheckCircle className="w-4.5 h-4.5 text-[var(--neon-green)]" />
                        : <Bug className="w-4.5 h-4.5 text-[var(--neon-orange)]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`badge ${diffColor} text-[9px]`}>{c.difficulty}</span>
                        <span className="badge badge-cyan text-[9px]">{c.lang}</span>
                        {done && <span className="badge badge-green text-[9px]">✓ Solved</span>}
                        {c.locked && <span className="badge text-[9px] bg-white/5 border-white/10 text-white/25">Locked</span>}
                      </div>
                      <h3 className="font-mono text-sm font-600 text-white/80 group-hover:text-white transition-colors">{c.title}</h3>
                      <p className="text-xs text-white/35 mt-1 leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-4 text-[10px] font-mono text-white/25">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(c.time)}</span>
                      <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />+{c.xp} XP</span>
                      <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3" />{c.hints.length} hints</span>
                    </div>
                    <button disabled={c.locked} onClick={() => startChallenge(c)}
                      className={`${c.locked ? "opacity-30 cursor-not-allowed btn-neon py-2 px-4 text-[10px]" : done ? "btn-neon py-2 px-4 text-[10px]" : "btn-neon btn-neon-solid py-2 px-4 text-[10px]"}`}>
                      {c.locked ? "Locked" : done ? <><RotateCcw className="w-3 h-3" /> Retry</> : <><Play className="w-3 h-3" /> Start</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AuthGuard>
  );

  /* ─── CHALLENGE VIEW ─── */
  if (stage === "challenge" && activeChallenge) return (
    <AuthGuard>
      <div className="container py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => { setStage("list"); setTimerRunning(false); }} className="flex items-center gap-2 text-xs font-mono text-white/30 hover:text-white/70 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to challenges
          </button>
          {/* Timer */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm font-700" style={{ borderColor: timerColor + "40", background: timerColor + "10", color: timerColor }}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Problem */}
          <div className="space-y-5">
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[rgba(255,107,43,0.1)] border border-[rgba(255,107,43,0.2)] flex items-center justify-center">
                  <Bug className="w-5 h-5 text-[var(--neon-orange)]" />
                </div>
                <div>
                  <h2 className="font-heading text-sm font-700 tracking-wider text-white">{activeChallenge.title}</h2>
                  <div className="flex gap-2 mt-1">
                    <span className={`badge text-[9px] ${activeChallenge.difficulty === "Easy" ? "badge-green" : activeChallenge.difficulty === "Intermediate" ? "badge-violet" : "badge-pink"}`}>{activeChallenge.difficulty}</span>
                    <span className="badge badge-cyan text-[9px]">{activeChallenge.lang}</span>
                    <span className="badge badge-orange text-[9px]">+{activeChallenge.xp} XP</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{activeChallenge.desc}</p>
            </div>

            {/* Buggy code (read-only reference) */}
            <div>
              <p className="text-[10px] font-mono text-[var(--neon-pink)] uppercase tracking-widest mb-2">🐛 Buggy Code (for reference)</p>
              <div className="terminal">
                <div className="terminal-header">
                  <div className="terminal-dot bg-[#ff5f57]" /><div className="terminal-dot bg-[#ffbd2e]" /><div className="terminal-dot bg-[#28ca42]" />
                  <span className="ml-2 text-[10px] font-mono text-white/25">buggy_{activeChallenge.lang.toLowerCase()}.py</span>
                </div>
                <pre className="terminal-body text-[13px] whitespace-pre leading-relaxed text-[var(--neon-pink)]">{activeChallenge.buggyCode}</pre>
              </div>
            </div>

            {/* Test cases */}
            <div className="card p-4">
              <p className="text-[10px] font-mono text-[var(--neon-cyan)] uppercase tracking-widest mb-3">Test Cases</p>
              <div className="space-y-2">
                {activeChallenge.testCases.map((tc, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] font-mono p-2 rounded-lg bg-white/3">
                    <span className="text-white/45">{tc.input}</span>
                    <span className="text-[var(--neon-green)]">→ {tc.expected}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hints */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-mono text-[var(--neon-orange)] uppercase tracking-widest flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Hints ({hintsUsed}/{activeChallenge.hints.length} used · -10 XP each)
                </p>
                {currentHint < activeChallenge.hints.length - 1 && showHint && (
                  <button onClick={nextHint} className="text-[10px] font-mono text-[var(--neon-orange)] hover:underline">Next hint →</button>
                )}
              </div>
              {!showHint ? (
                <button onClick={useHint} className="btn-neon border-[var(--neon-orange)] text-[var(--neon-orange)] py-2 px-4 text-[10px] w-full justify-center">
                  <Lightbulb className="w-3.5 h-3.5" /> Use a Hint (-10 XP)
                </button>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div key={currentHint} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-[rgba(255,107,43,0.06)] border border-[rgba(255,107,43,0.15)] rounded-xl p-3">
                    <p className="text-[11px] font-mono text-white/60 leading-relaxed">💡 Hint {currentHint + 1}: {activeChallenge.hints[currentHint]}</p>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Right: Code editor */}
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-mono text-[var(--neon-green)] uppercase tracking-widest mb-2">✏️ Your Fix — Edit the code below</p>
              <div className="terminal">
                <div className="terminal-header">
                  <div className="terminal-dot bg-[#ff5f57]" /><div className="terminal-dot bg-[#ffbd2e]" /><div className="terminal-dot bg-[#28ca42]" />
                  <span className="ml-2 text-[10px] font-mono text-white/25">solution.py</span>
                  <span className="ml-auto text-[9px] font-mono text-white/20">editable</span>
                </div>
                <textarea
                  value={userCode}
                  onChange={e => setUserCode(e.target.value)}
                  className="w-full bg-transparent border-none outline-none resize-none font-mono text-[13px] text-[var(--neon-green)] leading-relaxed p-4"
                  style={{ minHeight: 280, caretColor: "var(--neon-green)" }}
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={submitAnswer} className="btn-neon btn-neon-solid flex-1 py-3 text-[12px] justify-center">
                <CheckCircle className="w-4 h-4" /> Submit Solution
              </button>
              <button onClick={() => setUserCode(activeChallenge.buggyCode)} className="btn-neon py-3 px-4 text-[11px]">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[10px] font-mono text-white/20 text-center">Fix the bug(s) in the editor above and click Submit</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );

  /* ─── RESULT VIEW ─── */
  if (stage === "result" && activeChallenge) return (
    <AuthGuard>
      <div className="container py-16 flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
          <div className={`card p-8 text-center ${verdict === "correct" ? "" : "card-violet"}`}>
            {/* Verdict icon */}
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
              className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${verdict === "correct" ? "bg-[rgba(0,255,135,0.12)] border border-[rgba(0,255,135,0.3)]" : "bg-[rgba(255,45,120,0.12)] border border-[rgba(255,45,120,0.3)]"}`}>
              {verdict === "correct"
                ? <CheckCircle className="w-10 h-10 text-[var(--neon-green)]" />
                : <XCircle className="w-10 h-10 text-[var(--neon-pink)]" />}
            </motion.div>

            <h2 className={`font-heading text-3xl font-800 tracking-wider mb-2 ${verdict === "correct" ? "neon-text-green" : "neon-text-violet"}`}>
              {verdict === "correct" ? "CORRECT!" : "NOT QUITE"}
            </h2>
            <p className="text-white/45 text-sm mb-6">
              {verdict === "correct"
                ? `Great debugging! You earned +${xpEarned} XP${hintsUsed > 0 ? ` (${hintsUsed} hints used)` : ""}.`
                : "Don't worry — debugging is a skill that takes practice. Review the solution below."}
            </p>

            {/* XP badge */}
            {verdict === "correct" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[rgba(0,255,135,0.1)] border border-[rgba(0,255,135,0.25)] mb-6">
                <Zap className="w-4 h-4 text-[var(--neon-green)]" />
                <span className="font-heading text-sm font-700 neon-text-green">+{xpEarned} XP EARNED</span>
              </motion.div>
            )}

            {/* Explanation */}
            <div className="text-left mb-6">
              <p className="text-[10px] font-mono text-[var(--neon-cyan)] uppercase tracking-widest mb-3">📖 Explanation</p>
              <div className="bg-[rgba(0,0,0,0.3)] rounded-xl p-4 border border-white/6">
                <p className="text-sm text-white/65 leading-relaxed font-mono">{activeChallenge.explanation}</p>
              </div>
            </div>

            {/* Solution */}
            <div className="text-left mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-mono text-[var(--neon-green)] uppercase tracking-widest">✅ Correct Solution</p>
                <button onClick={() => setShowSolution(!showSolution)} className="flex items-center gap-1 text-[10px] font-mono text-white/30 hover:text-white/60 transition-colors">
                  {showSolution ? <><EyeOff className="w-3 h-3" /> Hide</> : <><Eye className="w-3 h-3" /> Show</>}
                </button>
              </div>
              <AnimatePresence>
                {showSolution && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="terminal">
                      <div className="terminal-header"><div className="terminal-dot bg-[#28ca42]" /><span className="ml-2 text-[10px] font-mono text-white/25">solution.py</span></div>
                      <pre className="terminal-body text-[13px] whitespace-pre leading-relaxed text-[var(--neon-green)]">{activeChallenge.solution}</pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => startChallenge(activeChallenge)} className="btn-neon py-3 px-6 text-[11px] justify-center">
                <RotateCcw className="w-3.5 h-3.5" /> Try Again
              </button>
              <button onClick={() => setStage("list")} className="btn-neon btn-neon-solid py-3 px-6 text-[11px] justify-center">
                <ChevronLeft className="w-3.5 h-3.5" /> All Challenges
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AuthGuard>
  );

  return null;
}
