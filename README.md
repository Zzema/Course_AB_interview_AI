# 🎯 A/B Hero: AI-powered тренажер для собеседований

<div align="center">

**Gamified платформа для подготовки к A/B Testing интервью в BigTech компаниях**

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://course-ab-interview.web.app)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

[🚀 Запустить](https://course-ab-interview.web.app) • [📖 Документация](PROJECT_CONTEXT.md) • [🐛 Баг-репорты](https://github.com/Zzema/Course_AB_interview_AI/issues)

</div>

---

## ✨ Основные возможности

### 🎓 Два режима обучения

1. **Free Practice Mode** - Случайные вопросы с геймификацией
   - 156 вопросов разных уровней (Junior → Staff)
   - AI-оценка через Gemini 1.5 Flash (0-10 баллов + детальный feedback)
   - XP система: `XP = сложность × балл × 10`
   - Ежедневные квесты (адаптивные по уровню)
   - Серии активности (streak system)
   - Инвентарь с предметами

2. **Learning Path Mode** - Структурированное обучение
   - 15 модулей в 3 уровнях сложности
   - Теория перед каждым модулем (200-300 слов)
   - Критерии завершения модуля
   - Unlock system (последовательное прохождение)
   - Синхронизация прогресса с Free Practice

### 🎮 Геймификация

- **XP System** - прокачка через ответы на вопросы
- **Daily Quests** - ежедневные задания с наградами
- **Activity Series** - бонусы за ежедневную активность
- **Inventory** - предметы (пропуск вопроса, защита серии)
- **Leaderboard** - таблица лидеров с процентилями
- **Social Comparison** - "Ты в топ X% users"

### 📊 Детальная аналитика

- Прогресс по 11 категориям A/B Testing
- Статистика по 20+ ключевым темам
- История ответов с оценками
- Графики прогресса XP
- Распределение по уровням сложности

---

## 🚀 Quick Start

### Локальный запуск

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/Zzema/Course_AB_interview_AI.git
cd Course_AB_interview_AI

# 2. Установите зависимости
npm install

# 3. Запустите dev-сервер
npm run dev

# 4. Откройте http://localhost:5173
```

### Production деплой

```bash
# 1. Сборка
npm run build

# 2. Деплой на Firebase Hosting
firebase deploy --only hosting
```

---

## 🛠 Технологии

### Frontend
- **React 18** с TypeScript
- **Vite** для сборки и dev-сервера
- **Inline CSS** (styles.ts) - zero UI dependencies
- **No external UI libraries** - все компоненты с нуля

### Backend & Services
- **Firebase Firestore** - хранение gameState пользователей
- **Google AI Gemini 1.5 Flash** - AI оценка ответов
- **Railway Proxy** - обход CORS для Gemini API
- **Google Identity Services** - OAuth 2.0 авторизация

### Deployment
- **Firebase Hosting** - production hosting
- **GitHub** - version control & CI/CD ready

---

## 📦 Структура данных

### GameState (состояние пользователя)

```typescript
{
  rating: number;                    // Общий XP
  selectedDifficulty: 'junior'|'mid'|'senior'|'staff';
  askedQuestionIds: number[];        // История вопросов
  questionAttempts: QuestionAttempt[]; // Все попытки с оценками
  activitySeries: ActivitySeries;    // Серия активности
  inventory: Inventory;              // Инвентарь
  completedDailyQuests: string[];    // Завершенные квесты
  learningProgress: UserLearningProgress; // Прогресс по модулям
  categoryScores: Record<Category, {totalScore, count}>;
  keyPointScores: Record<KeyPoint, {totalScore, count}>;
  levelProgress: Record<Seniority, LevelProgress>;
  ratingHistory: number[];
}
```

### Question (156 вопросов)

```typescript
{
  id: number;
  difficulty: 1-10;
  seniority: 'junior'|'mid'|'senior'|'staff';
  text: string;
  bigTech: Company[];
  keyPoints?: KeyPoint[];
  modules: string[];                // PRIMARY: ['1.1', '2.3']
}
```

---

## 🎓 Learning Path Structure

### Level 1: Foundation (Новичок)
- 1.1. Введение в A/B тестирование (6 вопросов)
- 1.2. Статистические основы (4 вопроса)
- 1.3. Формулирование гипотез (5 вопросов)
- 1.4. Выбор метрик (5 вопросов)
- 1.5. Рандомизация и A/A тесты (5 вопросов)

### Level 2: Practitioner (Практик)
- 2.1. Дизайн эксперимента (4 вопроса)
- 2.2. Статистические тесты (3 вопроса)
- 2.3. Подводные камни (3 вопроса)
- 2.4. Анализ результатов (4 вопроса)
- 2.5. Продуктовые кейсы (3 вопроса)

### Level 3: Expert (Эксперт)
- 3.1. Продвинутые методы (3 вопроса)
- 3.2. Интерпретация (3 вопроса)
- 3.3. Сложные кейсы (4 вопроса)
- 3.4. Инфраструктура (5 вопросов)
- 3.5. Лидерство (4 вопроса)

---

## 🔧 Настройка

### 1. Google OAuth

1. Создайте проект в [Google Cloud Console](https://console.cloud.google.com/)
2. Настройте OAuth 2.0 Client ID
3. Добавьте authorized JavaScript origins:
   ```
   http://localhost:5173
   https://course-ab-interview.web.app
   ```
4. Добавьте Client ID в `src/config/config.ts`

### 2. Firebase

1. Создайте проект в [Firebase Console](https://console.firebase.google.com/)
2. Настройте Firestore Database
3. Добавьте Security Rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && 
           request.auth.token.email == userId;
       }
     }
   }
   ```
4. Добавьте конфигурацию в `src/config/firebase.ts`

### 3. Gemini API Proxy (Railway)

1. Разверните proxy на Railway из `railway-proxy/`
2. Добавьте Gemini API ключ в Environment Variables
3. Обновите `GEMINI_PROXY_URL` в `src/config/config.ts`

---

## 📊 Статистика проекта

- **156 вопросов** (110 базовых + 46 Learning Path)
- **15 модулей** в 3 уровнях сложности
- **4 уровня** (Junior, Mid, Senior, Staff)
- **11 категорий** A/B Testing
- **20+ ключевых тем** (key points)
- **100% TypeScript** coverage
- **0 external UI dependencies**

---

## 🎮 Как использовать

1. **Войдите** через Google аккаунт
2. **Выберите режим**:
   - Free Practice - для случайных вопросов
   - Learning Path - для структурированного обучения
3. **Отвечайте на вопросы** (минимум 100 символов)
4. **Получайте AI feedback** с оценкой 0-10 и детальным разбором
5. **Зарабатывайте XP** и прокачивайтесь
6. **Выполняйте квесты** для дополнительных наград
7. **Отслеживайте прогресс** в статистике

---

## 🏗 Архитектура

```
src/
├── components/          # 14 React компонентов
│   ├── GameScreen.tsx           # Основной экран вопросов
│   ├── StatisticsScreenGamified.tsx  # Статистика
│   ├── LearningPathScreen.tsx   # Список модулей
│   ├── ModuleDetailScreen.tsx   # Детали модуля
│   └── ...
├── lib/                # 7 утилитных библиотек
│   ├── api.ts                   # Firebase API
│   ├── xpCalculator.ts          # Расчет XP
│   ├── questGenerator.ts        # Генерация квестов
│   ├── activitySeriesManager.ts # Серии активности
│   ├── learningPathManager.ts   # Прогресс модулей
│   ├── referralSystem.ts        # Реферальная система (TODO: UI)
│   └── categoryHelper.ts        # Работа с категориями
├── data/               # Данные
│   ├── constants.ts             # 156 вопросов + конфиги
│   ├── learningPathData.ts      # 15 модулей с теорией
│   └── weeklyChallenges.ts      # 8 недель челленджей (TODO: UI)
├── config/             # Конфигурация
│   ├── firebase.ts              # Firebase config
│   └── config.ts                # API URLs, Client IDs
├── types.ts            # TypeScript типы
└── styles.ts           # Inline CSS styles
```

---

## 🔐 Security & Privacy

- ✅ Google OAuth 2.0 для авторизации
- ✅ Firebase Security Rules (только свой gameState)
- ✅ No sensitive data storage
- ✅ HTTPS only (Firebase Hosting)
- ✅ No cookies, only localStorage

---

## 📝 Roadmap

### High Priority
- [ ] Создать UI для Referral System
- [ ] Создать UI для Weekly Challenges
- [ ] Badges & Certificates
- [ ] PDF export сертификатов

### Medium Priority
- [ ] Markdown parser для теории (react-markdown)
- [ ] Animations (confetti при завершении модуля)
- [ ] Notification toasts
- [ ] Checkpoints (финальные тесты уровней)

### Low Priority
- [ ] Social features (Weekly Leagues, Duels)
- [ ] Code splitting для уменьшения bundle size
- [ ] PWA (offline support)
- [ ] Dark mode

---

## 🐛 Known Issues

### Desktop
- ✅ Авторизация работает стабильно
- ✅ Все функции работают

### Mobile
- ⚠️ Google OAuth popup может блокироваться (особенно Safari iOS)
- ⚠️ Требуется улучшение мобильной авторизации
- ✅ UI адаптивен и работает корректно

---

## 🤝 Contributing

Pull requests приветствуются! Для значительных изменений:

1. Форкните репозиторий
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Коммитьте изменения (`git commit -m 'Add some AmazingFeature'`)
4. Пушьте в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

---

## 📄 License

MIT License - см. [LICENSE](LICENSE) для деталей

---

## 📧 Contact

Создано для помощи в подготовке к A/B Testing собеседованиям в BigTech.

**🔗 Links:**
- 🌐 [Live Demo](https://course-ab-interview.web.app)
- 📖 [Full Documentation](PROJECT_CONTEXT.md)
- 🐛 [Issue Tracker](https://github.com/Zzema/Course_AB_interview_AI/issues)

---

<div align="center">

**⭐ Если проект был полезен - поставьте звезду на GitHub!**

Made with ❤️ for A/B Testing enthusiasts

</div>
