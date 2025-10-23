# 🚀 Деплой на Firebase Hosting

Простой и быстрый способ задеплоить приложение.

---

## 📋 Пошаговая инструкция

### Шаг 1: Авторизация в Firebase

```bash
firebase login
```

Откроется браузер - войдите под вашим Google аккаунтом (тем же, что использовали для Firebase Console).

---

### Шаг 2: Сборка приложения

```bash
npm run build
```

Это создаст production-версию в папке `dist/`

---

### Шаг 3: Деплой

```bash
firebase deploy --only hosting
```

**Готово!** 🎉

Ваше приложение будет доступно по адресу:
```
https://course-ab-interview.web.app
```
или
```
https://course-ab-interview.firebaseapp.com
```

---

## 🔄 Обновление приложения

Каждый раз, когда нужно обновить:

```bash
npm run build
firebase deploy --only hosting
```

---

## 🔍 Полезные команды

### Просмотр перед деплоем
```bash
npm run build
firebase serve
```
Откроется на http://localhost:5000

### Просмотр логов
```bash
firebase hosting:channel:list
```

### Откат к предыдущей версии
```bash
firebase hosting:rollback
```

---

## 🌐 Добавление собственного домена

1. Firebase Console → **Hosting** → **Add custom domain**
2. Введите ваш домен (например, `ab-hero.com`)
3. Добавьте DNS записи (Firebase покажет какие)
4. SSL настроится автоматически

---

## 🆓 Бесплатные лимиты

- **Storage**: 10 GB
- **Transfer**: 360 MB/день (~10 GB/месяц)
- **SSL**: Автоматический HTTPS
- **CDN**: По всему миру

Более чем достаточно для вашего приложения!

---

## ⚙️ Что уже настроено

- ✅ `firebase.json` - конфигурация хостинга
- ✅ `.firebaserc` - привязка к проекту `course-ab-interview`
- ✅ SPA routing (все маршруты → index.html)
- ✅ Cache headers для оптимизации
- ✅ Firestore rules

---

**Готово к деплою!** 🚀

Просто выполните три команды выше.

