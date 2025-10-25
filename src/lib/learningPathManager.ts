import { GameState, UserLearningProgress, ModuleProgress, LearningModule } from '../types';
import { LEARNING_PATH_DATA, getModuleById } from '../data/learningPathData';

/**
 * Learning Path Manager
 * Утилиты для работы с прогрессом пользователя по модулям
 */

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================================

export function initializeLearningProgress(): UserLearningProgress {
  return {
    currentLevel: 1,
    currentModuleId: '1.1',
    completedModuleIds: [],
    completedCheckpointIds: [],
    moduleProgress: {},
    earnedBadges: []
  };
}

// ============================================================================
// ПОЛУЧЕНИЕ ПРОГРЕССА
// ============================================================================

export function getModuleProgress(
  gameState: GameState,
  moduleId: string
): ModuleProgress {
  const existing = gameState.learningProgress?.moduleProgress[moduleId];
  
  if (existing) {
    return existing;
  }
  
  // Создаем новый прогресс для модуля
  return {
    moduleId,
    startedAt: Date.now(),
    answeredQuestionIds: [],
    questionScores: {},
    avgScore: 0,
    checkpointCompleted: false
  };
}

// ============================================================================
// ПРОВЕРКА СТАТУСА
// ============================================================================

export function isModuleUnlocked(
  learningProgress: UserLearningProgress,
  moduleId: string
): boolean {
  const module = getModuleById(moduleId);
  if (!module) return false;
  
  // Первый модуль всегда разблокирован
  if (moduleId === '1.1') return true;
  
  // Проверяем unlock requirements
  if (module.unlockRequirements) {
    return module.unlockRequirements.every(reqId =>
      learningProgress.completedModuleIds.includes(reqId)
    );
  }
  
  return true;
}

export function isModuleCompleted(
  moduleProgress: ModuleProgress,
  module: LearningModule
): boolean {
  const questionsCompleted = moduleProgress.answeredQuestionIds.length;
  const meetsMinQuestions = questionsCompleted >= module.checkpointCriteria.minQuestionsCompleted;
  const meetsMinScore = moduleProgress.avgScore >= module.checkpointCriteria.minAvgScore;
  
  return meetsMinQuestions && meetsMinScore;
}

export function canTakeCheckpoint(
  learningProgress: UserLearningProgress,
  checkpointId: string
): boolean {
  // Уже пройден?
  if (learningProgress.completedCheckpointIds.includes(checkpointId)) {
    return false;
  }
  
  // Для level checkpoint - все модули уровня должны быть завершены
  if (checkpointId.startsWith('checkpoint-level-')) {
    const levelId = parseInt(checkpointId.split('-')[2]) as 1 | 2 | 3;
    const level = LEARNING_PATH_DATA.levels.find(l => l.id === levelId);
    
    if (!level) return false;
    
    return level.modules.every(module =>
      learningProgress.completedModuleIds.includes(module.id)
    );
  }
  
  return true;
}

// ============================================================================
// ОБНОВЛЕНИЕ ПРОГРЕССА
// ============================================================================

export function updateModuleProgress(
  gameState: GameState,
  moduleId: string,
  questionId: number,
  score: number
): GameState {
  if (!gameState.learningProgress) {
    gameState.learningProgress = initializeLearningProgress();
  }
  
  const moduleProgress = getModuleProgress(gameState, moduleId);
  
  // Обновляем прогресс
  if (!moduleProgress.answeredQuestionIds.includes(questionId)) {
    moduleProgress.answeredQuestionIds.push(questionId);
  }
  
  moduleProgress.questionScores[questionId] = score;
  
  // Пересчитываем среднюю оценку
  const scores = Object.values(moduleProgress.questionScores);
  moduleProgress.avgScore = scores.length > 0
    ? scores.reduce((sum, s) => sum + s, 0) / scores.length
    : 0;
  
  // Сохраняем обновленный прогресс
  gameState.learningProgress.moduleProgress[moduleId] = moduleProgress;
  
  // Проверяем, завершен ли модуль
  const module = getModuleById(moduleId);
  if (module && isModuleCompleted(moduleProgress, module)) {
    if (!gameState.learningProgress.completedModuleIds.includes(moduleId)) {
      gameState.learningProgress.completedModuleIds.push(moduleId);
      moduleProgress.completedAt = Date.now();
    }
  }
  
  return gameState;
}

export function completeCheckpoint(
  learningProgress: UserLearningProgress,
  checkpointId: string
): UserLearningProgress {
  if (!learningProgress.completedCheckpointIds.includes(checkpointId)) {
    learningProgress.completedCheckpointIds.push(checkpointId);
  }
  
  return learningProgress;
}

export function addBadge(
  learningProgress: UserLearningProgress,
  badgeId: string
): UserLearningProgress {
  if (!learningProgress.earnedBadges.includes(badgeId)) {
    learningProgress.earnedBadges.push(badgeId);
  }
  
  return learningProgress;
}

// ============================================================================
// РЕКОМЕНДАЦИИ
// ============================================================================

export function getNextRecommendedModule(
  learningProgress: UserLearningProgress
): LearningModule | null {
  const allModules = LEARNING_PATH_DATA.levels.flatMap(level => level.modules);
  
  // Находим первый незавершенный разблокированный модуль
  for (const module of allModules) {
    if (
      !learningProgress.completedModuleIds.includes(module.id) &&
      isModuleUnlocked(learningProgress, module.id)
    ) {
      return module;
    }
  }
  
  return null;
}

export function calculateOverallProgress(
  learningProgress: UserLearningProgress
): number {
  const totalModules = LEARNING_PATH_DATA.levels.reduce(
    (sum, level) => sum + level.modules.length,
    0
  );
  
  const completedModules = learningProgress.completedModuleIds.length;
  
  return totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
}

// ============================================================================
// СИНХРОНИЗАЦИЯ С FREE PRACTICE
// ============================================================================

/**
 * Синхронизирует прогресс из Free Practice с модулями
 * Вызывается после каждого ответа на вопрос
 */
export function syncQuestionAnswerToModules(
  gameState: GameState,
  questionId: number,
  score: number
): GameState {
  if (!gameState.learningProgress) {
    gameState.learningProgress = initializeLearningProgress();
  }
  
  // Находим все модули, которые содержат этот вопрос
  const allModules = LEARNING_PATH_DATA.levels.flatMap(level => level.modules);
  const affectedModules = allModules.filter(module =>
    module.questionIds.includes(questionId)
  );
  
  // Обновляем прогресс во всех затронутых модулях
  for (const module of affectedModules) {
    gameState = updateModuleProgress(gameState, module.id, questionId, score);
  }
  
  return gameState;
}

/**
 * Проверяет, есть ли новые завершенные модули после ответа
 * Возвращает список ID завершенных модулей
 */
export function checkNewlyCompletedModules(
  gameState: GameState,
  previousCompletedIds: string[]
): string[] {
  if (!gameState.learningProgress) return [];
  
  const currentCompletedIds = gameState.learningProgress.completedModuleIds;
  
  return currentCompletedIds.filter(id => !previousCompletedIds.includes(id));
}

