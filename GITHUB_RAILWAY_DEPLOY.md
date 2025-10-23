# 🚀 Деплой через GitHub + Railway

Полная инструкция по обновлению кода и настройке Railway прокси.

---

## 📋 Шаг 1: Закоммитьте изменения в GitHub

```bash
# Убедитесь, что вы в корне проекта
cd /Users/zzema/Documents/GitHub/Course_AB_interview_AI

# Добавьте все изменения
git add .

# Создайте коммит
git commit -m "Add Railway proxy for Gemini API"

# Запушьте в GitHub
git push origin main
```

---

## 🚂 Шаг 2: Настройте Railway

### 2.1 Зарегистрируйтесь

1. Откройте https://railway.app/
2. Нажмите **Login with GitHub**
3. Авторизуйте Railway

### 2.2 Создайте проект

1. Нажмите **+ New Project**
2. Выберите **Deploy from GitHub repo**
3. Найдите репозиторий **Course_AB_interview_AI**
4. Нажмите **Deploy**

### 2.3 Настройте Root Directory

Railway спросит где код. Укажите:

```
Root Directory: railway-proxy
```

Нажмите **Deploy**

### 2.4 Добавьте API ключ

После деплоя:

1. Перейдите в **Variables**
2. Нажмите **+ New Variable**
3. Добавьте:
   ```
   GEMINI_API_KEY = AIzaSyBSeNkPweNgSX0Ff-I4yL8qfQG6w6XjHws
   ```

### 2.5 Получите URL

1. Перейдите в **Settings** → **Networking**
2. Нажмите **Generate Domain**
3. Скопируйте URL (например: `course-ab-interview-ai-production.up.railway.app`)

### 2.6 Проверьте

Откройте в браузере:
```
https://ваш-url.up.railway.app/
```

Должно показать:
```json
{"status":"ok","service":"Gemini API Proxy","timestamp":"..."}
```

✅ **Railway работает!**

---

## 🔧 Шаг 3: Обновите конфиг приложения

Откройте `src/config/config.ts`:

```typescript
export const GEMINI_PROXY_URL = "https://ваш-url.up.railway.app/api/generate";
```

**⚠️ Важно**: добавьте `/api/generate` в конце!

---

## 🏗️ Шаг 4: Соберите и задеплойте

```bash
# Соберите приложение
npm run build

# Задеплойте на Firebase
firebase deploy --only hosting
```

---

## ✅ Готово!

Проверьте работу:

1. Откройте https://course-ab-interview.web.app
2. Авторизуйтесь
3. Ответьте на вопрос
4. Должна работать AI-оценка

---

## 📊 Мониторинг

### Railway Dashboard

Отслеживайте:
- 📈 Логи запросов
- 💰 Использование кредитов ($5/месяц бесплатно)
- ⚡ Метрики производительности

### Firebase Console

Отслеживайте:
- 👥 Активных пользователей
- 💾 Использование Firestore
- 🌐 Трафик Hosting

---

## 🔄 Обновление кода прокси

Если нужно обновить прокси:

```bash
# Внесите изменения в railway-proxy/index.js
nano railway-proxy/index.js

# Закоммитьте
git add railway-proxy/
git commit -m "Update Railway proxy"
git push

# Railway автоматически пересоберет! 🎉
```

---

## 💰 Стоимость

### Railway
- **$5/месяц** бесплатно
- Хватит на ~500,000 запросов

### Firebase
- **10 GB** storage бесплатно
- **360 MB/день** transfer бесплатно

### Gemini API
- **Бесплатно** для вашего объема запросов

**Итого: $0/месяц** для малого/среднего трафика ✅

---

## ⚠️ Troubleshooting

### Проблема: Railway не видит railway-proxy

**Решение**: 
1. Убедитесь, что папка `railway-proxy` запушена в GitHub
2. В Railway укажите Root Directory: `railway-proxy`

### Проблема: 400 Bad Request от Railway

**Решение**:
1. Проверьте, что `GEMINI_API_KEY` добавлен в Variables
2. Проверьте логи в Railway Dashboard

### Проблема: CORS ошибка

**Решение**: Убедитесь, что Railway вернул статус 200. Проверьте логи.

---

## 🎉 Всё работает!

Приложение теперь:
- ✅ Работает из любого региона
- ✅ Автоматически обновляется при push в GitHub
- ✅ Масштабируется автоматически
- ✅ Бесплатно для малого/среднего трафика

**Наслаждайтесь!** 🚀

