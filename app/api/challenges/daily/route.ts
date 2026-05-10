import { NextResponse } from "next/server";
import { CHALLENGES } from "@/lib/challenges";

export async function GET() {
  try {
    // Generate a deterministic index based on the current date
    const now = new Date();
    const dateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    
    // Simple hash-like function to get an index
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % CHALLENGES.length;
    const dailyChallenge = CHALLENGES[index];

    return NextResponse.json({
      challenge: dailyChallenge,
      date: dateString,
      bonusXp: dailyChallenge.xpReward // Double XP = base + bonus
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch daily challenge" }, { status: 500 });
  }
}
