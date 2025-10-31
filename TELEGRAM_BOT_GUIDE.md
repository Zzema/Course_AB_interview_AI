# 🤖 Telegram Бот - Полная инструкция по созданию и интеграции

## 📋 Оглавление
1. [Создание бота в Telegram](#1-создание-бота)
2. [Настройка Firebase Functions](#2-firebase-functions)
3. [Интеграция с веб-приложением](#3-интеграция)
4. [Команды бота](#4-команды)
5. [Push-уведомления](#5-пуш-уведомления)
6. [Система друзей](#6-друзья)
7. [Деплой и тестирование](#7-деплой)

---

## 1. Создание бота в Telegram

### Шаг 1.1: BotFather
1. Открой Telegram и найди [@BotFather](https://t.me/botfather)
2. Отправь команду `/newbot`
3. Введи название бота: **AB Testing Trainer**
4. Введи username: **ab_testing_trainer_bot** (должен заканчиваться на `_bot`)
5. **Сохрани токен!** Выглядит так: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### Шаг 1.2: Настройка бота
```
/setdescription - AB Testing Interview Trainer - готовься к собесам!
/setabouttext - Бот для подготовки к собеседованиям по A/B тестированию
/setcommands - установи команды (см. ниже)
```

**Команды бота:**
```
start - Начать использование
link - Привязать аккаунт
daily - Сегодняшний квест
stats - Моя статистика
challenge - Челлендж недели
friends - Мои друзья
notify - Настроить уведомления
help - Помощь
```

---

## 2. Настройка Firebase Functions

### Шаг 2.1: Установка зависимостей

```bash
cd functions
npm install node-telegram-bot-api
npm install -D @types/node-telegram-bot-api
```

### Шаг 2.2: Создай файл `functions/src/telegramBot.ts`

```typescript
import * as functions from 'firebase-functions';
import TelegramBot from 'node-telegram-bot-api';
import * as admin from 'firebase-admin';

const BOT_TOKEN = functions.config().telegram.token;
const bot = new TelegramBot(BOT_TOKEN);

// Webhook для получения сообщений
export const telegramWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const { message, callback_query } = req.body;

    if (message) {
      await handleMessage(message);
    }

    if (callback_query) {
      await handleCallbackQuery(callback_query);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.status(500).send('Error');
  }
});

// Обработка сообщений
async function handleMessage(message: any) {
  const chatId = message.chat.id;
  const text = message.text;
  const userId = message.from.id;

  switch (text) {
    case '/start':
      await handleStart(chatId, userId);
      break;
    case '/link':
      await handleLink(chatId, userId);
      break;
    case '/daily':
      await handleDaily(chatId, userId);
      break;
    case '/stats':
      await handleStats(chatId, userId);
      break;
    case '/challenge':
      await handleChallenge(chatId, userId);
      break;
    case '/friends':
      await handleFriends(chatId, userId);
      break;
    case '/notify':
      await handleNotify(chatId, userId);
      break;
    default:
      if (text?.startsWith('/')) {
        await bot.sendMessage(chatId, 'Неизвестная команда. Используй /help');
      }
  }
}

// Команда /start
async function handleStart(chatId: number, userId: number) {
  const keyboard = {
    inline_keyboard: [
      [{ text: '🔗 Привязать аккаунт', callback_data: 'link_account' }],
      [{ text: '📊 Статистика', callback_data: 'show_stats' }],
      [{ text: '🎯 Сегодняшний квест', callback_data: 'daily_quest' }]
    ]
  };

  await bot.sendMessage(
    chatId,
    '🎯 Привет! Я помогу тебе готовиться к собесам по A/B тестированию.\n\n' +
    'Для начала привяжи свой аккаунт командой /link или нажми кнопку ниже.',
    { reply_markup: keyboard }
  );
}

// Команда /link
async function handleLink(chatId: number, userId: number) {
  // Генерируем уникальный код для привязки
  const linkCode = generateLinkCode();
  
  await admin.firestore().collection('telegram_links').doc(linkCode).set({
    telegramId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: Date.now() + (10 * 60 * 1000) // 10 минут
  });

  await bot.sendMessage(
    chatId,
    `🔗 Для привязки аккаунта:\n\n` +
    `1. Перейди на https://course-ab-interview.web.app\n` +
    `2. Открой Настройки\n` +
    `3. Введи код: **${linkCode}**\n\n` +
    `Код действителен 10 минут.`,
    { parse_mode: 'Markdown' }
  );
}

// Команда /daily
async function handleDaily(chatId: number, userId: number) {
  const userDoc = await getUserByTelegramId(userId);
  
  if (!userDoc) {
    await bot.sendMessage(chatId, '❌ Сначала привяжи аккаунт: /link');
    return;
  }

  const gameState = userDoc.data()?.gameState;
  const series = gameState?.activitySeries?.currentSeries || 0;
  const todayCompleted = gameState?.activitySeries?.todayCompleted || false;

  if (todayCompleted) {
    await bot.sendMessage(
      chatId,
      `✅ Сегодняшний квест выполнен!\n\n` +
      `🔥 Серия: ${series} дней\n` +
      `⭐ Продолжай в том же духе!`
    );
  } else {
    await bot.sendMessage(
      chatId,
      `🎯 Сегодняшний квест:\n\n` +
      `Ответь на вопросы и сохрани свою серию!\n\n` +
      `🔥 Текущая серия: ${series} дней\n\n` +
      `👉 Перейди в приложение: https://course-ab-interview.web.app`,
      {
        reply_markup: {
          inline_keyboard: [[
            { text: '🚀 Начать', url: 'https://course-ab-interview.web.app' }
          ]]
        }
      }
    );
  }
}

// Команда /stats
async function handleStats(chatId: number, userId: number) {
  const userDoc = await getUserByTelegramId(userId);
  
  if (!userDoc) {
    await bot.sendMessage(chatId, '❌ Сначала привяжи аккаунт: /link');
    return;
  }

  const gameState = userDoc.data()?.gameState;
  const totalQuestions = gameState?.questionAttempts?.length || 0;
  const rating = gameState?.rating || 0;
  const series = gameState?.activitySeries?.currentSeries || 0;

  await bot.sendMessage(
    chatId,
    `📊 Твоя статистика:\n\n` +
    `✅ Вопросов ответил: ${totalQuestions}\n` +
    `⭐ Рейтинг (XP): ${rating}\n` +
    `🔥 Серия: ${series} дней\n\n` +
    `👉 Подробнее: https://course-ab-interview.web.app/stats`,
    {
      reply_markup: {
        inline_keyboard: [[
          { text: '📊 Открыть статистику', url: 'https://course-ab-interview.web.app' }
        ]]
      }
    }
  );
}

// Вспомогательные функции
function generateLinkCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function getUserByTelegramId(telegramId: number) {
  const snapshot = await admin.firestore()
    .collection('sessions')
    .where('telegramId', '==', telegramId)
    .limit(1)
    .get();
  
  return snapshot.empty ? null : snapshot.docs[0];
}

// Отправка push-уведомления
export const sendTelegramNotification = functions.firestore
  .document('sessions/{sessionId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const telegramId = after.telegramId;

    if (!telegramId) return;

    // Проверяем потерю серии
    const beforeSeries = before.gameState?.activitySeries?.currentSeries || 0;
    const afterSeries = after.gameState?.activitySeries?.currentSeries || 0;

    if (afterSeries < beforeSeries) {
      await bot.sendMessage(
        telegramId,
        `⚠️ Твоя серия прервалась!\n\n` +
        `Было: ${beforeSeries} дней\n` +
        `Начни новую серию прямо сейчас!`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '🔥 Восстановить', url: 'https://course-ab-interview.web.app' }
            ]]
          }
        }
      );
    }
  });

// Ежедневное напоминание (запускается по расписанию)
export const dailyReminder = functions.pubsub
  .schedule('0 18 * * *') // Каждый день в 18:00 MSK
  .timeZone('Europe/Moscow')
  .onRun(async (context) => {
    const users = await admin.firestore()
      .collection('sessions')
      .where('telegramId', '!=', null)
      .where('notificationsEnabled', '==', true)
      .get();

    for (const userDoc of users.docs) {
      const data = userDoc.data();
      const todayCompleted = data.gameState?.activitySeries?.todayCompleted;

      if (!todayCompleted) {
        await bot.sendMessage(
          data.telegramId,
          `🔔 Напоминание!\n\n` +
          `Не забудь выполнить сегодняшний квест и сохранить свою серию! 🔥\n\n` +
          `👉 https://course-ab-interview.web.app`
        );
      }
    }
  });
```

---

## 3. Интеграция с веб-приложением

### Шаг 3.1: Добавь поля в Session type

```typescript
// src/types.ts
export interface Session {
  // ... существующие поля
  telegramId?: number; // Telegram user ID
  telegramUsername?: string; // @username
  notificationsEnabled?: boolean;
  notificationTime?: string; // "18:00"
}
```

### Шаг 3.2: Создай компонент TelegramConnect

```typescript
// src/components/TelegramConnect.tsx
import React, { useState } from 'react';

const TelegramConnect: React.FC<{ userId: string }> = ({ userId }) => {
  const [linkCode, setLinkCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      // Проверяем код в Firestore
      const linkDoc = await firebase.firestore()
        .collection('telegram_links')
        .doc(linkCode)
        .get();

      if (!linkDoc.exists) {
        alert('Неверный код или истек срок действия');
        return;
      }

      const telegramId = linkDoc.data()?.telegramId;

      // Сохраняем связь
      await firebase.firestore()
        .collection('sessions')
        .doc(userId)
        .update({
          telegramId,
          notificationsEnabled: true
        });

      // Удаляем использованный код
      await linkDoc.ref.delete();

      alert('✅ Telegram успешно подключен!');
    } catch (error) {
      console.error(error);
      alert('Ошибка подключения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>📱 Подключить Telegram</h3>
      <ol>
        <li>Открой бота: @ab_testing_trainer_bot</li>
        <li>Отправь команду /link</li>
        <li>Введи полученный код ниже</li>
      </ol>
      <input
        type="text"
        value={linkCode}
        onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
        placeholder="ABC123"
        maxLength={6}
      />
      <button onClick={handleConnect} disabled={loading || linkCode.length !== 6}>
        {loading ? 'Подключение...' : 'Подключить'}
      </button>
    </div>
  );
};
```

---

## 4. Настройка Firebase

### Шаг 4.1: Установи конфиг

```bash
firebase functions:config:set telegram.token="YOUR_BOT_TOKEN"
```

### Шаг 4.2: Установи webhook

```bash
curl https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=https://YOUR_PROJECT.cloudfunctions.net/telegramWebhook
```

### Шаг 4.3: Деплой functions

```bash
firebase deploy --only functions
```

---

## 5. Push-уведомления (типы)

### 5.1 Ежедневное напоминание
- **Время**: 18:00 MSK (настраиваемо)
- **Условие**: Квест не выполнен
- **Текст**: "Не забудь выполнить сегодняшний квест!"

### 5.2 Потеря серии
- **Триггер**: series уменьшилась
- **Текст**: "Твоя серия прервалась! Было X дней"

### 5.3 Новый челлендж
- **Время**: Понедельник 10:00
- **Текст**: "Новый челлендж недели: [название]"

### 5.4 Активность друзей
- **Триггер**: Друг выполнил квест
- **Текст**: "[Имя] ответил на 5 вопросов сегодня!"

---

## 6. Система друзей через Telegram

### Вариант 1: Автоматическое сканирование (сложно, нужны права)
**Не рекомендуется** - Telegram API не дает доступ к контактам

### Вариант 2: Через общие чаты (рекомендуется)
1. Создай группу в Telegram
2. Пригласи друзей и бота
3. Бот видит всех участников
4. Автоматически добавляет в друзья

### Вариант 3: Реферальные ссылки (самый простой)
```
https://t.me/ab_testing_trainer_bot?start=ref_USER123
```

---

## 7. Тестирование

### Шаг 7.1: Локальное тестирование

```bash
# Установи ngrok для локального webhook
ngrok http 5001

# Установи webhook на ngrok URL
curl https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=YOUR_NGROK_URL/telegramWebhook
```

### Шаг 7.2: Проверь команды

1. Отправь `/start` - должно прийти приветствие
2. Отправь `/link` - должен прийти код
3. Введи код в веб-приложении
4. Отправь `/stats` - должна показаться статистика

---

## 📋 Checklist

- [ ] Создан бот через @BotFather
- [ ] Получен и сохранен токен
- [ ] Установлены команды бота
- [ ] Создан файл `functions/src/telegramBot.ts`
- [ ] Установлены npm зависимости
- [ ] Настроен Firebase config (токен)
- [ ] Установлен webhook
- [ ] Задеплоены functions
- [ ] Создан компонент TelegramConnect
- [ ] Добавлены поля в Session type
- [ ] Протестированы все команды
- [ ] Настроено ежедневное напоминание

---

## 🚀 Следующие шаги после запуска

1. Мониторинг логов: `firebase functions:log`
2. Аналитика использования бота
3. A/B тест времени напоминаний
4. Добавление inline кнопок
5. Gamification в Telegram (встроенные игры)

---

**Время на реализацию**: 4-6 часов  
**Сложность**: Средняя  
**Результат**: Полноценный Telegram бот с push-уведомлениями

