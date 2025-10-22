// FIX: Removed an incorrect import from './constants' that was causing a circular dependency.
// The types are defined below in this file and should not be imported from a file that depends on this one.

export interface GameState {
    currentQuestionIndex: number;
    rating: number;
    categoryScores: Record<string, { totalScore: number; count: number }>;
    keyPointScores: Record<string, { totalScore: number; count: number }>;
    consecutiveGoodAnswersOnSimpleQuestions: number;
}

export interface User {
    name: string; // Full name from Google
    email: string;
    given_name: string;
    family_name: string;
    picture?: string;
}

export interface Session {
    user: User;
    gameState: GameState;
}

export interface Feedback {
    overallScore: number;
    evaluation: {
        strengths: string[];
        weaknesses: string[];
    };
    categoryBreakdown: { category: string; score: number; comment: string }[];
}


// ============================================================================
// НОВЫЕ ТИПЫ ДЛЯ БАЗЫ ВОПРОСОВ
// ============================================================================

export interface Question {
  id: number;
  difficulty: DifficultyLevel;
  seniority: SeniorityLevel;
  categories: Category[];
  text: string;
  bigTech: BigTechCompany[];
  keyPoints?: KeyPoint[];
}

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type SeniorityLevel = 'junior' | 'mid' | 'senior' | 'staff';

export type Category = 
  | 'foundations'
  | 'statistics'
  | 'design'
  | 'metrics'
  | 'analysis'
  | 'interpretation'
  | 'pitfalls'
  | 'cases'
  | 'advanced_methods'
  | 'infrastructure'
  | 'leadership';

export type BigTechCompany = 'Meta' | 'Google' | 'Amazon' | 'Microsoft' | 'Netflix' | 'All';

export type KeyPoint = 
  | 'type-i-error'
  | 'type-ii-error'
  | 'statistical-power'
  | 'statistical-significance'
  | 'multiple-testing'
  | 'sample-size'
  | 'randomization'
  | 'experiment-duration'
  | 'experiment-types'
  | 'statistical-tests'
  | 'advanced-methods'
  | 'distribution-issues'
  | 'segmentation'
  | 'metric-types'
  | 'metric-issues'
  | 'business-metrics'
  | 'peeking-problem'
  | 'novelty-effects'
  | 'network-effects'
  | 'practical-significance'
  | 'causal-inference';