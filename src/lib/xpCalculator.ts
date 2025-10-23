/**
 * XP Calculator - Новая система опыта
 * 
 * Формула для хороших ответов (score >= 4): XP = BASE_XP * difficulty * (score / 10)
 * Формула для плохих ответов (score < 4): XP = -PENALTY_XP * difficulty * ((4 - score) / 4)
 * 
 * Примеры положительного XP:
 * - difficulty=1, score=10 → 10 * 1 * 1.0 = 10 XP
 * - difficulty=5, score=8 → 10 * 5 * 0.8 = 40 XP
 * - difficulty=10, score=10 → 10 * 10 * 1.0 = 100 XP
 * - difficulty=5, score=6 → 10 * 5 * 0.6 = 30 XP
 * - difficulty=5, score=5 → 10 * 5 * 0.5 = 25 XP
 * - difficulty=5, score=4 → 10 * 5 * 0.4 = 20 XP (минимальный порог для роста)
 * 
 * Примеры отрицательного XP:
 * - difficulty=5, score=3 → -5 * 5 * (1/4) = -6 XP
 * - difficulty=5, score=2 → -5 * 5 * (2/4) = -13 XP
 * - difficulty=5, score=0 → -5 * 5 * (4/4) = -25 XP
 * - difficulty=10, score=1 → -5 * 10 * (3/4) = -38 XP
 */

const BASE_XP = 10; // Базовый XP за вопрос
const PENALTY_XP = 5; // Штраф за плохой ответ (меньше чем награда)
const SCORE_THRESHOLD = 4; // Порог между наградой и штрафом (4+ дает XP)

export interface XPCalculationResult {
    earnedXP: number; // Заработанный опыт
    breakdown: {
        baseXP: number;
        difficulty: number;
        scoreMultiplier: number;
    };
}

/**
 * Рассчитывает заработанный опыт
 * 
 * XP может быть положительным (за хорошие ответы) или отрицательным (за плохие).
 * Это позволяет уровню мастерства падать при плохой игре.
 */
export function calculateXP(
    overallScore: number, // 0-10
    difficulty: number    // 1-10
): XPCalculationResult {
    let earnedXP: number;
    let scoreMultiplier: number;
    
    // Если ответ хороший (>= 4) - даем XP
    if (overallScore >= SCORE_THRESHOLD) {
        scoreMultiplier = overallScore / 10;
        earnedXP = Math.round(BASE_XP * difficulty * scoreMultiplier);
    } 
    // Если ответ плохой (< 4) - отнимаем XP
    else {
        // Чем хуже ответ, тем больше штраф
        // score=3 → penalty=1/4, score=0 → penalty=4/4
        const penaltyMultiplier = (SCORE_THRESHOLD - overallScore) / SCORE_THRESHOLD;
        earnedXP = -Math.round(PENALTY_XP * difficulty * penaltyMultiplier);
        scoreMultiplier = -penaltyMultiplier;
    }

    return {
        earnedXP,
        breakdown: {
            baseXP: overallScore >= SCORE_THRESHOLD ? BASE_XP : PENALTY_XP,
            difficulty,
            scoreMultiplier
        }
    };
}

/**
 * Рассчитывает общий XP из истории попыток
 */
export function calculateTotalXP(questionAttempts: any[]): number {
    if (!questionAttempts || questionAttempts.length === 0) {
        return 0;
    }

    return questionAttempts.reduce((total, attempt) => {
        // Если есть earnedXP (новая система), используем его
        if (attempt.earnedXP !== undefined) {
            return total + attempt.earnedXP;
        }
        
        // Иначе пересчитываем из старых данных
        const result = calculateXP(attempt.feedback.overallScore, attempt.difficulty);
        return total + result.earnedXP;
    }, 0);
}

/**
 * Рассчитывает взвешенную среднюю оценку (с учетом сложности)
 */
export function calculateWeightedAverageScore(questionAttempts: any[]): number {
    if (!questionAttempts || questionAttempts.length === 0) {
        return 0;
    }

    const totalWeight = questionAttempts.reduce((sum, attempt) => 
        sum + attempt.difficulty, 0
    );

    const weightedSum = questionAttempts.reduce((sum, attempt) => 
        sum + (attempt.feedback.overallScore * attempt.difficulty), 0
    );

    return weightedSum / totalWeight;
}

/**
 * Рассчитывает среднюю оценку (простое среднее)
 */
export function calculateSimpleAverageScore(questionAttempts: any[]): number {
    if (!questionAttempts || questionAttempts.length === 0) {
        return 0;
    }

    const totalScore = questionAttempts.reduce((sum, attempt) => 
        sum + attempt.feedback.overallScore, 0
    );

    return totalScore / questionAttempts.length;
}

/**
 * Рассчитывает среднюю оценку по последним N вопросам
 */
export function calculateRecentAverageScore(
    questionAttempts: any[], 
    recentCount: number = 20
): number {
    if (!questionAttempts || questionAttempts.length === 0) {
        return 0;
    }

    const recentAttempts = questionAttempts.slice(-recentCount);
    return calculateSimpleAverageScore(recentAttempts);
}

/**
 * Рассчитывает лучшую оценку по каждому уникальному вопросу
 */
export function calculateBestAverageScore(questionAttempts: any[]): number {
    if (!questionAttempts || questionAttempts.length === 0) {
        return 0;
    }

    const bestScores = new Map<number, number>();
    
    questionAttempts.forEach(attempt => {
        const currentBest = bestScores.get(attempt.questionId) || 0;
        if (attempt.feedback.overallScore > currentBest) {
            bestScores.set(attempt.questionId, attempt.feedback.overallScore);
        }
    });

    if (bestScores.size === 0) return 0;

    const totalScore = Array.from(bestScores.values()).reduce((sum, score) => sum + score, 0);
    return totalScore / bestScores.size;
}

/**
 * Рассчитывает опыт на основе последних N вопросов
 * Используется для "горячей формы" - показывает текущую производительность
 */
export function calculateRecentRating(questionAttempts: any[], count: number = 20): number {
    if (!questionAttempts || questionAttempts.length === 0) {
        return 0;
    }
    
    // Берем последние N попыток
    const recentAttempts = questionAttempts.slice(-count);
    
    // Суммируем заработанный опыт (earnedXP) из этих попыток
    const totalRating = recentAttempts.reduce((sum, attempt) => {
        return sum + (attempt.earnedXP ?? 0);
    }, 0);
    
    return totalRating;
}

