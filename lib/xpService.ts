/**
 * SM-2 Spaced Repetition Algorithm
 */
export function calculateNextReview(repetition: number, easeFactor: number, confidence: number) {
  if (confidence < 3) return { dueInDays: 1, repetition: 0, newEaseFactor: easeFactor };
  const interval = repetition === 0 ? 1 : repetition;
  const nextInterval = interval * easeFactor;
  const newEaseFactor = Math.max(1.3, easeFactor + 0.1 - (5 - confidence) * 0.08);
  return { dueInDays: Math.ceil(nextInterval), repetition: repetition + 1, newEaseFactor };
}

/**
 * XP Calculation Logic
 */
export interface ExerciseXpInput {
  baseXp?: number;
  runAttempts: number;
  solutionRevealed: boolean;
  timeSpentSeconds: number;
  solutionXpCost?: number;
}

export interface ExerciseXpResult {
  xp: number;
  breakdown: {
    base: number;
    efficiencyBonus: number;
    solutionPenalty: number;
    timeBonus: number;
    runCountPenalty: number;
  };
  label: string;
}

export function calculateExerciseXp(input: ExerciseXpInput): ExerciseXpResult {
  const base           = input.baseXp          ?? 50;
  const solutionCost   = input.solutionXpCost  ?? 5;
  const runs           = Math.max(1, input.runAttempts);

  let efficiencyBonus  = 0;
  let runCountPenalty  = 0;

  if (runs === 1) {
    efficiencyBonus = 25;
  } else if (runs >= 3) {
    runCountPenalty = Math.floor(base / 2);
  }

  const solutionPenalty = input.solutionRevealed ? solutionCost : 0;
  const timeBonus       = input.timeSpentSeconds <= 300 ? 15 : 0;

  const xp = Math.max(
    0,
    base + efficiencyBonus - runCountPenalty - solutionPenalty + timeBonus
  );

  const parts: string[] = [`Base: ${base}`];
  if (efficiencyBonus)  parts.push(`+${efficiencyBonus} efficiency`);
  if (runCountPenalty)  parts.push(`-${runCountPenalty} (many attempts)`);
  if (solutionPenalty)  parts.push(`-${solutionPenalty} (solution revealed)`);
  if (timeBonus)        parts.push(`+${timeBonus} speed bonus`);

  return {
    xp,
    breakdown: { base, efficiencyBonus, solutionPenalty, timeBonus, runCountPenalty },
    label: parts.join(' · '),
  };
}

/**
 * Leveling Logic
 */
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function xpToLevel(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  return level;
}
