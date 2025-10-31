/**
 * ============================================================================
 * WEEKLY CHALLENGES - Еженедельные челленджи
 * ============================================================================
 * 8 тематических недель по 10 вопросов каждая
 * Каждый челлендж фокусируется на конкретной теме A/B тестирования
 */

export interface WeeklyChallenge {
  id: string;
  week: number;
  title: string;
  description: string;
  theme: string;
  icon: string;
  questionIds: number[]; // 10 вопросов
  reward: {
    xp: number;
    badge?: string;
    description: string;
  };
  difficulty: 'junior' | 'mid' | 'senior';
}

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'week-1-basics',
    week: 1,
    title: 'Неделя основ',
    description: 'Погрузись в фундаментальные концепции A/B тестирования',
    theme: 'Основы A/B тестирования, формулирование гипотез, метрики',
    icon: '🎓',
    questionIds: [1, 41, 11, 91, 111, 112, 113, 22, 31, 51],
    reward: {
      xp: 500,
      badge: '🎓 Основы освоены',
      description: '+500 XP и значок "Знаток основ"'
    },
    difficulty: 'junior'
  },
  {
    id: 'week-2-statistics',
    week: 2,
    title: 'Неделя статистики',
    description: 'Освой статистические методы и p-value',
    theme: 'P-value, статистическая значимость, ошибки I и II рода',
    icon: '📊',
    questionIds: [2, 12, 32, 42, 52, 62, 72, 82, 92, 102],
    reward: {
      xp: 600,
      badge: '📊 Мастер статистики',
      description: '+600 XP и значок "Статистик"'
    },
    difficulty: 'junior'
  },
  {
    id: 'week-3-sample-size',
    week: 3,
    title: 'Неделя размера выборки',
    description: 'Научись правильно рассчитывать sample size и power',
    theme: 'Sample size, статистическая мощность, MDE',
    icon: '🔢',
    questionIds: [3, 13, 23, 33, 43, 53, 63, 73, 83, 93],
    reward: {
      xp: 700,
      badge: '🔢 Калькулятор размера',
      description: '+700 XP и значок "Размер имеет значение"'
    },
    difficulty: 'mid'
  },
  {
    id: 'week-4-metrics',
    week: 4,
    title: 'Неделя метрик',
    description: 'Выбор правильных метрик - ключ к успеху',
    theme: 'Выбор метрик, guardrail metrics, OEC',
    icon: '🎯',
    questionIds: [4, 14, 24, 34, 44, 54, 64, 74, 84, 94],
    reward: {
      xp: 750,
      badge: '🎯 Снайпер метрик',
      description: '+750 XP и значок "Метрик-снайпер"'
    },
    difficulty: 'mid'
  },
  {
    id: 'week-5-design',
    week: 5,
    title: 'Неделя дизайна экспериментов',
    description: 'A/A тесты, рандомизация, и продвинутые дизайны',
    theme: 'A/A тесты, рандомизация, многорукие бандиты',
    icon: '🎨',
    questionIds: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95],
    reward: {
      xp: 800,
      badge: '🎨 Дизайнер экспериментов',
      description: '+800 XP и значок "Архитектор тестов"'
    },
    difficulty: 'mid'
  },
  {
    id: 'week-6-pitfalls',
    week: 6,
    title: 'Неделя ловушек',
    description: 'Изучи все способы ошибиться в A/B тестах',
    theme: 'Peeking, множественное тестирование, Simpson paradox',
    icon: '⚠️',
    questionIds: [6, 16, 26, 36, 46, 56, 66, 76, 86, 96],
    reward: {
      xp: 850,
      badge: '⚠️ Охотник за багами',
      description: '+850 XP и значок "Багхантер"'
    },
    difficulty: 'senior'
  },
  {
    id: 'week-7-scale',
    week: 7,
    title: 'Неделя масштаба',
    description: 'A/B тестирование на уровне BigTech',
    theme: 'Experimentation platforms, automation, культура',
    icon: '🚀',
    questionIds: [7, 17, 27, 37, 47, 57, 67, 77, 87, 97],
    reward: {
      xp: 900,
      badge: '🚀 BigTech масштаб',
      description: '+900 XP и значок "Мастер масштаба"'
    },
    difficulty: 'senior'
  },
  {
    id: 'week-8-master',
    week: 8,
    title: 'Неделя мастера',
    description: 'Финальный босс - самые сложные кейсы',
    theme: 'Комплексные кейсы, принятие решений, трейдоффы',
    icon: '👑',
    questionIds: [8, 18, 28, 38, 48, 58, 68, 78, 88, 98],
    reward: {
      xp: 1000,
      badge: '👑 Мастер A/B тестов',
      description: '+1000 XP и значок "Легенда"'
    },
    difficulty: 'senior'
  }
];

/**
 * Получить текущий активный челлендж на основе даты
 * Челленджи меняются каждый понедельник
 */
export function getCurrentWeeklyChallenge(): WeeklyChallenge {
  const now = new Date();
  // Определяем номер недели в году
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const daysSinceStart = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(daysSinceStart / 7) % 8; // Цикл из 8 недель
  
  return WEEKLY_CHALLENGES[weekNumber];
}

/**
 * Получить прогресс по челленджу
 */
export function getChallengeProgress(
  challenge: WeeklyChallenge,
  answeredQuestionIds: number[]
): {
  completed: number;
  total: number;
  percentage: number;
} {
  const completed = challenge.questionIds.filter(id => 
    answeredQuestionIds.includes(id)
  ).length;
  
  return {
    completed,
    total: challenge.questionIds.length,
    percentage: (completed / challenge.questionIds.length) * 100
  };
}

