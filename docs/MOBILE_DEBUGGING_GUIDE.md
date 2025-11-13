# 📱 MOBILE DEBUGGING GUIDE - Профессиональная отладка на мобильных устройствах

**Дата создания**: 2025-11-13  
**Цель**: Настроить профессиональный workflow для быстрой разработки и отладки на мобильных устройствах

---

## 🎯 ПРОБЛЕМА

Тестирование на production методом "деплой → открой на телефоне → скриншот → исправь → повтори" - это:
- ❌ **Медленно** (каждый деплой 2-3 минуты)
- ❌ **Непродуктивно** (нет доступа к console.log)
- ❌ **Непрофессионально** (так не делают в реальных проектах)

## ✅ РЕШЕНИЕ

В продовых проектах используют **3 метода** для мобильной отладки:

1. **Safari Web Inspector** (iOS) / **Chrome DevTools** (Android) - remote debugging
2. **Локальный сервер доступный с телефона** (ngrok, локальная сеть)
3. **Встроенная консоль на production** (Eruda, для быстрых hotfix)

---

## 📋 ОГЛАВЛЕНИЕ

1. [Метод 1: Safari Web Inspector (iOS)](#метод-1-safari-web-inspector-ios)
2. [Метод 2: Chrome DevTools (Android)](#метод-2-chrome-devtools-android)
3. [Метод 3: ngrok - доступ к localhost](#метод-3-ngrok---доступ-к-localhost)
4. [Метод 4: Локальная сеть (WiFi)](#метод-4-локальная-сеть-wifi)
5. [Метод 5: Eruda Console (Production)](#метод-5-eruda-console-production)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## МЕТОД 1: Safari Web Inspector (iOS)

**Лучший метод для iOS разработки**. Полноценный DevTools прямо на Mac.

### Шаг 1: Настройка iPhone

1. Открой **Настройки** → **Safari** → **Дополнительно**
2. Включи **"Web Inspector"** (Веб-инспектор)

### Шаг 2: Настройка Mac

1. Открой **Safari** на Mac
2. **Safari** → **Настройки** → **Дополнительно**
3. Включи галочку **"Показывать меню разработки"**

### Шаг 3: Подключение

1. Подключи iPhone к Mac через USB-C/Lightning кабель
2. Открой сайт на iPhone в Safari
3. На Mac: **Safari** → **Разработка** → **[Имя твоего iPhone]** → **[Название вкладки]**

### Что теперь доступно:

✅ **Console** - все `console.log()` в реальном времени  
✅ **Network** - все запросы (Gemini API, Firebase)  
✅ **Elements** - инспектирование DOM и CSS  
✅ **Debugger** - breakpoints, step through code  
✅ **Storage** - localStorage, cookies, IndexedDB  

### Пример workflow:

```bash
# На Mac:
cd /Users/zzema/Documents/GitHub/Course_AB_interview_AI
lsof -ti:3000 | xargs kill -9  # убить процессы на 3000
npm run dev -- --port 3000

# На iPhone Safari:
# Открой http://<IP твоего Mac>:3000

# На Mac Safari:
# Открой Web Inspector и смотри логи в реальном времени
```

---

## МЕТОД 2: Chrome DevTools (Android)

**Для Android устройств**. Аналог Safari Web Inspector.

### Шаг 1: Настройка Android

1. Открой **Настройки** → **О телефоне**
2. Тапни 7 раз на **"Номер сборки"** (появится режим разработчика)
3. **Настройки** → **Для разработчиков** → Включи **"Отладка по USB"**

### Шаг 2: Подключение

1. Подключи Android к компьютеру через USB
2. Открой Chrome на компьютере
3. Перейди на `chrome://inspect`
4. Открой сайт на Android в Chrome
5. На компьютере появится устройство - нажми **"Inspect"**

### Что доступно:

✅ Полноценный Chrome DevTools  
✅ Все панели: Console, Network, Elements, Performance  
✅ Возможность делать screenshots прямо из DevTools  

---

## МЕТОД 3: ngrok - доступ к localhost

**Самый простой способ** открыть localhost на любом устройстве через интернет.

### Установка:

```bash
# Mac (через Homebrew):
brew install ngrok

# Или скачай с https://ngrok.com/download
```

### Регистрация (бесплатно):

1. Зарегистрируйся на https://ngrok.com
2. Получи authtoken
3. Настрой:

```bash
ngrok config add-authtoken <твой_токен>
```

### Использование:

```bash
# Запусти локальный сервер:
cd /Users/zzema/Documents/GitHub/Course_AB_interview_AI
lsof -ti:3000 | xargs kill -9
npm run dev -- --port 3000

# В другом терминале:
ngrok http 3000
```

### Результат:

```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

Теперь открой `https://abc123.ngrok.io` на **любом** устройстве (iPhone, Android, планшет).

### Преимущества:

✅ Работает через интернет (не нужна локальная сеть)  
✅ HTTPS из коробки (работает OAuth, Firebase)  
✅ Можно тестировать на нескольких устройствах одновременно  
✅ Бесплатный план: 1 concurrent ngrok process  

### Недостатки:

❌ Требует интернет  
❌ URL меняется при каждом запуске (платная версия дает постоянный URL)  

---

## МЕТОД 4: Локальная сеть (WiFi)

**Самый быстрый метод** без установки дополнительного ПО.

### Шаг 1: Узнай IP адрес Mac

```bash
# Вариант 1:
ifconfig | grep "inet " | grep -v 127.0.0.1

# Вариант 2:
ipconfig getifaddr en0   # WiFi
ipconfig getifaddr en1   # Ethernet
```

Пример вывода: `192.168.1.100`

### Шаг 2: Запусти dev server с host 0.0.0.0

```bash
cd /Users/zzema/Documents/GitHub/Course_AB_interview_AI
lsof -ti:3000 | xargs kill -9
npm run dev -- --host 0.0.0.0 --port 3000
```

### Шаг 3: Открой на телефоне

```
http://192.168.1.100:3000
```

### Требования:

- ✅ Телефон и Mac должны быть в **одной WiFi сети**
- ✅ Firewall на Mac не должен блокировать порт 3000

### Проверка Firewall:

```bash
# Открой порт 3000 если заблокирован:
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

### Преимущества:

✅ Самый быстрый (нет задержки через интернет)  
✅ Не требует регистрации  
✅ Работает без интернета  

### Недостатки:

❌ Только в локальной сети  
❌ HTTP (не HTTPS) - могут не работать некоторые API  
❌ IP может меняться  

---

## МЕТОД 5: Eruda Console (Production)

**Для быстрых hotfix на production** без re-deploy.

### Что это?

**Eruda** - встроенная мобильная консоль прямо на странице. Выглядит как DevTools, но работает на самом устройстве.

### Установка:

```bash
npm install eruda --save-dev
```

### Интеграция (conditional - только для мобильных):

```typescript
// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Eruda console для мобильных устройств (только на localhost и staging)
if (
  (window.location.hostname === 'localhost' || 
   window.location.hostname.includes('staging')) &&
  /Mobi|Android/i.test(navigator.userAgent)
) {
  import('eruda').then(eruda => eruda.default.init());
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
```

### Использование:

1. Открой сайт на телефоне
2. Увидишь иконку справа внизу
3. Тапни - откроется консоль
4. Вкладки: Console, Elements, Network, Resources, Info

### Преимущества:

✅ Работает на production (можно добавить через query param)  
✅ Не требует подключения к компьютеру  
✅ Все логи видны прямо на телефоне  

### Production-safe вариант (через query param):

```typescript
// src/index.tsx
const urlParams = new URLSearchParams(window.location.search);
const enableEruda = urlParams.get('debug') === 'true';

if (enableEruda && /Mobi|Android/i.test(navigator.userAgent)) {
  import('eruda').then(eruda => eruda.default.init());
}
```

Теперь открывай: `https://course-ab-interview.web.app?debug=true`

---

## BEST PRACTICES

### 1. Development Workflow

**Для активной разработки** (много изменений):

```bash
# Вариант A: ngrok (если нужен HTTPS для OAuth)
Terminal 1: npm run dev -- --port 3000
Terminal 2: ngrok http 3000

# Вариант B: локальная сеть (быстрее)
npm run dev -- --host 0.0.0.0 --port 3000
# Открой http://<твой_IP>:3000 на телефоне
```

**Затем**: Используй Safari Web Inspector (iOS) или Chrome DevTools (Android) для просмотра логов.

### 2. Быстрое тестирование фич

**Для проверки конкретной фичи**:

```bash
# Сделай build и задеплой на Firebase Hosting
npm run build
firebase deploy --only hosting

# Открой на телефоне с Eruda:
https://course-ab-interview.web.app?debug=true
```

### 3. Production Debugging

**Если баг только на production**:

1. Добавь временно `console.log()` в критические места
2. Деплой с Eruda (через query param)
3. Открой на телефоне с `?debug=true`
4. Воспроизведи баг и скопируй логи
5. Убери `console.log()` после фикса

### 4. Automated Logging

**Для отлова неочевидных багов**:

```typescript
// src/lib/logger.ts
export class RemoteLogger {
  private logs: string[] = [];

  log(message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.log(message, data);
    this.logs.push(JSON.stringify(logEntry));
    
    // Сохраняем в localStorage для просмотра
    localStorage.setItem('debug_logs', JSON.stringify(this.logs));
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
    localStorage.removeItem('debug_logs');
  }
}

export const logger = new RemoteLogger();
```

Использование:

```typescript
// src/components/UserSetup.tsx
import { logger } from '../lib/logger';

logger.log('Google button rendered', { buttonRef: !!googleButtonRef.current });
```

Затем на телефоне:

```javascript
// В Eruda Console:
JSON.parse(localStorage.getItem('debug_logs'))
```

---

## TROUBLESHOOTING

### Safari Web Inspector не показывает устройство

1. Проверь, что iPhone разблокирован
2. Нажми "Trust this computer" на iPhone
3. Перезапусти Safari на Mac
4. Проверь, что Web Inspector включен на iPhone

### Не открывается по IP адресу (локальная сеть)

```bash
# 1. Проверь, что сервер слушает на 0.0.0.0:
npm run dev -- --host 0.0.0.0 --port 3000

# 2. Проверь Firewall:
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# 3. Временно отключи Firewall (для теста):
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
```

### ngrok не работает

```bash
# 1. Проверь, что авторизован:
ngrok config check

# 2. Переустанови authtoken:
ngrok config add-authtoken <твой_токен>

# 3. Проверь, что localhost работает:
curl http://localhost:3000
```

### Firebase Auth не работает на localhost/ngrok

**Проблема**: Google OAuth требует whitelist redirect URIs.

**Решение**:

1. Открой [Google Cloud Console](https://console.cloud.google.com)
2. Выбери проект `course-ab-interview`
3. **APIs & Services** → **Credentials** → **OAuth 2.0 Client ID**
4. Добавь в **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `https://<твой-ngrok-id>.ngrok.io`
5. Добавь в **Authorized redirect URIs**:
   - `http://localhost:3000`
   - `https://<твой-ngrok-id>.ngrok.io`

**Альтернатива**: Используй тестового пользователя с email/password auth (без OAuth).

---

## ПРАКТИЧЕСКИЙ ПРИМЕР: Debug двойного SMS

### Задача:
Google OAuth отправляет 2 SMS вместо одного при входе на мобильных.

### Workflow:

```bash
# 1. Запусти локальный сервер:
cd /Users/zzema/Documents/GitHub/Course_AB_interview_AI
lsof -ti:3000 | xargs kill -9
npm run dev -- --port 3000

# 2. Запусти ngrok:
ngrok http 3000
# Получишь: https://abc123.ngrok.io

# 3. Добавь URL в Google Console:
# (см. раздел выше)

# 4. Открой на iPhone:
# https://abc123.ngrok.io

# 5. Открой Safari Web Inspector на Mac:
# Safari → Разработка → [iPhone] → [abc123.ngrok.io]

# 6. В Console смотри логи:
# console.log появятся в реальном времени
```

### Добавь детальное логирование:

```typescript
// src/components/UserSetup.tsx
console.log('🔵 Google callback START', {
  credential: !!credential,
  tempUser: !!tempUser,
  timestamp: new Date().toISOString()
});

// ... код ...

console.log('🔵 handleLogin called', {
  email: user.email,
  selectedLevel,
  timestamp: new Date().toISOString()
});
```

### Результат:
Теперь ты видишь **все** логи в реальном времени и можешь точно определить, где происходит дублирование.

---

## SUMMARY

| Метод | Скорость | Сложность | Когда использовать |
|-------|----------|-----------|-------------------|
| **Safari Web Inspector** | ⚡⚡⚡ | 🟢 Легко | iOS разработка, нужны логи |
| **Chrome DevTools** | ⚡⚡⚡ | 🟢 Легко | Android разработка |
| **ngrok** | ⚡⚡ | 🟡 Средне | OAuth, HTTPS, удаленное тестирование |
| **Локальная сеть** | ⚡⚡⚡ | 🟢 Легко | Быстрое тестирование без интернета |
| **Eruda Console** | ⚡ | 🟢 Легко | Production hotfix, быстрая проверка |

### Рекомендуемый workflow:

1. **Активная разработка**: `npm run dev` + Safari Web Inspector
2. **Тестирование OAuth**: ngrok + Safari Web Inspector
3. **Production debug**: Eruda Console (`?debug=true`)
4. **Automated logging**: RemoteLogger → localStorage

---

## ПОЛЕЗНЫЕ ССЫЛКИ

- [Safari Web Inspector Guide](https://webkit.org/web-inspector/)
- [Chrome Remote Debugging](https://developer.chrome.com/docs/devtools/remote-debugging/)
- [ngrok Documentation](https://ngrok.com/docs)
- [Eruda GitHub](https://github.com/liriliri/eruda)
- [Vite Network Options](https://vitejs.dev/config/server-options.html#server-host)

---

**Теперь у тебя профессиональный setup для мобильной разработки! 🚀**

**Больше никаких скриншотов и слепых деплоев - только быстрые итерации с полным контролем.**

