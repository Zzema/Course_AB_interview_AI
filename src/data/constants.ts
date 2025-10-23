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
 * Версия: 2.0 FINAL
 * Дата: 2025-10-21
 * Целевая аудитория: Senior Product Analyst в BigTech
 * Всего вопросов: 110
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
        categories: ['foundations'], 
        bigTech: ['All'],
        text: "Что такое A/B-тестирование и зачем оно нужно в продуктовой аналитике?",
        keyPoints: ['causal-inference', 'randomization', 'experiment-types']
    },
    { 
        id: 26, 
        difficulty: 2, 
        seniority: 'junior',
        categories: ['foundations', 'pitfalls'], 
        bigTech: ['All'],
        text: "Ваш коллега говорит: 'Давай сделаем контрольную группу из 30% пользователей, а тестовую из 70%, чтобы быстрее набрать данные'. Что не так с этим предложением?",
        keyPoints: ['statistical-power', 'sample-size']
    },
    { 
        id: 81, 
        difficulty: 2, 
        seniority: 'junior',
        categories: ['foundations', 'metrics'], 
        bigTech: ['All'],
        text: "PM говорит: 'Наша конверсия 15%'. Вы спрашиваете: 'Конверсия чего в что?'. PM удивлен вопросом. Почему это важно уточнить перед запуском A/B теста?",
        keyPoints: ['metric-types']
    },
    { 
        id: 41, 
        difficulty: 2, 
        seniority: 'junior',
        categories: ['foundations'], 
        bigTech: ['All'],
        text: "Какие три ключевых элемента должны быть в хорошо сформулированной гипотезе для A/B-теста?",
        keyPoints: ['sample-size', 'metric-types']
    },
    { 
        id: 11, 
        difficulty: 3, 
        seniority: 'junior',
        categories: ['foundations', 'pitfalls'], 
        bigTech: ['All'],
        text: "Чем отличается A/A-тест от A/B-теста и для чего он проводится?",
        keyPoints: ['randomization', 'experiment-types']
    },
    { 
        id: 71, 
        difficulty: 3, 
        seniority: 'junior',
        categories: ['design', 'pitfalls'], 
        bigTech: ['All'],
        text: "Дизайнер сделал 5 вариантов новой кнопки и хочет протестировать все сразу: A/B/C/D/E/F тест, каждый вариант получит по 16.6% трафика. Звучит эффективно? Что не так?",
        keyPoints: ['statistical-power', 'multiple-testing', 'experiment-types']
    },
    { 
        id: 91, 
        difficulty: 3, 
        seniority: 'junior',
        categories: ['foundations', 'design'], 
        bigTech: ['All'],
        text: "Почему для A/B-тестов важен принцип 'одно изменение за раз'?",
        keyPoints: ['causal-inference', 'experiment-types']
    },
    { 
        id: 22, 
        difficulty: 3, 
        seniority: 'junior',
        categories: ['foundations', 'design'], 
        bigTech: ['All'],
        text: "Критикуйте гипотезу: 'Мы думаем, что если мы сделаем наш сайт быстрее, то пользователи будут счастливее'. Перепишите ее по SMART-критериям с конкретными метриками и ожидаемыми эффектами. Как измерить 'счастье'? Какая скорость 'быстрее'?",
        keyPoints: ['metric-types', 'sample-size']
    },
    { 
        id: 31, 
        difficulty: 3, 
        seniority: 'junior',
        categories: ['metrics'], 
        bigTech: ['Microsoft', 'All'],
        text: "Что такое OEC (Overall Evaluation Criterion)? Зачем она нужна, если можно смотреть на несколько метрик сразу?",
        keyPoints: ['metric-types', 'statistical-significance']
    },

    // ========================================================================
    // MID LEVEL (4-6): Практическое применение
    // ========================================================================
    { 
        id: 2, 
        difficulty: 4, 
        seniority: 'mid',
        categories: ['design', 'metrics'], 
        bigTech: ['Amazon', 'All'],
        text: "Сформулируйте продуктовую гипотезу для изменения цвета кнопки 'Купить' с синего на зеленый на сайте e-commerce. Гипотеза должна включать: (1) целевую аудиторию, (2) ожидаемое изменение поведения, (3) метрику успеха, (4) минимальный детектируемый эффект. Какие guardrail метрики добавите?",
        keyPoints: ['sample-size', 'metric-types']
    },
    { 
        id: 3, 
        difficulty: 4, 
        seniority: 'mid',
        categories: ['design', 'statistics'], 
        bigTech: ['All'],
        text: "Как определить необходимый размер выборки для A/B-теста? Какие параметры для этого нужны?",
        keyPoints: ['sample-size', 'statistical-power']
    },
    { 
        id: 27, 
        difficulty: 4, 
        seniority: 'mid',
        categories: ['design'], 
        bigTech: ['All'],
        text: "Почему важна случайная (рандомизированная) выборка пользователей для групп A и B?",
        keyPoints: ['causal-inference']
    },
    { 
        id: 12, 
        difficulty: 4, 
        seniority: 'mid',
        categories: ['metrics'], 
        bigTech: ['All'],
        text: "Приведите пример guardrail (защитной) метрики для теста новой фичи в приложении для доставки еды. Объясните свой выбор.",
        keyPoints: ['practical-significance', 'business-metrics']
    },
    { 
        id: 42, 
        difficulty: 4, 
        seniority: 'mid',
        categories: ['metrics', 'interpretation'], 
        bigTech: ['All'],
        text: "Вы выбрали 'Выручка с пользователя' как основную метрику теста. Через неделю PM просит добавить еще 5 метрик: CTR, время на сайте, bounce rate, NPS, количество сессий. Как отреагируете?",
        keyPoints: ['segmentation', 'multiple-testing', 'metric-types']
    },
    { 
        id: 61, 
        difficulty: 4, 
        seniority: 'mid',
        categories: ['interpretation', 'statistics'], 
        bigTech: ['All'],
        text: "После запуска теста вы получили p-value = 0.03, но видите, что в первый день эффект был +10%, второй день +5%, третий день +2%, а сейчас уже -1%. Тест все еще статзначим. Ваши действия?",
        keyPoints: ['novelty-effects', 'experiment-duration']
    },
    { 
        id: 82, 
        difficulty: 4, 
        seniority: 'mid',
        categories: ['cases'], 
        bigTech: ['All'],
        text: "Предложите гипотезу для A/B-теста на странице с ценами (pricing page)."
    },
    { 
        id: 34, 
        difficulty: 4, 
        seniority: 'mid',
        categories: ['statistics'], 
        bigTech: ['All'],
        text: "Какой статистический тест (критерий) обычно используется для сравнения средних значений в двух группах? А для сравнения конверсий?",
        keyPoints: ['statistical-tests']
    },
    { 
        id: 17, 
        difficulty: 4, 
        seniority: 'mid',
        categories: ['analysis', 'interpretation'], 
        bigTech: ['All'],
        text: "В ходе анализа результатов A/B-теста вы не обнаружили общего статзначимого эффекта. Стоит ли смотреть на сегменты пользователей? Если да, то как правильно это делать?",
        keyPoints: ['segmentation', 'multiple-testing']
    },
    { 
        id: 51, 
        difficulty: 4, 
        seniority: 'mid',
        categories: ['design', 'statistics'], 
        bigTech: ['All'],
        text: "Какая связь между размером выборки, статистической мощностью и MDE?",
        keyPoints: ['practical-significance', 'sample-size']
    },
    { 
        id: 77, 
        difficulty: 4, 
        seniority: 'mid',
        categories: ['interpretation', 'foundations'], 
        bigTech: ['All'],
        text: "Объясните, почему корреляция не означает причинно-следственную связь, на примере A/B-тестирования."
    },
    { 
        id: 97, 
        difficulty: 4, 
        seniority: 'mid',
        categories: ['infrastructure'], 
        bigTech: ['All'],
        text: "Какие инструменты для проведения A/B-тестов вы знаете? (например, Google Optimize, Optimizely, или внутренние системы)"
    },
    { 
        id: 4, 
        difficulty: 5, 
        seniority: 'mid',
        categories: ['statistics'], 
        bigTech: ['All'],
        text: "Что такое p-value? Какое значение p-value обычно считают пороговым для принятия решения и почему?",
        keyPoints: ['statistical-significance', 'type-i-error']
    },
    { 
        id: 13, 
        difficulty: 5, 
        seniority: 'mid',
        categories: ['design'], 
        bigTech: ['All'],
        text: "Почему нельзя проводить A/B-тест всего один день, даже если набрался достаточный размер выборки?",
        keyPoints: ['experiment-duration']
    },
    { 
        id: 18, 
        difficulty: 5, 
        seniority: 'mid',
        categories: ['metrics', 'analysis'], 
        bigTech: ['All'],
        text: "Вы тестируете новую фичу 'Добавить в избранное'. Дата-инженер предлагает метрику: 'Среднее количество добавлений в избранное на пользователя'. Что может пойти не так с этой метрикой? Предложите альтернативу.",
        keyPoints: ['distribution-issues', 'metric-issues']
    },
    { 
        id: 23, 
        difficulty: 5, 
        seniority: 'mid',
        categories: ['statistics', 'design'], 
        bigTech: ['All'],
        text: "Что такое статистическая мощность (statistical power) и почему важно устанавливать ее на уровне 80% или выше?",
        keyPoints: ['type-ii-error', 'statistical-power']
    },
    { 
        id: 28, 
        difficulty: 5, 
        seniority: 'mid',
        categories: ['cases', 'metrics'], 
        bigTech: ['All'],
        text: "Вы работаете в музыкальном стриминговом сервисе. Предложите A/B-тест для увеличения количества прослушиваний 'непопулярных' исполнителей."
    },
    { 
        id: 36, 
        difficulty: 5, 
        seniority: 'mid',
        categories: ['statistics'], 
        bigTech: ['All'],
        text: "Что такое односторонняя и двусторонняя гипотеза в статистическом тесте? Какую следует использовать в A/B-тестировании и почему?",
        keyPoints: ['experiment-types']
    },
    { 
        id: 46, 
        difficulty: 5, 
        seniority: 'mid',
        categories: ['interpretation'], 
        bigTech: ['All'],
        text: "Почему стат. незначимый результат — это тоже результат? Что он нам говорит?",
        keyPoints: ['practical-significance', 'statistical-power']
    },
    { 
        id: 52, 
        difficulty: 5, 
        seniority: 'mid',
        categories: ['interpretation', 'pitfalls'], 
        bigTech: ['All'],
        text: "Что такое 'regression to the mean' (регрессия к среднему) и как это может повлиять на интерпретацию результатов?"
    },
    { 
        id: 56, 
        difficulty: 5, 
        seniority: 'mid',
        categories: ['metrics'], 
        bigTech: ['All'],
        text: "Что такое 'прокси-метрика'? Приведите пример.",
        keyPoints: ['practical-significance']
    },
    { 
        id: 66, 
        difficulty: 5, 
        seniority: 'mid',
        categories: ['metrics'], 
        bigTech: ['All'],
        text: "Почему нельзя выбирать слишком много основных метрик для одного теста?",
        keyPoints: ['multiple-testing']
    },
    { 
        id: 72, 
        difficulty: 5, 
        seniority: 'mid',
        categories: ['design', 'infrastructure'], 
        bigTech: ['All'],
        text: "Как убедиться, что ваша система сплитования (распределения пользователей по группам) работает корректно?",
        keyPoints: ['experiment-types', 'randomization']
    },
    { 
        id: 86, 
        difficulty: 5, 
        seniority: 'mid',
        categories: ['design'], 
        bigTech: ['All'],
        text: "Какой минимальный размер группы должен быть для проведения A/B-теста? Существует ли такое число?",
        keyPoints: ['sample-size']
    },
    { 
        id: 92, 
        difficulty: 5, 
        seniority: 'mid',
        categories: ['metrics'], 
        bigTech: ['All'],
        text: "Как выбрать правильную метрику для A/B-теста, если у продукта несколько целей (например, вовлечение и монетизация)?",
        keyPoints: ['metric-types']
    },
    { 
        id: 5, 
        difficulty: 6, 
        seniority: 'mid',
        categories: ['interpretation', 'metrics'], 
        bigTech: ['Amazon', 'All'],
        text: "Результаты теста показали статзначимый рост конверсии на 5%, но при этом средний чек упал на 3% (нестатзначимо). Ваши действия и как вы примете решение?",
        keyPoints: ['practical-significance', 'business-metrics']
    },
    { 
        id: 8, 
        difficulty: 6, 
        seniority: 'mid',
        categories: ['statistics', 'interpretation'], 
        bigTech: ['All'],
        text: "Что такое ошибка I и II рода в контексте A/B-тестирования? Какая из них, на ваш взгляд, чаще бывает 'дороже' для бизнеса?",
        keyPoints: ['type-i-error', 'type-ii-error']
    },
    { 
        id: 19, 
        difficulty: 6, 
        seniority: 'mid',
        categories: ['design'], 
        bigTech: ['All'],
        text: "Что такое MDE (Minimum Detectable Effect)? Как выбор MDE влияет на размер выборки и длительность теста?",
        keyPoints: ['sample-size']
    },
    { 
        id: 14, 
        difficulty: 6, 
        seniority: 'mid',
        categories: ['interpretation', 'statistics'], 
        bigTech: ['All'],
        text: "Результаты теста: конверсия выросла с 10% до 11%, p-value=0.001, доверительный интервал [+0.8%, +1.2%]. PM в восторге. Вы замечаете, что в абсолютных числах это 100 дополнительных конверсий в день, а реализация фичи требует команду из 3 разработчиков на 2 месяца. Ваша оценка ситуации?",
        keyPoints: ['practical-significance']
    },
    { 
        id: 32, 
        difficulty: 6, 
        seniority: 'mid',
        categories: ['design', 'pitfalls'], 
        bigTech: ['All'],
        text: "Для чего может понадобиться проводить A/A/B тест вместо обычного A/B?",
        keyPoints: ['randomization', 'experiment-types']
    },
    { 
        id: 38, 
        difficulty: 6, 
        seniority: 'mid',
        categories: ['design', 'pitfalls'], 
        bigTech: ['All'],
        text: "Что произойдет, если вы остановите тест раньше, как только p-value достигнет нужного уровня?",
        keyPoints: ['peeking-problem', 'type-i-error', 'advanced-methods']
    },
    { 
        id: 43, 
        difficulty: 6, 
        seniority: 'mid',
        categories: ['design'], 
        bigTech: ['All'],
        text: "Что такое 'эффект уикенда' и как его следует учитывать при планировании длительности теста?",
        keyPoints: ['experiment-duration']
    },
    { 
        id: 47, 
        difficulty: 6, 
        seniority: 'mid',
        categories: ['design', 'pitfalls'], 
        bigTech: ['All'],
        text: "Что такое SRM (Sample Ratio Mismatch) и почему за этим важно следить?",
        keyPoints: ['randomization', 'statistical-tests']
    },
    { 
        id: 57, 
        difficulty: 6, 
        seniority: 'mid',
        categories: ['interpretation', 'design'], 
        bigTech: ['All'],
        text: "Ваш коллега запустил тест, и в первые 2 дня вариант B показывает взрывной рост. Он хочет остановить тест и выкатить фичу. Ваши действия?",
        keyPoints: ['peeking-problem', 'experiment-duration', 'advanced-methods']
    },
    { 
        id: 62, 
        difficulty: 6, 
        seniority: 'senior',
        categories: ['interpretation', 'metrics'], 
        bigTech: ['All'],
        text: "Что такое 'метрики здоровья' (health metrics) и почему они важны?",
        keyPoints: ['practical-significance', 'metric-types']
    },
    { 
        id: 68, 
        difficulty: 6, 
        seniority: 'mid',
        categories: ['cases', 'design'], 
        bigTech: ['All'],
        text: "Вы хотите протестировать новый дизайн главной страницы. Есть ли разница, как проводить этот тест на мобильных устройствах и на десктопе?",
        keyPoints: ['practical-significance', 'experiment-types', 'metric-types']
    },
    { 
        id: 75, 
        difficulty: 6, 
        seniority: 'senior',
        categories: ['metrics'], 
        bigTech: ['Meta', 'All'],
        text: "Приведите пример хорошей 'северной звезды' (North Star Metric) для продукта типа TikTok.",
        keyPoints: ['practical-significance', 'statistical-tests', 'business-metrics']
    },
    { 
        id: 83, 
        difficulty: 6, 
        seniority: 'mid',
        categories: ['statistics', 'pitfalls'], 
        bigTech: ['All'],
        text: "CEO видит дашборд: контроль 10.2% конверсия, тест 10.5% конверсия. Говорит: 'Отлично, запускаем!'. Размер групп по 500 человек, тест идет 3 дня. Что вы ответите CEO?",
        keyPoints: ['sample-size', 'experiment-duration', 'statistical-significance', 'randomization']
    },
    { 
        id: 90, 
        difficulty: 6, 
        seniority: 'senior',
        categories: ['leadership', 'interpretation'], 
        bigTech: ['All'],
        text: "Какие этические вопросы могут возникнуть при проведении A/B-тестов? Приведите пример.",
        keyPoints: ['practical-significance']
    },
    { 
        id: 95, 
        difficulty: 6, 
        seniority: 'senior',
        categories: ['cases', 'interpretation'], 
        bigTech: ['All'],
        text: "Тест показал рост регистрации, но падение удержания первого дня (Day 1 Retention). Как интерпретировать такой результат?",
        keyPoints: ['practical-significance', 'business-metrics']
    },

    // ========================================================================
    // SENIOR LEVEL (7-8): Продвинутые концепции
    // ========================================================================
    { 
        id: 6, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['design', 'interpretation', 'pitfalls'], 
        bigTech: ['All'],
        text: "Проблема подглядывания (peeking problem) в A/B-тестировании. В чем она заключается и как ее избежать?",
        keyPoints: ['advanced-methods', 'experiment-types']
    },
    { 
        id: 7, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['cases', 'metrics', 'design'], 
        bigTech: ['Meta', 'All'],
        text: "Вы хотите протестировать новый алгоритм рекомендаций в ленте новостей социальной сети. Как бы вы подошли к дизайну такого эксперимента? Какие метрики бы отслеживали?",
        keyPoints: ['metric-types']
    },
    { 
        id: 9, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['metrics', 'statistics'], 
        bigTech: ['All'],
        text: "Мы тестируем изменение, которое должно повлиять на CTR (click-through rate). CTR - это ratio метрика. В чем особенность проверки статзначимости для таких метрик?",
        keyPoints: ['advanced-methods', 'distribution-issues', 'metric-issues']
    },
    { 
        id: 15, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['cases', 'metrics'], 
        bigTech: ['All'],
        text: "В приложении для изучения языков мы хотим ввести геймификацию (очки, уровни). Какую основную метрику вы бы выбрали для A/B-теста и почему? Какие вторичные метрики важны?"
    },
    { 
        id: 20, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['cases', 'design'], 
        bigTech: ['Netflix', 'All'],
        text: "Сервис онлайн-кинотеатра хочет протестировать новую модель подписки с более низкой ценой, но с показом рекламы. Опишите дизайн эксперимента."
    },
    { 
        id: 25, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['interpretation'], 
        bigTech: ['Amazon', 'All'],
        text: "Тест показал статзначимое падение метрики 'время на сайте', но статзначимый рост конверсии в покупку. Является ли это хорошим результатом?",
        keyPoints: ['practical-significance', 'metric-types']
    },
    { 
        id: 33, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['interpretation', 'design'], 
        bigTech: ['All'],
        text: "Как оценить долгосрочный эффект от изменения, если A/B-тест обычно длится 2-4 недели?",
        keyPoints: ['practical-significance', 'metric-types', 'experiment-duration']
    },
    { 
        id: 37, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['interpretation', 'pitfalls'], 
        bigTech: ['All'],
        text: "Что такое 'эффект новизны' (novelty effect) и как он может исказить результаты A/B-теста?",
        keyPoints: ['novelty-effects', 'experiment-duration']
    },
    { 
        id: 44, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['cases', 'interpretation'], 
        bigTech: ['All'],
        text: "Выкатили новую фичу после успешного A/B-теста, но общие метрики продукта упали. Какие могут быть причины?",
        keyPoints: ['network-effects']
    },
    { 
        id: 48, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['metrics', 'analysis'], 
        bigTech: ['All'],
        text: "Как бы вы подходили к проверке гипотезы о влиянии на LTV (Lifetime Value), учитывая, что LTV считается очень долго?",
        keyPoints: ['metric-types']
    },
    { 
        id: 53, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['design'], 
        bigTech: ['All'],
        text: "В каких случаях имеет смысл проводить тест только на сегменте новых пользователей?",
        keyPoints: ['novelty-effects']
    },
    { 
        id: 58, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['statistics'], 
        bigTech: ['All'],
        text: "Что делать, если распределение вашей метрики сильно отличается от нормального (например, это время, проведенное на странице)?",
        keyPoints: ['advanced-methods', 'distribution-issues']
    },
    { 
        id: 64, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['cases', 'metrics'], 
        bigTech: ['All'],
        text: "Тестируем новый платный тариф в Freemium-продукте. Основная метрика - конверсия в покупку. Какие могут быть негативные последствия и как их отследить?",
        keyPoints: ['practical-significance', 'business-metrics']
    },
    { 
        id: 67, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['interpretation', 'pitfalls'], 
        bigTech: ['All'],
        text: "Что такое SIMPSON'S PARADOX в контексте анализа результатов A/B-теста?",
        keyPoints: ['segmentation', 'causal-inference']
    },
    { 
        id: 73, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['interpretation'], 
        bigTech: ['All'],
        text: "В чем разница между статистической значимостью и практической (или продуктовой) значимостью?",
        keyPoints: ['business-metrics', 'sample-size']
    },
    { 
        id: 76, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['statistics', 'analysis'], 
        bigTech: ['All'],
        text: "Вы анализируете метрику 'Время до первой покупки' в днях. Распределение: медиана 3 дня, среднее 45 дней (есть пользователи, которые покупают через год). T-test показывает p=0.15, но вы видите на графиках, что в тесте явно больше быстрых покупок. Что делать?",
        keyPoints: ['distribution-issues', 'statistical-tests']
    },
    { 
        id: 78, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['design', 'advanced_methods'], 
        bigTech: ['All'],
        text: "Что такое 'trigger-based' эксперименты? Когда они полезны?",
        keyPoints: ['randomization', 'metric-issues']
    },
    { 
        id: 84, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['design', 'pitfalls'], 
        bigTech: ['All'],
        text: "Что такое 'эффект каннибализации' и как его можно обнаружить в ходе A/B-теста?",
        keyPoints: ['practical-significance', 'metric-types']
    },
    { 
        id: 88, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['cases', 'design'], 
        bigTech: ['All'],
        text: "Как бы вы тестировали изменения в email-рассылках? Какие особенности у таких тестов?",
        keyPoints: ['practical-significance', 'network-effects', 'metric-issues']
    },
    { 
        id: 93, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['analysis', 'pitfalls'], 
        bigTech: ['All'],
        text: "Ваш менеджер просит вас проанализировать 10 разных метрик в одном A/B-тесте. Какие у этого есть риски?",
        keyPoints: ['multiple-testing', 'segmentation']
    },
    { 
        id: 98, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['interpretation'], 
        bigTech: ['All'],
        text: "Что такое Twyman's Law и как оно применимо к анализу неожиданных результатов тестов?",
        keyPoints: ['practical-significance']
    },
    { 
        id: 107, 
        difficulty: 7, 
        seniority: 'senior',
        categories: ['leadership', 'interpretation'], 
        bigTech: ['All'],
        text: "Ваш эксперимент показал незначимый результат (p=0.34), но PM уверен, что фича 'очевидно' хороша и хочет запускать. Как построите коммуникацию?",
        keyPoints: ['practical-significance']
    },
    { 
        id: 16, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['statistics', 'interpretation'], 
        bigTech: ['All'],
        text: "Что такое проблема множественных сравнений (multiple comparisons problem) и как с ней бороться? Приведите пример.",
        keyPoints: ['type-i-error', 'multiple-testing', 'segmentation']
    },
    { 
        id: 24, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['design', 'interpretation', 'advanced_methods'], 
        bigTech: ['Meta', 'All'],
        text: "Как наличие сетевых эффектов (network effects) в продукте (например, в соцсети) усложняет проведение A/B-тестов? Какие есть подходы к решению этой проблемы?",
        keyPoints: ['network-effects']
    },
    { 
        id: 29, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['analysis', 'interpretation'], 
        bigTech: ['All'],
        text: "Как выбросы в данных могут повлиять на результаты A/B-теста? Какие методы для работы с ними вы знаете?",
        keyPoints: ['distribution-issues', 'statistical-power']
    },
    { 
        id: 30, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['advanced_methods', 'design'], 
        bigTech: ['Microsoft', 'Meta', 'All'],
        text: "Что такое техника CUPED (Controlled-experiment using pre-experiment data)? Для чего она применяется и как работает на интуитивном уровне?",
        keyPoints: ['advanced-methods', 'statistical-power']
    },
    { 
        id: 35, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['cases', 'design', 'metrics'], 
        bigTech: ['All'],
        text: "Нужно протестировать новый, более 'агрессивный' онбординг для новых пользователей приложения. Какие риски существуют и как их можно измерить с помощью guardrail метрик?",
        keyPoints: ['business-metrics']
    },
    { 
        id: 45, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['statistics'], 
        bigTech: ['All'],
        text: "Что такое bootstrap и в каких случаях его можно применять для анализа результатов A/B-тестов?",
        keyPoints: ['advanced-methods', 'metric-issues']
    },
    { 
        id: 54, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['cases', 'metrics'], 
        bigTech: ['All'],
        text: "Мы хотим протестировать push-уведомления, которые должны возвращать пользователей в приложение. Какие метрики (кроме CTR пуша) вы бы отслеживали, чтобы понять, успешен ли тест?",
        keyPoints: ['business-metrics']
    },
    { 
        id: 55, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['statistics', 'pitfalls'], 
        bigTech: ['All'],
        text: "Ваш A/B тест на новых пользователях: контроль 50,000 юзеров, конверсия 5.2%; тест 1,000 юзеров, конверсия 8.1%. P-value = 0.001. Junior аналитик предлагает запускать. В чем проблема?",
        keyPoints: ['sample-size']
    },
    { 
        id: 60, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['cases', 'design'], 
        bigTech: ['Amazon', 'All'],
        text: "Нужно протестировать изменение в процессе оформления заказа (checkout). На что стоит обратить особое внимание при дизайне такого эксперимента?",
        keyPoints: ['business-metrics']
    },
    { 
        id: 63, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['design', 'pitfalls'], 
        bigTech: ['All'],
        text: "Как бы вы организовали A/B-тест для изменения, которое может иметь сильный 'эффект обучения' (learning effect) у пользователей?",
        keyPoints: ['experiment-duration', 'novelty-effects']
    },
    { 
        id: 69, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['statistics', 'advanced_methods'], 
        bigTech: ['All'],
        text: "Что такое Дельта-метод (Delta method) и когда он используется для ratio-метрик?",
        keyPoints: ['advanced-methods']
    },
    { 
        id: 74, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['cases', 'analysis'], 
        bigTech: ['All'],
        text: "При анализе результатов теста вы видите, что дисперсия метрики в тестовой группе сильно выросла по сравнению с контрольной. Что это может означать?",
        keyPoints: ['segmentation']
    },
    { 
        id: 79, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['cases', 'metrics'], 
        bigTech: ['Amazon', 'All'],
        text: "В маркетплейсе мы хотим изменить алгоритм ранжирования товаров в поиске. Как оценить эффект? Какие метрики будут ключевыми?",
        keyPoints: ['business-metrics', 'metric-types']
    },
    { 
        id: 85, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['metrics'], 
        bigTech: ['All'],
        text: "Что такое 'метрики-зомби' (zombie metrics) и 'метрики тщеславия' (vanity metrics)? Приведите примеры.",
        keyPoints: ['metric-issues', 'business-metrics']
    },
    { 
        id: 87, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['interpretation', 'analysis'], 
        bigTech: ['All'],
        text: "Результаты теста: p-value = 0.06, размер эффекта +3% на основной метрике (конверсия), CI [-0.5%, +6.5%]. Product manager настаивает на запуске, так как 'мы близко к 0.05 и эффект положительный'. Ваш ответ и аргументация? Какие дополнительные анализы проведете?",
        keyPoints: ['statistical-significance', 'experiment-types']
    },
    { 
        id: 94, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['design', 'advanced_methods'], 
        bigTech: ['All'],
        text: "Что такое Quasi-эксперименты? Когда они могут быть полезны, если провести настоящий A/B-тест невозможно?",
        keyPoints: ['experiment-types', 'causal-inference']
    },
    { 
        id: 99, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['cases', 'metrics', 'design'], 
        bigTech: ['Netflix', 'All'],
        text: "Вы работаете над видео-стриминговым сервисом. Предложите эксперимент для борьбы с оттоком (churn) пользователей.",
        keyPoints: ['practical-significance', 'metric-types']
    },
    { 
        id: 101, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['design', 'interpretation'], 
        bigTech: ['All'],
        text: "У вас два варианта: (A) запустить эксперимент на 2 недели с мощностью 80% для детекта 2% эффекта, или (B) запустить на 4 недели с мощностью 90% для детекта 1% эффекта. Текущая конверсия 10%. Как будете решать? Какую информацию запросите у PM?",
        keyPoints: ['practical-significance']
    },
    { 
        id: 103, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['advanced_methods', 'design'], 
        bigTech: ['Amazon', 'All'],
        text: "Для эксперимента в marketplace: продавцы видят новую фичу, но эффект измеряется через покупателей. Какие проблемы с каузальностью? Как дизайнить такой двусторонний эксперимент?",
        keyPoints: ['network-effects', 'randomization']
    },
    { 
        id: 104, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['analysis', 'statistics'], 
        bigTech: ['All'],
        text: "В вашем эксперименте 20% пользователей генерируют 80% метрики. Как это влияет на анализ? Какие подходы к работе с такой тяжелохвостым распределением?",
        keyPoints: ['distribution-issues']
    },
    { 
        id: 105, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['metrics', 'statistics'], 
        bigTech: ['All'],
        text: "Как выбирать sample size для ratio-метрики (например, revenue per user)? Почему стандартная формула для пропорций не подходит?",
        keyPoints: ['metric-issues', 'advanced-methods', 'sample-size']
    },
    { 
        id: 108, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['statistics', 'cases'], 
        bigTech: ['All'],
        text: "Вы одновременно тестируете изменения в 8 разных частях продукта (независимые эксперименты). Все с альфой 0.05. Получили результаты: 2 теста статзначимы (p=0.03 и p=0.04), остальные 6 - нет. Насколько вы уверены в этих двух 'победителях'?",
        keyPoints: ['type-i-error', 'multiple-testing', 'statistical-significance']
    },
    { 
        id: 109, 
        difficulty: 8, 
        seniority: 'senior',
        categories: ['infrastructure', 'design'], 
        bigTech: ['All'],
        text: "У вас есть только 5% трафика для экспериментов (остальное занято другими тестами). Как увеличить пропускную способность? Какие техники и методы можете применить?",
        keyPoints: ['advanced-methods', 'experiment-types']
    },

    // ========================================================================
    // STAFF/PRINCIPAL LEVEL (9-10): Экспертиза и лидерство
    // ========================================================================
    { 
        id: 21, 
        difficulty: 8, 
        seniority: 'staff',
        categories: ['advanced_methods'], 
        bigTech: ['All'],
        text: "Чем байесовский подход к A/B-тестированию отличается от частотного (фреквентистского)? Каковы его преимущества и недостатки?",
        keyPoints: ['practical-significance', 'advanced-methods']
    },
    { 
        id: 39, 
        difficulty: 9, 
        seniority: 'staff',
        categories: ['advanced_methods', 'design'], 
        bigTech: ['All'],
        text: "Что такое последовательное (sequential) тестирование? В чем его отличие от классического подхода с фиксированным размером выборки?",
        keyPoints: ['advanced-methods']
    },
    { 
        id: 40, 
        difficulty: 9, 
        seniority: 'staff',
        categories: ['advanced_methods', 'design'], 
        bigTech: ['All'],
        text: "Расскажите про алгоритмы 'многоруких бандитов'. В каких ситуациях их применение может быть более оправданным, чем классический A/B-тест?",
        keyPoints: ['metric-issues']
    },
    { 
        id: 49, 
        difficulty: 9, 
        seniority: 'staff',
        categories: ['design', 'advanced_methods'], 
        bigTech: ['All'],
        text: "Что такое факторный дизайн эксперимента (например, 2x2)? Когда его стоит использовать?",
        keyPoints: ['multiple-testing', 'network-effects']
    },
    { 
        id: 50, 
        difficulty: 9, 
        seniority: 'staff',
        categories: ['cases'], 
        bigTech: ['All'],
        text: "Вам нужно протестировать 5 вариантов заголовков на главной странице. Как бы вы это сделали? Обычный A/B/C/D/E тест или есть другие подходы?",
        keyPoints: ['multiple-testing']
    },
    { 
        id: 59, 
        difficulty: 9, 
        seniority: 'staff',
        categories: ['design', 'advanced_methods', 'cases'], 
        bigTech: ['All'],
        text: "Что такое Switchback-тесты (или тесты по времени)? В каких продуктах (например, Uber, Яндекс.Еда) они применяются и почему?",
        keyPoints: ['experiment-types', 'network-effects']
    },
    { 
        id: 65, 
        difficulty: 9, 
        seniority: 'staff',
        categories: ['statistics', 'interpretation'], 
        bigTech: ['All'],
        text: "Вы запускаете платформу для A/B тестов в компании. Каждая неделя ~50 экспериментов завершаются с альфой 0.05. Через 3 месяца 12 тестов показали 'успех' и команды запустили фичи. Спустя квартал видите: из 12 фич только 4 действительно улучшили метрики. Что произошло? Как системно решить?",
        keyPoints: ['multiple-testing']
    },
    { 
        id: 70, 
        difficulty: 9, 
        seniority: 'staff',
        categories: ['cases', 'design', 'interpretation'], 
        bigTech: ['All'],
        text: "Компания запускает ребрендинг (новый логотип, цветовая схема). Можно ли 'протестировать' ребрендинг с помощью A/B? Если да, то как? Если нет, то почему?",
        keyPoints: ['practical-significance', 'experiment-types']
    },
    { 
        id: 89, 
        difficulty: 9, 
        seniority: 'staff',
        categories: ['design', 'advanced_methods'], 
        bigTech: ['Google', 'All'],
        text: "Что такое 'interleaving' эксперименты и когда они применяются, например, в поисковых системах?",
        keyPoints: ['practical-significance']
    },
    { 
        id: 96, 
        difficulty: 9, 
        seniority: 'staff',
        categories: ['statistics', 'pitfalls'], 
        bigTech: ['All'],
        text: "В чем заключается проблема с 'p-hacking'? Как ее можно избежать?",
        keyPoints: ['practical-significance', 'metric-issues']
    },
    { 
        id: 10, 
        difficulty: 10, 
        seniority: 'staff',
        categories: ['infrastructure', 'cases'], 
        bigTech: ['All'],
        text: "Представьте, что вам нужно с нуля построить платформу для A/B-тестирования в компании. Опишите ключевые компоненты такой системы.",
        keyPoints: ['randomization', 'metric-types']
    },
    { 
        id: 80, 
        difficulty: 10, 
        seniority: 'staff',
        categories: ['leadership', 'cases'], 
        bigTech: ['All'],
        text: "Как построить культуру экспериментов в компании? Какие основные барьеры и как их преодолеть?",
        keyPoints: ['practical-significance']
    },
    { 
        id: 100, 
        difficulty: 10, 
        seniority: 'staff',
        categories: ['leadership', 'advanced_methods', 'cases'], 
        bigTech: ['All'],
        text: "Какие, на ваш взгляд, тренды и будущие направления развития есть в области A/B-тестирования и онлайн-экспериментов?",
        keyPoints: ['experiment-types', 'causal-inference']
    },
    { 
        id: 102, 
        difficulty: 10, 
        seniority: 'staff',
        categories: ['infrastructure', 'design'], 
        bigTech: ['All'],
        text: "Спроектируйте архитектуру experimentation platform для компании с 50M DAU, 100+ экспериментов одновременно. Какие компоненты? Как обеспечить: (1) правильную рандомизацию, (2) изоляцию экспериментов, (3) realtime мониторинг, (4) автоматические алерты?",
        keyPoints: ['randomization', 'experiment-types']
    },
    { 
        id: 106, 
        difficulty: 10, 
        seniority: 'staff',
        categories: ['leadership'], 
        bigTech: ['All'],
        text: "CEO хочет, чтобы 80% решений принималось на основе A/B тестов. Вы - руководитель аналитики. Ваш план действий на год? Какие барьеры и как их преодолеть?",
        keyPoints: ['practical-significance']
    },
    { 
        id: 110, 
        difficulty: 10, 
        seniority: 'staff',
        categories: ['advanced_methods', 'design'], 
        bigTech: ['All'],
        text: "Вы в компании-стартапе с 10K DAU. Классические A/B тесты идут месяцами. Какие альтернативные подходы к экспериментированию предложите? Рассмотрите: bandits, bayesian optimization, quasi-experiments.",
        keyPoints: ['practical-significance', 'experiment-types', 'sample-size']
    }
];

export const LEADERBOARD_DATA = [
    { name: 'Alex', score: 95 },
    { name: 'Elena', score: 87 },
    { name: 'Mike', score: 81 },
    { name: 'Jane', score: 75 },
    { name: 'Sam', score: 68 },
];