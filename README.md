# 🎯 A/B Hero: Интерактивный тренажер для собеседований

🔥 **Powered by Firebase**

Интерактивное приложение для подготовки к собеседованиям в BigTech (Meta, Google, Amazon, Microsoft) по темам A/B тестирования, статистики и анализа данных.

---

## ✨ Основные возможности

- 🎓 **110+ вопросов** разных уровней сложности (Junior → Staff)
- 🤖 **AI-оценка ответов** с детальной обратной связью (Gemini 2.0)
- 📊 **Персональная статистика** по 11 категориям и 20+ ключевым темам
- 🏆 **Система рейтинга** с учетом сложности вопросов и качества ответов
- 🔥 **Firebase Firestore** для сохранения прогресса между устройствами
- 🌐 **Cloudflare Worker** для обхода региональных ограничений API
- 📱 **Responsive design** для комфортной работы на любых устройствах
- 🔒 **Google OAuth** для авторизации

---

## 🚀 Быстрый старт

### Локально

```bash
# 1. Установите зависимости
npm install

# 2. Запустите dev-сервер
npm run dev

# 3. Откройте http://localhost:3000
```

### Production деплой

```bash
# 1. Авторизация в Firebase (первый раз)
firebase login

# 2. Сборка
npm run build

# 3. Деплой
firebase deploy --only hosting
```

📚 **Документация:**
- [docs/DEPLOY.md](docs/DEPLOY.md) - Инструкция по деплою
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Структура проекта
- [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) - Настройка Firebase
- [docs/RAILWAY_SETUP.md](docs/RAILWAY_SETUP.md) - Настройка Railway прокси

---

## 🛠 Технологии

- **Frontend**: React 19, TypeScript, Vite
- **AI**: Gemini 2.0-flash-exp (через Railway Proxy)
- **Backend**: Firebase Firestore
- **Auth**: Google OAuth 2.0
- **Hosting**: Firebase Hosting
- **Proxy**: Railway.app

---

## 📊 Категории вопросов

- 📐 **Foundations** - Основы A/B тестирования
- 📈 **Statistics** - Статистические методы
- 🎨 **Design** - Дизайн экспериментов
- 📏 **Metrics** - Метрики и KPI
- 🔍 **Analysis** - Анализ данных
- 💡 **Interpretation** - Интерпретация результатов
- ⚠️ **Pitfalls** - Типичные ошибки
- 📋 **Cases** - Практические кейсы
- 🚀 **Advanced Methods** - Продвинутые методы
- 🏗 **Infrastructure** - Инфраструктура
- 👔 **Leadership** - Лидерские навыки

---

## 🔧 Настройка

### 1. Google OAuth

1. Создайте проект в [Google Cloud Console](https://console.cloud.google.com/)
2. Настройте OAuth 2.0 credentials
3. Добавьте Client ID в `config.ts`

### 2. Firebase

1. Создайте проект в [Firebase Console](https://console.firebase.google.com/)
2. Настройте Firestore Database
3. Добавьте конфигурацию в `firebase.ts`

См. [FIREBASE_SETUP.md](FIREBASE_SETUP.md) для детальной инструкции.

### 3. Cloudflare Worker

1. Создайте Worker в [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Скопируйте код из `cloudflare-worker.js`
3. Добавьте Gemini API ключ в Environment Variables
4. Обновите URL в `config.ts`

См. [CLOUDFLARE_WORKER_SETUP.md](CLOUDFLARE_WORKER_SETUP.md) для детальной инструкции.

---

## 📁 Структура проекта

```
Course_AB_interview_AI/
├── components/          # React компоненты
│   ├── GameScreen.tsx   # Основной экран с вопросами
│   ├── StatisticsScreen.tsx # Статистика пользователя
│   ├── Leaderboard.tsx  # Таблица лидеров
│   └── ...
├── constants.ts         # База вопросов и конфигурация
├── types.ts            # TypeScript типы
├── api.ts              # API для работы с данными
├── firebase.ts         # Firebase конфигурация
├── config.ts           # Конфигурация приложения
├── cloudflare-worker.js # Прокси для Gemini API
└── public/
    └── favicon.svg     # Фавикон приложения
```

---

## 🎮 Использование

1. **Авторизуйтесь** через Google
2. **Выберите уровень** сложности (Junior/Mid/Senior/Staff)
3. **Отвечайте на вопросы** (минимум 100 символов)
4. **Получайте оценку** от AI с детальной обратной связью
5. **Отслеживайте прогресс** в разделе статистики
6. **Соревнуйтесь** с другими пользователями в таблице лидеров

---

## 🤝 Контрибьюция

Pull requests приветствуются! Для значительных изменений сначала откройте issue.

---

## 📝 Лицензия

MIT

---

## 👨‍💻 Автор

Создано для помощи в подготовке к собеседованиям по A/B тестированию в BigTech компании.

---

**⭐ Если проект был полезен, поставьте звезду на GitHub!**
