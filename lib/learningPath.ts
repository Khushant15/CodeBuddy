// lib/learningPath.ts

import { CHALLENGES, Challenge } from './challenges';
import { getChallengeProgress, ChallengeProgress } from './userService';

/**
 * Checks if a user is allowed to access a given lesson/challenge based on prerequisites.
 */
export function canAccessContent(
  completedLessons: string[],
  prerequisiteLessons: string[]
): {
  allowed: boolean;
  blockedBy: string[];
} {
  const blockedBy = prerequisiteLessons.filter(req => !completedLessons.includes(req));
  
  return {
    allowed: blockedBy.length === 0,
    blockedBy
  };
}

/**
 * Calculates a match score for a challenge based on user struggle areas and recently completed lessons. 
 * Higher score = better recommendation.
 */
function calculateSkillMatch(
  challenge: Challenge,
  struggles: ChallengeProgress[],
  recentLessons: string[],
  completedChallenges: string[]
): number {
  let score = 0;

  // 1. Give priority to challenges whose prerequisites were just completed
  if (challenge.prerequisiteLessons.some(l => recentLessons.includes(l))) {
    score += 30;
  }

  // 2. Identify if the user struggles with this category
  // A struggle is defined as a challenge taking >3 attempts and belonging to the same category.
  const strugglingInThisCategory = struggles.some(s => s.category === challenge.category);
  if (strugglingInThisCategory) {
    // If they struggle, recommend an easier challenge in the same category
    if (challenge.difficulty === 'beginner' || challenge.difficulty === 'intermediate') {
      score += 50; 
    } else {
      score -= 20; // Don't give them an expert challenge on a topic they are struggling with
    }
  }

  // 3. Difficulty curve progression
  // If they haven't completed many challenges in this category, favor beginner ones
  const completedInCategory = completedChallenges.filter(id => {
    const c = CHALLENGES.find(ch => ch.id === id);
    return c?.category === challenge.category;
  }).length;
  
  if (completedInCategory === 0 && challenge.difficulty === 'beginner') score += 20;
  if (completedInCategory > 2 && challenge.difficulty === 'intermediate') score += 20;
  if (completedInCategory > 5 && challenge.difficulty === 'advanced') score += 20;

  return score;
}

/**
 * Advanced challenge recommendation engine.
 */
export function getRecommendedChallengesAdvanced(
  completedLessons: string[],
  completedChallenges: string[],
  userChallengeProgress: ChallengeProgress[],
  limit = 5
): Challenge[] {
  
  const recentLessons = [...completedLessons].slice(-3); // Last 3 
  const struggles = userChallengeProgress.filter(c => c.attempts > 3);

  // Filter pool: 
  // 1. Not already completed
  // 2. Prerequisites met
  const pool = CHALLENGES.filter(c => 
    !completedChallenges.includes(c.id) &&
    canAccessContent(completedLessons, c.prerequisiteLessons).allowed
  );

  // If pool is empty, return empty
  if (pool.length === 0) return [];

  // Map to score, sort desc
  const scored = pool.map(c => ({
    challenge: c,
    score: calculateSkillMatch(c, struggles, recentLessons, completedChallenges)
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(s => s.challenge);
}
