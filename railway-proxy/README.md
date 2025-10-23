# 🚂 Gemini API Proxy для Railway.app

Прокси-сервер для обхода региональных ограничений Gemini API.

---

## 🚀 Деплой на Railway.app

### Шаг 1: Создайте аккаунт

1. Перейдите на https://railway.app/
2. Нажмите **Start a New Project**
3. Войдите через GitHub

---

### Шаг 2: Создайте новый проект

1. Нажмите **+ New Project**
2. Выберите **Deploy from GitHub repo**
3. Выберите репозиторий с этой папкой `railway-proxy`
4. Или выберите **Empty Project** и загрузите файлы вручную

---

### Шаг 3: Настройте переменные окружения

В Railway Dashboard:

1. Перейдите в **Variables**
2. Добавьте переменную:
   ```
   GEMINI_API_KEY = AIzaSyBSeNkPweNgSX0Ff-I4yL8qfQG6w6XjHws
   ```
3. Нажмите **Add**

---

### Шаг 4: Деплой

Railway автоматически задеплоит приложение.

После деплоя вы получите URL вида:
```
https://your-app-name.up.railway.app
```

---

## 🔧 Использование

### Endpoint

```
POST https://your-app-name.up.railway.app/api/generate
```

### Пример запроса

```bash
curl -X POST https://your-app-name.up.railway.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Hello, how are you?"
      }]
    }]
  }'
```

---

## 📋 Обновление URL в приложении

После деплоя обновите URL в `src/config/config.ts`:

```typescript
export const GEMINI_PROXY_URL = "https://your-app-name.up.railway.app/api/generate";
```

---

## 💰 Стоимость

Railway предоставляет **$5 бесплатных кредитов в месяц**.

Этого достаточно для:
- ~500,000 запросов в месяц
- Или ~16,000 запросов в день

Для вашего приложения этого более чем достаточно! ✅

---

## 🔍 Мониторинг

В Railway Dashboard вы можете видеть:
- Логи запросов
- Использование ресурсов
- Метрики производительности

---

**Готово!** 🎉

