# ✅ Чеклист перед деплоем

## 📋 Что проверить

### 1. ⚙️ Конфигурация

- [ ] `src/config/config.ts` - Google Client ID указан
- [ ] `src/config/config.ts` - Cloudflare Worker URL указан
- [ ] `src/config/firebase.ts` - Firebase конфигурация заполнена
- [ ] `.firebaserc` - проект `course-ab-interview` указан

### 2. 🔥 Firebase Setup

- [ ] Firestore Database создана
- [ ] Firestore Rules загружены (`firestore.rules`)
- [ ] Google OAuth настроен в Firebase Console
- [ ] Authorized domains добавлены (localhost + production domain)

### 3. ☁️ Cloudflare Worker

- [ ] Worker создан и задеплоен
- [ ] Gemini API ключ добавлен как секрет
- [ ] URL worker'а обновлен в `src/config/config.ts`
- [ ] Worker протестирован (curl)

### 4. 🧪 Локальное тестирование

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Открыть http://localhost:3000 и проверить:
- [ ] Авторизация работает
- [ ] Выбор уровня работает
- [ ] Вопросы отображаются
- [ ] AI оценка работает
- [ ] Статистика сохраняется
- [ ] Лидерборд отображается
```

### 5. 📦 Production сборка

```bash
# Сборка
npm run build

# Проверка сборки
ls -lh dist/

# Должны быть файлы:
- [ ] dist/index.html
- [ ] dist/assets/index-*.js
- [ ] dist/favicon.svg
```

### 6. 🚀 Деплой

```bash
# Авторизация (первый раз)
firebase login

# Деплой
firebase deploy --only hosting

# После деплоя проверить:
- [ ] Приложение открывается по URL
- [ ] Авторизация работает
- [ ] Все функции работают
```

### 7. 🔒 Security

- [ ] Firebase Rules ограничивают доступ к данным пользователей
- [ ] API ключи НЕ светятся в клиентском коде
- [ ] CORS настроены правильно
- [ ] Google OAuth домены авторизованы

### 8. 📱 Responsive Design

Проверить на устройствах:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## 🎯 Команды

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Деплой хостинга
firebase deploy --only hosting

# Деплой Firestore rules
firebase deploy --only firestore:rules

# Полный деплой
firebase deploy
```

---

## 🔍 Troubleshooting

### Проблема: Авторизация не работает
- Проверьте Google Client ID в `src/config/config.ts`
- Проверьте Authorized domains в Firebase Console

### Проблема: AI оценка не работает
- Проверьте Cloudflare Worker URL
- Проверьте, что Worker задеплоен
- Проверьте секрет `GEMINI_API_KEY` в Worker

### Проблема: Данные не сохраняются
- Проверьте Firebase конфигурацию
- Проверьте Firestore Rules
- Откройте Console и проверьте ошибки

---

**Готово! 🚀**

