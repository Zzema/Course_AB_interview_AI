/**
 * ============================================================================
 * REFERRAL SYSTEM - Реферальная программа
 * ============================================================================
 * Трекинг приглашений, начисление наград, генерация квестов
 */

import { GameState, Quest } from '../types';

/**
 * Генерирует уникальный реферальный код для пользователя
 */
export function generateReferralCode(userName: string): string {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const namePart = userName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
  return `${namePart}${randomPart}`;
}

/**
 * Инициализирует реферальную систему для нового пользователя
 */
export function initializeReferralSystem(gameState: GameState, userEmail: string): GameState {
  if (!gameState.referralCode) {
    gameState.referralCode = userEmail; // Используем email как реферальный код
    gameState.referrals = [];
    gameState.referralRewards = {
      count: 0,
      xpEarned: 0,
      itemsEarned: []
    };
  }
  return gameState;
}

/**
 * Обрабатывает реферальную ссылку при регистрации
 */
export function processReferralLink(
  gameState: GameState,
  referrerCode: string | null
): GameState {
  if (referrerCode && !gameState.referredBy) {
    gameState.referredBy = referrerCode;
    console.log(`User was referred by: ${referrerCode}`);
  }
  return gameState;
}

/**
 * Добавляет реферала и начисляет награды
 */
export function addReferral(
  referrerGameState: GameState,
  referralCode: string
): { gameState: GameState; rewards: any[] } {
  if (!referrerGameState.referrals) {
    referrerGameState.referrals = [];
  }

  // Проверяем, не добавлен ли уже этот реферал
  if (referrerGameState.referrals.includes(referralCode)) {
    return { gameState: referrerGameState, rewards: [] };
  }

  // Добавляем реферала
  referrerGameState.referrals.push(referralCode);
  
  if (!referrerGameState.referralRewards) {
    referrerGameState.referralRewards = {
      count: 0,
      xpEarned: 0,
      itemsEarned: []
    };
  }

  referrerGameState.referralRewards.count++;

  // Определяем награды на основе количества рефералов
  const rewards = getReferralRewards(referrerGameState.referralRewards.count);

  // Применяем награды
  referrerGameState.rating += rewards.xp;
  referrerGameState.referralRewards.xpEarned += rewards.xp;

  if (rewards.items) {
    if (!referrerGameState.inventory) {
      referrerGameState.inventory = {
        questionSkips: 0,
        seriesProtection: 0
      };
    }

    rewards.items.forEach(item => {
      if (item.type === 'question_skip') {
        referrerGameState.inventory!.questionSkips += item.value;
      } else if (item.type === 'series_protection') {
        referrerGameState.inventory!.seriesProtection += item.value;
      }
      
      referrerGameState.referralRewards!.itemsEarned.push(item);
    });
  }

  return { gameState: referrerGameState, rewards };
}

/**
 * Определяет награды за количество рефералов
 */
export function getReferralRewards(count: number): {
  xp: number;
  items?: { type: string; value: number; description: string }[];
  badge?: string;
} {
  switch (count) {
    case 1:
      return {
        xp: 100,
        items: [{ type: 'question_skip', value: 1, description: '🎲 Пропуск вопроса' }]
      };
    case 3:
      return {
        xp: 300,
        items: [{ type: 'series_protection', value: 1, description: '🛡️ Защита серии' }],
        badge: '🎯 Рекрутер'
      };
    case 5:
      return {
        xp: 500,
        badge: '🌟 Амбассадор'
      };
    case 10:
      return {
        xp: 1000,
        badge: '👑 Легендарный амбассадор'
      };
    default:
      // За каждого следующего +100 XP
      return {
        xp: 100
      };
  }
}

/**
 * Генерирует реферальный квест
 */
export function generateReferralQuest(gameState: GameState): Quest | null {
  const referralCount = gameState.referrals?.length || 0;

  // Квест доступен если пригласил менее 10 человек
  if (referralCount >= 10) {
    return null;
  }

  // Определяем следующий milestone
  let nextMilestone = 1;
  if (referralCount >= 5) nextMilestone = 10;
  else if (referralCount >= 3) nextMilestone = 5;
  else if (referralCount >= 1) nextMilestone = 3;

  const rewards = getReferralRewards(nextMilestone);
  const rewardsArray = [
    {
      type: 'xp' as const,
      value: rewards.xp,
      description: `+${rewards.xp} XP`
    }
  ];

  if (rewards.items) {
    rewards.items.forEach(item => {
      rewardsArray.push({
        type: 'item' as const,
        value: item.value,
        itemType: item.type as any,
        description: item.description
      });
    });
  }

  return {
    id: `referral-${nextMilestone}`,
    title: '👥 Пригласи друзей',
    description: `Поделись реферальной ссылкой и получи награду когда друг зарегистрируется (${referralCount}/${nextMilestone})`,
    progress: {
      current: referralCount,
      total: nextMilestone
    },
    reward: rewards.xp,
    rewards: rewardsArray,
    completed: referralCount >= nextMilestone,
    urgent: false,
    type: 'achievement'
  };
}

/**
 * Получает URL реферальной ссылки
 */
export function getReferralLink(referralCode: string): string {
  return `https://course-ab-interview.web.app?ref=${referralCode}`;
}

/**
 * Парсит реферальный код из URL
 */
export function parseReferralFromURL(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('ref');
}

