// app/api/challenges/route.ts
// GET /api/challenges?difficulty=intermediate&category=logic&lang=python&search=loop

import { NextRequest, NextResponse } from 'next/server';
import { CHALLENGES, getFilteredChallenges, type ChallengeDifficulty, type ChallengeCategory, type ChallengeLang } from '@/lib/challenges';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const difficulty = searchParams.get('difficulty') as ChallengeDifficulty | null;
  const category   = searchParams.get('category')   as ChallengeCategory   | null;
  const lang       = searchParams.get('lang')        as ChallengeLang       | null;
  const search     = searchParams.get('search')      ?? undefined;

  const results = getFilteredChallenges({
    difficulty: difficulty ?? undefined,
    category:   category   ?? undefined,
    lang:       lang       ?? undefined,
    search,
  });

  // Sort by difficulty tier order then by xpReward asc
  const tierOrder: Record<ChallengeDifficulty, number> = {
    beginner: 0, intermediate: 1, advanced: 2, expert: 3,
  };

  const sorted = [...results].sort(
    (a, b) => tierOrder[a.difficulty] - tierOrder[b.difficulty] || a.xpReward - b.xpReward
  );

  return NextResponse.json({
    total: sorted.length,
    challenges: sorted.map(c => ({
      id:          c.id,
      title:       c.title,
      description: c.description,
      difficulty:  c.difficulty,
      category:    c.category,
      lang:        c.lang,
      xpReward:    c.xpReward,
      timeLimit:   c.timeLimit,
      hintCount:   c.hints.length,
      prerequisiteLessons: c.prerequisiteLessons,
    })),
  });
}
