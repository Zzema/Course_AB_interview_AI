# 🚂 Настройка Railway Proxy для Gemini API

Railway.app используется как прокси-сервер для обхода региональных ограничений Gemini API.

---

## 📋 Что нужно:

1. ✅ Аккаунт GitHub (уже есть)
2. ✅ Код уже в репозитории `Course_AB_interview_AI`
3. ✅ 5 минут времени

---

## 🚀 Пошаговая инструкция:

### Шаг 1: Зарегистрируйтесь на Railway

1. Откройте https://railway.app/
2. Нажмите **Login**
3. Выберите **Login with GitHub**
4. Авторизуйте Railway

✅ **Бонус**: Railway даст вам **$5 бесплатных кредитов** в месяц!

---

### Шаг 2: Создайте новый проект

1. В Railway Dashboard нажмите **+ New Project**
2. Выберите **Deploy from GitHub repo**
3. Найдите репозиторий **Course_AB_interview_AI**
4. Нажмите **Deploy**

Railway спросит: "Where is your code?"

5. Укажите **Root Directory**: `railway-proxy`
6. Нажмите **Deploy**

Railway автоматически:
- ✅ Обнаружит `package.json`
- ✅ Установит зависимости
- ✅ Запустит сервер

---

### Шаг 3: Настройте переменные окружения

После деплоя:

1. В Railway Dashboard перейдите в **Variables** (левое меню)
2. Нажмите **+ New Variable**
3. Введите:
   - **Variable Name**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyBSeNkPweNgSX0Ff-I4yL8qfQG6w6XjHws`
4. Нажмите **Add**

Railway автоматически перезапустит сервер с новой переменной.

---

### Шаг 4: Получите публичный URL

1. Перейдите в **Settings** (левое меню)
2. Найдите раздел **Networking**
3. Нажмите **Generate Domain**

Railway создаст URL вида:
```
https://course-ab-interview-ai-production.up.railway.app
```

**Скопируйте этот URL!** 📋

---

### Шаг 5: Проверьте работу прокси

Откройте в браузере:
```
https://ваш-url.up.railway.app/
```

Должны увидеть:
```json
{
  "status": "ok",
  "service": "Gemini API Proxy",
  "timestamp": "2024-10-23T..."
}
```

✅ **Прокси работает!**

---

### Шаг 6: Обновите конфиг в приложении

Откройте `src/config/config.ts` и обновите:

```typescript
export const GEMINI_PROXY_URL = "https://ваш-url.up.railway.app/api/generate";
```

**Важно**: добавьте `/api/generate` в конце!

---

### Шаг 7: Деплой обновленного приложения

```bash
# Соберите проект
npm run build

# Задеплойте на Firebase
firebase deploy --only hosting
```

---

## ✅ Готово!

Теперь:
- ✅ Railway прокси работает из США
- ✅ Gemini API доступен без ограничений
- ✅ Приложение использует прокси

---

## 📊 Мониторинг

В Railway Dashboard вы можете:
- 📈 Видеть логи запросов
- 💰 Отслеживать использование кредитов
- ⚡ Видеть метрики производительности

---

## 💰 Стоимость

Railway предоставляет **$5 бесплатных кредитов в месяц**.

Для вашего приложения это:
- ~500,000 запросов в месяц
- Или ~16,000 запросов в день

**Более чем достаточно!** ✅

---

## 🔧 Обновление кода прокси

Если нужно обновить код прокси:

1. Внесите изменения в `railway-proxy/index.js`
2. Закоммитьте и запушьте в GitHub
3. Railway автоматически пересоберет и задеплоит

**Автодеплой из коробки!** 🚀

---

## ⚠️ Troubleshooting

### Проблема: Railway не находит код

**Решение**: Убедитесь, что указали Root Directory: `railway-proxy`

### Проблема: Ошибка "API key not configured"

**Решение**: Проверьте, что добавили переменную `GEMINI_API_KEY` в Variables

### Проблема: 400 Bad Request

**Решение**: Проверьте, что URL заканчивается на `/api/generate`

---

## 🎉 Всё работает!

Приложение теперь доступно пользователям из любого региона! 🌍

