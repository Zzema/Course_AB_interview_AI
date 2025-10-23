export type LevelName = 'junior' | 'mid' | 'senior' | 'staff';

interface LevelInfo {
    name: LevelName;
    displayName: string;
    min: number;
    max: number;
}

/**
 * Уровни мастерства (не путать с целевой позицией!)
 * 
 * Это динамический показатель - может расти и падать в зависимости от ответов.
 * Показывает, насколько хорошо пользователь владеет материалом.
 * 
 * Расчет XP для среднестатистического прохождения:
 * - Средняя сложность: 5
 * - Средняя оценка: 7
 * - XP за вопрос: 5 * 5 * 0.7 ≈ 18 XP
 * 
 * Новичок → Практик: 250 XP ≈ 14 вопросов
 * Практик → Мастер: 750 XP ≈ 42 вопроса (всего ~56 вопросов)
 * Мастер → Эксперт: 1750 XP ≈ 97 вопросов (всего ~153 вопроса)
 */
const LEVELS: LevelInfo[] = [
    { name: 'junior', displayName: 'НОВИЧОК', min: 0, max: 250 },
    { name: 'mid', displayName: 'ПРАКТИК', min: 250, max: 750 },
    { name: 'senior', displayName: 'МАСТЕР', min: 750, max: 1750 },
    { name: 'staff', displayName: 'ЭКСПЕРТ', min: 1750, max: Infinity }
];

export interface LevelData {
    currentLevel: LevelName;
    currentLevelName: string;
    nextLevel: LevelName | null;
    nextLevelName: string;
    currentXP: number;
    nextLevelXP: number;
    progress: number;
    numericLevel: number; // For "Lvl 12" type display
}

export function calculateLevel(xp: number): LevelData {
    // Find current level
    let currentLevelInfo = LEVELS[0];
    for (const level of LEVELS) {
        if (xp >= level.min && xp < level.max) {
            currentLevelInfo = level;
            break;
        }
    }

    // Find next level
    const currentIndex = LEVELS.findIndex(l => l.name === currentLevelInfo.name);
    const nextLevelInfo = currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;

    // Calculate progress within current level
    const levelMin = currentLevelInfo.min;
    const levelMax = currentLevelInfo.max === Infinity ? levelMin + 1000 : currentLevelInfo.max;
    const levelRange = levelMax - levelMin;
    const currentProgress = xp - levelMin;
    const progress = Math.min((currentProgress / levelRange) * 100, 100);

    // Calculate numeric level (for visual display)
    // Map XP to a 1-100 scale more granularly
    const numericLevel = Math.floor(xp / 100) + 1;

    return {
        currentLevel: currentLevelInfo.name,
        currentLevelName: currentLevelInfo.displayName,
        nextLevel: nextLevelInfo?.name || null,
        nextLevelName: nextLevelInfo?.displayName || 'MAX LEVEL',
        currentXP: xp,
        nextLevelXP: levelMax,
        progress,
        numericLevel
    };
}

export function scoreToLevel(score: number): number {
    // Convert 0-100 score to level 1-10
    return Math.ceil(score / 10) || 1;
}

export function getAbilityDescription(score: number): string {
    if (score >= 90) return 'Мастер! Отличное понимание темы 🌟';
    if (score >= 75) return 'Хорошее владение материалом';
    if (score >= 50) return 'Требуется дополнительная практика';
    return 'Нужно больше фокуса на этой теме';
}

