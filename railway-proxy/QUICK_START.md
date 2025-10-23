# ⚡ Быстрый старт (5 минут)

## 📋 Что нужно:

1. ✅ Аккаунт GitHub
2. ✅ 5 минут времени

---

## 🚀 Пошаговая инструкция:

### 1️⃣ Загрузите код на GitHub (1 мин)

```bash
cd railway-proxy
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

Создайте новый репозиторий на GitHub: https://github.com/new

Назовите его: `gemini-proxy`

```bash
git remote add origin https://github.com/ВАШ_USERNAME/gemini-proxy.git
git push -u origin main
```

---

### 2️⃣ Деплой на Railway (2 мин)

1. Откройте https://railway.app/
2. Нажмите **Login** → войдите через GitHub
3. Нажмите **+ New Project**
4. Выберите **Deploy from GitHub repo**
5. Найдите репозиторий `gemini-proxy`
6. Нажмите **Deploy Now**

Railway автоматически:
- ✅ Установит зависимости (`npm install`)
- ✅ Запустит сервер (`npm start`)
- ✅ Создаст публичный URL

---

### 3️⃣ Добавьте API ключ (1 мин)

В Railway Dashboard:

1. Перейдите в **Variables** (слева)
2. Нажмите **+ New Variable**
3. Введите:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyBSeNkPweNgSX0Ff-I4yL8qfQG6w6XjHws`
4. Нажмите **Add**

Railway автоматически перезапустит сервер.

---

### 4️⃣ Получите URL (30 сек)

В Railway Dashboard:

1. Перейдите в **Settings**
2. Найдите **Public Networking**
3. Нажмите **Generate Domain**
4. Скопируйте URL (например: `gemini-proxy-production.up.railway.app`)

---

### 5️⃣ Обновите приложение (30 сек)

Откройте `src/config/config.ts`:

```typescript
export const GEMINI_PROXY_URL = "https://gemini-proxy-production.up.railway.app/api/generate";
```

Пересоберите и задеплойте:

```bash
npm run build
firebase deploy --only hosting
```

---

## ✅ Готово!

Проверьте:
```bash
curl https://ваш-url.up.railway.app/
```

Должно вернуть:
```json
{"status":"ok","service":"Gemini API Proxy","timestamp":"..."}
```

---

## 🎉 Всё работает!

Приложение теперь использует Railway прокси → Gemini API работает! 🚀

---

## 💡 Альтернатива: Railway CLI (для продвинутых)

```bash
# Установите Railway CLI
npm i -g @railway/cli

# Войдите
railway login

# Инициализируйте проект
railway init

# Добавьте переменную
railway variables --set GEMINI_API_KEY=AIzaSyBSeNkPweNgSX0Ff-I4yL8qfQG6w6XjHws

# Деплой
railway up
```

**Готово за 2 команды!** ⚡

