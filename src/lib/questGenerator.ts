/**
 * ============================================================================
 * QUEST GENERATOR
 * ============================================================================
 * Единый генератор всех типов квестов
 * Объединяет текущую логику milestone квестов + новые ежедневные квесты
 * 
 * Типы квестов:
 * 1. DAILY - Ежедневные задания (1 активный в день)
 * 2. ACHIEVEMENT - Разовые достижения (награды за серии, recovery quest)
 * 3. MILESTONE - Долгосрочные цели (50 вопросов, 100 вопросов и т.д.)
 * 
 * Основная функция: generateAllQuests() - возвращает массив всех активных квестов
 */

import { Quest, GameState, Category } from '../types';
import { 
  getEndOfDay, 
  getUnclaimedMilestones,
  getCurrentDateString 
} from './activitySeriesManager';
import { 
  calculateWeightedAverageScore 
} from './xpCalculator';

// Импорт констант для расчета категорий
import { CATEGORIES_CONFIG } from '../data/constants';

// ============================================================================
// ТИПЫ ДЛЯ ВНУТРЕННЕЙ ЛОГИКИ
// ============================================================================

interface DailyQuestConfig {
  description: string;
  target: number;
  minScore: number;
  xpReward: number;
  itemReward?: {
    type: 'question_skip' | 'series_protection';
    value: number;
  };
}

interface AbilityScore {
  key: string;
  score: number;
}

// ============================================================================
// ГЕНЕРАТОР ЕЖЕДНЕВНЫХ КВЕСТОВ
// ============================================================================

/**
 * Генерирует ежедневный квест на основе прогресса пользователя
 * 
 * ЛОГИКА АДАПТАЦИИ:
 * - Первые 5 вопросов: легкое введение (1 вопрос с оценкой 5+)
 * - Далее: на основе выбранного уровня сложности
 * - Junior: 2 вопроса с оценкой 6+
 * - Mid: 3 вопроса с оценкой 7+
 * - Senior: 3 вопроса с оценкой 7+
 * - Staff: 4 вопроса с оценкой 8+
 * 
 * @param gameState - текущее состояние игры
 * @param currentDate - дата в формате YYYY-MM-DD
 * @returns ежедневный квест или null если уже выполнен
 */
export function generateDailyQuest(
  gameState: GameState,
  currentDate: string
): Quest | null {
  // Проверяем, не выполнен ли уже сегодняшний квест
  if (gameState.activitySeries?.todayCompleted) {
    console.log('✅ Daily quest already completed today');
    return null;
  }
  
  const difficulty = gameState.selectedDifficulty || 'junior';
  const totalAnswered = gameState.questionAttempts?.length || 0;
  
  // Получаем конфигурацию квеста
  const config = getDailyQuestConfig(difficulty, totalAnswered);
  
  // Рассчитываем текущий прогресс (сколько подходящих ответов дано сегодня)
  const progress = calculateDailyProgress(gameState, currentDate, config);
  
  // Формируем массив наград
  const rewards = [
    {
      type: 'xp' as const,
      value: config.xpReward,
      description: `+${config.xpReward} XP`
    }
  ];
  
  // Добавляем предмет если есть
  if (config.itemReward) {
    rewards.push({
      type: 'item' as const,
      value: config.itemReward.value,
      itemType: config.itemReward.type,
      description: config.itemReward.type === 'question_skip' 
        ? '🎲 Пропуск вопроса'
        : '🛡️ Защита серии'
    });
  }
  
  return {
    id: `daily-${currentDate}`,
    title: `📅 Ежедневное задание`,
    description: config.description,
    progress: {
      current: progress,
      total: config.target
    },
    reward: config.xpReward,
    rewards: rewards,
    completed: progress >= config.target,
    urgent: false,
    type: 'daily',
    expiresAt: getEndOfDay(currentDate)
  };
}

/**
 * Конфигурация ежедневного квеста на основе уровня и прогресса
 */
function getDailyQuestConfig(
  difficulty: string,
  totalAnswered: number
): DailyQuestConfig {
  // ========================================
  // ОНБОРДИНГ: Первые 5 дней - легкое введение
  // ========================================
  if (totalAnswered === 0) {
    return {
      description: 'Ответь на свой первый вопрос! 🎯',
      target: 1,
      minScore: 0,
      xpReward: 30, // было 50
      itemReward: {
        type: 'question_skip',
        value: 1
      }
    };
  }
  
  if (totalAnswered < 3) {
    return {
      description: 'Ответь на 1 вопрос с оценкой 5+ ⭐',
      target: 1,
      minScore: 5,
      xpReward: 20, // было 30
      itemReward: {
        type: 'question_skip',
        value: 1
      }
    };
  }
  
  if (totalAnswered < 7) {
    return {
      description: 'Ответь на 2 вопроса с оценкой 6+ ⭐⭐',
      target: 2,
      minScore: 6,
      xpReward: 25 // было 40
    };
  }
  
  // ========================================
  // ОСНОВНАЯ ЛОГИКА: на основе выбранного уровня
  // ========================================
  const configs: Record<string, DailyQuestConfig> = {
    junior: {
      description: 'Ответь на 2 вопроса Junior с оценкой 6+ ⭐⭐',
      target: 2,
      minScore: 6,
      xpReward: 35 // было 50
    },
    mid: {
      description: 'Ответь на 3 вопроса Mid с оценкой 7+ ⭐⭐⭐',
      target: 3,
      minScore: 7,
      xpReward: 55 // было 80
    },
    senior: {
      description: 'Ответь на 3 вопроса Senior с оценкой 7+ 💎💎💎',
      target: 3,
      minScore: 7,
      xpReward: 80 // было 120
    },
    staff: {
      description: 'Ответь на 4 вопроса Staff с оценкой 8+ 👑👑👑👑',
      target: 4,
      minScore: 8,
      xpReward: 120 // было 180
    },
    all: {
      description: 'Ответь на 3 любых вопроса с оценкой 7+ 🎯🎯🎯',
      target: 3,
      minScore: 7,
      xpReward: 70 // было 100
    }
  };
  
  return configs[difficulty] || configs.junior;
}

/**
 * Рассчитать прогресс ежедневного квеста
 * Считает количество ответов сегодня, которые соответствуют требованиям
 * 
 * @param gameState - текущее состояние
 * @param currentDate - текущая дата YYYY-MM-DD
 * @param config - конфигурация квеста (для проверки minScore)
 */
export function calculateDailyProgress(
  gameState: GameState,
  currentDate: string,
  config: DailyQuestConfig
): number {
  if (!gameState.questionAttempts) return 0;
  
  // Получаем начало сегодняшнего дня (00:00:00)
  const todayStart = new Date(currentDate + 'T00:00:00').getTime();
  const todayEnd = new Date(currentDate + 'T23:59:59').getTime();
  
  // Фильтруем ответы за сегодня с подходящей оценкой
  const todayAnswers = gameState.questionAttempts.filter(attempt => {
    const isToday = attempt.timestamp >= todayStart && attempt.timestamp <= todayEnd;
    const meetsScore = attempt.feedback.overallScore >= config.minScore;
    
    return isToday && meetsScore;
  });
  
  return todayAnswers.length;
}

// ============================================================================
// ГЕНЕРАТОР КВЕСТОВ ЗА ДОСТИЖЕНИЯ (СЕРИИ)
// ============================================================================

/**
 * Генерирует квесты за непретензированные milestone'ы серии
 * Отображаются как "завершенные" квесты с кнопкой "Забрать награду"
 */
export function generateSeriesQuests(gameState: GameState): Quest[] {
  if (!gameState.activitySeries) return [];
  
  const unclaimedMilestones = getUnclaimedMilestones(gameState.activitySeries);
  
  return unclaimedMilestones.map(milestone => ({
    id: `series-${milestone.days}`,
    title: `🔥 Серия ${milestone.days} дней`,
    description: `Ты занимался ${milestone.days} дней подряд! Забери награду`,
    progress: { current: milestone.days, total: milestone.days },
    reward: milestone.reward.value,
    rewards: [milestone.reward],
    completed: true, // уже достигнут
    urgent: false,
    type: 'achievement' as const
  }));
}

// ============================================================================
// ГЕНЕРАТОР ДОЛГОСРОЧНЫХ MILESTONE КВЕСТОВ
// ============================================================================

/**
 * Генерирует долгосрочные milestone квесты
 * Это текущая система квестов (50 вопросов, 100 вопросов, категория 80% и т.д.)
 */
export function generateMilestoneQuests(gameState: GameState): Quest[] {
  const totalAnswered = gameState.questionAttempts?.length || 0;
  const abilities = calculateAbilities(gameState);
  const avgScore = calculateWeightedAverageScore(gameState.questionAttempts || []);
  
  const quests: Quest[] = [];
  
  // ========================================
  // URGENT QUEST: Восстановление (если rating отрицательный)
  // ========================================
  if (gameState.rating < -50) {
    quests.push({
      id: 'milestone-recovery',
      title: '🆘 Восстановление',
      description: `Текущий опыт: ${gameState.rating}. Ответь на вопрос с оценкой 6+, чтобы получить +50 опыта!`,
      progress: { 
        current: Math.max(0, gameState.rating + 50), 
        total: 50 
      },
      reward: 50,
      completed: false,
      urgent: true,
      type: 'achievement'
    });
  }
  
  // ========================================
  // MILESTONE КВЕСТЫ - долгосрочные цели
  // ========================================
  
  // 50 вопросов
  quests.push({
    id: 'milestone-50-questions',
    title: 'Ответь на 50 вопросов',
    description: `Прогресс: ${totalAnswered}/50`,
    progress: { current: Math.min(totalAnswered, 50), total: 50 },
    reward: 200,
    completed: totalAnswered >= 50,
    type: 'milestone'
  });
  
  // 80% в категории
  const maxCategoryScore = Math.max(...abilities.map(a => a.score), 0);
  quests.push({
    id: 'milestone-category-80',
    title: 'Достигни 80% в любой категории',
    description: `Лучшая категория: ${Math.round(maxCategoryScore)}%`,
    progress: { 
      current: Math.min(Math.round(maxCategoryScore), 80), 
      total: 80 
    },
    reward: 150,
    completed: maxCategoryScore >= 80,
    type: 'milestone'
  });
  
  // Средняя оценка 8/10
  quests.push({
    id: 'milestone-avg-8',
    title: 'Средняя оценка за ответ 8/10',
    description: `Текущая: ${avgScore.toFixed(1)}/10`,
    progress: { 
      current: Math.min(avgScore, 8), 
      total: 8 
    },
    reward: 100,
    completed: avgScore >= 8.0,
    type: 'milestone'
  });
  
  // 100 вопросов
  quests.push({
    id: 'milestone-100-questions',
    title: 'Ответь на 100 вопросов',
    description: `Прогресс: ${totalAnswered}/100`,
    progress: { current: Math.min(totalAnswered, 100), total: 100 },
    reward: 500,
    completed: totalAnswered >= 100,
    type: 'milestone'
  });
  
  return quests;
}

/**
 * Рассчитать оценки по категориям (для квеста "80% в категории")
 * Копия логики из StatisticsScreenGamified для консистентности
 */
function calculateAbilities(gameState: GameState): AbilityScore[] {
  return Object.entries(CATEGORIES_CONFIG).map(([key, config]) => {
    const categoryScore = gameState.categoryScores[key];
    const score = categoryScore && categoryScore.count > 0 
      ? (categoryScore.totalScore / categoryScore.count) * 10 
      : 0;
    return {
      key,
      score
    };
  });
}

// ============================================================================
// ГЛАВНАЯ ФУНКЦИЯ - ОБЪЕДИНЯЕТ ВСЕ КВЕСТЫ
// ============================================================================

/**
 * Генерирует все активные квесты для пользователя
 * 
 * ПОРЯДОК КВЕСТОВ (важен для отображения):
 * 1. Ежедневный квест (если не выполнен)
 * 2. Квесты за достижения серий (если есть непретензированные)
 * 3. Долгосрочные milestone квесты
 * 
 * @param gameState - текущее состояние игры
 * @param currentDate - текущая дата (опционально, по умолчанию - сегодня)
 * @returns массив всех активных квестов
 */
export function generateAllQuests(
  gameState: GameState,
  currentDate?: string
): Quest[] {
  const date = currentDate || getCurrentDateString();
  const allQuests: Quest[] = [];
  
  // 1. Ежедневный квест (всегда первый в списке)
  const dailyQuest = generateDailyQuest(gameState, date);
  if (dailyQuest) {
    allQuests.push(dailyQuest);
  }
  
  // 2. Квесты за серии (награды за milestone'ы)
  const seriesQuests = generateSeriesQuests(gameState);
  allQuests.push(...seriesQuests);
  
  // 3. Долгосрочные milestone квесты
  const milestoneQuests = generateMilestoneQuests(gameState);
  allQuests.push(...milestoneQuests);
  
  console.log('📋 Generated quests:', {
    daily: dailyQuest ? 1 : 0,
    series: seriesQuests.length,
    milestones: milestoneQuests.length,
    total: allQuests.length
  });
  
  return allQuests;
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

/**
 * Проверить, выполнен ли ежедневный квест
 * Используется для обновления activitySeries.todayCompleted
 */
export function isDailyQuestCompleted(
  gameState: GameState,
  currentDate: string
): boolean {
  const dailyQuest = generateDailyQuest(gameState, currentDate);
  
  if (!dailyQuest) return true; // уже был выполнен ранее
  
  return dailyQuest.completed;
}

/**
 * Получить оставшееся время до истечения ежедневного квеста
 * Возвращает null если нет активного квеста
 */
export function getDailyQuestTimeRemaining(
  gameState: GameState,
  currentDate: string
): number | null {
  const dailyQuest = generateDailyQuest(gameState, currentDate);
  
  if (!dailyQuest || !dailyQuest.expiresAt) return null;
  
  return Math.max(0, dailyQuest.expiresAt - Date.now());
}

