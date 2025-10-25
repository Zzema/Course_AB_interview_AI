/**
 * ============================================================================
 * ACTIVITY SERIES MANAGER
 * ============================================================================
 * Управление системой серий активности (ежедневная активность пользователя)
 * 
 * Основные функции:
 * - Инициализация новой серии
 * - Проверка и обновление серии при логине
 * - Управление milestone'ами (награды за 3, 7, 14, 30 дней)
 * - Завершение ежедневного квеста
 * - Претензия наград за milestone'ы
 * 
 * Логика серии:
 * - Серия продолжается, если пользователь заходит ежедневно (в течение 24 часов)
 * - Серия прерывается, если пропущен день (больше 24 часов)
 * - При прерывании серии - начинается новая серия с 1 дня
 * - Рекорд серии (longestSeries) сохраняется навсегда
 */

import { ActivitySeries, SeriesMilestone, GameState } from '../types';

// ============================================================================
// КОНФИГУРАЦИЯ MILESTONE'ОВ
// ============================================================================

/**
 * Награды за достижение определенного количества дней подряд
 * ВАЖНО: Порядок важен - от меньшего к большему
 */
const SERIES_MILESTONES_CONFIG: Omit<SeriesMilestone, 'unlocked' | 'claimed'>[] = [
  {
    days: 3,
    reward: {
      type: 'item',
      value: 1,
      itemType: 'question_skip',
      description: '🎲 Пропуск вопроса'
    }
  },
  {
    days: 5,
    reward: {
      type: 'xp',
      value: 30,
      description: '+30 бонусного XP'
    }
  },
  {
    days: 7,
    reward: {
      type: 'xp',
      value: 70, // было 100
      description: '+70 бонусного XP'
    }
  },
  {
    days: 10,
    reward: {
      type: 'xp',
      value: 50,
      description: '+50 бонусного XP'
    }
  },
  {
    days: 14,
    reward: {
      type: 'item',
      value: 1,
      itemType: 'series_protection',
      description: '🛡️ Защита серии'
    }
  },
  {
    days: 21,
    reward: {
      type: 'xp',
      value: 200,
      description: '+200 бонусного XP'
    }
  },
  {
    days: 30,
    reward: {
      type: 'xp',
      value: 300, // было 500
      description: '+300 бонусного XP'
    }
  }
];

// ============================================================================
// ОСНОВНЫЕ ФУНКЦИИ
// ============================================================================

/**
 * Инициализация новой серии активности
 * Используется для новых пользователей или при первой миграции
 */
export function initializeActivitySeries(): ActivitySeries {
  return {
    currentSeries: 0,
    longestSeries: 0,
    lastActiveDate: '',
    todayCompleted: false,
    seriesMilestones: SERIES_MILESTONES_CONFIG.map(m => ({
      ...m,
      unlocked: false,
      claimed: false
    }))
  };
}

/**
 * Проверка и обновление серии активности при логине
 * 
 * @param gameState - текущее состояние игры
 * @param currentDate - текущая дата в формате YYYY-MM-DD
 * @returns обновленная серия и статус изменения
 * 
 * Возможные статусы:
 * - 'continued': серия продолжается (вчера был активен)
 * - 'started': начало новой серии (первый заход или после долгого перерыва)
 * - 'broken': серия прервана (пропущен день)
 * - 'same_day': заход в тот же день (серия не меняется)
 */
export function checkAndUpdateSeries(
  gameState: GameState,
  currentDate: string
): { 
  series: ActivitySeries; 
  status: 'continued' | 'started' | 'broken' | 'same_day';
  previousSeries?: number; // для отображения в модалке потери
} {
  const series = gameState.activitySeries || initializeActivitySeries();
  const lastDate = series.lastActiveDate;
  
  // ========================================
  // СЛУЧАЙ 1: Тот же день (повторный заход)
  // ========================================
  if (lastDate === currentDate) {
    console.log('🔄 Same day login - no series update');
    return { series, status: 'same_day' };
  }
  
  // ========================================
  // СЛУЧАЙ 2: Вчера был последний день (серия продолжается)
  // ========================================
  const yesterday = getYesterdayDate(currentDate);
  const isConsecutive = lastDate === yesterday;
  
  if (isConsecutive) {
    console.log('✅ Series continued!', { from: lastDate, to: currentDate });
    
    const newSeriesLength = series.currentSeries + 1;
    const newSeries: ActivitySeries = {
      ...series,
      currentSeries: newSeriesLength,
      longestSeries: Math.max(series.longestSeries, newSeriesLength),
      lastActiveDate: currentDate,
      todayCompleted: false // сбрасываем флаг выполнения дневного квеста
    };
    
    // Проверяем, не достигли ли мы новых milestone'ов
    newSeries.seriesMilestones = newSeries.seriesMilestones.map(m => {
      if (m.days <= newSeriesLength && !m.unlocked) {
        console.log(`🎁 Milestone unlocked: ${m.days} days!`);
        return { ...m, unlocked: true };
      }
      return m;
    });
    
    return { series: newSeries, status: 'continued' };
  }
  
  // ========================================
  // СЛУЧАЙ 3: Первый заход или начало новой серии
  // ========================================
  if (!lastDate || series.currentSeries === 0) {
    console.log('🆕 Starting new series');
    
    const newSeries: ActivitySeries = {
      ...series,
      currentSeries: 1,
      longestSeries: Math.max(series.longestSeries, 1),
      lastActiveDate: currentDate,
      todayCompleted: false
    };
    
    return { series: newSeries, status: 'started' };
  }
  
  // ========================================
  // СЛУЧАЙ 4: Серия прервана (пропущен день)
  // ========================================
  console.log('💔 Series broken!', { 
    lastDate, 
    currentDate, 
    lostSeries: series.currentSeries 
  });
  
  const previousSeriesLength = series.currentSeries;
  
  const newSeries: ActivitySeries = {
    ...series,
    currentSeries: 1, // начинаем новую серию
    lastActiveDate: currentDate,
    todayCompleted: false,
    // Сбрасываем все непретензированные milestone'ы
    seriesMilestones: series.seriesMilestones.map(m => ({
      ...m,
      unlocked: false,
      claimed: false
    }))
  };
  
  return { 
    series: newSeries, 
    status: 'broken',
    previousSeries: previousSeriesLength
  };
}

/**
 * Отметить ежедневный квест как выполненный
 * Вызывается когда пользователь завершил daily quest
 */
export function completeDailyQuest(series: ActivitySeries): ActivitySeries {
  console.log('✅ Daily quest completed for today');
  
  return {
    ...series,
    todayCompleted: true
  };
}

/**
 * Претензия награды за milestone серии
 * Вызывается когда пользователь нажимает "Забрать награду"
 * 
 * @param series - текущая серия
 * @param days - количество дней milestone'а для претензии
 * @returns обновленная серия с претензированным milestone'ом
 */
export function claimSeriesMilestone(
  series: ActivitySeries,
  days: number
): ActivitySeries {
  console.log(`🎁 Claiming milestone reward: ${days} days`);
  
  return {
    ...series,
    seriesMilestones: series.seriesMilestones.map(m => 
      m.days === days ? { ...m, claimed: true } : m
    )
  };
}

/**
 * Получить следующий milestone для отображения прогресса
 * Возвращает ближайший неполученный milestone
 */
export function getNextMilestone(series: ActivitySeries): SeriesMilestone | null {
  const nextMilestone = series.seriesMilestones.find(
    m => m.days > series.currentSeries
  );
  
  return nextMilestone || null;
}

/**
 * Получить все разблокированные, но непретензированные milestone'ы
 * Используется для отображения квестов с наградами
 */
export function getUnclaimedMilestones(series: ActivitySeries): SeriesMilestone[] {
  return series.seriesMilestones.filter(
    m => m.unlocked && !m.claimed
  );
}

// ============================================================================
// HELPER ФУНКЦИИ (работа с датами)
// ============================================================================

/**
 * Получить вчерашнюю дату
 * @param dateString - дата в формате YYYY-MM-DD
 * @returns вчерашняя дата в формате YYYY-MM-DD
 */
function getYesterdayDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00'); // добавляем время для корректного парсинга
  date.setDate(date.getDate() - 1);
  return formatDateToYYYYMMDD(date);
}

/**
 * Получить конец текущего дня (23:59:59)
 * Используется для expiresAt ежедневных квестов
 */
export function getEndOfDay(dateString: string): number {
  const date = new Date(dateString + 'T23:59:59');
  return date.getTime();
}

/**
 * Получить текущую дату в формате YYYY-MM-DD
 * ВАЖНО: Используем локальную timezone пользователя
 */
export function getCurrentDateString(): string {
  const now = new Date();
  return formatDateToYYYYMMDD(now);
}

/**
 * Форматировать Date в YYYY-MM-DD
 */
function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Получить количество дней между двумя датами
 */
export function getDaysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1 + 'T00:00:00');
  const d2 = new Date(date2 + 'T00:00:00');
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Проверить, истек ли ежедневный квест
 */
export function isQuestExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt;
}

/**
 * Получить оставшееся время до истечения квеста в формате "Xч Yм"
 */
export function getTimeRemaining(expiresAt: number): string {
  const now = Date.now();
  const diff = expiresAt - now;
  
  if (diff <= 0) {
    return 'Истек';
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  }
  
  return `${minutes}м`;
}

