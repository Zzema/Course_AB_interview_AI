# 🚀 Быстрый старт

## 💻 Локальная разработка

```bash
npm install
npm run dev
```

Откройте http://localhost:3000

---

## 🌐 Деплой на Firebase Hosting

```bash
# 1. Авторизация (первый раз)
firebase login

# 2. Сборка
npm run build

# 3. Деплой
firebase deploy --only hosting
```

**Готово!** Приложение будет доступно по адресу:
```
https://course-ab-interview.web.app
```

---

## 📚 Документация

- [README.md](README.md) - Главная документация
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Структура проекта
- [docs/DEPLOY.md](docs/DEPLOY.md) - Подробная инструкция по деплою
- [docs/CHECKLIST.md](docs/CHECKLIST.md) - Чеклист перед деплоем
- [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) - Настройка Firebase
- [docs/CLOUDFLARE_WORKER_SETUP.md](docs/CLOUDFLARE_WORKER_SETUP.md) - Настройка прокси

---

## 🔧 Полезные команды

```bash
# Разработка
npm run dev              # Запуск dev-сервера

# Сборка
npm run build            # Production сборка

# Firebase
firebase login           # Авторизация
firebase deploy          # Полный деплой
firebase deploy --only hosting         # Только хостинг
firebase deploy --only firestore:rules # Только rules
firebase serve           # Локальный preview
```

---

## 📁 Ключевые файлы

```
src/
├── config/
│   ├── config.ts        # 🔑 Google Client ID, Cloudflare Worker URL
│   └── firebase.ts      # 🔥 Firebase конфигурация
├── data/
│   └── constants.ts     # 📊 База вопросов (110 вопросов)
└── components/
    └── GameScreen.tsx   # 🎮 Основной экран
```

---

## ⚡ Быстрые фиксы

### Авторизация не работает
```typescript
// src/config/config.ts
export const GOOGLE_CLIENT_ID = "ваш_client_id_здесь";
```

### AI оценка не работает
```typescript
// src/config/config.ts
export const GEMINI_PROXY_URL = "url_вашего_worker";
```

### Firestore не сохраняет данные
```typescript
// src/config/firebase.ts
const firebaseConfig = {
  projectId: "course-ab-interview", // Проверьте проект ID
  // ...
};
```

---

**Всё готово к работе!** 🎉

