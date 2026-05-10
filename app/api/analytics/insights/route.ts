import { NextResponse } from "next/server";
import { detectStruggles, UserStats } from "@/lib/struggleDetector";

export async function GET() {
  // Mock user stats that would normally come from the database
  const userStats: UserStats = {
    successRate: 35,
    avgAttempts: 4.2,
    streakBroken: true,
    recentStruggleConcepts: ["Loops", "Async"]
  };

  const dynamicStruggles = detectStruggles(userStats);

  const data = {
    overallProgress: {
      track: "Python Track",
      percentage: 45,
      level: 8,
      maxLevel: 50,
      streak: 47,
      totalXp: 18750
    },
    timeInvestment: {
      thisWeek: 8.5,
      thisMonth: 32,
      allTime: 156
    },
    conceptMastery: [
      { concept: "Variables", score: 85, fullMark: 100 },
      { concept: "Functions", score: 65, fullMark: 100 },
      { concept: "Loops", score: 40, fullMark: 100 },
      { concept: "Classes", score: 55, fullMark: 100 },
      { concept: "Arrays", score: 75, fullMark: 100 },
      { concept: "Async", score: 30, fullMark: 100 }
    ],
    performanceTrends: {
      successRate: [65, 68, 70, 72, 75, 78],
      avgAttempts: [2.8, 2.5, 2.3, 2.1, 2.0, 1.9],
      challengeSpeed: [22, 20, 18, 15, 13, 11] // in minutes
    },
    trends: [
      { day: "Mon", xp: 100 },
      { day: "Tue", xp: 120 },
      { day: "Wed", xp: 90 },
      { day: "Thu", xp: 210 },
      { day: "Fri", xp: 160 },
      { day: "Sat", xp: 250 },
      { day: "Sun", xp: 300 }
    ],
    struggles: dynamicStruggles,
    strengths: ["Variables", "Arrays"],
    badges: [
      { id: "python-101", name: "Python 101", icon: "🐍" },
      { id: "speedrunner", name: "Speedrunner", icon: "⚡" },
      { id: "streak-7", name: "7-Day Streak", icon: "🔥" },
      { id: "century", name: "100 Challenges", icon: "🧠" }
    ]
  };

  return NextResponse.json(data);
}
