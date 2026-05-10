// lib/chatTypes.ts

export interface ContextualHelp {
  currentLesson?: string;
  currentChallenge?: string;
  userLevel?: number;
  attempts?: number;
  behavior?: {
    noDirectSolutions?: boolean;
    hintMode?: boolean;
    explainMode?: boolean;
  };
}
