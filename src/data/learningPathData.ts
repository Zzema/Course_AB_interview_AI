import { LearningPath, LearningModule, LearningLevel, Checkpoint } from '../types';

/**
 * LEARNING PATH DATA
 * Полная структура модулей для структурированного обучения
 */

// ============================================================================
// LEVEL 1: FOUNDATION (Новичок)
// ============================================================================

const MODULE_1_1: LearningModule = {
  id: '1.1',
  level: 1,
  category: 'foundations',
  title: 'Введение в A/B тестирование',
  description: 'Что такое A/B тест и зачем он нужен',
  theoryContent: `# 🎯 Введение в A/B тестирование

## Что такое A/B тестирование?

**A/B тестирование (сплит-тестирование)** — это контролируемый эксперимент, при котором пользователи случайным образом делятся на группы для сравнения разных версий продукта.

---

## 🔑 Ключевые компоненты

### Схема A/B теста:

▶ ПОЛЬЗОВАТЕЛИ
      ↓
   [Рандомизация]
      ↓
   ┌──────┴──────┐
   ↓             ↓
Группа A      Группа B
 (50%)         (50%)
   ↓             ↓
Вариант A    Вариант B
(контроль)   (изменение)
   ↓             ↓
Метрика A    Метрика B
 (10.0%)      (10.5%)
   ↓             ↓
   └──────┬──────┘
          ↓
       Анализ
          ↓
   p-value < 0.05?
 Запускать B для всех?

### 1. Контрольная группа (A)
• Видит текущую версию продукта (baseline)
• Используется как точка отсчета
• Обычно 50% пользователей

### 2. Тестовая группа (B)
• Видит новую версию с изменением
• Сравнивается с контролем
• Остальные 50% пользователей

### 3. Рандомизация
• Случайное распределение пользователей
• Гарантирует сопоставимость групп
• Исключает систематические различия

### 4. Метрика успеха
• Измеримый KPI (conversion, retention, revenue)
• Определяется ДО запуска теста
• Используется для принятия решения

---

## 💡 Зачем нужно A/B тестирование?

### 1. Доказательство причинности
**Корреляция ≠ Причинность**

❌ Обычная аналитика: "После редизайна конверсия выросла на 10%"
• Может быть сезонность
• Может быть маркетинговая кампания
• Может быть внешний фактор

✅ A/B тест: "Редизайн вызвал рост конверсии на 10%"
• Рандомизация исключает другие факторы
• Доказана причинно-следственная связь

### 2. Снижение рисков
• Тестируем на 10-50% пользователей
• При негативном эффекте — откатываемся
• Минимизируем потери

### 3. Data-driven культура
• Решения на основе фактов, а не мнений
• Объективная оценка идей
• Меньше субъективности

### 4. Непрерывная оптимизация
• Итеративное улучшение продукта
• Накопление знаний о пользователях
• Compound effect от множества тестов

---

## 📊 Реальные примеры из BigTech

### Netflix: Thumbnail optimization
**Проблема**: Какой thumbnail увеличит просмотры сериала?

**Тест**:
• Группа A: Thumbnail 1 (крупный план актера)
• Группа B: Thumbnail 2 (сцена экшена)

**Метрика**: % начавших смотреть (play rate)

**Результат**: Вариант B показал +15% → запущен для всех

**Эффект**: Миллионы дополнительных просмотров

### Google: 50 оттенков синего
**Проблема**: Какой оттенок синего для рекламных ссылок?

**Тест**: 40 вариантов оттенков синего

**Результат**: Оптимальный оттенок дал $200M+ дополнительного revenue в год

### Amazon: Free shipping threshold
**Проблема**: При какой сумме заказа предлагать бесплатную доставку?

**Тест**: $25 vs $35 vs $49

**Результат**: $35 оптимизировал баланс между конверсией и маржинальностью

---

## ⚡ Когда использовать A/B тест?

### ✅ Хорошо подходит для:
• Изменения UI/UX (кнопки, формы, layout)
• Pricing эксперименты
• Копирайтинг и messaging
• Recommendation алгоритмы
• Email/push уведомления

### ⚠️ Ограничения:
• Требует достаточный трафик (минимум тысячи пользователей)
• Нужно время (обычно 1-2+ недели)
• Не подходит для радикальных изменений всего продукта
• Измеряет "что работает", но не "почему"

---

## 🎓 Следующие шаги

В следующих модулях вы изучите:
• Статистические основы (p-value, ошибки I/II рода)
• Формулирование гипотез
• Выбор метрик
• Дизайн эксперимента
• Анализ результатов`,
  questionIds: [1, 41, 91, 111, 112, 113],
  checkpointCriteria: {
    minAvgScore: 5.0,
    minQuestionsCompleted: 6
  }
};

const MODULE_1_2: LearningModule = {
  id: '1.2',
  level: 1,
  category: 'statistics',
  title: 'Статистические основы',
  description: 'P-value, ошибки I и II рода, statistical power',
  theoryContent: `# 📈 Статистические основы A/B тестирования

Статистика — это фундамент A/B тестирования. Без понимания базовых концепций невозможно корректно интерпретировать результаты.

---

## 🎲 P-value (уровень значимости)

### Что это такое?
**P-value** — вероятность получить наблюдаемый результат (или более экстремальный), если нулевая гипотеза (H0: нет разницы) верна.

### Интерпретация:
• **p < 0.05** → результат статистически значимый
  - Разница скорее всего реальная, а не случайная
  - Отвергаем H0
  
• **p ≥ 0.05** → нет доказательств эффекта
  - Недостаточно данных, чтобы утверждать наличие разницы
  - Не можем отвергнуть H0

### 💡 Пример:
**Конверсия A: 10.0%, B: 10.5%, p = 0.02**

Интерпретация:
"Если на самом деле разницы между A и B нет, вероятность увидеть такую разницу (или больше) составляет 2%"

**Вывод**: p = 0.02 < 0.05 → разница статистически значима → скорее всего вариант B действительно лучше.

### ⚠️ Частые ошибки:
❌ "p-value = вероятность, что H0 верна"
✅ "p-value = вероятность данных при условии, что H0 верна"

❌ "p > 0.05 значит эффекта нет"
✅ "p > 0.05 значит недостаточно доказательств эффекта"

---

## 🚨 Ошибки I и II рода

### Матрица решений:

═══════════════════════════════════════════════════
                    РЕАЛЬНОСТЬ
─────────────┬─────────────────┬─────────────────
             │  H0 верна       │  H0 ложна
             │  (нет эффекта)  │  (есть эффект)
─────────────┼─────────────────┼─────────────────
Отвергаем H0 │  ❌ Ошибка I    │  ✅ Верно
(p < 0.05)   │  (α = 5%)       │  (Power)
─────────────┼─────────────────┼─────────────────
Не отвергаем │  ✅ Верно       │  ❌ Ошибка II
H0           │                 │  (β = 20%)
(p ≥ 0.05)   │                 │
═══════════════════════════════════════════════════

|                    | **H0 верна (нет эффекта)** | **H0 ложна (есть эффект)** |
|--------------------|---------------------------|---------------------------|
| **Отвергаем H0**   | ❌ Ошибка I рода (α)      | ✅ Правильное решение     |
| **Не отвергаем H0**| ✅ Правильное решение     | ❌ Ошибка II рода (β)     |

### Ошибка I рода (False Positive, α)
**Суть**: Мы думаем, что эффект есть, но на самом деле его нет.

**Аналогия**: Пожарная тревога без пожара

**В A/B тестах**: 
• Запускаем "улучшение", которое на самом деле не работает
• Тратим ресурсы впустую
• Возможный негативный эффект в долгосрочной перспективе

**Контроль**: 
• Устанавливаем α = 0.05 (5% ошибок)
• Bonferroni correction при множественном тестировании
• Репликация эксперимента

**Пример**: 
p = 0.03 → запустили изменение → через месяц метрика вернулась к baseline

### Ошибка II рода (False Negative, β)
**Суть**: Эффект есть, но мы его не заметили.

**Аналогия**: Пожар, но сигнализация молчит

**В A/B тестах**:
• Отклоняем хорошее изменение
• Упускаем возможность улучшения
• Конкуренты могут обогнать

**Контроль**:
• Увеличиваем размер выборки
• Увеличиваем длительность теста
• Выбираем более чувствительные метрики

**Пример**:
p = 0.08 → не запустили изменение → позже узнали, что оно действительно работало, но выборка была мала

---

## 💪 Statistical Power (мощность теста)

### Определение:
**Power = 1 - β** — вероятность обнаружить эффект, когда он реально есть.

### Стандартные значения:
• **Power = 0.8 (80%)** — индустриальный стандарт
• Power = 0.9 (90%) — более консервативный подход

### Что влияет на Power:

**1. Размер выборки (↑ sample size → ↑ power)**
• Больше пользователей = выше вероятность обнаружить эффект

**2. Размер эффекта (↑ effect size → ↑ power)**
• Большие изменения метрики легче обнаружить
• Маленькие (но важные!) эффекты требуют больше данных

**3. Уровень значимости α (↑ α → ↑ power, но ↑ Type I error)**
• Trade-off между ошибками I и II рода

**4. Вариативность метрики (↓ variance → ↑ power)**
• Метрики с меньшим шумом легче тестировать

### 📊 Пример расчета:
**Цель**: Обнаружить +5% относительное улучшение конверсии

**Исходные данные**:
• Baseline конверсия: 10%
• MDE (Minimum Detectable Effect): +0.5 п.п. (10% → 10.5%)
• α = 0.05
• Желаемая power = 0.8

**Результат**: Нужно ~16,000 пользователей на группу

**Интерпретация**:
При таком размере выборки мы с вероятностью 80% обнаружим улучшение на 5%, если оно реально есть.

### График зависимости Power от Sample Size:

Power │
 1.0  │                    ___________
      │                 __/
 0.9  │              __/
      │           __/
 0.8  │        __/  ← Стандарт (16K users)
      │     __/
 0.7  │   _/
      │ _/
 0.5  │/
      └─────────────────────────────────
      0   5K  10K  15K  20K  25K
             Sample Size (пользователей на группу)

📌 Вывод: Чем больше выборка, тем выше power

---

## 🎯 Практические рекомендации

### При планировании теста:
✅ Определите минимальный интересующий эффект (MDE)
✅ Рассчитайте необходимый sample size для power = 0.8
✅ Оцените, сколько времени потребуется для набора выборки
✅ Убедитесь, что α = 0.05 (стандарт)

### При интерпретации:
✅ Смотрите не только на p-value, но и на размер эффекта
✅ Учитывайте практическую значимость (не только статистическую)
✅ Проверяйте, был ли тест powered correctly
✅ Помните о возможности ошибок I и II рода

---

## 📚 Что дальше?

В следующих модулях:
• Как формулировать гипотезы
• Как выбирать правильные метрики
• Как рассчитать sample size
• Как избежать типичных ошибок`,
  questionIds: [114, 115, 116, 117],
  checkpointCriteria: {
    minAvgScore: 5.0,
    minQuestionsCompleted: 4
  },
  unlockRequirements: ['1.1']
};

const MODULE_1_3: LearningModule = {
  id: '1.3',
  level: 1,
  category: 'foundations',
  title: 'Формулирование гипотез',
  description: 'SMART гипотезы и приоритизация',
  theoryContent: `# Как сформулировать хорошую гипотезу?

## SMART Framework

**S**pecific (Конкретная): Что именно меняем?
**M**easurable (Измеримая): Как измерим результат?
**A**chievable (Достижимая): Реалистичный эффект?
**R**elevant (Релевантная): Связана с бизнес-целями?
**T**ime-bound (Ограниченная): Срок теста?

## Шаблон гипотезы:

"Мы считаем, что [ИЗМЕНЕНИЕ] для [АУДИТОРИИ] приведет к [РЕЗУЛЬТАТУ], потому что [ОБОСНОВАНИЕ]. Проверим, измеряя [МЕТРИКУ] в течение [ВРЕМЕНИ]."

## Пример хорошей гипотезы:

"Добавление social proof (отзывы) на страницу товара для новых пользователей увеличит conversion rate на 10%, потому что это снижает неопределенность. Проверим, измеряя конверсию в покупку в течение 2 недель."`,
  questionIds: [22, 118, 119, 120, 121],
  checkpointCriteria: {
    minAvgScore: 5.0,
    minQuestionsCompleted: 5
  },
  unlockRequirements: ['1.2']
};

const MODULE_1_4: LearningModule = {
  id: '1.4',
  level: 1,
  category: 'metrics',
  title: 'Выбор метрик',
  description: 'Primary, secondary, guardrail метрики',
  theoryContent: `# Выбор правильных метрик

## Типы метрик:

### Primary Metric (Первичная)
Главная метрика для решения.
- **Примеры:** конверсия, revenue per user, retention
- **Количество:** 1 (максимум 2)

### Secondary Metrics (Вторичные)
Дополнительные для понимания "почему".
- **Примеры:** время на сайте, кол-во страниц

### Guardrail Metrics (Защитные)
Метрики, которые НЕ должны ухудшиться.
- **Примеры:** скорость загрузки, error rate, отток

## Свойства хорошей метрики (ACCRUE):

**A**ligned: Согласована с бизнесом
**C**lear: Понятна всем
**C**onsistent: Стабильна
**R**esponsive: Чувствительна к изменениям
**U**seful: Можно действовать
**E**asy to measure: Легко измерить`,
  questionIds: [31, 81, 122, 123, 124],
  checkpointCriteria: {
    minAvgScore: 5.0,
    minQuestionsCompleted: 5
  },
  unlockRequirements: ['1.3']
};

const MODULE_1_5: LearningModule = {
  id: '1.5',
  level: 1,
  category: 'design',
  title: 'Рандомизация и A/A тесты',
  description: 'Случайное распределение и проверка системы',
  theoryContent: `# Рандомизация: основа эксперимента

## Зачем нужна?

Случайное распределение гарантирует, что группы A и B **похожи по всем характеристикам** (возраст, пол, страна, устройство...).

### Без рандомизации:
❌ Группа A: США, Группа B: Европа
❌ Результат: непонятно, что повлияло

### С рандомизацией:
✅ Равная вероятность попасть в A или B
✅ Группы статистически идентичны
✅ Разница вызвана изменением

## A/A тест: проверка системы

### Что это?
Тест, где обе группы видят одинаковый вариант.

### Зачем?
1. Проверить корректность рандомизации
2. Оценить естественную вариацию
3. Убедиться, что нет багов

### Ожидаемый результат:
- p-value > 0.05 (нет разницы)
- Метрики практически одинаковые`,
  questionIds: [11, 26, 125, 126, 127],
  checkpointCriteria: {
    minAvgScore: 5.0,
    minQuestionsCompleted: 5
  },
  unlockRequirements: ['1.4']
};

const LEVEL_1_CHECKPOINT: Checkpoint = {
  id: 'checkpoint-level-1',
  type: 'level',
  levelId: 1,
  questionIds: [1, 11, 22, 31, 41], // По одному из каждого модуля
  minScore: 7.0,
  reward: {
    badge: 'foundation_master',
    badgeTitle: 'A/B Testing Foundation',
    certificate: true,
    xp: 500
  }
};

// ============================================================================
// LEVEL 2: PRACTITIONER (Практик)
// ============================================================================

const MODULE_2_1: LearningModule = {
  id: '2.1',
  level: 2,
  category: 'design',
  title: 'Дизайн эксперимента',
  description: 'Расчет sample size, длительность, unit of randomization',
  theoryContent: `# Дизайн A/B эксперимента

## 1. Расчет размера выборки

Зависит от:
- **Baseline metric**: текущее значение
- **MDE**: минимальный эффект для обнаружения
- **Significance level (α)**: обычно 0.05
- **Power (1-β)**: обычно 0.80

### Правило большого пальца:
- Baseline: 10% конверсия
- MDE: 10% относительное улучшение
- Нужно: ~40,000 пользователей на группу

## 2. Длительность теста

### Минимум:
- **1 полная неделя** (учесть weekday/weekend)
- **Лучше 2 недели** (снижает влияние аномалий)

### Расчет:
- Трафик: 10,000 users/day
- Нужно: 80,000 total
- Длительность: 8 дней → округляем до 14`,
  questionIds: [2, 128, 129, 130],
  checkpointCriteria: {
    minAvgScore: 5.0,
    minQuestionsCompleted: 4
  },
  unlockRequirements: ['1.5']
};

const MODULE_2_2: LearningModule = {
  id: '2.2',
  level: 2,
  category: 'statistics',
  title: 'Статистические тесты',
  description: 'Z-test, t-test, Mann-Whitney, Bootstrap',
  theoryContent: `# Выбор статистического теста

## Z-test (для пропорций)
**Когда:** Бинарные метрики (conversion, CTR)
**Пример:** Конверсия в покупку (да/нет)

## T-test (для средних)
**Когда:** Непрерывные метрики (revenue, время)
**Виды:** Student's t-test, Welch's t-test
**Пример:** Средний revenue per user

## Mann-Whitney U (непараметрический)
**Когда:**
- Данные не нормально распределены
- Много outliers
- Малая выборка

## Bootstrap
**Когда:** Сложные распределения, нет assumptions о распределении`,
  questionIds: [131, 132, 133],
  checkpointCriteria: {
    minAvgScore: 5.0,
    minQuestionsCompleted: 3
  },
  unlockRequirements: ['2.1']
};

const MODULE_2_3: LearningModule = {
  id: '2.3',
  level: 2,
  category: 'pitfalls',
  title: 'Подводные камни',
  description: 'Peeking, multiple testing, SRM, novelty эффекты',
  theoryContent: `# Типичные ошибки в A/B тестировании

## 1. Peeking Problem
**Проблема:** Смотрим на результаты каждый день и останавливаем при p<0.05
**Почему плохо:** Inflated Type I error (20%+ вместо 5%)
**Решение:** Заранее определить sample size

## 2. Multiple Testing
**Проблема:** Тестируем 20 метрик, одна показала p<0.05
**Вероятность false positive:** 64%!
**Решение:** Bonferroni correction, FDR control

## 3. SRM (Sample Ratio Mismatch)
**Проблема:** Планировали 50/50, получили 48/52
**Причины:** Баг в рандомизации, фильтрация
**Решение:** Chi-square test на размеры групп

## 4. Novelty Effect
**Проблема:** Новая фича показывает рост первую неделю, потом падает
**Решение:** Тест минимум 2-3 недели`,
  questionIds: [71, 11, 26],
  checkpointCriteria: {
    minAvgScore: 5.0,
    minQuestionsCompleted: 3
  },
  unlockRequirements: ['2.2']
};

const MODULE_2_4: LearningModule = {
  id: '2.4',
  level: 2,
  category: 'analysis',
  title: 'Анализ результатов',
  description: 'Интерпретация, сегментация, outliers',
  theoryContent: `# Анализ результатов A/B теста

## Шаги анализа:

### 1. Проверка качества
✅ SRM check
✅ Нет аномалий
✅ Достаточно данных

### 2. Primary метрика
- Рассчитать p-value
- Построить confidence interval
- **Решение:** launch/no launch

### 3. Secondary метрики
- Понять "почему"
- Проверить consistency

### 4. Guardrail метрики
- Убедиться, что ничего не сломали

### 5. Сегментный анализ
**Когда полезен:** Эффект может быть разный для подгрупп
**Опасность:** Multiple testing!`,
  questionIds: [134, 135, 136, 137],
  checkpointCriteria: {
    minAvgScore: 5.0,
    minQuestionsCompleted: 4
  },
  unlockRequirements: ['2.3']
};

const MODULE_2_5: LearningModule = {
  id: '2.5',
  level: 2,
  category: 'cases',
  title: 'Продуктовые кейсы',
  description: 'Реальные кейсы из E-commerce, Social, SaaS',
  theoryContent: `# Решение продуктовых кейсов

## Framework:

### 1. Clarify (Уточнение)
- Что именно меняем?
- Для какой аудитории?
- Какая бизнес-цель?

### 2. Hypothesis (Гипотеза)
- SMART формулировка
- Ожидаемый эффект
- Обоснование

### 3. Metrics (Метрики)
- Primary, Secondary, Guardrail

### 4. Design (Дизайн)
- Рандомизация, Sample size, Длительность

### 5. Risks (Риски)
- Что может пойти не так?
- Как митигируем?`,
  questionIds: [138, 139, 140],
  checkpointCriteria: {
    minAvgScore: 5.0,
    minQuestionsCompleted: 3
  },
  unlockRequirements: ['2.4']
};

const LEVEL_2_CHECKPOINT: Checkpoint = {
  id: 'checkpoint-level-2',
  type: 'level',
  levelId: 2,
  questionIds: [2, 3, 4, 5, 6], // Сложные mid-level вопросы
  minScore: 7.5,
  reward: {
    badge: 'practitioner_master',
    badgeTitle: 'A/B Testing Practitioner',
    certificate: true,
    xp: 800
  }
};

// ============================================================================
// LEVEL 3: EXPERT (Эксперт)
// ============================================================================

const MODULE_3_1: LearningModule = {
  id: '3.1',
  level: 3,
  category: 'advanced_methods',
  title: 'Продвинутые методы',
  description: 'CUPED, Bandits, Sequential testing',
  theoryContent: `# Продвинутые техники

## CUPED
Использует pre-experiment данные для снижения variance на 20-50%.

## Multi-Armed Bandits
Динамически перераспределяет трафик в пользу лучшего варианта.

## Sequential Testing
Позволяет смотреть на результаты по ходу теста без inflated error.`,
  questionIds: [141, 142, 143],
  checkpointCriteria: {
    minAvgScore: 5.0,
    minQuestionsCompleted: 3
  },
  unlockRequirements: ['2.5']
};

const MODULE_3_2: LearningModule = {
  id: '3.2',
  level: 3,
  category: 'interpretation',
  title: 'Интерпретация и принятие решений',
  description: 'Statistical vs practical significance, trade-offs',
  theoryContent: `# От результатов к решениям

## Statistical vs Practical Significance
p-value = 0.001, но эффект +0.01% конверсии → стоит ли?

## Неоднозначные результаты
- Primary ↑, Guardrail ↓ → trade-off
- Разные результаты в сегментах → что делать?

## Причинность
A/B тест показывает причинность, но нужно учитывать: confounders, selection bias, external validity.`,
  questionIds: [7, 8, 9], // Используем существующие интерпретационные вопросы
  checkpointCriteria: {
    minAvgScore: 5.0,
    minQuestionsCompleted: 3
  },
  unlockRequirements: ['3.1']
};

const MODULE_3_3: LearningModule = {
  id: '3.3',
  level: 3,
  category: 'cases',
  title: 'Сложные продуктовые кейсы',
  description: 'Marketplace, Algorithm changes, Pricing',
  theoryContent: `# Senior-level кейсы

## Типы:

### Ecosystem changes
Изменение влияет на всю экосистему (Uber, Airbnb).

### Algorithm changes
ML model update, ranking algorithm (YouTube, TikTok).

### Pricing experiments
Очень чувствительная область с ethical concerns.`,
  questionIds: [144, 145, 146, 147],
  checkpointCriteria: {
    minAvgScore: 5.0,
    minQuestionsCompleted: 4
  },
  unlockRequirements: ['3.2']
};

const MODULE_3_4: LearningModule = {
  id: '3.4',
  level: 3,
  category: 'infrastructure',
  title: 'Инфраструктура и масштабирование',
  description: 'Experiment platform, Layering, Automated checks',
  theoryContent: `# Experimentation Platform

## Компоненты:
1. Experiment Setup UI
2. Randomization Service
3. Logging & Data Pipeline
4. Analysis Engine
5. Reporting Dashboard

## Масштабирование:
При 1000+ экспериментов в год нужны: layering, orthogonalization, automated checks.`,
  questionIds: [148, 149, 150, 151, 152],
  checkpointCriteria: {
    minAvgScore: 5.0,
    minQuestionsCompleted: 5
  },
  unlockRequirements: ['3.3']
};

const MODULE_3_5: LearningModule = {
  id: '3.5',
  level: 3,
  category: 'leadership',
  title: 'Лидерство и культура экспериментов',
  description: 'Experimentation culture, Governance, Scaling',
  theoryContent: `# Культура экспериментов

## Принципы:
1. Data-driven decision making
2. Fail fast, learn fast
3. Democratization
4. Transparency

## Challenges:
- Сопротивление к негативным результатам
- Confirmation bias
- Short-term thinking

## Leadership роль:
Строить платформу, обучать команды, устанавливать standards.`,
  questionIds: [153, 154, 155, 156],
  checkpointCriteria: {
    minAvgScore: 5.0,
    minQuestionsCompleted: 4
  },
  unlockRequirements: ['3.4']
};

const LEVEL_3_CHECKPOINT: Checkpoint = {
  id: 'checkpoint-level-3',
  type: 'level',
  levelId: 3,
  questionIds: [100, 101, 102, 103, 104], // Staff-level вопросы
  minScore: 8.0,
  reward: {
    badge: 'expert_master',
    badgeTitle: 'A/B Testing Expert',
    certificate: true,
    xp: 1500
  }
};

// ============================================================================
// СОБИРАЕМ ВСЁ ВМЕСТЕ
// ============================================================================

// Экспортируем все модули для использования в categoryHelper
export const LEARNING_MODULES = [
  MODULE_1_1, MODULE_1_2, MODULE_1_3, MODULE_1_4, MODULE_1_5,
  MODULE_2_1, MODULE_2_2, MODULE_2_3, MODULE_2_4, MODULE_2_5,
  MODULE_3_1, MODULE_3_2, MODULE_3_3, MODULE_3_4, MODULE_3_5
];

export const LEARNING_PATH_DATA: LearningPath = {
  levels: [
    {
      id: 1,
      title: 'Foundation (Новичок)',
      description: 'Базовые концепции A/B тестирования',
      modules: [MODULE_1_1, MODULE_1_2, MODULE_1_3, MODULE_1_4, MODULE_1_5],
      finalCheckpoint: LEVEL_1_CHECKPOINT
    },
    {
      id: 2,
      title: 'Practitioner (Практик)',
      description: 'Практическое применение A/B тестов',
      modules: [MODULE_2_1, MODULE_2_2, MODULE_2_3, MODULE_2_4, MODULE_2_5],
      finalCheckpoint: LEVEL_2_CHECKPOINT
    },
    {
      id: 3,
      title: 'Expert (Эксперт)',
      description: 'Продвинутые методы и лидерство',
      modules: [MODULE_3_1, MODULE_3_2, MODULE_3_3, MODULE_3_4, MODULE_3_5],
      finalCheckpoint: LEVEL_3_CHECKPOINT
    }
  ]
};

// Вспомогательные функции для работы с Learning Path
export function getModuleById(moduleId: string): LearningModule | undefined {
  for (const level of LEARNING_PATH_DATA.levels) {
    const module = level.modules.find(m => m.id === moduleId);
    if (module) return module;
  }
  return undefined;
}

export function getNextModule(currentModuleId: string): LearningModule | null {
  const allModules = LEARNING_PATH_DATA.levels.flatMap(level => level.modules);
  const currentIndex = allModules.findIndex(m => m.id === currentModuleId);
  
  if (currentIndex === -1 || currentIndex === allModules.length - 1) {
    return null;
  }
  
  return allModules[currentIndex + 1];
}

export function getLevelByModuleId(moduleId: string): LearningLevel | undefined {
  return LEARNING_PATH_DATA.levels.find(level => 
    level.modules.some(m => m.id === moduleId)
  );
}

