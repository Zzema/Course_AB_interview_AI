/**
 * Скрипт для удаления поля categories из всех вопросов
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'constants.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🗑️  Удаляем поле categories из всех вопросов...\n');

// Удаляем строки с categories
content = content.replace(/\s*categories:\s*\[.*?\],\s*\n/g, '\n');

// Сохраняем файл
fs.writeFileSync(filePath, content, 'utf8');

console.log('✨ Поле categories успешно удалено!');
console.log(`💾 Файл сохранен: ${filePath}`);

