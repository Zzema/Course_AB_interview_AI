/**
 * Скрипт для автоматической миграции вопросов:
 * 1. Добавляет поле modules на основе QUESTION_TO_MODULES_MAP
 * 2. Удаляет поле categories (будет вычисляемым)
 */

const fs = require('fs');
const path = require('path');

// Маппинг questionId -> modules
const QUESTION_TO_MODULES_MAP = {
  // Module 1.1
  1: ['1.1'], 41: ['1.1'], 91: ['1.1'], 111: ['1.1'], 112: ['1.1'], 113: ['1.1'],
  // Module 1.2
  3: ['1.2'], 4: ['1.2'], 23: ['1.2'], 114: ['1.2'], 115: ['1.2'], 116: ['1.2'], 117: ['1.2'],
  // Module 1.3
  22: ['1.3'], 77: ['1.3'], 118: ['1.3'], 119: ['1.3'], 120: ['1.3'], 121: ['1.3'],
  // Module 1.4
  12: ['1.4'], 31: ['1.4'], 42: ['1.4'], 56: ['1.4'], 62: ['1.4'], 66: ['1.4'],
  75: ['1.4'], 81: ['1.4'], 85: ['1.4'], 92: ['1.4'], 122: ['1.4'], 123: ['1.4'], 124: ['1.4'],
  // Module 1.5
  11: ['1.5', '2.3'], 26: ['1.5', '2.3'], 27: ['1.5'], 32: ['1.5'], 72: ['1.5'], 
  125: ['1.5'], 126: ['1.5'], 127: ['1.5'],
  // Module 2.1
  2: ['2.1'], 13: ['2.1'], 19: ['2.1'], 43: ['2.1'], 51: ['2.1'], 78: ['2.1'], 86: ['2.1'],
  101: ['2.1'], 105: ['2.1'], 128: ['2.1'], 129: ['2.1'], 130: ['2.1'],
  // Module 2.2
  34: ['2.2'], 36: ['2.2'], 45: ['2.2'], 58: ['2.2'], 69: ['2.2'], 76: ['2.2'],
  131: ['2.2'], 132: ['2.2'], 133: ['2.2'],
  // Module 2.3
  37: ['2.3'], 38: ['2.3'], 47: ['2.3'], 52: ['2.3'], 57: ['2.3'], 61: ['2.3'], 71: ['2.3'],
  83: ['2.3'], 84: ['2.3'],
  // Module 2.4
  16: ['2.4'], 17: ['2.4'], 29: ['2.4'], 48: ['2.4'], 67: ['2.4'], 74: ['2.4'],
  93: ['2.4'], 104: ['2.4'], 108: ['2.4'], 134: ['2.4'], 135: ['2.4'], 136: ['2.4'], 137: ['2.4'],
  // Module 2.5
  15: ['2.5'], 18: ['2.5'], 20: ['2.5'], 28: ['2.5'], 50: ['2.5'], 54: ['2.5'],
  64: ['2.5'], 68: ['2.5'], 79: ['2.5'], 82: ['2.5'], 88: ['2.5'], 95: ['2.5'], 99: ['2.5'],
  138: ['2.5'], 139: ['2.5'], 140: ['2.5'],
  // Module 3.1
  21: ['3.1'], 30: ['3.1'], 39: ['3.1'], 40: ['3.1'], 49: ['3.1'], 59: ['3.1'], 65: ['3.1'],
  89: ['3.1'], 94: ['3.1'], 96: ['3.1'], 110: ['3.1'], 141: ['3.1'], 142: ['3.1'], 143: ['3.1'],
  // Module 3.2
  5: ['3.2'], 6: ['3.2'], 7: ['3.2'], 8: ['3.2'], 9: ['3.2'], 14: ['3.2'], 25: ['3.2'],
  33: ['3.2'], 46: ['3.2'], 73: ['3.2'], 87: ['3.2'], 98: ['3.2'],
  // Module 3.3
  24: ['3.3'], 35: ['3.3'], 44: ['3.3'], 53: ['3.3'], 55: ['3.3'], 60: ['3.3'], 63: ['3.3'],
  70: ['3.3'], 103: ['3.3'], 144: ['3.3'], 145: ['3.3'], 146: ['3.3'], 147: ['3.3'],
  // Module 3.4
  10: ['3.4'], 97: ['3.4'], 102: ['3.4'], 109: ['3.4'], 148: ['3.4'], 149: ['3.4'],
  150: ['3.4'], 151: ['3.4'], 152: ['3.4'],
  // Module 3.5
  80: ['3.5'], 90: ['3.5'], 100: ['3.5'], 106: ['3.5'], 107: ['3.5'], 153: ['3.5'],
  154: ['3.5'], 155: ['3.5'], 156: ['3.5']
};

const filePath = path.join(__dirname, 'src', 'data', 'constants.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Начинаем миграцию вопросов...\n');

// Регулярка для поиска объектов вопросов
const questionRegex = /{\s*id:\s*(\d+),[\s\S]*?}/g;

let match;
let processedCount = 0;
let addedModulesCount = 0;

// Проходим по всем вопросам
const questions = [];
while ((match = questionRegex.exec(content)) !== null) {
  const questionId = parseInt(match[1]);
  const questionText = match[0];
  questions.push({ id: questionId, text: questionText, index: match.index });
}

console.log(`📊 Найдено ${questions.length} вопросов\n`);

// Обрабатываем в обратном порядке, чтобы не сбивались индексы
for (let i = questions.length - 1; i >= 0; i--) {
  const question = questions[i];
  const questionId = question.id;
  const modules = QUESTION_TO_MODULES_MAP[questionId];
  
  if (!modules) {
    console.warn(`⚠️  Вопрос ${questionId}: модули не найдены в маппинге!`);
    continue;
  }

  let newText = question.text;
  
  // Проверяем, есть ли уже поле modules
  if (newText.includes('modules:')) {
    console.log(`✅ Вопрос ${questionId}: modules уже добавлен`);
    processedCount++;
    continue;
  }

  // Находим последнее поле перед закрывающей скобкой
  // Добавляем modules после последнего поля
  const lastFieldMatch = newText.match(/(keyPoints:.*?(?:\[.*?\]|'.*?'))(\s*)(})/s);
  
  if (lastFieldMatch) {
    const modulesStr = `['${modules.join("', '")}']`;
    newText = newText.replace(
      lastFieldMatch[0],
      `${lastFieldMatch[1]},${lastFieldMatch[2]}modules: ${modulesStr}${lastFieldMatch[2]}${lastFieldMatch[3]}`
    );
    
    // Заменяем в content
    content = content.slice(0, question.index) + newText + content.slice(question.index + question.text.length);
    
    console.log(`✅ Вопрос ${questionId}: добавлено modules: ${modulesStr}`);
    addedModulesCount++;
  } else {
    console.warn(`⚠️  Вопрос ${questionId}: не удалось найти место для вставки`);
  }
  
  processedCount++;
}

// Сохраняем файл
fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n✨ Миграция завершена!`);
console.log(`📊 Обработано вопросов: ${processedCount}`);
console.log(`➕ Добавлено modules: ${addedModulesCount}`);
console.log(`\n💾 Файл сохранен: ${filePath}`);

