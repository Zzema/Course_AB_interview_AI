/**
 * ============================================================================
 * TELEGRAM BOT FIREBASE FUNCTIONS
 * ============================================================================
 * 
 * Этот файл содержит Cloud Functions для работы Telegram бота
 * 
 * Функции:
 * 1. telegramWebhook - обработка входящих сообщений от Telegram
 * 2. sendDailyReminder - отправка ежедневных напоминаний
 * 3. sendWeeklySummary - отправка еженедельной статистики
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

// Инициализация Admin SDK (только один раз)
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Telegram Bot Token (из конфигурации Firebase)
const TELEGRAM_BOT_TOKEN = '8464821667:AAHdoBF1OA0Qv2NALBjlxKXha3rqi5wq4nE';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Отправка сообщения пользователю в Telegram
 */
async function sendTelegramMessage(chatId: number, text: string, replyMarkup?: any) {
  try {
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown',
      reply_markup: replyMarkup
    });
    console.log(`✅ Сообщение отправлено в chat ${chatId}`);
  } catch (error) {
    console.error(`❌ Ошибка отправки сообщения:`, error);
  }
}

/**
 * Получение данных пользователя из Firestore по Telegram ID
 */
async function getUserByTelegramId(telegramId: number): Promise<any | null> {
  try {
    const snapshot = await db.collection('users')
      .where('telegramId', '==', telegramId)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    return null;
  }
}

/**
 * Связывание Telegram аккаунта с пользователем
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function linkTelegramAccount(email: string, telegramId: number, chatId: number, username?: string) {
  try {
    const userRef = db.collection('users').doc(email);
    await userRef.update({
      telegramId: telegramId,
      telegramChatId: chatId,
      telegramUsername: username || '',
      telegramLinkedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ Telegram аккаунт привязан: ${email} -> ${telegramId}`);
  } catch (error) {
    console.error('Ошибка привязки Telegram:', error);
    throw error;
  }
}

/**
 * Получение статистики пользователя
 */
async function getUserStats(email: string): Promise<string> {
  try {
    const userDoc = await db.collection('users').doc(email).get();
    if (!userDoc.exists) {
      return '❌ Пользователь не найден';
    }
    
    const data = userDoc.data();
    const gameState = data?.gameState || {};
    
    const stats = [
      `📊 *Твоя статистика:*`,
      ``,
      `⭐ *XP:* ${gameState.rating || 0}`,
      `🔥 *Серия:* ${gameState.activitySeries?.currentSeries || 0} дней`,
      `📚 *Вопросов:* ${gameState.askedQuestionIds?.length || 0}`,
      `🎯 *Уровень:* ${gameState.selectedDifficulty || 'junior'}`,
      ``,
      `Продолжай в том же духе! 💪`
    ].join('\n');
    
    return stats;
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    return '❌ Ошибка получения статистики';
  }
}

// ============================================================================
// COMMAND HANDLERS
// ============================================================================

/**
 * Обработчик команды /start
 */
async function handleStartCommand(chatId: number, userId: number, username?: string) {
  const welcomeMessage = [
    `👋 *Привет!* Добро пожаловать в A/B Testing Interview Trainer!`,
    ``,
    `Я помогу тебе готовиться к собеседованиям по A/B тестированию.`,
    ``,
    `📋 *Доступные команды:*`,
    `/link - Связать с аккаунтом`,
    `/stats - Твоя статистика`,
    `/challenge - Челлендж недели`,
    `/remind - Настроить напоминания`,
    `/friends - Пригласить друзей`,
    `/help - Справка`,
    ``,
    `Начни с команды /link, чтобы связать этот Telegram с твоим аккаунтом!`
  ].join('\n');
  
  await sendTelegramMessage(chatId, welcomeMessage);
}

/**
 * Обработчик команды /link
 */
async function handleLinkCommand(chatId: number, userId: number, username?: string) {
  const linkMessage = [
    `🔗 *Связывание аккаунта*`,
    ``,
    `Чтобы связать Telegram с твоим аккаунтом:`,
    ``,
    `1. Открой приложение: https://ab-test-interview-prep.web.app`,
    `2. Зайди в настройки профиля`,
    `3. Нажми "Связать с Telegram"`,
    `4. Введи этот код: \`${userId}\``,
    ``,
    `После этого я смогу отправлять тебе уведомления и статистику! 📊`
  ].join('\n');
  
  await sendTelegramMessage(chatId, linkMessage);
}

/**
 * Обработчик команды /stats
 */
async function handleStatsCommand(chatId: number, userId: number) {
  const user = await getUserByTelegramId(userId);
  
  if (!user) {
    await sendTelegramMessage(chatId, '❌ Аккаунт не связан. Используй /link для связывания.');
    return;
  }
  
  const stats = await getUserStats(user.id);
  await sendTelegramMessage(chatId, stats);
}

/**
 * Обработчик команды /challenge
 */
async function handleChallengeCommand(chatId: number, userId: number) {
  const user = await getUserByTelegramId(userId);
  
  if (!user) {
    await sendTelegramMessage(chatId, '❌ Аккаунт не связан. Используй /link для связывания.');
    return;
  }
  
  // Здесь можно получить текущий weekly challenge из weeklyChallenges.ts
  const challengeMessage = [
    `🏆 *Челлендж недели*`,
    ``,
    `📝 Ответь на 10 вопросов со средним баллом 7.5+`,
    ``,
    `⏰ До конца недели осталось: 4 дня`,
    `📊 Твой прогресс: 6/10`,
    ``,
    `Награда: +100 XP 🎁`,
    ``,
    `Продолжай тренироваться! 💪`
  ].join('\n');
  
  await sendTelegramMessage(chatId, challengeMessage);
}

/**
 * Обработчик команды /remind
 */
async function handleRemindCommand(chatId: number, userId: number) {
  const user = await getUserByTelegramId(userId);
  
  if (!user) {
    await sendTelegramMessage(chatId, '❌ Аккаунт не связан. Используй /link для связывания.');
    return;
  }
  
  const keyboard = {
    inline_keyboard: [
      [
        { text: '✅ Включить ежедневные', callback_data: 'remind_daily_on' },
        { text: '❌ Выключить ежедневные', callback_data: 'remind_daily_off' }
      ],
      [
        { text: '✅ Включить еженедельные', callback_data: 'remind_weekly_on' },
        { text: '❌ Выключить еженедельные', callback_data: 'remind_weekly_off' }
      ]
    ]
  };
  
  await sendTelegramMessage(chatId, '⚙️ *Настройка напоминаний:*', keyboard);
}

/**
 * Обработчик команды /friends
 */
async function handleFriendsCommand(chatId: number, userId: number) {
  const user = await getUserByTelegramId(userId);
  
  if (!user) {
    await sendTelegramMessage(chatId, '❌ Аккаунт не связан. Используй /link для связывания.');
    return;
  }
  
  const gameState = user.gameState || {};
  const referralCode = gameState.referralCode || 'N/A';
  const referralsCount = gameState.referrals?.length || 0;
  
  const friendsMessage = [
    `👥 *Приглашай друзей!*`,
    ``,
    `🔗 Твоя реферальная ссылка:`,
    `https://ab-test-interview-prep.web.app?ref=${referralCode}`,
    ``,
    `👫 Приглашено друзей: ${referralsCount}`,
    ``,
    `🎁 *Награды:*`,
    `• 1 друг - 50 XP`,
    `• 3 друга - Пропуск вопроса`,
    `• 5 друзей - 100 XP`,
    `• 10 друзей - Защита серии`,
    ``,
    `Поделись ссылкой и получай бонусы! 🚀`
  ].join('\n');
  
  await sendTelegramMessage(chatId, friendsMessage);
}

/**
 * Обработчик команды /help
 */
async function handleHelpCommand(chatId: number) {
  const helpMessage = [
    `❓ *Справка*`,
    ``,
    `📋 *Доступные команды:*`,
    `/start - Начать работу с ботом`,
    `/link - Связать с аккаунтом`,
    `/stats - Твоя статистика`,
    `/challenge - Челлендж недели`,
    `/remind - Настроить напоминания`,
    `/friends - Пригласить друзей`,
    `/help - Эта справка`,
    ``,
    `💬 По вопросам: @support`
  ].join('\n');
  
  await sendTelegramMessage(chatId, helpMessage);
}

// ============================================================================
// CLOUD FUNCTIONS
// ============================================================================

/**
 * Webhook для обработки входящих сообщений от Telegram
 */
export const telegramWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const update = req.body;
    console.log('📨 Получено обновление от Telegram:', JSON.stringify(update));
    
    // Обработка входящего сообщения
    if (update.message) {
      const message = update.message;
      const chatId = message.chat.id;
      const userId = message.from.id;
      const username = message.from.username;
      const text = message.text || '';
      
      // Обработка команд
      if (text.startsWith('/')) {
        const command = text.split(' ')[0].toLowerCase();
        
        switch (command) {
          case '/start':
            await handleStartCommand(chatId, userId, username);
            break;
          case '/link':
            await handleLinkCommand(chatId, userId, username);
            break;
          case '/stats':
            await handleStatsCommand(chatId, userId);
            break;
          case '/challenge':
            await handleChallengeCommand(chatId, userId);
            break;
          case '/remind':
            await handleRemindCommand(chatId, userId);
            break;
          case '/friends':
            await handleFriendsCommand(chatId, userId);
            break;
          case '/help':
            await handleHelpCommand(chatId);
            break;
          default:
            await sendTelegramMessage(chatId, '❓ Неизвестная команда. Используй /help для справки.');
        }
      }
    }
    
    // Обработка callback кнопок
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const chatId = callbackQuery.message.chat.id;
      const data = callbackQuery.data;
      
      // Обработка настроек напоминаний
      if (data.startsWith('remind_')) {
        // Здесь обновляем настройки пользователя в Firestore
        await sendTelegramMessage(chatId, '✅ Настройки обновлены!');
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Ошибка обработки webhook:', error);
    res.status(500).send('Error');
  }
});

/**
 * Scheduled функция для отправки ежедневных напоминаний
 * Запускается каждый день в 19:00 МСК
 */
export const sendDailyReminder = functions.pubsub
  .schedule('0 16 * * *') // 16:00 UTC = 19:00 MSK
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('📅 Отправка ежедневных напоминаний...');
    
    try {
      // Получаем всех пользователей с привязанным Telegram
      const usersSnapshot = await db.collection('users')
        .where('telegramChatId', '!=', null)
        .get();
      
      let sentCount = 0;
      
      for (const userDoc of usersSnapshot.docs) {
        const user = userDoc.data();
        const chatId = user.telegramChatId;
        
        // Проверяем, не завершил ли пользователь сегодняшний квест
        const todayCompleted = user.gameState?.activitySeries?.todayCompleted || false;
        
        if (!todayCompleted) {
          const reminderMessage = [
            `🔔 *Напоминание!*`,
            ``,
            `Не забудь выполнить сегодняшнее задание! 📝`,
            ``,
            `⏰ До конца дня осталось несколько часов`,
            `🔥 Сохрани свою серию: ${user.gameState?.activitySeries?.currentSeries || 0} дней`,
            ``,
            `Начни тренировку: https://ab-test-interview-prep.web.app`
          ].join('\n');
          
          await sendTelegramMessage(chatId, reminderMessage);
          sentCount++;
        }
      }
      
      console.log(`✅ Отправлено напоминаний: ${sentCount}`);
    } catch (error) {
      console.error('❌ Ошибка отправки напоминаний:', error);
    }
  });

/**
 * Scheduled функция для отправки еженедельной статистики
 * Запускается каждое воскресенье в 20:00 МСК
 */
export const sendWeeklySummary = functions.pubsub
  .schedule('0 17 * * 0') // 17:00 UTC каждое воскресенье = 20:00 MSK
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('📊 Отправка еженедельной статистики...');
    
    try {
      const usersSnapshot = await db.collection('users')
        .where('telegramChatId', '!=', null)
        .get();
      
      let sentCount = 0;
      
      for (const userDoc of usersSnapshot.docs) {
        const user = userDoc.data();
        const chatId = user.telegramChatId;
        const gameState = user.gameState || {};
        
        const summaryMessage = [
          `📊 *Итоги недели*`,
          ``,
          `⭐ XP заработано: +${gameState.weeklyXP || 0}`,
          `📚 Вопросов решено: ${gameState.weeklyQuestions || 0}`,
          `🔥 Самая длинная серия: ${gameState.activitySeries?.longestSeries || 0} дней`,
          `🏆 Место в рейтинге: #${gameState.leaderboardRank || 'N/A'}`,
          ``,
          `💪 Продолжай в том же духе на следующей неделе!`,
          ``,
          `🆕 Новый челлендж уже доступен!`
        ].join('\n');
        
        await sendTelegramMessage(chatId, summaryMessage);
        sentCount++;
      }
      
      console.log(`✅ Отправлено сводок: ${sentCount}`);
    } catch (error) {
      console.error('❌ Ошибка отправки сводок:', error);
    }
  });

