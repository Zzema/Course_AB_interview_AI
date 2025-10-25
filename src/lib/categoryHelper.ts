import { Category } from '../types';
import { LEARNING_MODULES } from '../data/learningPathData';

/**
 * Вычисляет категории вопроса на основе его модулей
 * @param modules - массив ID модулей вопроса (например, ['1.1', '2.3'])
 * @returns массив категорий
 */
export function getCategoriesFromModules(modules: string[]): Category[] {
  if (!modules || modules.length === 0) {
    // Fallback для вопросов без модулей (не должно быть после миграции)
    return ['foundations'];
  }

  const categories = new Set<Category>();
  
  modules.forEach(moduleId => {
    const module = LEARNING_MODULES.find(m => m.id === moduleId);
    if (module) {
      categories.add(module.category);
    }
  });

  // Возвращаем как массив
  return Array.from(categories);
}

/**
 * Маппинг questionId -> modules для всех вопросов
 * Построен на основе learningPathData.ts
 */
export const QUESTION_TO_MODULES_MAP: Record<number, string[]> = {
  // Module 1.1: Введение в A/B тестирование
  1: ['1.1'],
  41: ['1.1'],
  91: ['1.1'],
  111: ['1.1'],
  112: ['1.1'],
  113: ['1.1'],

  // Module 1.2: Статистические основы
  114: ['1.2'],
  115: ['1.2'],
  116: ['1.2'],
  117: ['1.2'],

  // Module 1.3: Формулирование гипотез
  22: ['1.3'],
  118: ['1.3'],
  119: ['1.3'],
  120: ['1.3'],
  121: ['1.3'],

  // Module 1.4: Выбор метрик
  31: ['1.4'],
  81: ['1.4'],
  122: ['1.4'],
  123: ['1.4'],
  124: ['1.4'],

  // Module 1.5: Рандомизация и A/A тесты
  11: ['1.5', '2.3'], // Появляется в двух модулях
  26: ['1.5', '2.3'], // Появляется в двух модулях
  125: ['1.5'],
  126: ['1.5'],
  127: ['1.5'],

  // Module 2.1: Дизайн эксперимента
  2: ['2.1'],
  128: ['2.1'],
  129: ['2.1'],
  130: ['2.1'],

  // Module 2.2: Статистические тесты
  131: ['2.2'],
  132: ['2.2'],
  133: ['2.2'],

  // Module 2.3: Подводные камни
  71: ['2.3'],
  // 11 и 26 уже добавлены выше

  // Module 2.4: Анализ результатов
  134: ['2.4'],
  135: ['2.4'],
  136: ['2.4'],
  137: ['2.4'],

  // Module 2.5: Продуктовые кейсы
  138: ['2.5'],
  139: ['2.5'],
  140: ['2.5'],

  // Module 3.1: Продвинутые методы
  141: ['3.1'],
  142: ['3.1'],
  143: ['3.1'],

  // Module 3.2: Интерпретация
  7: ['3.2'],
  8: ['3.2'],
  9: ['3.2'],

  // Module 3.3: Сложные продуктовые кейсы
  144: ['3.3'],
  145: ['3.3'],
  146: ['3.3'],
  147: ['3.3'],

  // Module 3.4: Инфраструктура
  148: ['3.4'],
  149: ['3.4'],
  150: ['3.4'],
  151: ['3.4'],
  152: ['3.4'],

  // Module 3.5: Лидерство
  153: ['3.5'],
  154: ['3.5'],
  155: ['3.5'],
  156: ['3.5'],

  // ОСТАЛЬНЫЕ 110 ВОПРОСОВ - нужно вручную добавить логику распределения
  // Временно присваиваем базовые модули на основе их categories и seniority
  
  // Junior foundations
  3: ['1.2'], // statistics
  4: ['1.2'], // statistics
  12: ['1.4'], // metrics
  13: ['2.1'], // design - experiment duration
  14: ['3.2'], // interpretation
  15: ['2.5'], // cases
  16: ['2.4'], // analysis - multiple comparisons
  17: ['2.4'], // analysis
  18: ['1.4'], // metrics
  19: ['2.1'], // design - MDE
  20: ['2.5'], // cases
  21: ['3.1'], // advanced_methods - bayesian
  23: ['1.2'], // statistics - power
  24: ['3.3'], // advanced - network effects
  25: ['3.2'], // interpretation
  27: ['1.5'], // design - randomization
  28: ['2.5'], // cases
  29: ['2.4'], // analysis - outliers
  30: ['3.1'], // advanced - CUPED
  32: ['1.5'], // design - A/A/B
  33: ['3.2'], // interpretation - long term
  34: ['2.2'], // statistics - tests
  35: ['3.3'], // cases
  36: ['2.2'], // statistics
  37: ['2.3'], // pitfalls - novelty
  38: ['2.3'], // pitfalls - peeking
  39: ['3.1'], // advanced - sequential
  40: ['3.1'], // advanced - bandits
  42: ['1.4'], // metrics
  43: ['2.1'], // design - duration
  44: ['3.3'], // cases
  45: ['2.2'], // statistics - bootstrap
  46: ['3.2'], // interpretation
  47: ['2.3'], // pitfalls - SRM
  48: ['2.4'], // analysis - LTV
  49: ['3.1'], // advanced - factorial
  50: ['2.5'], // cases
  51: ['2.1'], // design - power/MDE
  52: ['2.3'], // pitfalls - regression to mean
  53: ['3.3'], // cases - new users
  54: ['2.5'], // cases - push
  55: ['3.3'], // cases - small sample
  56: ['1.4'], // metrics - proxy
  57: ['2.3'], // pitfalls - early stopping
  58: ['2.2'], // statistics - non-normal
  59: ['3.1'], // advanced - switchback
  60: ['3.3'], // cases - checkout
  61: ['2.3'], // pitfalls - novelty effects
  62: ['1.4'], // metrics - health
  63: ['3.3'], // cases - learning effect
  64: ['2.5'], // cases - pricing
  65: ['3.1'], // advanced - platform
  66: ['1.4'], // metrics - too many
  67: ['2.4'], // analysis - Simpson's paradox
  68: ['2.5'], // cases - mobile vs desktop
  69: ['2.2'], // statistics - delta method
  70: ['3.3'], // cases - rebrand
  72: ['1.5'], // design - splitting system
  73: ['3.2'], // interpretation - statistical vs practical
  74: ['2.4'], // analysis - variance
  75: ['1.4'], // metrics - North Star
  76: ['2.2'], // statistics - skewed data
  77: ['1.3'], // foundations - correlation
  78: ['2.1'], // design - trigger-based
  79: ['2.5'], // cases - search ranking
  80: ['3.5'], // leadership - culture
  82: ['2.5'], // cases - pricing page
  83: ['2.3'], // pitfalls - CEO interpretation
  84: ['2.3'], // pitfalls - cannibalization
  85: ['1.4'], // metrics - zombie metrics
  86: ['2.1'], // design - min sample size
  87: ['3.2'], // interpretation - p=0.06
  88: ['2.5'], // cases - email
  89: ['3.1'], // advanced - interleaving
  90: ['3.5'], // leadership - ethics
  92: ['1.4'], // metrics - multiple goals
  93: ['2.4'], // analysis - multiple metrics
  94: ['3.1'], // advanced - quasi-experiments
  95: ['2.5'], // cases - registration vs retention
  96: ['3.1'], // advanced - p-hacking
  97: ['3.4'], // infrastructure - tools
  98: ['3.2'], // interpretation - Twyman's Law
  99: ['2.5'], // cases - video streaming churn
  100: ['3.5'], // leadership - trends
  101: ['2.1'], // design - power tradeoff
  102: ['3.4'], // infrastructure - platform architecture
  103: ['3.3'], // advanced - marketplace two-sided
  104: ['2.4'], // analysis - heavy tail
  105: ['2.1'], // design - ratio metrics sample size
  106: ['3.5'], // leadership - CEO wants 80% tests
  107: ['3.5'], // leadership - PM wants launch
  108: ['2.4'], // analysis - multiple experiments
  109: ['3.4'], // infrastructure - limited traffic
  110: ['3.1'], // advanced - small DAU startup
};

