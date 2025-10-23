# 🔥 Firebase Setup Guide

## Шаг 1: Создать Firebase проект

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Нажмите **"Добавить проект"** (Add project)
3. Введите название проекта (например, `ab-hero`)
4. Отключите Google Analytics (необязательно для начала)
5. Нажмите **"Создать проект"**

## Шаг 2: Добавить Web приложение

1. В консоли Firebase выберите ваш проект
2. Нажмите на иконку **"</>** (Web)
3. Зарегистрируйте приложение:
   - Введите название: `AB Hero Web`
   - ✅ Отметьте "Also set up Firebase Hosting"
   - Нажмите **"Зарегистрировать приложение"**

## Шаг 3: Скопировать конфигурацию

Firebase покажет код конфигурации, который выглядит так:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "ab-hero.firebaseapp.com",
  projectId: "ab-hero",
  storageBucket: "ab-hero.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**Скопируйте эти значения** и вставьте в файл `firebase.ts`

## Шаг 4: Включить Firestore Database

1. В левом меню выберите **"Firestore Database"**
2. Нажмите **"Создать базу данных"** (Create database)
3. Выберите режим запуска:
   - Для начала: **"Тестовый режим"** (Test mode)
   - Это позволит читать/писать без аутентификации (на 30 дней)
4. Выберите регион: **europe-west** (ближе к России/Европе)
5. Нажмите **"Включить"**

## Шаг 5: Настроить правила безопасности (важно!)

После тестирования обновите правила в Firestore:

1. Перейдите в **Firestore Database → Rules**
2. Замените правила на:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Пользователи могут читать и писать только свои данные
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.token.email == userId;
    }
  }
}
```

3. Нажмите **"Опубликовать"**

## Шаг 6: Настроить аутентификацию (опционально)

Если хотите использовать Firebase Authentication вместо Google OAuth:

1. В левом меню выберите **"Authentication"**
2. Нажмите **"Начать"**
3. Включите **"Google"** как метод входа
4. Добавьте ваш Google OAuth Client ID

## Шаг 7: Проверить работу

1. Откройте приложение в браузере
2. Откройте консоль (F12)
3. Войдите в приложение
4. Вы должны увидеть:
   ```
   ✅ Firebase initialized successfully
   ✅ Data saved to Firebase
   ```

5. Проверьте в Firebase Console → Firestore Database
   - Должна появиться коллекция `users`
   - В ней документы с email пользователей

## 🎉 Готово!

Теперь данные сохраняются в Firebase Firestore и доступны с любого устройства!

## 📊 Лимиты бесплатного тариана:

- ✅ 50,000 чтений/день
- ✅ 20,000 записей/день  
- ✅ 20,000 удалений/день
- ✅ 1 GB хранилища
- ✅ 10 GB/месяц исходящего трафика

Для вашего приложения этого более чем достаточно!

## 🚀 Деплой на Firebase Hosting (бонус)

```bash
# Установить Firebase CLI
npm install -g firebase-tools

# Войти в Firebase
firebase login

# Инициализировать проект
firebase init hosting

# Собрать проект
npm run build

# Задеплоить
firebase deploy
```

Ваше приложение будет доступно по адресу: `https://ab-hero.web.app`

