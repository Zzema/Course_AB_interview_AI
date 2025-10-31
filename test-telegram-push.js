/**
 * Простой скрипт для тестирования отправки Telegram пушей
 * Можно запустить локально без Firebase Functions
 */

const axios = require('axios');

const TELEGRAM_BOT_TOKEN = '8464821667:AAHdoBF1OA0Qv2NALBjlxKXha3rqi5wq4nE';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

/**
 * Отправка тестового сообщения
 * @param {number} chatId - ID чата Telegram (получи через /start)
 */
async function sendTestMessage(chatId) {
  try {
    const message = [
      `🔔 *Тестовое напоминание!*`,
      ``,
      `Не забудь выполнить сегодняшнее задание! 📝`,
      ``,
      `⏰ До конца дня осталось несколько часов`,
      `🔥 Сохрани свою серию!`,
      ``,
      `Начни тренировку: https://course-ab-interview.web.app`
    ].join('\n');
    
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    });
    
    console.log('✅ Сообщение успешно отправлено!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Ошибка отправки:', error.response?.data || error.message);
  }
}

/**
 * Получение информации о боте
 */
async function getBotInfo() {
  try {
    const response = await axios.get(`${TELEGRAM_API_URL}/getMe`);
    console.log('🤖 Информация о боте:');
    console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    console.error('❌ Ошибка получения информации о боте:', error.message);
  }
}

/**
 * Получение обновлений (последние сообщения)
 */
async function getUpdates() {
  try {
    const response = await axios.get(`${TELEGRAM_API_URL}/getUpdates`);
    console.log('📨 Последние обновления:');
    console.log(JSON.stringify(response.data.result, null, 2));
    
    // Извлекаем chat_id из последнего сообщения
    if (response.data.result.length > 0) {
      const lastMessage = response.data.result[response.data.result.length - 1];
      const chatId = lastMessage.message?.chat?.id;
      if (chatId) {
        console.log('\n🆔 Твой Chat ID:', chatId);
        console.log('📝 Используй этот ID для отправки сообщений');
        return chatId;
      }
    } else {
      console.log('\n⚠️  Нет сообщений. Отправь /start боту, чтобы получить chat_id');
    }
  } catch (error) {
    console.error('❌ Ошибка получения обновлений:', error.message);
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('🚀 Telegram Bot Test Script\n');
  
  // 1. Проверяем бота
  await getBotInfo();
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 2. Получаем обновления и chat_id
  const chatId = await getUpdates();
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 3. Если нашли chat_id, отправляем тестовое сообщение
  if (chatId) {
    console.log('📤 Отправляю тестовое сообщение...\n');
    await sendTestMessage(chatId);
  } else {
    console.log('⚠️  Инструкция:');
    console.log('1. Найди бота в Telegram');
    console.log('2. Отправь /start');
    console.log('3. Запусти этот скрипт снова');
  }
}

// Проверяем аргументы командной строки
if (process.argv[2]) {
  const chatId = parseInt(process.argv[2]);
  console.log(`📤 Отправка сообщения в чат ${chatId}...\n`);
  sendTestMessage(chatId);
} else {
  main();
}

