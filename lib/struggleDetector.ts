// lib/struggleDetector.ts

export interface UserStats {
  successRate: number;
  avgAttempts: number;
  streakBroken?: boolean;
  recentStruggleConcepts: string[];
}

export interface Intervention {
  type: 'REVIEW' | 'TUTORIAL' | 'INCENTIVE';
  concept: string;
  suggestion: string;
  bonus: string;
  actionLabel: string;
  actionLink: string;
}

export function detectStruggles(stats: UserStats): Intervention[] {
  const interventions: Intervention[] = [];

  if (stats.successRate < 40) {
    interventions.push({
      type: 'REVIEW',
      concept: stats.recentStruggleConcepts[0] || 'General Logic',
      suggestion: `We noticed you're struggling with ${stats.recentStruggleConcepts[0] || 'logic'}.`,
      bonus: '+15 XP if completed today',
      actionLabel: 'Review Lesson',
      actionLink: '/learn'
    });
  }

  if (stats.avgAttempts > 4) {
    interventions.push({
      type: 'TUTORIAL',
      concept: stats.recentStruggleConcepts[0] || 'Syntax',
      suggestion: `Too many attempts? Let's clarify the concepts with a tutorial.`,
      bonus: '+10 XP bonus',
      actionLabel: 'Watch Tutorial',
      actionLink: '/learn' // In a real app, this might be a specific video modal
    });
  }

  if (stats.streakBroken) {
    interventions.push({
      type: 'INCENTIVE',
      concept: 'Engagement',
      suggestion: `Welcome back! Jump back into your flow with a bonus.`,
      bonus: '2x XP for 3 challenges',
      actionLabel: 'Start Practice',
      actionLink: '/practice'
    });
  }

  return interventions;
}
