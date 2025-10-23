# 📁 Структура проекта

```
Course_AB_interview_AI/
│
├── 📄 index.html              # Главная HTML страница
├── 📄 package.json            # Зависимости проекта
├── 📄 tsconfig.json           # TypeScript конфигурация
├── 📄 vite.config.ts          # Vite конфигурация
├── 📄 firebase.json           # Firebase конфигурация
├── 📄 .firebaserc             # Firebase проект
├── 📄 firestore.rules         # Правила Firestore
├── 📄 firestore.indexes.json  # Индексы Firestore
├── 📄 .gitignore              # Git игнор
├── 📄 README.md               # Главная документация
│
├── 📂 src/                    # ⭐ Исходный код
│   ├── 📄 index.tsx           # Точка входа
│   ├── 📄 App.tsx             # Главный компонент
│   ├── 📄 types.ts            # TypeScript типы
│   ├── 📄 styles.ts           # Глобальные стили
│   │
│   ├── 📂 components/         # React компоненты
│   │   ├── GameScreen.tsx         # Экран игры (вопросы/ответы)
│   │   ├── UserSetup.tsx          # Авторизация и выбор уровня
│   │   ├── StatisticsScreen.tsx   # Экран статистики
│   │   ├── Leaderboard.tsx        # Таблица лидеров
│   │   ├── FeedbackOverlay.tsx    # Оверлей с обратной связью
│   │   ├── RatingProgressChart.tsx # График прогресса рейтинга
│   │   ├── ProgressBar.tsx        # Прогресс-бар
│   │   └── ProgressSummary.tsx    # Сводка по прогрессу
│   │
│   ├── 📂 config/             # Конфигурация
│   │   ├── config.ts          # API ключи и URLs
│   │   └── firebase.ts        # Firebase инициализация
│   │
│   ├── 📂 lib/                # Утилиты и API
│   │   └── api.ts             # API для работы с данными
│   │
│   └── 📂 data/               # Данные приложения
│       └── constants.ts       # База вопросов, категории, лидерборд
│
├── 📂 public/                 # Статические файлы
│   └── favicon.svg            # Иконка сайта
│
├── 📂 docs/                   # 📚 Документация
│   ├── DEPLOY.md              # Инструкция по деплою
│   ├── FIREBASE_SETUP.md      # Настройка Firebase
│   ├── CLOUDFLARE_WORKER_SETUP.md # Настройка Cloudflare Worker
│   └── cloudflare-worker.js   # Код worker'а для прокси
│
├── 📂 dist/                   # Production сборка (генерируется)
└── 📂 node_modules/           # Зависимости (генерируется)
```

---

## 🎯 Ключевые файлы

### Конфигурация
- `src/config/config.ts` - Google Client ID и URL прокси для Gemini API
- `src/config/firebase.ts` - Firebase настройки

### Данные
- `src/data/constants.ts` - **База вопросов (110 вопросов)**, категории, ключевые понятия, лидерборд

### Компоненты
- `src/components/GameScreen.tsx` - Основной экран с вопросами
- `src/components/UserSetup.tsx` - Авторизация через Google OAuth
- `src/components/StatisticsScreen.tsx` - Персональная статистика

### API
- `src/lib/api.ts` - Работа с localStorage и Firebase Firestore

---

## 🚀 Команды

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Деплой
firebase deploy --only hosting
```

---

## 📦 Что изменилось

### ✅ До реструктуризации
Все файлы в корне - хаос и беспорядок 😵

### ✨ После реструктуризации
- `src/components/` - все React компоненты
- `src/config/` - конфигурация (API, Firebase)
- `src/lib/` - утилиты (api.ts)
- `src/data/` - база вопросов и константы
- `docs/` - вся документация
- `public/` - статические файлы

---

**Чисто, структурировано, профессионально!** 🎉

