"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWeeklySummary = exports.sendDailyReminder = exports.telegramWebhook = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
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
async function sendTelegramMessage(chatId, text, replyMarkup) {
    try {
        await axios_1.default.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown',
            reply_markup: replyMarkup
        });
        console.log(`✅ Сообщение отправлено в chat ${chatId}`);
    }
    catch (error) {
        console.error(`❌ Ошибка отправки сообщения:`, error);
    }
}
/**
 * Получение данных пользователя из Firestore по Telegram ID
 */
async function getUserByTelegramId(telegramId) {
    try {
        const snapshot = await db.collection('users')
            .where('telegramId', '==', telegramId)
            .limit(1)
            .get();
        if (snapshot.empty) {
            return null;
        }
        return Object.assign({ id: snapshot.docs[0].id }, snapshot.docs[0].data());
    }
    catch (error) {
        console.error('Ошибка получения пользователя:', error);
        return null;
    }
}
/**
 * Связывание Telegram аккаунта с пользователем
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function linkTelegramAccount(email, telegramId, chatId, username) {
    try {
        const userRef = db.collection('users').doc(email);
        await userRef.update({
            telegramId: telegramId,
            telegramChatId: chatId,
            telegramUsername: username || '',
            telegramLinkedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`✅ Telegram аккаунт привязан: ${email} -> ${telegramId}`);
    }
    catch (error) {
        console.error('Ошибка привязки Telegram:', error);
        throw error;
    }
}
/**
 * Получение статистики пользователя
 */
async function getUserStats(email) {
    var _a, _b;
    try {
        const userDoc = await db.collection('users').doc(email).get();
        if (!userDoc.exists) {
            return '❌ Пользователь не найден';
        }
        const data = userDoc.data();
        const gameState = (data === null || data === void 0 ? void 0 : data.gameState) || {};
        const stats = [
            `📊 *Твоя статистика:*`,
            ``,
            `⭐ *XP:* ${gameState.rating || 0}`,
            `🔥 *Серия:* ${((_a = gameState.activitySeries) === null || _a === void 0 ? void 0 : _a.currentSeries) || 0} дней`,
            `📚 *Вопросов:* ${((_b = gameState.askedQuestionIds) === null || _b === void 0 ? void 0 : _b.length) || 0}`,
            `🎯 *Уровень:* ${gameState.selectedDifficulty || 'junior'}`,
            ``,
            `Продолжай в том же духе! 💪`
        ].join('\n');
        return stats;
    }
    catch (error) {
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
async function handleStartCommand(chatId, userId, username) {
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
async function handleLinkCommand(chatId, userId, username) {
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
async function handleStatsCommand(chatId, userId) {
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
async function handleChallengeCommand(chatId, userId) {
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
async function handleRemindCommand(chatId, userId) {
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
async function handleFriendsCommand(chatId, userId) {
    var _a;
    const user = await getUserByTelegramId(userId);
    if (!user) {
        await sendTelegramMessage(chatId, '❌ Аккаунт не связан. Используй /link для связывания.');
        return;
    }
    const gameState = user.gameState || {};
    const referralCode = gameState.referralCode || 'N/A';
    const referralsCount = ((_a = gameState.referrals) === null || _a === void 0 ? void 0 : _a.length) || 0;
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
async function handleHelpCommand(chatId) {
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
exports.telegramWebhook = functions.https.onRequest(async (req, res) => {
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
    }
    catch (error) {
        console.error('❌ Ошибка обработки webhook:', error);
        res.status(500).send('Error');
    }
});
/**
 * Scheduled функция для отправки ежедневных напоминаний
 * Запускается каждый день в 19:00 МСК
 */
exports.sendDailyReminder = functions.pubsub
    .schedule('0 16 * * *') // 16:00 UTC = 19:00 MSK
    .timeZone('UTC')
    .onRun(async (context) => {
    var _a, _b, _c, _d;
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
            const todayCompleted = ((_b = (_a = user.gameState) === null || _a === void 0 ? void 0 : _a.activitySeries) === null || _b === void 0 ? void 0 : _b.todayCompleted) || false;
            if (!todayCompleted) {
                const reminderMessage = [
                    `🔔 *Напоминание!*`,
                    ``,
                    `Не забудь выполнить сегодняшнее задание! 📝`,
                    ``,
                    `⏰ До конца дня осталось несколько часов`,
                    `🔥 Сохрани свою серию: ${((_d = (_c = user.gameState) === null || _c === void 0 ? void 0 : _c.activitySeries) === null || _d === void 0 ? void 0 : _d.currentSeries) || 0} дней`,
                    ``,
                    `Начни тренировку: https://ab-test-interview-prep.web.app`
                ].join('\n');
                await sendTelegramMessage(chatId, reminderMessage);
                sentCount++;
            }
        }
        console.log(`✅ Отправлено напоминаний: ${sentCount}`);
    }
    catch (error) {
        console.error('❌ Ошибка отправки напоминаний:', error);
    }
});
/**
 * Scheduled функция для отправки еженедельной статистики
 * Запускается каждое воскресенье в 20:00 МСК
 */
exports.sendWeeklySummary = functions.pubsub
    .schedule('0 17 * * 0') // 17:00 UTC каждое воскресенье = 20:00 MSK
    .timeZone('UTC')
    .onRun(async (context) => {
    var _a;
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
                `🔥 Самая длинная серия: ${((_a = gameState.activitySeries) === null || _a === void 0 ? void 0 : _a.longestSeries) || 0} дней`,
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
    }
    catch (error) {
        console.error('❌ Ошибка отправки сводок:', error);
    }
});
//# sourceMappingURL=telegram-bot.js.map