import { NextRequest, NextResponse } from 'next/server';
import { getRecommendedChallengesAdvanced } from '@/lib/learningPath';
// NOTE: Ideally we fetch user progress here using a uid from headers or cookies, 
// but for this MVP, we parse it from the client via query strings.

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const completedLessons    = (searchParams.get('completedLessons')    ?? '').split(',').filter(Boolean);
  const completedChallenges = (searchParams.get('completedChallenges') ?? '').split(',').filter(Boolean);
  
  // NOTE: Advanced engine requires all challenge stats (like attempts). 
  // In a real API endpoint handling Auth, we'd query Firestore directly here.
  // For MVP parity without injecting auth cookies into Next server edge requests, 
  // we fallback to passing minimal stats or relying on client to send it over.
  
  // For the moment, we will pass empty array for struggles from client if not provided, allowing basic advanced matching to still function.
  const userChallengeProgressRaw = searchParams.get('challengeProgressStr');
  const userChallengeProgress = userChallengeProgressRaw ? JSON.parse(userChallengeProgressRaw) : [];

  const recommendations = getRecommendedChallengesAdvanced(
    completedLessons, 
    completedChallenges, 
    userChallengeProgress
  );

  return NextResponse.json({
    total: recommendations.length,
    challenges: recommendations.map(c => ({
      id:          c.id,
      title:       c.title,
      description: c.description,
      difficulty:  c.difficulty,
      category:    c.category,
      lang:        c.lang,
      xpReward:    c.xpReward,
      timeLimit:   c.timeLimit,
      hintCount:   c.hints.length,
    })),
  });
}
