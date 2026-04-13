// lib/curriculum/types.ts
// Type definitions for CodeBuddy's modular curriculum system

export type Track = 'python' | 'html' | 'css' | 'javascript' | 'react';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseType = 
  | 'multiple-choice'
  | 'fill-blank'
  | 'code-output'
  | 'code-fix'
  | 'code-write'
  | 'arrange-code'
  | 'trace-execution';

export type TheorySectionType = 
  | 'text' 
  | 'heading' 
  | 'code' 
  | 'callout' 
  | 'image' 
  | 'video';

export type CalloutVariant = 'info' | 'tip' | 'warning' | 'error';

// Main curriculum structure
export interface Curriculum {
  id: string;
  title: string;
  description: string;
  track: Track;
  order: number;
  estimatedHours: number;
  difficulty: Difficulty;
  prerequisites: string[]; // module IDs
  learningObjectives: string[];
  lessons: Lesson[];
  capstoneProject?: Project;
}

// Individual lesson
export interface Lesson {
  id: string;
  title: string;
  order: number;
  difficulty: Difficulty;
  xpReward: number;
  estimatedMinutes: number;
  tags: string[];
  prerequisites: string[]; // lesson IDs
  
  // Content
  theory: TheoryContent;
  examples: CodeExample[];
  exercises: Exercise[];
}

// Theory content structure
export interface TheoryContent {
  sections: TheorySection[];
}

export interface TheorySection {
  type: TheorySectionType;
  content: string;
  language?: string; // for code blocks
  variant?: CalloutVariant; // for callouts
}

// Code examples
export interface CodeExample {
  title: string;
  code: string;
  output?: string;
  explanation: string;
  language?: string;
}

// Base exercise interface
interface BaseExercise {
  id: string;
  type: ExerciseType;
  question: string;
  explanation: string;
  hints: string[];
}

// Multiple choice exercise
export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: string;
}

// Fill in the blank
export interface FillBlankExercise extends BaseExercise {
  type: 'fill-blank';
  blanks: string[]; // placeholders like __VAR__, __NUM__
  correctAnswer: string[];
  acceptableAnswers?: string[]; // for flexible answers
}

// Predict code output
export interface CodeOutputExercise extends BaseExercise {
  type: 'code-output';
  code: string;
  correctAnswer: string;
  language?: string;
}

// Fix buggy code
export interface CodeFixExercise extends BaseExercise {
  type: 'code-fix';
  brokenCode: string;
  solution: string;
  language?: string;
  testCases?: TestCase[];
}

// Write code from scratch
export interface CodeWriteExercise extends BaseExercise {
  type: 'code-write';
  starterCode?: string;
  solution: string;
  testCases: TestCase[];
  language?: string;
}

// Arrange code blocks
export interface ArrangeCodeExercise extends BaseExercise {
  type: 'arrange-code';
  blocks: string[];
  correctOrder: number[]; // indices
  language?: string;
}

// Trace execution
export interface TraceExecutionExercise extends BaseExercise {
  type: 'trace-execution';
  code: string;
  correctAnswer: string;
  showSteps?: boolean;
  language?: string;
}

// Union type for all exercises
export type Exercise =
  | MultipleChoiceExercise
  | FillBlankExercise
  | CodeOutputExercise
  | CodeFixExercise
  | CodeWriteExercise
  | ArrangeCodeExercise
  | TraceExecutionExercise;

// Test cases for code execution
export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean; // hide some test cases from user
  description?: string;
}

// Project structure
export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedHours: number;
  xpReward: number;
  requirements: string[];
  starterCode?: string;
  sampleOutput?: string;
  hints?: string[];
  testCases?: TestCase[];
}

// User progress tracking
export interface UserProgress {
  userId: string;
  track: Track;
  
  // Module & lesson tracking
  modulesCompleted: string[];
  lessonsCompleted: string[];
  currentModule?: string;
  currentLesson?: string;
  
  // Exercise tracking
  exercisesCompleted: {
    [exerciseId: string]: ExerciseProgress;
  };
  
  // Project tracking
  projectsCompleted: string[];
  
  // Stats
  totalXpEarned: number;
  lessonsStarted: number;
  averageScore: number;
  lastActivity: Date;
}

export interface ExerciseProgress {
  exerciseId: string;
  completed: boolean;
  attempts: number;
  lastAttempt: Date;
  bestScore?: number;
  hintsUsed: number;
}

// Leaderboard entry
export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalXp: number;
  level: number;
  streak: number;
  lessonsCompleted: number;
  rank: number;
}
