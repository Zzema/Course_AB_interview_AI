# 🚂 Railway Proxy - Инструкция по деплою

## Проблема
Railway proxy не работает из-за отсутствия GEMINI_API_KEY или неправильной конфигурации.

## Решение

### 1. Зайти в Railway Dashboard
```
https://railway.app/
```

### 2. Найти проект `courseabinterviewai-production`

### 3. Добавить Environment Variable
```
GEMINI_API_KEY = AIzaSyCYObs7UDj-8RPLl0gfXXPlb_cSU6_h3JI
```

### 4. Проверить Root Directory
В настройках проекта должно быть:
```
Root Directory: railway-proxy
```

### 5. Redeploy
Нажать "Deploy" → "Redeploy"

### 6. Проверить логи
После деплоя в логах должно быть:
```
🚀 Gemini Proxy Server running on port 3000
📍 Environment: production
🔑 API Key configured: Yes ✅
```

### 7. Протестировать
```bash
curl -X POST https://courseabinterviewai-production.up.railway.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"test"}]}],"generationConfig":{"responseMimeType":"application/json"}}'
```

Должен вернуться JSON ответ от Gemini.

## Альтернатива: Новый деплой

Если не работает, создать новый проект на Railway:

1. New Project → Deploy from GitHub repo
2. Выбрать репозиторий: `Course_AB_interview_AI`
3. Root Directory: `railway-proxy`
4. Add Variable: `GEMINI_API_KEY=AIzaSyCYObs7UDj-8RPLl0gfXXPlb_cSU6_h3JI`
5. Deploy
6. Скопировать новый URL и обновить `src/config/config.ts`

## Проверка работы

После деплоя открыть:
```
https://course-ab-interview.web.app?demo=true
```

Ответить на вопрос - должен прийти AI feedback.

