# ⚡ Быстрое тестирование изменений

## 🎯 Что проверить прямо сейчас:

### 1. localhost:3000 уже запущен! ✅

Открой: **http://localhost:3000**

---

## 🐛 БАГИ (проверь первым делом):

### ✅ Серия активности
1. Открой **Статистика** → секция **"Серия активности"**
2. **Проверь**: Огоньки идут **слева направо** (старые → новые)
3. **Проверь**: Последний огонек = сегодня (27 октября)
4. **Проверь**: Есть награда за 3 дня серии

### ✅ Лидерборд
1. Открой **Статистика** → **Leaderboard**
2. **Проверь**: По умолчанию выбрано **"Все уровни"** (не Mid/Senior)

### ✅ Модули - счетчик
1. **Структурированное обучение** → выбери модуль 1.1
2. Нажми **"Практика"**
3. **Проверь**: Наверху показывает **"1/6"** (не 1/26)
4. Ответь на вопрос
5. **Проверь**: Счетчик обновился **"2/6"**

---

## 🚀 НОВЫЕ ФУНКЦИИ:

### 1. Social Share (📱 Поделиться)
**Как проверить**:
1. Ответь на **5 вопросов подряд** ИЛИ получи балл **8+**
2. После ответа должна появиться кнопка **"📱 Поделиться результатом"**
3. Нажми на кнопку
4. **Проверь**: Появилось модальное окно
5. **Проверь**: Есть кнопки Telegram, LinkedIn, Facebook, Twitter, VK
6. **Проверь**: Реферальная ссылка с кнопкой "Скопировать"
7. Нажми **"Скопировать"**
8. **Проверь**: Текст скопирован в буфер обмена

### 2. Weekly Challenge Widget
**Как проверить**:
1. В коде добавь в `GameScreen` или `StatisticsScreen`:
```typescript
import WeeklyChallengeWidget from './WeeklyChallengeWidget';

// В render:
<WeeklyChallengeWidget gameState={gameState} />
```
2. **Проверь**: Виджет отображается
3. **Проверь**: Прогресс-бар работает
4. **Проверь**: Показывает 8 челленджей (ротация по неделям)

### 3. Реферальная система
**Как проверить**:
1. Открой DevTools Console
2. Перейди по ссылке: `http://localhost:3000?ref=TEST123`
3. **Проверь в консоли**: `📎 Реферальный код найден: TEST123`
4. **Проверь localStorage**: `pendingReferralCode = TEST123`
5. Создай новый аккаунт (или сброс)
6. **Проверь**: В gameState появились поля `referralCode`, `referredBy`
7. Открой **Статистика** → **Квесты**
8. **Проверь**: Есть квест **"Пригласи друзей"**

---

## 🤖 TELEGRAM BOT:

### Быстрый тест (локально):
```bash
# Консоль 1: Functions эмулятор
cd functions
npm install
npm run serve

# Консоль 2: Test webhook
curl -X POST http://localhost:5001/YOUR_PROJECT/us-central1/telegramWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "chat": {"id": 123456},
      "from": {"id": 123456, "username": "test"},
      "text": "/start"
    }
  }'
```

### Деплой и реальный тест:
```bash
# 1. Деплой
cd functions
firebase deploy --only functions

# 2. Получи URL функции из консоли

# 3. Настрой webhook
curl -X POST "https://api.telegram.org/bot8464821667:AAHdoBF1OA0Qv2NALBjlxKXha3rqi5wq4nE/setWebhook" \
  -d "url=YOUR_FUNCTION_URL"

# 4. Найди бота в Telegram и отправь /start
```

---

## 🔍 DEBUG (если что-то не работает):

### Серия активности:
```javascript
// В консоли браузера:
const currentDate = new Date().toISOString().split('T')[0];
console.log('Today (MSK):', currentDate);
console.log('Series:', gameState.activitySeries);
```

### Модули - счетчик:
```javascript
// Смотри в консоли логи "Header Debug"
// Должны быть moduleFilter и правильные currentLevelQuestionsIds
```

### Social Share:
```javascript
// В консоли после ответа:
console.log('Question count:', gameState.askedQuestionIds.length);
console.log('Should show share:', questionCount % 5 === 0 || score >= 8);
```

### Реферальная система:
```javascript
// В консоли:
console.log('GameState referral:', {
  referralCode: gameState.referralCode,
  referredBy: gameState.referredBy,
  referrals: gameState.referrals
});
```

---

## ✅ ЧЕКЛИСТ:

- [ ] Серия активности: огоньки слева направо ✅
- [ ] Серия активности: награда за 3 дня ✅
- [ ] Лидерборд: предвыбрано "Все" ✅
- [ ] Модули: счетчик X/6 (не X/26) ✅
- [ ] Social Share: кнопка появляется ✅
- [ ] Social Share: реферальная ссылка копируется ✅
- [ ] Реферальный код: обрабатывается из URL ✅
- [ ] Реферальный квест: появляется в списке ✅
- [ ] Weekly Challenge: виджет работает ⏳
- [ ] Telegram Bot: /start отвечает ⏳

---

## 🚀 ДЕПЛОЙ (когда все протестировано):

```bash
# 1. Build
npm run build

# 2. Деплой hosting
firebase deploy --only hosting

# 3. Деплой functions
cd functions
firebase deploy --only functions

# 4. Проверка на проде
# https://ab-test-interview-prep.web.app
```

---

## 📱 Тест на мобильном:

1. Открой на телефоне (через QR или прямую ссылку)
2. Проверь серию активности (особенно важно!)
3. Проверь Social Share (кнопки должны работать)
4. Проверь модули (скролл, счетчик)

---

**Удачного тестирования! 🎉**

Если что-то не работает - смотри логи в консоли браузера или пиши мне!

