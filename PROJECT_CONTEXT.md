# 🎓 A/B TESTING INTERVIEW TRAINER - PROJECT CONTEXT

**Дата обновления**: 2025-10-25  
**Версия**: 2.1 (Clean Architecture - Computed Categories)

---

## 📋 КРАТКОЕ ОПИСАНИЕ ПРОЕКТА

Gamified платформа для подготовки к A/B Testing интервью в BigTech компаниях. Пользователи отвечают на развернутые вопросы, получают AI-feedback от Gemini и прокачивают навыки через систему XP, квестов и структурированного обучения.

**Live URL**: https://course-ab-interview.web.app  
**Tech Stack**: React + TypeScript + Vite + Firebase (Firestore + Hosting)

---

## 🏗️ АРХИТЕКТУРА ПРОЕКТА

### **Frontend**:
- **React 18** с TypeScript
- **Vite** для сборки
- **Inline CSS** (styles.ts + inline styles)
- **No UI libraries** - все компоненты с нуля

### **Backend**:
- **Firebase Firestore** - хранение gameState пользователей
- **Google AI Gemini 1.5 Flash** - оценка ответов через proxy
- **Railway Proxy** - обход CORS для Gemini API

### **Deployment**:
- **Firebase Hosting** - production
- **GitHub** - version control

---

## 📁 СТРУКТУРА ФАЙЛОВ

### **Ключевые компоненты**:

```
src/
├── components/
│   ├── GameScreen.tsx              # Основной экран ответа на вопросы
│   ├── StatisticsScreenGamified.tsx # Статистика с квестами
│   ├── LearningPathScreen.tsx      # Список модулей Learning Path
│   ├── ModuleDetailScreen.tsx      # Детали модуля + теория
│   ├── FeedbackOverlay.tsx         # AI feedback после ответа
│   ├── UserSetup.tsx               # Google login
│   ├── ActivitySeriesWidget.tsx    # Виджет серии активности
│   ├── InventoryPanel.tsx          # Инвентарь (предметы)
│   ├── QuestCard.tsx               # Карточка квеста
│   └── Leaderboard.tsx             # Таблица лидеров
│
├── lib/
│   ├── api.ts                      # Firebase API
│   ├── xpCalculator.ts             # Расчет XP
│   ├── questGenerator.ts           # Генерация квестов
│   ├── activitySeriesManager.ts    # Управление сериями активности
│   └── learningPathManager.ts      # Управление прогрессом модулей
│
├── data/
│   ├── constants.ts                # 156 вопросов + конфиги
│   └── learningPathData.ts         # 15 модулей с теорией
│
├── config/
│   ├── firebase.ts                 # Firebase config
│   └── config.ts                   # Gemini proxy URL
│
└── types.ts                        # Все TypeScript типы
```

---

## 🎮 ОСНОВНЫЕ ФУНКЦИИ

### 1️⃣ **FREE PRACTICE MODE** (Основной режим)
- Случайные вопросы по выбранному уровню (Junior/Mid/Senior/Staff)
- AI оценка через Gemini (0-10 баллов + detailed feedback)
- XP система с прогрессией
- Ежедневные квесты
- Серии активности (streak)
- Инвентарь (пропуск вопроса, защита серии)

### 2️⃣ **LEARNING PATH MODE** (Структурированное обучение)
- 15 модулей организованных в 3 уровня
- Теория перед каждым модулем (200-300 слов)
- Прогресс синхронизируется с Free Practice
- Критерии завершения модуля (количество вопросов + средний балл)
- Unlock system (следующий модуль доступен после завершения предыдущего)

### 3️⃣ **GAMIFICATION**
- **XP System**: вопросы дают XP = сложность × балл × 10
- **Daily Quests**: ежедневные задания (адаптивные по уровню)
- **Activity Series**: бонусы за ежедневную активность
- **Inventory**: предметы за достижения
- **Social Comparison**: топ X% users
- **Leaderboard**: таблица лидеров

---

## 📊 DATA STRUCTURES

### **GameState** (основное состояние пользователя):
```typescript
{
  rating: number;                    // Общий XP
  selectedDifficulty: 'junior'|'mid'|'senior'|'staff';
  askedQuestionIds: number[];        // История вопросов
  questionAttempts: QuestionAttempt[]; // Все попытки
  activitySeries: ActivitySeries;    // Серия активности
  inventory: Inventory;              // Инвентарь
  completedDailyQuests: string[];    // Завершенные ежедневки
  learningProgress: UserLearningProgress; // Прогресс по модулям
  categoryScores: Record<Category, {totalScore, count}>;
  keyPointScores: Record<KeyPoint, {totalScore, count}>;
  levelProgress: Record<Seniority, LevelProgress>;
  ratingHistory: number[];
}
```

### **Question** (156 вопросов):
```typescript
{
  id: number;
  difficulty: 1-10;
  seniority: 'junior'|'mid'|'senior'|'staff';
  text: string;                     // Текст вопроса
  bigTech: Company[];
  keyPoints?: KeyPoint[];
  modules: string[];                // PRIMARY: ['1.1', '2.3'] - связь с модулями
  // categories вычисляются через getCategoriesFromModules()
}
```

### **LearningModule** (15 модулей):
```typescript
{
  id: '1.1';                        // Level.Module
  level: 1|2|3;
  title: string;
  description: string;
  theoryContent: string;            // 200-300 слов
  questionIds: number[];            // Вопросы модуля
  checkpointCriteria: {
    minAvgScore: number;            // Мин. средний балл
    minQuestionsCompleted: number;  // Мин. вопросов
  };
  unlockRequirements: string[];     // ['1.1'] - зависимости
}
```

---

## 🔄 КЛЮЧЕВЫЕ FLOW

### **Ответ на вопрос (Free Practice)**:
1. `GameScreen` выбирает случайный вопрос из доступных
2. Пользователь пишет ответ (min 100 символов)
3. `evaluateAnswer` отправляет на Gemini API через proxy
4. Получаем `Feedback` (overallScore 0-10 + categoryBreakdown)
5. `calculateXP` вычисляет XP = difficulty × score × 10
6. `syncQuestionAnswerToModules` обновляет прогресс модулей
7. `checkAndUpdateSeries` обновляет серию активности
8. `saveGameState` сохраняет в Firebase

### **Ответ на вопрос (Learning Path)**:
1. `ModuleDetailScreen` → кнопка "Начать изучение"
2. `App.tsx` переключает на `view='moduleGame'`
3. `GameScreen` получает `moduleFilter='1.1'`
4. Фильтрует вопросы: `q.modules.includes('1.1')`
5. Далее идентично Free Practice
6. При выходе → возврат к `ModuleDetailScreen`

### **Синхронизация прогресса**:
```typescript
// После каждого ответа:
syncQuestionAnswerToModules(gameState, questionId, score)
  → находит все модули с этим вопросом
  → обновляет answeredQuestionIds
  → пересчитывает avgScore
  → проверяет criteria (auto-complete module)
```

---

## 🎯 NAVIGATION FLOW

```
Login (UserSetup)
  ↓
Summary (ProgressSummary) - выбор уровня
  ↓
┌─────────────────────────────────────────┐
│ Free Practice (GameScreen)              │
│   - Случайные вопросы                   │
│   - XP, квесты, серии                   │
└─────────────────────────────────────────┘
  ↓ (кнопка "🎓 Модули")
┌─────────────────────────────────────────┐
│ Learning Path (LearningPathScreen)      │
│   - 15 модулей                          │
│   - Прогресс, статусы                   │
└─────────────────────────────────────────┘
  ↓ (клик на модуль)
┌─────────────────────────────────────────┐
│ Module Detail (ModuleDetailScreen)      │
│   - Теория, прогресс                    │
│   - Кнопка "Начать"                     │
└─────────────────────────────────────────┘
  ↓ (кнопка "Начать")
┌─────────────────────────────────────────┐
│ Module Game (GameScreen + moduleFilter) │
│   - Только вопросы этого модуля         │
│   - Прогресс обновляется                │
└─────────────────────────────────────────┘
  ↓ (кнопка "← Выйти из модуля")
Back to Module Detail
```

---

## 🔥 КЛЮЧЕВЫЕ ОСОБЕННОСТИ КОДА

### **1. Переиспользование компонентов**:
- `GameScreen` используется и для Free Practice, и для Learning Path
- Фильтрация через props `moduleFilter?: string`
- Одна кодовая база для всей логики вопросов

### **2. Automatic sync**:
- После каждого ответа автоматически обновляются:
  - Rating (XP)
  - Category scores
  - Level progress
  - Module progress (через `syncQuestionAnswerToModules`)
  - Activity series
  - Daily quest progress

### **3. Migration system**:
```typescript
// В api.ts - автоматическая миграция при загрузке:
if (!data.learningProgress) {
  data.learningProgress = initializeLearningProgress();
}
```

### **4. TypeScript строгость**:
- Все типы в `types.ts`
- Strict null checks
- No `any` (кроме Gemini API response)

### **5. Mobile-first**:
```typescript
const isMobile = window.innerWidth <= 768;
// Адаптивные стили, fixed bottom buttons, etc.
```

---

## 📦 DEPENDENCIES

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "firebase": "^10.x",
  "vite": "^6.x",
  "typescript": "^5.x"
}
```

**NO** дополнительных UI библиотек (Material-UI, Ant Design, etc.)  
**NO** state management (Redux, Zustand) - только `useState` + `useCallback`

---

## 🚀 DEPLOYMENT

### **Build & Deploy**:
```bash
npm run build          # Vite build → dist/
firebase deploy --only hosting
```

### **Localhost (port 3000)**:
```bash
# Убить процессы на 3000:
lsof -ti:3000 | xargs kill -9

# Запустить dev server:
npm run dev -- --port 3000
```

### **Environment Variables**:
```typescript
// src/config/config.ts
export const GEMINI_PROXY_URL = 'https://railway-proxy-url/api/gemini';

// src/config/firebase.ts
export const firebaseConfig = { ... };
```

---

## 🐛 COMMON ISSUES & FIXES

### **1. Прогресс модулей не обновляется**:
- **Причина**: Забыли вызвать `syncQuestionAnswerToModules`
- **Fix**: В `GameScreen.tsx` после оценки вызываем sync

### **2. Слова ломаются на мобильных**:
- **Fix**: `whiteSpace: 'nowrap'` + `minmax(min(200px, 100%), 1fr)`

### **3. Автоссылки (Google Maps)**:
- **Fix**: `pointerEvents: 'none'` + `userSelect: 'none'` + CSS class

### **4. Gemini API 503**:
- **Причина**: Overload или network issue
- **Fix**: Retry через 1-2 минуты, показать понятное сообщение

---

## 📊 STATS & METRICS

- **156 вопросов** (110 старых + 46 новых Learning Path)
- **15 модулей** (3 уровня × 5 модулей)
- **4 уровня сложности** (Junior, Mid, Senior, Staff)
- **~2000 строк** нового кода для Learning Path
- **100% TypeScript coverage**
- **0 linter errors**

---

## 🎓 LEARNING PATH STRUCTURE

### **Level 1: Foundation (Новичок)**
1.1. Введение в A/B тестирование (6 вопросов)
1.2. Статистические основы (4 вопроса)
1.3. Формулирование гипотез (5 вопросов)
1.4. Выбор метрик (5 вопросов)
1.5. Рандомизация и A/A тесты (5 вопросов)

### **Level 2: Practitioner (Практик)**
2.1. Дизайн эксперимента (4 вопроса)
2.2. Статистические тесты (3 вопроса)
2.3. Подводные камни (3 вопроса)
2.4. Анализ результатов (4 вопроса)
2.5. Продуктовые кейсы (3 вопроса)

### **Level 3: Expert (Эксперт)**
3.1. Продвинутые методы (3 вопроса)
3.2. Интерпретация (3 вопроса)
3.3. Сложные кейсы (4 вопроса)
3.4. Инфраструктура (5 вопросов)
3.5. Лидерство (4 вопроса)

---

## 🔐 FIREBASE SECURITY RULES

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.token.email == userId;
    }
  }
}
```

**Только авторизованный пользователь может читать/писать свой документ**

---

## 🧪 TESTING CHECKLIST

При каждом деплое проверяй:
- [ ] Login работает (Google Auth)
- [ ] Вопросы загружаются
- [ ] AI feedback приходит
- [ ] XP начисляется корректно
- [ ] Модули отображаются
- [ ] Прогресс модулей обновляется после ответа
- [ ] Кнопка "Начать изучение" работает
- [ ] Фильтрация вопросов по модулю работает
- [ ] Выход из модуля работает
- [ ] Мобильная версия адаптивна
- [ ] Firebase сохраняет gameState

---

## 🎨 UI/UX PRINCIPLES

1. **Gradient headers** - фиолетовый градиент (#667eea → #764ba2)
2. **Fixed bottom buttons** на мобильных
3. **Progress bars** для визуализации прогресса
4. **Icons + Text** для понятности (🎓, 📊, ⭐, etc.)
5. **Hover effects** на desktop
6. **Touch-friendly** на mobile (min 44px tap targets)
7. **No animations** (пока) - для скорости

---

## 📝 TODO / BACKLOG

### **High Priority**:
- [ ] Checkpoints (финальные тесты уровней)
- [ ] Badges & Certificates
- [ ] PDF export сертификатов

### **Medium Priority**:
- [ ] Markdown parser для теории (react-markdown)
- [ ] Animations (confetti при завершении модуля)
- [ ] Notification toasts (при auto-complete модуля)

### **Low Priority**:
- [ ] Social features (Weekly Leagues, Duels)
- [ ] Code splitting (уменьшить bundle size)
- [ ] PWA (offline support)

---

## 🔗 USEFUL LINKS

- **Production**: https://course-ab-interview.web.app
- **Firebase Console**: https://console.firebase.google.com/project/course-ab-interview
- **GitHub**: (ваш репозиторий)
- **Railway Proxy**: (ваш proxy URL)

---

## 💡 BEST PRACTICES

### **При добавлении новых вопросов**:
```typescript
{
  id: 157,  // Следующий ID
  difficulty: 5,
  seniority: 'mid',
  categories: ['analysis'],  // DEPRECATED
  modules: ['2.4'],          // PRIMARY
  text: "...",
  bigTech: ['All'],
  keyPoints: ['key-point']
}
```

### **При создании новых компонентов**:
- Используй TypeScript strict mode
- Props через `interface ComponentProps`
- Mobile-first: `const isMobile = window.innerWidth <= 768;`
- Inline styles или `styles` object
- No external CSS files

### **При изменении GameState структуры**:
- Обнови `types.ts`
- Добавь migration в `api.ts`
- Обнови `createInitialGameState()`
- Тестируй на existing users

---

## 🎯 SUMMARY

**Это gamified платформа для подготовки к A/B Testing интервью.**

**Два режима**:
1. **Free Practice** - случайные вопросы + геймификация
2. **Learning Path** - структурированное обучение по модулям

**Прогресс синхронизируется** между режимами автоматически.

**Переиспользуется `GameScreen`** для обоих режимов через props.

**Все данные в Firebase**, AI оценка через Gemini.

**Полностью TypeScript**, zero dependencies для UI.

---

**При создании нового чата - прочитай этот файл целиком для быстрой адаптации! 🚀**

