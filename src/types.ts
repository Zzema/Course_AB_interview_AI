// FIX: Removed an incorrect import from './constants' that was causing a circular dependency.
// The types are defined below in this file and should not be imported from a file that depends on this one.

export interface LevelProgress {
    askedQuestionIds: number[]; // ID пройденных вопросов на этом уровне
    totalQuestions: number; // Общее количество вопросов на уровне
    averageScore: number; // Средний балл на этом уровне
}

export interface QuestionAttempt {
    questionId: number; // ID вопроса
    timestamp: number; // Время ответа (Unix timestamp)
    answer: string; // Ответ пользователя
    feedback: Feedback; // Полная обратная связь от AI
    earnedPoints: number; // Заработанные баллы
    difficulty: DifficultyLevel; // Сложность вопроса (на момент ответа)
    seniority: SeniorityLevel; // Уровень вопроса
}

export interface GameState {
    currentQuestionIndex: number;
    rating: number;
    categoryScores: Record<string, { totalScore: number; count: number }>;
    keyPointScores: Record<string, { totalScore: number; count: number }>;
    consecutiveGoodAnswersOnSimpleQuestions: number;
    ratingHistory?: number[]; // История накопленного рейтинга после каждого вопроса
    initialLevel?: 'junior' | 'mid' | 'senior' | 'staff'; // 🆕 Начальный уровень аналитика (фиксированный)
    selectedDifficulty?: 'all' | 'junior' | 'mid' | 'senior' | 'staff'; // Выбранный уровень сложности вопросов
    askedQuestionIds?: number[]; // ID уже заданных вопросов для рандомизации (для обратной совместимости)
    currentQuestionId?: number; // ID текущего отображаемого вопроса
    levelProgress?: Record<'junior' | 'mid' | 'senior' | 'staff', LevelProgress>; // Прогресс по каждому уровню
    questionAttempts?: QuestionAttempt[]; // 🆕 История всех попыток ответов на вопросы
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