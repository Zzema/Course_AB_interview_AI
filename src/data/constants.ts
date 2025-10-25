import { Question, Category, DifficultyLevel, SeniorityLevel, BigTechCompany, KeyPoint } from './types';

// ============================================================================
// КОНФИГУРАЦИЯ КАТЕГОРИЙ
// ============================================================================

export const CATEGORIES_CONFIG: Record<Category, { name: string; color: string; description: string }> = {
  foundations: { 
    name: 'Основы', 
    color: '#2979ff',
    description: 'Фундаментальные концепции A/B тестирования: гипотезы, p-value, доверительные интервалы, ошибки I и II рода'
  },
  statistics: { 
    name: 'Статистика', 
    color: '#00e676',
    description: 'Статистические методы: t-тесты, бутстреп, байесовский подход, распределения, мощность теста'
  },
  design: { 
    name: 'Дизайн эксперимента', 
    color: '#ffc400',
    description: 'Планирование экспериментов: размер выборки, рандомизация, A/A тесты, стратификация, длительность'
  },
  metrics: { 
    name: 'Метрики', 
    color: '#ff3d00',
    description: 'Выбор и проектирование метрик: первичные/вторичные метрики, соотношения, композитные метрики'
  },
  analysis: { 
    name: 'Анализ', 
    color: '#651fff',
    description: 'Анализ результатов: сегментация, гетерогенные эффекты, outliers, множественные сравнения'
  },
  interpretation: { 
    name: 'Интерпретация', 
    color: '#d500f9',
    description: 'Интерпретация данных: практическая значимость, причинность, внешняя валидность, бизнес-выводы'
  },
  pitfalls: { 
    name: 'Подводные камни', 
    color: '#ff1744',
    description: 'Типичные ошибки: peeking, multiple testing, SRM, spillover эффекты, Simpson\'s paradox'
  },
  cases: { 
    name: 'Продуктовые кейсы', 
    color: '#00e5ff',
    description: 'Реальные кейсы: запуск фичей, оптимизация воронок, изменение дизайна, pricing эксперименты'
  },
  advanced_methods: { 
    name: 'Продвинутые методы', 
    color: '#76ff03',
    description: 'Сложные техники: CUPED, difference-in-differences, quasi-experiments, bandits, switchback'
  },
  infrastructure: { 
    name: 'Инфраструктура', 
    color: '#64ffda',
    description: 'Платформы экспериментов: feature flagging, logging, мониторинг, автоматизация, масштабирование'
  },
  leadership: { 
    name: 'Лидерство и культура', 
    color: '#f50057',
    description: 'Организационные аспекты: внедрение культуры экспериментов, обучение команды, governance'
  },
};

// ============================================================================
// КОНФИГУРАЦИЯ КЛЮЧЕВЫХ ПОИНТОВ
// ============================================================================
export const KEY_POINT_CONFIG: Record<KeyPoint, { name: string; description: string }> = {
  'type-i-error': { name: 'Ошибка I рода', description: 'Ложноположительный результат (α): отвергли H0, когда она верна' },
  'type-ii-error': { name: 'Ошибка II рода', description: 'Ложноотрицательный результат (β): не отвергли H0, когда она ложна' },
  'statistical-power': { name: 'Стат. мощность', description: 'Способность теста обнаружить эффект, когда он есть (1-β)' },
  'statistical-significance': { name: 'Стат. значимость', description: 'p-value < α: вероятность получить результат при H0' },
  'multiple-testing': { name: 'Множ. тестирование', description: 'Коррекция для множественных гипотез: Bonferroni, FDR' },
  'sample-size': { name: 'Размер выборки', description: 'Расчет необходимого количества пользователей для теста' },
  'randomization': { name: 'Рандомизация', description: 'Случайное распределение пользователей по группам' },
  'experiment-duration': { name: 'Длительность теста', description: 'Сколько времени нужно для достижения power' },
  'experiment-types': { name: 'Типы экспериментов', description: 'A/B, многорукие бандиты, switchback, quasi-experiments' },
  'statistical-tests': { name: 'Стат. тесты', description: 'T-test, z-test, chi-square, Mann-Whitney' },
  'advanced-methods': { name: 'Продвинутые методы', description: 'CUPED, стратификация, variance reduction' },
  'distribution-issues': { name: 'Проблемы распределений', description: 'Non-normality, skewness, heavy tails, outliers' },
  'segmentation': { name: 'Сегментация', description: 'Анализ эффектов по подгруппам пользователей' },
  'metric-types': { name: 'Типы метрик', description: 'Первичные, вторичные, guardrail, диагностические' },
  'metric-issues': { name: 'Проблемы метрик', description: 'Чувствительность, стабильность, интерпретируемость' },
  'business-metrics': { name: 'Бизнес-метрики', description: 'Revenue, retention, engagement, conversion' },
  'peeking-problem': { name: 'Проблема подглядывания', description: 'Early stopping: остановка теста при раннем значимом результате' },
  'novelty-effects': { name: 'Эффект новизны', description: 'Временное изменение поведения при знакомстве с новым' },
  'network-effects': { name: 'Сетевые эффекты', description: 'Взаимное влияние пользователей друг на друга' },
  'practical-significance': { name: 'Практ. значимость', description: 'Достаточно ли эффект велик для внедрения?' },
  'causal-inference': { name: 'Причинно-следств. связь', description: 'Установление причинности, а не просто корреляции' },
};


// ============================================================================
// МАППИНГ КЛЮЧЕВЫХ ПОИНТОВ НА КАТЕГОРИИ
// ============================================================================
export const KEY_POINT_TO_CATEGORY_MAP: Record<KeyPoint, Category> = {
  'type-i-error': 'statistics',
  'type-ii-error': 'statistics',
  'statistical-power': 'statistics',
  'statistical-significance': 'statistics',
  'multiple-testing': 'statistics',
  'sample-size': 'design',
  'randomization': 'design',
  'experiment-duration': 'design',
  'experiment-types': 'design',
  'statistical-tests': 'statistics',
  'advanced-methods': 'advanced_methods',
  'distribution-issues': 'analysis',
  'segmentation': 'analysis',
  'metric-types': 'metrics',
  'metric-issues': 'metrics',
  'business-metrics': 'metrics',
  'peeking-problem': 'pitfalls',
  'novelty-effects': 'pitfalls',
  'network-effects': 'pitfalls',
  'practical-significance': 'interpretation',
  'causal-inference': 'foundations',
};


/**
 * ============================================================================
 * ФИНАЛЬНАЯ СПЕЦИФИКАЦИЯ БАЗЫ ВОПРОСОВ ПО A/B ТЕСТИРОВАНИЮ
 * ============================================================================
 * 
 * Версия: 2.1 CLEAN
 * Дата: 2025-10-25
 * Целевая аудитория: Senior Product Analyst в BigTech
 * Всего вопросов: 156 (110 базовых + 46 Learning Path)
 * 
 * АРХИТЕКТУРА:
 * - categories: используется для статистики и AI feedback (все вопросы)
 * - modules: опциональное поле для Learning Path (вопросы 111-156)
 * ============================================================================
 */


// ============================================================================
// БАЗА ВОПРОСОВ
// ============================================================================

export const QUESTION_DATABASE: Question[] = [
    // ========================================================================
    // JUNIOR LEVEL (1-3): Фундаментальные знания
    // ========================================================================
    { 
        id: 1, 
        difficulty: 2, 
        seniority: 'junior',
        bigTech: ['All'],
        text: "Что такое A/B-тестирование и зачем оно нужно в продуктовой аналитике?",
        keyPoints: ['causal-inference', 'randomization', 'experiment-types'],
        modules: ['1.1'],
        referenceAnswer: `A/B-тестирование (сплит-тестирование) — это экспериментальный метод, при котором пользователи случайным образом делятся на две или более групп, каждая из которых видит разный вариант продукта (A — контрольный, B — тестовый).

Ключевые элементы:
• Рандомизация: пользователи распределяются случайно, что обеспечивает сопоставимость групп
• Контрольная группа: видит текущую версию продукта
• Тестовая группа: видит новую версию с изменением
• Метрика успеха: измеряем конкретный KPI (конверсия, retention, revenue)

Зачем нужно в продуктовой аналитике:
1. Причинность: A/B тест доказывает, что именно ваше изменение вызвало эффект (корреляция ≠ причинность)
2. Снижение рисков: тестируем на малой аудитории перед полным запуском
3. Data-driven решения: принимаем решения на основе фактов, а не мнений
4. Оптимизация продукта: постоянно улучшаем метрики через итеративное тестирование
5. Измерение эффекта: точно оцениваем, насколько изменение улучшило/ухудшило метрику`
    },
    { 
        id: 26, 
        difficulty: 2, 
        seniority: 'junior',
        bigTech: ['All'],
        text: "Ваш коллега говорит: 'Давай сделаем контрольную группу из 30% пользователей, а тестовую из 70%, чтобы быстрее набрать данные'. Что не так с этим предложением?",
        keyPoints: ['statistical-power', 'sample-size'],
    modules: ['1.5', '2.3']
    },
    { 
        id: 81, 
        difficulty: 2, 
        seniority: 'junior',
        bigTech: ['All'],
        text: "PM говорит: 'Наша конверсия 15%'. Вы спрашиваете: 'Конверсия чего в что?'. PM удивлен вопросом. Почему это важно уточнить перед запуском A/B теста?",
        keyPoints: ['metric-types'],
    modules: ['1.4']
    },
    { 
        id: 41, 
        difficulty: 2, 
        seniority: 'junior',
        bigTech: ['All'],
        text: "Какие три ключевых элемента должны быть в хорошо сформулированной гипотезе для A/B-теста?",
        keyPoints: ['sample-size', 'metric-types'],
        modules: ['1.1'],
        referenceAnswer: `Хорошая гипотеза для A/B-теста должна содержать три ключевых элемента:

1. ЧТО мы меняем (изменение/интервенция)
Конкретное описание того, что именно мы тестируем.
Примеры:
• "Изменение цвета кнопки покупки с синего на красный"
• "Добавление социальных доказательств (отзывов) на страницу товара"
• "Упрощение формы регистрации с 5 до 3 полей"

2. КАКОЙ эффект ожидаем (направление и величина)
Конкретная метрика и ожидаемое изменение.
Примеры:
• "Увеличит conversion rate на 10%"
• "Снизит bounce rate на 5%"
• "Повысит время на сайте на 30 секунд"

3. ПОЧЕМУ мы ожидаем этот эффект (обоснование)
Логическое объяснение, почему изменение должно сработать.
Примеры:
• "Потому что красный цвет привлекает внимание и создает срочность"
• "Потому что социальные доказательства снижают неопределенность и повышают доверие"
• "Потому что короткая форма снижает трение и повышает completion rate"

Пример полной гипотезы:
"Мы считаем, что добавление отзывов клиентов (ЧТО) на страницу товара увеличит конверсию в покупку на 10% (ЭФФЕКТ), потому что это снижает неопределенность и повышает доверие к продукту (ПОЧЕМУ)."

Дополнительно хорошо указать:
• Целевую аудиторию (для кого тест)
• Временные рамки эксперимента
• Primary метрику для принятия решения`
    },
    { 
        id: 11, 
        difficulty: 3, 
        seniority: 'junior',
        bigTech: ['All'],
        text: "Чем отличается A/A-тест от A/B-теста и для чего он проводится?",
        keyPoints: ['randomization', 'experiment-types'],
        modules: ['1.5', '2.3'],
        referenceAnswer: `A/A-тест vs A/B-тест:

A/B-тест:
• Группа A видит вариант A (контроль)
• Группа B видит вариант B (изменение)
• Цель: проверить, есть ли эффект от изменения

A/A-тест:
• Обе группы видят ОДИНАКОВЫЙ вариант
• Формально это группы A и A (без изменений)
• Цель: проверить корректность системы экспериментов

Зачем нужен A/A-тест:

1. Проверка рандомизации
Убедиться, что механизм разбиения пользователей на группы работает корректно и группы действительно статистически идентичны.

2. Калибровка системы
Оценить естественную вариацию метрик:
• Какие колебания метрик нормальны?
• Какой уровень шума в данных?
• Корректно ли работают наши статистические тесты?

3. Обнаружение багов
Выявить технические проблемы:
• Баги в логировании
• Проблемы с tracking
• Sample Ratio Mismatch (SRM)
• Систематические различия между группами

4. Определение false positive rate
Проверить, что при отсутствии реального эффекта мы получаем p-value > 0.05 в ~95% случаев (если α=0.05).

Ожидаемый результат A/A-теста:
✅ p-value > 0.05 (нет статистически значимой разницы)
✅ Метрики в обеих группах примерно одинаковые
✅ Sample Ratio близко к ожидаемому (50/50)
✅ Confidence interval включает 0

Если A/A-тест показывает разницу:
❌ Проблема с рандомизацией
❌ Баг в системе экспериментов
❌ Технические проблемы с tracking

Когда проводить:
• При запуске новой experimentation platform
• После значительных изменений в инфраструктуре
• Периодически для мониторинга здоровья системы
• При подозрении на проблемы с рандомизацией`
    },
    { 
        id: 71, 
        difficulty: 3, 
        seniority: 'junior',
        bigTech: ['All'],
        text: "Дизайнер сделал 5 вариантов новой кнопки и хочет протестировать все сразу: A/B/C/D/E/F тест, каждый вариант получит по 16.6% трафика. Звучит эффективно? Что не так?",
        keyPoints: ['statistical-power', 'multiple-testing', 'experiment-types'],
    modules: ['2.3']
    },
    { 
        id: 91, 
        difficulty: 3, 
        seniority: 'junior',
        bigTech: ['All'],
        text: "Почему для A/B-тестов важен принцип 'одно изменение за раз'?",
        keyPoints: ['causal-inference', 'experiment-types'],
    modules: ['1.1']
    },
    { 
        id: 22, 
        difficulty: 3, 
        seniority: 'junior',
        bigTech: ['All'],
        text: "Критикуйте гипотезу: 'Мы думаем, что если мы сделаем наш сайт быстрее, то пользователи будут счастливее'. Перепишите ее по SMART-критериям с конкретными метриками и ожидаемыми эффектами. Как измерить 'счастье'? Какая скорость 'быстрее'?",
        keyPoints: ['metric-types', 'sample-size'],
    modules: ['1.3']
    },
    { 
        id: 31, 
        difficulty: 3, 
        seniority: 'junior',
        bigTech: ['Microsoft', 'All'],
        text: "Что такое OEC (Overall Evaluation Criterion)? Зачем она нужна, если можно смотреть на несколько метрик сразу?",
        keyPoints: ['metric-types', 'statistical-significance'],
    modules: ['1.4']
    },

    // ========================================================================
    // MID LEVEL (4-6): Практическое применение
    // ========================================================================
    { 
        id: 2, 
        difficulty: 4, 
        seniority: 'mid',
        bigTech: ['Amazon', 'All'],
        text: "Сформулируйте продуктовую гипотезу для изменения цвета кнопки 'Купить' с синего на зеленый на сайте e-commerce. Гипотеза должна включать: (1) целевую аудиторию, (2) ожидаемое изменение поведения, (3) метрику успеха, (4) минимальный детектируемый эффект. Какие guardrail метрики добавите?",
        keyPoints: ['sample-size', 'metric-types'],
    modules: ['2.1']
    },
    { 
        id: 3, 
        difficulty: 4, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Как определить необходимый размер выборки для A/B-теста? Какие параметры для этого нужны?",
        keyPoints: ['sample-size', 'statistical-power'],
    modules: ['1.2']
    },
    { 
        id: 27, 
        difficulty: 4, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Почему важна случайная (рандомизированная) выборка пользователей для групп A и B?",
        keyPoints: ['causal-inference'],
    modules: ['1.5']
    },
    { 
        id: 12, 
        difficulty: 4, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Приведите пример guardrail (защитной) метрики для теста новой фичи в приложении для доставки еды. Объясните свой выбор.",
        keyPoints: ['practical-significance', 'business-metrics'],
    modules: ['1.4']
    },
    { 
        id: 42, 
        difficulty: 4, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Вы выбрали 'Выручка с пользователя' как основную метрику теста. Через неделю PM просит добавить еще 5 метрик: CTR, время на сайте, bounce rate, NPS, количество сессий. Как отреагируете?",
        keyPoints: ['segmentation', 'multiple-testing', 'metric-types'],
    modules: ['1.4']
    },
    { 
        id: 61, 
        difficulty: 4, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "После запуска теста вы получили p-value = 0.03, но видите, что в первый день эффект был +10%, второй день +5%, третий день +2%, а сейчас уже -1%. Тест все еще статзначим. Ваши действия?",
        keyPoints: ['novelty-effects', 'experiment-duration'],
    modules: ['2.3']
    },
    { 
        id: 82, 
        difficulty: 4, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Предложите гипотезу для A/B-теста на странице с ценами (pricing page).",
        modules: ['2.5']
    },
    { 
        id: 34, 
        difficulty: 4, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Какой статистический тест (критерий) обычно используется для сравнения средних значений в двух группах? А для сравнения конверсий?",
        keyPoints: ['statistical-tests'],
    modules: ['2.2']
    },
    { 
        id: 17, 
        difficulty: 4, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "В ходе анализа результатов A/B-теста вы не обнаружили общего статзначимого эффекта. Стоит ли смотреть на сегменты пользователей? Если да, то как правильно это делать?",
        keyPoints: ['segmentation', 'multiple-testing'],
    modules: ['2.4']
    },
    { 
        id: 51, 
        difficulty: 4, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Какая связь между размером выборки, статистической мощностью и MDE?",
        keyPoints: ['practical-significance', 'sample-size'],
    modules: ['2.1']
    },
    { 
        id: 77, 
        difficulty: 4, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Объясните, почему корреляция не означает причинно-следственную связь, на примере A/B-тестирования.",
        modules: ['1.3']
    },
    { 
        id: 97, 
        difficulty: 4, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Какие инструменты для проведения A/B-тестов вы знаете? (например, Google Optimize, Optimizely, или внутренние системы)",
        modules: ['3.4']
    },
    { 
        id: 4, 
        difficulty: 5, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Что такое p-value? Какое значение p-value обычно считают пороговым для принятия решения и почему?",
        keyPoints: ['statistical-significance', 'type-i-error'],
    modules: ['1.2']
    },
    { 
        id: 13, 
        difficulty: 5, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Почему нельзя проводить A/B-тест всего один день, даже если набрался достаточный размер выборки?",
        keyPoints: ['experiment-duration'],
    modules: ['2.1']
    },
    { 
        id: 18, 
        difficulty: 5, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Вы тестируете новую фичу 'Добавить в избранное'. Дата-инженер предлагает метрику: 'Среднее количество добавлений в избранное на пользователя'. Что может пойти не так с этой метрикой? Предложите альтернативу.",
        keyPoints: ['distribution-issues', 'metric-issues'],
    modules: ['2.5']
    },
    { 
        id: 23, 
        difficulty: 5, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Что такое статистическая мощность (statistical power) и почему важно устанавливать ее на уровне 80% или выше?",
        keyPoints: ['type-ii-error', 'statistical-power'],
    modules: ['1.2']
    },
    { 
        id: 28, 
        difficulty: 5, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Вы работаете в музыкальном стриминговом сервисе. Предложите A/B-тест для увеличения количества прослушиваний 'непопулярных' исполнителей.",
        modules: ['2.5']
    },
    { 
        id: 36, 
        difficulty: 5, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Что такое односторонняя и двусторонняя гипотеза в статистическом тесте? Какую следует использовать в A/B-тестировании и почему?",
        keyPoints: ['experiment-types'],
    modules: ['2.2']
    },
    { 
        id: 46, 
        difficulty: 5, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Почему стат. незначимый результат — это тоже результат? Что он нам говорит?",
        keyPoints: ['practical-significance', 'statistical-power'],
    modules: ['3.2']
    },
    { 
        id: 52, 
        difficulty: 5, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Что такое 'regression to the mean' (регрессия к среднему) и как это может повлиять на интерпретацию результатов?",
        modules: ['2.3']
    },
    { 
        id: 56, 
        difficulty: 5, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Что такое 'прокси-метрика'? Приведите пример.",
        keyPoints: ['practical-significance'],
    modules: ['1.4']
    },
    { 
        id: 66, 
        difficulty: 5, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Почему нельзя выбирать слишком много основных метрик для одного теста?",
        keyPoints: ['multiple-testing'],
    modules: ['1.4']
    },
    { 
        id: 72, 
        difficulty: 5, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Как убедиться, что ваша система сплитования (распределения пользователей по группам) работает корректно?",
        keyPoints: ['experiment-types', 'randomization'],
    modules: ['1.5']
    },
    { 
        id: 86, 
        difficulty: 5, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Какой минимальный размер группы должен быть для проведения A/B-теста? Существует ли такое число?",
        keyPoints: ['sample-size'],
    modules: ['2.1']
    },
    { 
        id: 92, 
        difficulty: 5, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Как выбрать правильную метрику для A/B-теста, если у продукта несколько целей (например, вовлечение и монетизация)?",
        keyPoints: ['metric-types'],
    modules: ['1.4']
    },
    { 
        id: 5, 
        difficulty: 6, 
        seniority: 'mid',
        bigTech: ['Amazon', 'All'],
        text: "Результаты теста показали статзначимый рост конверсии на 5%, но при этом средний чек упал на 3% (нестатзначимо). Ваши действия и как вы примете решение?",
        keyPoints: ['practical-significance', 'business-metrics'],
    modules: ['3.2']
    },
    { 
        id: 8, 
        difficulty: 6, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Что такое ошибка I и II рода в контексте A/B-тестирования? Какая из них, на ваш взгляд, чаще бывает 'дороже' для бизнеса?",
        keyPoints: ['type-i-error', 'type-ii-error'],
    modules: ['3.2']
    },
    { 
        id: 19, 
        difficulty: 6, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Что такое MDE (Minimum Detectable Effect)? Как выбор MDE влияет на размер выборки и длительность теста?",
        keyPoints: ['sample-size'],
    modules: ['2.1']
    },
    { 
        id: 14, 
        difficulty: 6, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Результаты теста: конверсия выросла с 10% до 11%, p-value=0.001, доверительный интервал [+0.8%, +1.2%]. PM в восторге. Вы замечаете, что в абсолютных числах это 100 дополнительных конверсий в день, а реализация фичи требует команду из 3 разработчиков на 2 месяца. Ваша оценка ситуации?",
        keyPoints: ['practical-significance'],
    modules: ['3.2']
    },
    { 
        id: 32, 
        difficulty: 6, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Для чего может понадобиться проводить A/A/B тест вместо обычного A/B?",
        keyPoints: ['randomization', 'experiment-types'],
    modules: ['1.5']
    },
    { 
        id: 38, 
        difficulty: 6, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Что произойдет, если вы остановите тест раньше, как только p-value достигнет нужного уровня?",
        keyPoints: ['peeking-problem', 'type-i-error', 'advanced-methods'],
    modules: ['2.3']
    },
    { 
        id: 43, 
        difficulty: 6, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Что такое 'эффект уикенда' и как его следует учитывать при планировании длительности теста?",
        keyPoints: ['experiment-duration'],
    modules: ['2.1']
    },
    { 
        id: 47, 
        difficulty: 6, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Что такое SRM (Sample Ratio Mismatch) и почему за этим важно следить?",
        keyPoints: ['randomization', 'statistical-tests'],
    modules: ['2.3']
    },
    { 
        id: 57, 
        difficulty: 6, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Ваш коллега запустил тест, и в первые 2 дня вариант B показывает взрывной рост. Он хочет остановить тест и выкатить фичу. Ваши действия?",
        keyPoints: ['peeking-problem', 'experiment-duration', 'advanced-methods'],
    modules: ['2.3']
    },
    { 
        id: 62, 
        difficulty: 6, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Что такое 'метрики здоровья' (health metrics) и почему они важны?",
        keyPoints: ['practical-significance', 'metric-types'],
    modules: ['1.4']
    },
    { 
        id: 68, 
        difficulty: 6, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "Вы хотите протестировать новый дизайн главной страницы. Есть ли разница, как проводить этот тест на мобильных устройствах и на десктопе?",
        keyPoints: ['practical-significance', 'experiment-types', 'metric-types'],
    modules: ['2.5']
    },
    { 
        id: 75, 
        difficulty: 6, 
        seniority: 'senior',
        bigTech: ['Meta', 'All'],
        text: "Приведите пример хорошей 'северной звезды' (North Star Metric) для продукта типа TikTok.",
        keyPoints: ['practical-significance', 'statistical-tests', 'business-metrics'],
    modules: ['1.4']
    },
    { 
        id: 83, 
        difficulty: 6, 
        seniority: 'mid',
        bigTech: ['All'],
        text: "CEO видит дашборд: контроль 10.2% конверсия, тест 10.5% конверсия. Говорит: 'Отлично, запускаем!'. Размер групп по 500 человек, тест идет 3 дня. Что вы ответите CEO?",
        keyPoints: ['sample-size', 'experiment-duration', 'statistical-significance', 'randomization'],
    modules: ['2.3']
    },
    { 
        id: 90, 
        difficulty: 6, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Какие этические вопросы могут возникнуть при проведении A/B-тестов? Приведите пример.",
        keyPoints: ['practical-significance'],
    modules: ['3.5']
    },
    { 
        id: 95, 
        difficulty: 6, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Тест показал рост регистрации, но падение удержания первого дня (Day 1 Retention). Как интерпретировать такой результат?",
        keyPoints: ['practical-significance', 'business-metrics'],
    modules: ['2.5']
    },

    // ========================================================================
    // SENIOR LEVEL (7-8): Продвинутые концепции
    // ========================================================================
    { 
        id: 6, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Проблема подглядывания (peeking problem) в A/B-тестировании. В чем она заключается и как ее избежать?",
        keyPoints: ['advanced-methods', 'experiment-types'],
    modules: ['3.2']
    },
    { 
        id: 7, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['Meta', 'All'],
        text: "Вы хотите протестировать новый алгоритм рекомендаций в ленте новостей социальной сети. Как бы вы подошли к дизайну такого эксперимента? Какие метрики бы отслеживали?",
        keyPoints: ['metric-types'],
    modules: ['3.2']
    },
    { 
        id: 9, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Мы тестируем изменение, которое должно повлиять на CTR (click-through rate). CTR - это ratio метрика. В чем особенность проверки статзначимости для таких метрик?",
        keyPoints: ['advanced-methods', 'distribution-issues', 'metric-issues'],
    modules: ['3.2']
    },
    { 
        id: 15, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "В приложении для изучения языков мы хотим ввести геймификацию (очки, уровни). Какую основную метрику вы бы выбрали для A/B-теста и почему? Какие вторичные метрики важны?",
        modules: ['2.5']
    },
    { 
        id: 20, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['Netflix', 'All'],
        text: "Сервис онлайн-кинотеатра хочет протестировать новую модель подписки с более низкой ценой, но с показом рекламы. Опишите дизайн эксперимента.",
        modules: ['2.5']
    },
    { 
        id: 25, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['Amazon', 'All'],
        text: "Тест показал статзначимое падение метрики 'время на сайте', но статзначимый рост конверсии в покупку. Является ли это хорошим результатом?",
        keyPoints: ['practical-significance', 'metric-types'],
    modules: ['3.2']
    },
    { 
        id: 33, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Как оценить долгосрочный эффект от изменения, если A/B-тест обычно длится 2-4 недели?",
        keyPoints: ['practical-significance', 'metric-types', 'experiment-duration'],
    modules: ['3.2']
    },
    { 
        id: 37, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Что такое 'эффект новизны' (novelty effect) и как он может исказить результаты A/B-теста?",
        keyPoints: ['novelty-effects', 'experiment-duration'],
    modules: ['2.3']
    },
    { 
        id: 44, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Выкатили новую фичу после успешного A/B-теста, но общие метрики продукта упали. Какие могут быть причины?",
        keyPoints: ['network-effects'],
    modules: ['3.3']
    },
    { 
        id: 48, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Как бы вы подходили к проверке гипотезы о влиянии на LTV (Lifetime Value), учитывая, что LTV считается очень долго?",
        keyPoints: ['metric-types'],
    modules: ['2.4']
    },
    { 
        id: 53, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "В каких случаях имеет смысл проводить тест только на сегменте новых пользователей?",
        keyPoints: ['novelty-effects'],
    modules: ['3.3']
    },
    { 
        id: 58, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Что делать, если распределение вашей метрики сильно отличается от нормального (например, это время, проведенное на странице)?",
        keyPoints: ['advanced-methods', 'distribution-issues'],
    modules: ['2.2']
    },
    { 
        id: 64, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Тестируем новый платный тариф в Freemium-продукте. Основная метрика - конверсия в покупку. Какие могут быть негативные последствия и как их отследить?",
        keyPoints: ['practical-significance', 'business-metrics'],
    modules: ['2.5']
    },
    { 
        id: 67, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Что такое SIMPSON'S PARADOX в контексте анализа результатов A/B-теста?",
        keyPoints: ['segmentation', 'causal-inference'],
    modules: ['2.4']
    },
    { 
        id: 73, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "В чем разница между статистической значимостью и практической (или продуктовой) значимостью?",
        keyPoints: ['business-metrics', 'sample-size'],
    modules: ['3.2']
    },
    { 
        id: 76, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Вы анализируете метрику 'Время до первой покупки' в днях. Распределение: медиана 3 дня, среднее 45 дней (есть пользователи, которые покупают через год). T-test показывает p=0.15, но вы видите на графиках, что в тесте явно больше быстрых покупок. Что делать?",
        keyPoints: ['distribution-issues', 'statistical-tests'],
    modules: ['2.2']
    },
    { 
        id: 78, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Что такое 'trigger-based' эксперименты? Когда они полезны?",
        keyPoints: ['randomization', 'metric-issues'],
    modules: ['2.1']
    },
    { 
        id: 84, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Что такое 'эффект каннибализации' и как его можно обнаружить в ходе A/B-теста?",
        keyPoints: ['practical-significance', 'metric-types'],
    modules: ['2.3']
    },
    { 
        id: 88, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Как бы вы тестировали изменения в email-рассылках? Какие особенности у таких тестов?",
        keyPoints: ['practical-significance', 'network-effects', 'metric-issues'],
    modules: ['2.5']
    },
    { 
        id: 93, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Ваш менеджер просит вас проанализировать 10 разных метрик в одном A/B-тесте. Какие у этого есть риски?",
        keyPoints: ['multiple-testing', 'segmentation'],
    modules: ['2.4']
    },
    { 
        id: 98, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Что такое Twyman's Law и как оно применимо к анализу неожиданных результатов тестов?",
        keyPoints: ['practical-significance'],
    modules: ['3.2']
    },
    { 
        id: 107, 
        difficulty: 7, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Ваш эксперимент показал незначимый результат (p=0.34), но PM уверен, что фича 'очевидно' хороша и хочет запускать. Как построите коммуникацию?",
        keyPoints: ['practical-significance'],
    modules: ['3.5']
    },
    { 
        id: 16, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Что такое проблема множественных сравнений (multiple comparisons problem) и как с ней бороться? Приведите пример.",
        keyPoints: ['type-i-error', 'multiple-testing', 'segmentation'],
    modules: ['2.4']
    },
    { 
        id: 24, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['Meta', 'All'],
        text: "Как наличие сетевых эффектов (network effects) в продукте (например, в соцсети) усложняет проведение A/B-тестов? Какие есть подходы к решению этой проблемы?",
        keyPoints: ['network-effects'],
    modules: ['3.3']
    },
    { 
        id: 29, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Как выбросы в данных могут повлиять на результаты A/B-теста? Какие методы для работы с ними вы знаете?",
        keyPoints: ['distribution-issues', 'statistical-power'],
    modules: ['2.4']
    },
    { 
        id: 30, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['Microsoft', 'Meta', 'All'],
        text: "Что такое техника CUPED (Controlled-experiment using pre-experiment data)? Для чего она применяется и как работает на интуитивном уровне?",
        keyPoints: ['advanced-methods', 'statistical-power'],
    modules: ['3.1']
    },
    { 
        id: 35, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Нужно протестировать новый, более 'агрессивный' онбординг для новых пользователей приложения. Какие риски существуют и как их можно измерить с помощью guardrail метрик?",
        keyPoints: ['business-metrics'],
    modules: ['3.3']
    },
    { 
        id: 45, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Что такое bootstrap и в каких случаях его можно применять для анализа результатов A/B-тестов?",
        keyPoints: ['advanced-methods', 'metric-issues'],
    modules: ['2.2']
    },
    { 
        id: 54, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Мы хотим протестировать push-уведомления, которые должны возвращать пользователей в приложение. Какие метрики (кроме CTR пуша) вы бы отслеживали, чтобы понять, успешен ли тест?",
        keyPoints: ['business-metrics'],
    modules: ['2.5']
    },
    { 
        id: 55, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Ваш A/B тест на новых пользователях: контроль 50,000 юзеров, конверсия 5.2%; тест 1,000 юзеров, конверсия 8.1%. P-value = 0.001. Junior аналитик предлагает запускать. В чем проблема?",
        keyPoints: ['sample-size'],
    modules: ['3.3']
    },
    { 
        id: 60, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['Amazon', 'All'],
        text: "Нужно протестировать изменение в процессе оформления заказа (checkout). На что стоит обратить особое внимание при дизайне такого эксперимента?",
        keyPoints: ['business-metrics'],
    modules: ['3.3']
    },
    { 
        id: 63, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Как бы вы организовали A/B-тест для изменения, которое может иметь сильный 'эффект обучения' (learning effect) у пользователей?",
        keyPoints: ['experiment-duration', 'novelty-effects'],
    modules: ['3.3']
    },
    { 
        id: 69, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Что такое Дельта-метод (Delta method) и когда он используется для ratio-метрик?",
        keyPoints: ['advanced-methods'],
    modules: ['2.2']
    },
    { 
        id: 74, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "При анализе результатов теста вы видите, что дисперсия метрики в тестовой группе сильно выросла по сравнению с контрольной. Что это может означать?",
        keyPoints: ['segmentation'],
    modules: ['2.4']
    },
    { 
        id: 79, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['Amazon', 'All'],
        text: "В маркетплейсе мы хотим изменить алгоритм ранжирования товаров в поиске. Как оценить эффект? Какие метрики будут ключевыми?",
        keyPoints: ['business-metrics', 'metric-types'],
    modules: ['2.5']
    },
    { 
        id: 85, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Что такое 'метрики-зомби' (zombie metrics) и 'метрики тщеславия' (vanity metrics)? Приведите примеры.",
        keyPoints: ['metric-issues', 'business-metrics'],
    modules: ['1.4']
    },
    { 
        id: 87, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Результаты теста: p-value = 0.06, размер эффекта +3% на основной метрике (конверсия), CI [-0.5%, +6.5%]. Product manager настаивает на запуске, так как 'мы близко к 0.05 и эффект положительный'. Ваш ответ и аргументация? Какие дополнительные анализы проведете?",
        keyPoints: ['statistical-significance', 'experiment-types'],
    modules: ['3.2']
    },
    { 
        id: 94, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Что такое Quasi-эксперименты? Когда они могут быть полезны, если провести настоящий A/B-тест невозможно?",
        keyPoints: ['experiment-types', 'causal-inference'],
    modules: ['3.1']
    },
    { 
        id: 99, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['Netflix', 'All'],
        text: "Вы работаете над видео-стриминговым сервисом. Предложите эксперимент для борьбы с оттоком (churn) пользователей.",
        keyPoints: ['practical-significance', 'metric-types'],
    modules: ['2.5']
    },
    { 
        id: 101, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "У вас два варианта: (A) запустить эксперимент на 2 недели с мощностью 80% для детекта 2% эффекта, или (B) запустить на 4 недели с мощностью 90% для детекта 1% эффекта. Текущая конверсия 10%. Как будете решать? Какую информацию запросите у PM?",
        keyPoints: ['practical-significance'],
    modules: ['2.1']
    },
    { 
        id: 103, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['Amazon', 'All'],
        text: "Для эксперимента в marketplace: продавцы видят новую фичу, но эффект измеряется через покупателей. Какие проблемы с каузальностью? Как дизайнить такой двусторонний эксперимент?",
        keyPoints: ['network-effects', 'randomization'],
    modules: ['3.3']
    },
    { 
        id: 104, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "В вашем эксперименте 20% пользователей генерируют 80% метрики. Как это влияет на анализ? Какие подходы к работе с такой тяжелохвостым распределением?",
        keyPoints: ['distribution-issues'],
    modules: ['2.4']
    },
    { 
        id: 105, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Как выбирать sample size для ratio-метрики (например, revenue per user)? Почему стандартная формула для пропорций не подходит?",
        keyPoints: ['metric-issues', 'advanced-methods', 'sample-size'],
    modules: ['2.1']
    },
    { 
        id: 108, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "Вы одновременно тестируете изменения в 8 разных частях продукта (независимые эксперименты). Все с альфой 0.05. Получили результаты: 2 теста статзначимы (p=0.03 и p=0.04), остальные 6 - нет. Насколько вы уверены в этих двух 'победителях'?",
        keyPoints: ['type-i-error', 'multiple-testing', 'statistical-significance'],
    modules: ['2.4']
    },
    { 
        id: 109, 
        difficulty: 8, 
        seniority: 'senior',
        bigTech: ['All'],
        text: "У вас есть только 5% трафика для экспериментов (остальное занято другими тестами). Как увеличить пропускную способность? Какие техники и методы можете применить?",
        keyPoints: ['advanced-methods', 'experiment-types'],
    modules: ['3.4']
    },

    // ========================================================================
    // STAFF/PRINCIPAL LEVEL (9-10): Экспертиза и лидерство
    // ========================================================================
    { 
        id: 21, 
        difficulty: 8, 
        seniority: 'staff',
        bigTech: ['All'],
        text: "Чем байесовский подход к A/B-тестированию отличается от частотного (фреквентистского)? Каковы его преимущества и недостатки?",
        keyPoints: ['practical-significance', 'advanced-methods'],
    modules: ['3.1']
    },
    { 
        id: 39, 
        difficulty: 9, 
        seniority: 'staff',
        bigTech: ['All'],
        text: "Что такое последовательное (sequential) тестирование? В чем его отличие от классического подхода с фиксированным размером выборки?",
        keyPoints: ['advanced-methods'],
    modules: ['3.1']
    },
    { 
        id: 40, 
        difficulty: 9, 
        seniority: 'staff',
        bigTech: ['All'],
        text: "Расскажите про алгоритмы 'многоруких бандитов'. В каких ситуациях их применение может быть более оправданным, чем классический A/B-тест?",
        keyPoints: ['metric-issues'],
    modules: ['3.1']
    },
    { 
        id: 49, 
        difficulty: 9, 
        seniority: 'staff',
        bigTech: ['All'],
        text: "Что такое факторный дизайн эксперимента (например, 2x2)? Когда его стоит использовать?",
        keyPoints: ['multiple-testing', 'network-effects'],
    modules: ['3.1']
    },
    { 
        id: 50, 
        difficulty: 9, 
        seniority: 'staff',
        bigTech: ['All'],
        text: "Вам нужно протестировать 5 вариантов заголовков на главной странице. Как бы вы это сделали? Обычный A/B/C/D/E тест или есть другие подходы?",
        keyPoints: ['multiple-testing'],
    modules: ['2.5']
    },
    { 
        id: 59, 
        difficulty: 9, 
        seniority: 'staff',
        bigTech: ['All'],
        text: "Что такое Switchback-тесты (или тесты по времени)? В каких продуктах (например, Uber, Яндекс.Еда) они применяются и почему?",
        keyPoints: ['experiment-types', 'network-effects'],
    modules: ['3.1']
    },
    { 
        id: 65, 
        difficulty: 9, 
        seniority: 'staff',
        bigTech: ['All'],
        text: "Вы запускаете платформу для A/B тестов в компании. Каждая неделя ~50 экспериментов завершаются с альфой 0.05. Через 3 месяца 12 тестов показали 'успех' и команды запустили фичи. Спустя квартал видите: из 12 фич только 4 действительно улучшили метрики. Что произошло? Как системно решить?",
        keyPoints: ['multiple-testing'],
    modules: ['3.1']
    },
    { 
        id: 70, 
        difficulty: 9, 
        seniority: 'staff',
        bigTech: ['All'],
        text: "Компания запускает ребрендинг (новый логотип, цветовая схема). Можно ли 'протестировать' ребрендинг с помощью A/B? Если да, то как? Если нет, то почему?",
        keyPoints: ['practical-significance', 'experiment-types'],
    modules: ['3.3']
    },
    { 
        id: 89, 
        difficulty: 9, 
        seniority: 'staff',
        bigTech: ['Google', 'All'],
        text: "Что такое 'interleaving' эксперименты и когда они применяются, например, в поисковых системах?",
        keyPoints: ['practical-significance'],
    modules: ['3.1']
    },
    { 
        id: 96, 
        difficulty: 9, 
        seniority: 'staff',
        bigTech: ['All'],
        text: "В чем заключается проблема с 'p-hacking'? Как ее можно избежать?",
        keyPoints: ['practical-significance', 'metric-issues'],
    modules: ['3.1']
    },
    { 
        id: 10, 
        difficulty: 10, 
        seniority: 'staff',
        bigTech: ['All'],
        text: "Представьте, что вам нужно с нуля построить платформу для A/B-тестирования в компании. Опишите ключевые компоненты такой системы.",
        keyPoints: ['randomization', 'metric-types'],
    modules: ['3.4']
    },
    { 
        id: 80, 
        difficulty: 10, 
        seniority: 'staff',
        bigTech: ['All'],
        text: "Как построить культуру экспериментов в компании? Какие основные барьеры и как их преодолеть?",
        keyPoints: ['practical-significance'],
    modules: ['3.5']
    },
    { 
        id: 100, 
        difficulty: 10, 
        seniority: 'staff',
        bigTech: ['All'],
        text: "Какие, на ваш взгляд, тренды и будущие направления развития есть в области A/B-тестирования и онлайн-экспериментов?",
        keyPoints: ['experiment-types', 'causal-inference'],
    modules: ['3.5']
    },
    { 
        id: 102, 
        difficulty: 10, 
        seniority: 'staff',
        bigTech: ['All'],
        text: "Спроектируйте архитектуру experimentation platform для компании с 50M DAU, 100+ экспериментов одновременно. Какие компоненты? Как обеспечить: (1) правильную рандомизацию, (2) изоляцию экспериментов, (3) realtime мониторинг, (4) автоматические алерты?",
        keyPoints: ['randomization', 'experiment-types'],
    modules: ['3.4']
    },
    { 
        id: 106, 
        difficulty: 10, 
        seniority: 'staff',
        bigTech: ['All'],
        text: "CEO хочет, чтобы 80% решений принималось на основе A/B тестов. Вы - руководитель аналитики. Ваш план действий на год? Какие барьеры и как их преодолеть?",
        keyPoints: ['practical-significance'],
    modules: ['3.5']
    },
    { 
        id: 110, 
        difficulty: 10, 
        seniority: 'staff',
        bigTech: ['All'],
        text: "Вы в компании-стартапе с 10K DAU. Классические A/B тесты идут месяцами. Какие альтернативные подходы к экспериментированию предложите? Рассмотрите: bandits, bayesian optimization, quasi-experiments.",
        keyPoints: ['practical-significance', 'experiment-types', 'sample-size'],
    modules: ['3.1']
    },

    // ========================================================================
    // НОВЫЕ ВОПРОСЫ ДЛЯ LEARNING PATH (НАЧИНАЯ С ID 111)
    // ========================================================================
    
    // ------------------------------------------------------------------------
    // MODULE 1.1: Введение в A/B тестирование (Junior, Level 1)
    // ------------------------------------------------------------------------
    {
        id: 111,
        difficulty: 2,
        seniority: 'junior',
        bigTech: ['All'],
        text: "Google изменила оттенок синего цвета ссылок и протестировала 41 вариант оттенков. Результат: нашли оптимальный цвет, который принес +$200M revenue в год. Netflix тестирует миниатюры (thumbnails) сериалов и увеличил engagement на 20-30%. Airbnb тестирует каждое изменение и сохранил десятки миллионов $ благодаря A/B тестам. Какие паттерны объединяют эти успешные кейсы? Что делает их A/B тесты эффективными?",
        keyPoints: ['experiment-types', 'metric-types', 'sample-size'],
        modules: ['1.1']
    },
    {
        id: 112,
        difficulty: 2,
        seniority: 'junior',
        bigTech: ['All'],
        text: "Ваш CEO спрашивает: 'Зачем нам A/B тесты? Давайте просто соберем user research, посмотрим на аналитику и запустим изменение. Если что-то пойдет не так - откатим'. Как бы вы аргументировали ценность A/B тестирования? В каких ситуациях A/B тест действительно критичен, а в каких можно обойтись другими методами?",
        keyPoints: ['causal-inference', 'practical-significance'],
        modules: ['1.1']
    },
    {
        id: 113,
        difficulty: 3,
        seniority: 'junior',
        bigTech: ['All'],
        text: "PM предлагает: 'Давайте посмотрим на retention пользователей до и после запуска новой фичи. Если retention вырос - значит фича работает'. Почему этот подход НЕ является A/B тестом? Какие факторы могут искажать выводы? Когда before/after анализ допустим, а когда обязательно нужен A/B тест?",
        keyPoints: ['causal-inference', 'randomization', 'experiment-types'],
        modules: ['1.1']
    },

    // ------------------------------------------------------------------------
    // MODULE 1.2: Статистические основы (Junior, Level 1)
    // ------------------------------------------------------------------------
    {
        id: 114,
        difficulty: 2,
        seniority: 'junior',
        bigTech: ['All'],
        text: "Представь, что ты подбрасываешь монету 10 раз и получаешь 8 орлов. Ты подозреваешь, что монета нечестная. P-value в этом случае = 0.109 (10.9%). Объясни на этом примере: что такое p-value? Что означает 0.109? Можем ли мы утверждать, что монета нечестная? Как это связано с A/B тестами?",
        keyPoints: ['statistical-significance', 'type-i-error'],
        modules: ['1.2'],
        referenceAnswer: `Что такое p-value:

P-value — это вероятность получить наблюдаемый результат (или более экстремальный), если предположить, что нулевая гипотеза верна.

Разбор примера с монетой:

Нулевая гипотеза (H0): монета честная (вероятность орла = 50%)
Альтернативная гипотеза (H1): монета нечестная
Наблюдение: 8 орлов из 10 подбрасываний
P-value = 0.109

Что означает p-value = 0.109:

"Если монета честная (50/50), то вероятность получить 8 или более орлов из 10 подбрасываний составляет 10.9%"

Другими словами:
• Из 100 экспериментов с честной монетой
• В ~11 экспериментах мы получим 8+ орлов
• Это не очень редкий результат для честной монеты

Можем ли утверждать, что монета нечестная?

НЕТ, не можем!

Причина: p-value = 0.109 > 0.05 (стандартный порог)
• Результат НЕ статистически значим
• Мы не можем отвергнуть нулевую гипотезу
• 8 орлов из 10 вполне может быть случайностью

Интерпретация:
✅ "Недостаточно доказательств, что монета нечестная"
❌ НЕ "Монета честная" (мы просто не нашли доказательств нечестности)

Связь с A/B тестами:

В A/B тестах логика та же:

H0: Нет разницы между вариантами A и B
H1: Есть разница между A и B

Пример:
• Вариант A: 10.5% конверсия
• Вариант B: 11.2% конверсия
• P-value = 0.03

Что это означает:
"Если на самом деле разницы нет (H0 верна), вероятность увидеть такую разницу (или больше) составляет 3%"

Решение:
• p = 0.03 < 0.05 → статистически значимо
• Отвергаем H0
• Вариант B скорее всего лучше (разница не случайна)

Важные пороги:
• p < 0.05: статистически значим (стандарт)
• p < 0.01: высоко значим
• p ≥ 0.05: НЕ значим (недостаточно доказательств)

Частые ошибки понимания:
❌ "P-value = вероятность, что H0 верна" - НЕВЕРНО
✅ "P-value = вероятность данных, если H0 верна" - ВЕРНО
❌ "P > 0.05 значит H0 верна" - НЕВЕРНО
✅ "P > 0.05 значит недостаточно доказательств против H0" - ВЕРНО`
    },
    {
        id: 115,
        difficulty: 2,
        seniority: 'junior',
        bigTech: ['All'],
        text: "Результаты твоего A/B теста: конверсия выросла с 10.0% до 10.1%, p-value = 0.001 (статистически значимо!). Разработка и поддержка изменения стоит $50k. Ожидаемый дополнительный доход от +0.1% конверсии = $5k в год. Launch или no launch? Объясни разницу между 'статистически значимо' и 'практически значимо'.",
        keyPoints: ['statistical-significance', 'practical-significance'],
        modules: ['1.2']
    },
    {
        id: 116,
        difficulty: 3,
        seniority: 'junior',
        bigTech: ['All'],
        text: "Ошибка I рода (False Positive): запустили изменение, которое на самом деле не работает. Пример: тест показал +5% конверсии (p=0.04), запустили, но реального эффекта нет. Ошибка II рода (False Negative): НЕ запустили изменение, которое на самом деле работало. Пример: тест показал +2% конверсии (p=0.12), не запустили, упустили возможность. Какая ошибка опаснее для e-commerce стартапа? Для устоявшейся соцсети? Как можно контролировать эти риски?",
        keyPoints: ['type-i-error', 'type-ii-error', 'statistical-power'],
        modules: ['1.2']
    },
    {
        id: 117,
        difficulty: 3,
        seniority: 'junior',
        bigTech: ['All'],
        text: "У тебя два теста: (A) Тест с 1000 пользователей на группу, power = 50% (шанс обнаружить реальный эффект = 50%). (B) Тест с 10,000 пользователей на группу, power = 80%. Второй тест требует ждать 10 раз дольше. PM хочет быстрый результат и выбирает вариант А. Какие риски? В каких случаях оправдан тест с низким power?",
        keyPoints: ['statistical-power', 'sample-size', 'type-ii-error'],
        modules: ['1.2']
    },

    // ------------------------------------------------------------------------
    // MODULE 1.3: Формулирование гипотез (Junior, Level 1)
    // ------------------------------------------------------------------------
    {
        id: 118,
        difficulty: 3,
        seniority: 'junior',
        bigTech: ['All'],
        text: "PM говорит: 'У нас проблема с регистрацией - много пользователей не завершают sign-up. Надо что-то сделать'. Сформулируй ТРИ конкретные гипотезы для A/B тестов, используя SMART framework. Для каждой гипотезы укажи: (1) что именно меняем, (2) для кого, (3) какую метрику используем, (4) ожидаемый эффект, (5) обоснование 'почему это должно сработать'.",
        keyPoints: ['experiment-types', 'metric-types', 'sample-size'],
        modules: ['1.3']
    },
    {
        id: 119,
        difficulty: 2,
        seniority: 'junior',
        bigTech: ['All'],
        text: "У тебя есть 5 гипотез для тестирования, но ресурсов хватит только на 2 теста. Как приоритизировать? Опиши ICE framework (Impact, Confidence, Ease) для приоритизации гипотез. Приведи пример: как бы ты оценил гипотезу 'Изменить цвет главной CTA кнопки с синего на зеленый' по каждому критерию?",
        keyPoints: ['experiment-types', 'practical-significance'],
        modules: ['1.3']
    },
    {
        id: 120,
        difficulty: 3,
        seniority: 'junior',
        bigTech: ['All'],
        text: "Дизайнер предлагает гипотезу: 'Мы сделаем редизайн всей страницы продукта: изменим header, добавим trust badges, перепишем описание, добавим video, изменим расположение reviews и кнопку CTA'. Что фундаментально не так с этой гипотезой для A/B теста? Как бы ты разбил это на несколько тестов? В каких случаях допустимо тестировать несколько изменений одновременно?",
        keyPoints: ['causal-inference', 'experiment-types'],
        modules: ['1.3']
    },
    {
        id: 121,
        difficulty: 2,
        seniority: 'junior',
        bigTech: ['All'],
        text: "Критикуй гипотезу: 'Если мы улучшим UX, пользователи будут более довольны'. Что именно плохо сформулировано? Перепиши эту гипотезу, чтобы она стала testable (пригодной для A/B теста). Как измерить абстрактные концепты типа 'UX', 'удовлетворенность', 'engagement'?",
        keyPoints: ['metric-types'],
        modules: ['1.3']
    },

    // ------------------------------------------------------------------------
    // MODULE 1.4: Выбор метрик (Junior, Level 1)
    // ------------------------------------------------------------------------
    {
        id: 122,
        difficulty: 3,
        seniority: 'junior',
        bigTech: ['All'],
        text: "Ты тестируешь новый checkout flow для e-commerce. Какие guardrail метрики выберешь, чтобы убедиться, что не сломал что-то важное? Назови 5 guardrail метрик и объясни, почему каждая важна. Что делать, если primary метрика выросла, но одна из guardrail метрик значимо упала?",
        keyPoints: ['metric-types', 'metric-issues'],
        modules: ['1.4']
    },
    {
        id: 123,
        difficulty: 2,
        seniority: 'junior',
        bigTech: ['All'],
        text: "Два типа метрик: (A) Ratio metrics: CTR = clicks / impressions, conversion rate = purchases / visitors. (B) Count metrics: total clicks, total revenue. В чем разница при анализе? Когда использовать ratio, когда count? Почему 'average revenue per user' считается более стабильной метрикой чем 'total revenue'? Какие проблемы у ratio метрик?",
        keyPoints: ['metric-types', 'metric-issues'],
        modules: ['1.4']
    },
    {
        id: 124,
        difficulty: 3,
        seniority: 'junior',
        bigTech: ['All'],
        text: "Ваша primary метрика - 'среднее время на сайте'. Тест показал: вариант B увеличил время на +15% (p<0.01). PM хочет launch. Ты сомневаешься. Почему 'среднее время на сайте' - проблемная primary метрика? Приведи примеры, когда рост времени = плохо. Какую метрику использовать вместо нее?",
        keyPoints: ['metric-types', 'metric-issues', 'practical-significance'],
        modules: ['1.4']
    },

    // ------------------------------------------------------------------------
    // MODULE 1.5: Рандомизация и A/A тесты (Junior, Level 1)
    // ------------------------------------------------------------------------
    {
        id: 125,
        difficulty: 3,
        seniority: 'junior',
        bigTech: ['All'],
        text: "Провели A/A тест (обе группы видят одинаковый вариант). Ожидали p-value > 0.05, получили p-value = 0.001! Conversion rate в группе A = 10.5%, в группе B = 9.5%. Группы одинакового размера. Что могло пойти не так? Перечисли 5 возможных причин такого результата. Как диагностировать каждую проблему?",
        keyPoints: ['randomization', 'experiment-types'],
        modules: ['1.5']
    },
    {
        id: 126,
        difficulty: 2,
        seniority: 'junior',
        bigTech: ['All'],
        text: "Два подхода к рандомизации: (A) User-level: каждый пользователь всегда видит один вариант. (B) Session-level: каждая сессия пользователя независимо рандомизируется. Опиши trade-offs. Приведи примеры тестов, где лучше user-level, и где допустим session-level. Что такое 'carry-over эффект' и как он связан с выбором подхода?",
        keyPoints: ['randomization', 'experiment-types', 'novelty-effects'],
        modules: ['1.5']
    },
    {
        id: 127,
        difficulty: 3,
        seniority: 'junior',
        bigTech: ['All'],
        text: "SRM (Sample Ratio Mismatch) check: ты планировал split 50/50, но получил 48.5% vs 51.5%. Total users = 100,000 (48,500 vs 51,500). Критично ли это? Как проверить статистически? Что может вызвать SRM? Если обнаружил SRM - что делать с результатами теста? Когда можно игнорировать небольшой SRM, когда нельзя?",
        keyPoints: ['randomization', 'distribution-issues'],
        modules: ['1.5']
    },

    // ========================================================================
    // LEVEL 2: PRACTITIONER (MID LEVEL) - ID 128-160
    // ========================================================================
    
    // ------------------------------------------------------------------------
    // MODULE 2.1: Дизайн эксперимента (Mid, Level 2)
    // ------------------------------------------------------------------------
    {
        id: 128,
        difficulty: 5,
        seniority: 'mid',
        bigTech: ['All'],
        text: "Калькулятор sample size показал: нужно 100,000 пользователей на группу для достижения 80% power. У тебя всего 10,000 активных пользователей в неделю. Какие варианты? Рассмотри: (1) Увеличение MDE, (2) Снижение significance level, (3) Использование pre-experiment данных (CUPED), (4) Sequential testing, (5) Изменение метрики. Для каждого варианта опиши trade-offs.",
        keyPoints: ['sample-size', 'statistical-power', 'advanced-methods'],
        modules: ['2.1']
    },
    {
        id: 129,
        difficulty: 4,
        seniority: 'mid',
        bigTech: ['All'],
        text: "Твой тест набрал нужный sample size за 3 дня. Результат: p=0.001, конверсия +15%! PM хочет остановить тест и launch прямо сейчас. Ты видишь риски. Когда можно безопасно остановить тест раньше запланированного срока? Что такое 'calendar effect' и почему важно тестировать полную неделю? Когда early stopping действительно допустим?",
        keyPoints: ['experiment-duration', 'peeking-problem'],
        modules: ['2.1']
    },
    {
        id: 130,
        difficulty: 5,
        seniority: 'mid',
        bigTech: ['All'],
        text: "Два варианта дизайна теста: (A) 'Quick & Dirty': 5,000 users per group, 3 дня, power=60%, можем протестировать только большие эффекты (MDE>5%). (B) 'Proper': 50,000 users per group, 3 недели, power=80%, можем детектировать MDE=1%. В каких ситуациях оправдан вариант А? Какие риски принимаем? Как объяснить PM необходимость варианта B?",
        keyPoints: ['sample-size', 'statistical-power', 'practical-significance'],
        modules: ['2.1']
    },

    // ------------------------------------------------------------------------
    // MODULE 2.2: Статистические тесты (Mid, Level 2)
    // ------------------------------------------------------------------------
    {
        id: 131,
        difficulty: 4,
        seniority: 'mid',
        bigTech: ['All'],
        text: "Primary метрика - 'revenue per user'. Данные сильно skewed: median=$10, mean=$50, 95th percentile=$500, есть outliers до $10,000. Стандартный t-test показывает p=0.08 (не значимо). Что делать? Сравни варианты: (1) t-test на логарифмированных данных, (2) Mann-Whitney U-test, (3) Bootstrap, (4) Winsorization outliers. Когда использовать каждый подход?",
        keyPoints: ['statistical-tests', 'distribution-issues'],
        modules: ['2.2']
    },
    {
        id: 132,
        difficulty: 4,
        seniority: 'mid',
        bigTech: ['All'],
        text: "Объясни разницу между t-test и z-test. Твоя метрика - conversion rate (10%). Sample size = 50,000 per group. Какой тест использовать и почему? Что если sample size = 500 per group? При каком sample size становится критичным выбор между z-test и t-test? Что такое 'Central Limit Theorem' и как он связан с этим выбором?",
        keyPoints: ['statistical-tests', 'sample-size'],
        modules: ['2.2']
    },
    {
        id: 133,
        difficulty: 5,
        seniority: 'mid',
        bigTech: ['All'],
        text: "Дата-сайентист предлагает использовать bootstrap для анализа результатов A/B теста вместо стандартного t-test. Что такое bootstrap? В каких ситуациях он предпочтительнее parametric тестов? Какие минусы? Опиши механизм: как bootstrap оценивает p-value и confidence interval.",
        keyPoints: ['statistical-tests', 'advanced-methods'],
        modules: ['2.2']
    },

    // ------------------------------------------------------------------------
    // MODULE 2.4: Анализ результатов (Mid, Level 2)
    // ------------------------------------------------------------------------
    {
        id: 134,
        difficulty: 5,
        seniority: 'mid',
        bigTech: ['All'],
        text: "Результаты теста: p-value = 0.04 (значимо!), но 95% confidence interval для эффекта = [-0.5%, +3.0%] (включает ноль). Коллега говорит: 'p<0.05, значит launch'. Ты сомневаешься. Объясни, почему CI включает ноль при p<0.05? Что это говорит о стабильности эффекта? Launch или no launch в этой ситуации? Как интерпретировать contradicting сигналы?",
        keyPoints: ['statistical-significance', 'practical-significance'],
        modules: ['2.4']
    },
    {
        id: 135,
        difficulty: 5,
        seniority: 'mid',
        bigTech: ['All'],
        text: "Overall результат: конверсия +2%, p=0.15 (не значимо). Но сегментный анализ показал: US: +8% (p=0.01), EU: -3% (p=0.10), Asia: +1% (p=0.50). Что делать? Рассмотри: (1) Launch только в US, (2) Не launch вообще, (3) Разобраться почему разные результаты, (4) Multiple testing problem. Как бы ты принял решение? Какие дополнительные анализы провел бы?",
        keyPoints: ['segmentation', 'multiple-testing', 'practical-significance'],
        modules: ['2.4']
    },
    {
        id: 136,
        difficulty: 4,
        seniority: 'mid',
        bigTech: ['All'],
        text: "Primary метрика - revenue. 1% пользователей (whales) дают 30% всего revenue. Тест показал: average revenue per user вырос на +5% (p=0.03). Детальнее: у 99% пользователей изменений нет, но у топ-1% revenue вырос на +150%. Исключать ли outliers из анализа? Какую метрику использовать? Как интерпретировать такой результат?",
        keyPoints: ['distribution-issues', 'metric-issues', 'practical-significance'],
        modules: ['2.4']
    },
    {
        id: 137,
        difficulty: 5,
        seniority: 'mid',
        bigTech: ['All'],
        text: "Primary метрика (конверсия): +5%, p=0.02 ✅. Secondary метрики: CTR: +10% ✅, Time on site: -15% ❌, Pages per session: -8% ❌. Похоже, пользователи быстрее находят то, что ищут. Но PM беспокоится: 'Меньше time on site = меньше engagement = плохо'. Как интерпретировать противоречивые secondary метрики? Launch или no launch?",
        keyPoints: ['metric-types', 'practical-significance'],
        modules: ['2.4']
    },

    // ------------------------------------------------------------------------
    // MODULE 2.5: Продуктовые кейсы Junior/Mid (Mid, Level 2)
    // ------------------------------------------------------------------------
    {
        id: 138,
        difficulty: 5,
        seniority: 'mid',
        bigTech: ['Amazon', 'All'],
        text: "E-commerce кейс: тестируешь dynamic pricing (цена меняется в зависимости от demand, времени суток, user profile). Primary метрика: revenue per user. Какие guardrail метрики критичны? Какие этические риски? Как избежать backlash от пользователей, которые узнают, что видели разные цены? Как долго тестировать pricing changes? Опиши experiment design полностью.",
        keyPoints: ['metric-types', 'practical-significance', 'causal-inference'],
        modules: ['2.5']
    },
    {
        id: 139,
        difficulty: 5,
        seniority: 'mid',
        bigTech: ['Meta', 'Netflix', 'All'],
        text: "Тестируешь изменение ranking algorithm в feed (Instagram/Facebook/TikTok). Week 1: engagement +10% 🎉. Week 2: engagement +5% 🤔. Week 4: engagement +1% 😐. Week 8: engagement -2% 😱. Что происходит? Как называется этот эффект? Почему краткосрочные метрики могут не коррелировать с долгосрочными? Как правильно тестировать algorithm changes?",
        keyPoints: ['novelty-effects', 'experiment-duration', 'metric-issues'],
        modules: ['2.5']
    },
    {
        id: 140,
        difficulty: 5,
        seniority: 'mid',
        bigTech: ['All'],
        text: "SaaS продукт: тестируешь новый onboarding flow. Multi-step funnel: Sign up → Email verification → Profile setup → First action → Activation (7 days). Immediate результат: sign-up rate +15% ✅. Но: email verification rate -5% ❌, activation rate (7 days) -10% ❌❌. Что оптимизируем: top of funnel или quality? Какую north star метрику использовать? Launch или no launch?",
        keyPoints: ['metric-types', 'practical-significance'],
        modules: ['2.5']
    },

    // ========================================================================
    // LEVEL 3: EXPERT (SENIOR/STAFF LEVEL) - ID 141-180
    // ========================================================================
    
    // ------------------------------------------------------------------------
    // MODULE 3.1: Продвинутые методы (Senior, Level 3)
    // ------------------------------------------------------------------------
    {
        id: 141,
        difficulty: 7,
        seniority: 'senior',
        bigTech: ['All'],
        text: "CUPED (Controlled-experiment Using Pre-Experiment Data) обещает снижение variance на 20-50% → можно уменьшить sample size или повысить power. Объясни механизм работы CUPED простыми словами. Когда CUPED наиболее эффективен? Какие требования к pre-experiment данным? Какие риски и ограничения? Стоит ли добавлять CUPED к каждому тесту, если это увеличивает complexity анализа?",
        keyPoints: ['advanced-methods', 'statistical-power'],
        modules: ['3.1']
    },
    {
        id: 142,
        difficulty: 7,
        seniority: 'senior',
        bigTech: ['All'],
        text: "Multi-armed bandits vs A/B testing: trade-off между exploration и exploitation. Bandits динамически перераспределяют трафик в пользу лучшего варианта → меньше пользователей видят худший вариант. Но: сложнее интерпретировать, меньше статистическая строгость. В каких ситуациях bandits предпочтительнее A/B тестов? Когда A/B тест критически важен? Опиши алгоритм Thompson Sampling.",
        keyPoints: ['advanced-methods', 'experiment-types'],
        modules: ['3.1']
    },
    {
        id: 143,
        difficulty: 7,
        seniority: 'senior',
        bigTech: ['All'],
        text: "Sequential testing (SPRT, mSPRT) позволяет смотреть на результаты по ходу теста без inflated Type I error. Чем отличается от классического 'peeking'? Какие математические гарантии даются? Какие компании используют sequential testing в production? Какие минусы и ограничения? Стоит ли внедрять sequential testing как default подход?",
        keyPoints: ['advanced-methods', 'peeking-problem'],
        modules: ['3.1']
    },

    // ------------------------------------------------------------------------
    // MODULE 3.3: Сложные продуктовые кейсы (Senior/Staff, Level 3)
    // ------------------------------------------------------------------------
    {
        id: 144,
        difficulty: 8,
        seniority: 'senior',
        bigTech: ['Uber', 'Lyft', 'All'],
        text: "Uber/Lyft кейс: тестируешь изменение surge pricing в городе. Проблема: two-sided marketplace - изменение влияет и на drivers, и на riders. Network effects: если повысили цену в районе А, водители уезжают из района B → группы больше не независимы. Spillover между регионами. Как дизайнить эксперимент? Рассмотри: geo-based randomization, time-based switchback tests. Какие метрики для drivers vs riders?",
        keyPoints: ['network-effects', 'experiment-types', 'advanced-methods'],
        modules: ['3.3']
    },
    {
        id: 145,
        difficulty: 8,
        seniority: 'senior',
        bigTech: ['YouTube', 'Netflix', 'TikTok', 'All'],
        text: "YouTube/TikTok кейс: меняешь recommendation algorithm. Immediate metrics: watch time +5%, CTR +10% ✅. Но опасения: алгоритм может создавать filter bubble, показывать больше clickbait, снижать content diversity. Как измерить 'quality' контента? Какие long-term метрики смотреть? Как балансировать short-term engagement vs long-term user satisfaction? Как дизайнить holdout для long-term monitoring?",
        keyPoints: ['metric-issues', 'novelty-effects', 'practical-significance'],
        modules: ['3.3']
    },
    {
        id: 146,
        difficulty: 8,
        seniority: 'senior',
        bigTech: ['Amazon', 'All'],
        text: "E-commerce pricing experiment: тестируешь персонализированные цены (ML model предсказывает willingness to pay и назначает разные цены разным пользователям). Revenue +8% в тесте ✅. Но: (1) Ethical concerns: price discrimination, (2) Reputational risk если пользователи узнают, (3) Legal risks в некоторых странах, (4) Конкуренты могут использовать против вас в marketing. Launch или no launch? Как митигировать риски?",
        keyPoints: ['practical-significance', 'causal-inference'],
        modules: ['3.3']
    },
    {
        id: 147,
        difficulty: 9,
        seniority: 'staff',
        bigTech: ['All'],
        text: "Multi-quarter strategy experiment: меняешь core business model (например, переход с ads-based на subscription, как YouTube Premium). Эксперимент должен идти минимум 6-12 месяцев. Как дизайнить такой долгосрочный эксперимент? Какие метрики смотреть? Как убедить CEO инвестировать в такой длинный тест? Как избежать organizational pressure запустить раньше? Опиши experiment design и governance process.",
        keyPoints: ['practical-significance', 'experiment-types', 'business-metrics'],
        modules: ['3.3']
    },

    // ------------------------------------------------------------------------
    // MODULE 3.4: Инфраструктура и масштабирование (Senior/Staff, Level 3)
    // ------------------------------------------------------------------------
    {
        id: 148,
        difficulty: 7,
        seniority: 'senior',
        bigTech: ['All'],
        text: "Layering vs Interleaving experiments: твоя платформа запускает 100+ одновременных экспериментов. Как избежать collision (взаимного влияния)? Объясни систему layers/namespaces. Что такое orthogonalization? Когда experiments в разных layers действительно независимы? Как проверить, что collision нет? Опиши архитектуру experiment platform для 1000+ experiments/year.",
        keyPoints: ['experiment-types', 'randomization'],
        modules: ['3.4']
    },
    {
        id: 149,
        difficulty: 7,
        seniority: 'senior',
        bigTech: ['All'],
        text: "Automated quality checks для experimentation platform. Что должна проверять система автоматически для каждого эксперимента? Опиши must-have checks: (1) SRM check, (2) Data quality, (3) Guardrail metrics alerts, (4) Power analysis, (5) Novelty detection. Для каждого check: как работает, какой threshold, что делать при fail?",
        keyPoints: ['randomization', 'metric-issues'],
        modules: ['3.4']
    },
    {
        id: 150,
        difficulty: 8,
        seniority: 'senior',
        bigTech: ['Meta', 'Google', 'All'],
        text: "Real-time experiment monitoring: данные обновляются каждый час, dashboard показывает текущие результаты. Риски: peeking problem, false alarms при раннем просмотре. Как строить real-time monitoring, чтобы не вводить в заблуждение? Какие метрики показывать? Как визуализировать uncertainty? Опиши best practices для real-time scorecards.",
        keyPoints: ['peeking-problem', 'metric-issues'],
        modules: ['3.4']
    },
    {
        id: 151,
        difficulty: 8,
        seniority: 'senior',
        bigTech: ['All'],
        text: "Обнаружение collision между экспериментами: запущено 50 экспериментов одновременно, результаты одного теста неожиданно negative. Подозрение: влияние другого эксперимента. Как систематически проверить collision? Опиши алгоритм detection. Какие типы collision бывают? Как предотвратить на уровне платформы?",
        keyPoints: ['experiment-types', 'network-effects'],
        modules: ['3.4']
    },
    {
        id: 152,
        difficulty: 8,
        seniority: 'staff',
        bigTech: ['All'],
        text: "Scaling experimentation culture: компания запускала 10 экспериментов в год, хочешь масштабировать до 1000. Какие изменения нужны? (1) Платформа и tooling, (2) Governance и processes, (3) Обучение и best practices, (4) Metrics и standards. Как измерить 'maturity' experimentation culture? Какие KPIs для experimentation program? Как не потерять качество при масштабировании?",
        keyPoints: ['experiment-types'],
        modules: ['3.4']
    },

    // ------------------------------------------------------------------------
    // MODULE 3.5: Лидерство и культура экспериментов (Staff, Level 3)
    // ------------------------------------------------------------------------
    {
        id: 153,
        difficulty: 8,
        seniority: 'staff',
        bigTech: ['All'],
        text: "PM провел A/B тест, получил negative result (метрика упала на -3%, p=0.02). Но PM настаивает на launch: 'Я уверен, что это правильное решение. Может тест был некорректен? Может пользователи еще не привыкли? Давайте launch и посмотрим'. Твоя роль - Senior/Staff Data Scientist. Как убедить PM следовать данным? Какие аргументы? Как балансировать data-driven подход с product intuition? Когда допустимо игнорировать negative test?",
        keyPoints: ['practical-significance', 'causal-inference'],
        modules: ['3.5']
    },
    {
        id: 154,
        difficulty: 8,
        seniority: 'staff',
        bigTech: ['All'],
        text: "Как измерить 'зрелость' experimentation culture в компании? Предложи framework с 4-5 уровнями зрелости (от 'ad-hoc testing' до 'experimentation-first culture'). Для каждого уровня опиши: что характерно, какие процессы, какие инструменты, сколько экспериментов в год, кто запускает, как принимаются решения. Как двигать компанию с уровня 1 на уровень 4?",
        keyPoints: ['experiment-types'],
        modules: ['3.5']
    },
    {
        id: 155,
        difficulty: 9,
        seniority: 'staff',
        bigTech: ['All'],
        text: "CEO хочет launch крупное изменение без A/B теста: 'Я уверен, что это нужно. Конкуренты уже сделали. Не хочу тратить 2 недели на тест'. Ты - Head of Experimentation. Как донести ценность A/B теста? Рассмотри: (1) Cost of wrong decision, (2) Примеры failed launches без тестов, (3) Opportunity cost, (4) Компромиссы (phased rollout, shorter test). Как изменить культуру decision-making в компании?",
        keyPoints: ['practical-significance', 'causal-inference'],
        modules: ['3.5']
    },
    {
        id: 156,
        difficulty: 9,
        seniority: 'staff',
        bigTech: ['All'],
        text: "Стратегия scaling experimentation: из 10 в год → 100 в год → 1000 в год. Опиши roadmap на 2 года. Какие этапы? Какие инвестиции в platform, tooling, людей? Как обучать команды? Как устанавливать standards? Какие governance процессы? Как балансировать democratization (каждый может запустить тест) vs quality control? Какие metrics успеха experimentation program?",
        keyPoints: ['experiment-types'],
        modules: ['3.5']
    }
];

export const LEADERBOARD_DATA = [
    { name: 'Alex', score: 95 },
    { name: 'Elena', score: 87 },
    { name: 'Mike', score: 81 },
    { name: 'Jane', score: 75 },
    { name: 'Sam', score: 68 },
];