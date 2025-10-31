# 🤖 Установка Telegram Бота - Пошаговая Инструкция

## ✅ Что уже сделано:

1. ✅ Бот создан через @BotFather
2. ✅ Токен получен: `8464821667:AAHdoBF1OA0Qv2NALBjlxKXha3rqi5wq4nE`
3. ✅ Команды настроены в @BotFather
4. ✅ Firebase Functions код готов

---

## 📋 Шаг 1: Установка зависимостей

```bash
cd /Users/zzema/Documents/GitHub/Course_AB_interview_AI/functions
npm install
```

---

## 📋 Шаг 2: Компиляция TypeScript

```bash
npm run build
```

---

## 📋 Шаг 3: Деплой Firebase Functions

```bash
firebase deploy --only functions
```

Это развернет три функции:
- `telegramWebhook` - обработка сообщений
- `sendDailyReminder` - ежедневные напоминания (19:00 МСК)
- `sendWeeklySummary` - еженедельная статистика (воскресенье, 20:00 МСК)

---

## 📋 Шаг 4: Настройка Webhook в Telegram

После деплоя получишь URL функции, например:
```
https://us-central1-YOUR-PROJECT.cloudfunctions.net/telegramWebhook
```

Установи webhook командой (замени YOUR_URL):

```bash
curl -X POST "https://api.telegram.org/bot8464821667:AAHdoBF1OA0Qv2NALBjlxKXha3rqi5wq4nE/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "YOUR_URL"}'
```

**Или через браузер:**
```
https://api.telegram.org/bot8464821667:AAHdoBF1OA0Qv2NALBjlxKXha3rqi5wq4nE/setWebhook?url=YOUR_URL
```

---

## 📋 Шаг 5: Проверка работы бота

1. Открой Telegram
2. Найди своего бота
3. Отправь `/start`
4. Должен прийти приветственный ответ

---

## 🔧 Настройка токена через Firebase Config (безопасный способ)

**Вместо хардкода токена в коде**, лучше использовать Firebase Config:

### 1. Установи токен:
```bash
firebase functions:config:set telegram.bot_token="8464821667:AAHdoBF1OA0Qv2NALBjlxKXha3rqi5wq4nE"
```

### 2. Обнови код в `telegram-bot.ts`:
```typescript
// Вместо
const TELEGRAM_BOT_TOKEN = '8464821667:AAHdoBF1OA0Qv2NALBjlxKXha3rqi5wq4nE';

// Используй
const TELEGRAM_BOT_TOKEN = functions.config().telegram.bot_token;
```

### 3. Передеплой:
```bash
firebase deploy --only functions
```

---

## 📋 Команды бота (уже настроены)

| Команда | Описание |
|---------|----------|
| `/start` | Начать работу с ботом |
| `/link` | Связать Telegram с аккаунтом |
| `/stats` | Посмотреть свою статистику |
| `/challenge` | Текущий челлендж недели |
| `/remind` | Настроить напоминания |
| `/friends` | Реферальная ссылка |
| `/help` | Справка по командам |

---

## 🔍 Мониторинг и отладка

### Просмотр логов:
```bash
firebase functions:log
```

### Локальное тестирование (эмулятор):
```bash
npm run serve
```

### Проверка статуса webhook:
```bash
curl "https://api.telegram.org/bot8464821667:AAHdoBF1OA0Qv2NALBjlxKXha3rqi5wq4nE/getWebhookInfo"
```

---

## 🔄 Интеграция с веб-приложением

### В UserSetup или ProfileScreen добавь:

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const linkTelegram = httpsCallable(functions, 'linkTelegramAccount');

async function handleLinkTelegram(telegramId: string) {
  try {
    await linkTelegram({ 
      email: user.email, 
      telegramId: parseInt(telegramId) 
    });
    alert('✅ Telegram успешно привязан!');
  } catch (error) {
    console.error('Ошибка привязки:', error);
    alert('❌ Ошибка привязки Telegram');
  }
}
```

---

## 📊 Структура данных в Firestore

После связывания аккаунта, в документе пользователя будут поля:

```typescript
{
  email: "user@example.com",
  telegramId: 123456789,
  telegramChatId: 123456789,
  telegramUsername: "username",
  telegramLinkedAt: Timestamp,
  gameState: { ... }
}
```

---

## 🎯 Следующие шаги

1. **Тестирование**: Протестируй все команды бота
2. **Push-уведомления**: Проверь работу ежедневных напоминаний
3. **Статистика**: Убедись что `/stats` корректно отображает данные
4. **Друзья через Telegram**: Можно добавить импорт контактов

---

## 🆘 Troubleshooting

### Бот не отвечает:
1. Проверь webhook: `getWebhookInfo`
2. Проверь логи: `firebase functions:log`
3. Убедись что функция задеплоена

### Ошибка "Function not found":
```bash
firebase deploy --only functions:telegramWebhook
```

### Ошибка прав доступа:
Убедись что Firebase Admin SDK инициализирован:
```typescript
admin.initializeApp();
```

---

## 💰 Стоимость

Firebase Functions тарификация:
- **Free tier**: 2M invocations/month
- **Paid**: $0.40 per 1M invocations

При ~100 активных пользователей:
- Webhook: ~1000 сообщений/день = 30K/месяц
- Daily reminders: 100 * 30 = 3K/месяц
- Weekly summaries: 100 * 4 = 400/месяц
- **ИТОГО**: ~33.4K invocations/month = **БЕСПЛАТНО** ✅

---

## ✨ Готово!

Теперь у тебя есть полнофункциональный Telegram бот для твоего приложения!

**Протестируй его прямо сейчас:** Найди бота в Telegram и отправь `/start`

