# 🎮 Геймифицированная статистика - Компоненты

Эта папка содержит компоненты для геймифицированного отображения статистики пользователя.

## Компоненты

### `LevelBadge.tsx`
Бейдж уровня пользователя (Junior/Mid/Senior/Staff).

**Props:**
- `level`: 'junior' | 'mid' | 'senior' | 'staff'
- `compact?`: boolean - компактная версия

**Пример:**
```tsx
<LevelBadge level="mid" />
```

---

### `XPProgressBar.tsx`
Прогресс-бар опыта до следующего уровня.

**Props:**
- `currentXP`: number - текущий опыт
- `nextLevelXP`: number - опыт для следующего уровня
- `nextLevelName`: string - название следующего уровня

**Пример:**
```tsx
<XPProgressBar
    currentXP={1856}
    nextLevelXP={2000}
    nextLevelName="SENIOR ANALYST"
/>
```

---

### `QuestCard.tsx`
Карточка квеста (задачи для пользователя).

**Props:**
- `quest`: Quest - объект квеста

**Quest interface:**
```typescript
interface Quest {
    id: string;
    title: string;
    description: string;
    progress: { current: number; total: number };
    reward: number;
    completed: boolean;
}
```

**Пример:**
```tsx
<QuestCard quest={{
    id: 'quest-1',
    title: 'Ответь на 50 вопросов',
    description: 'Прогресс: 47/50',
    progress: { current: 47, total: 50 },
    reward: 200,
    completed: false
}} />
```

---

### `AbilityCard.tsx`
Карточка способности/навыка (представляет категорию знаний).

**Props:**
- `name`: string - название способности
- `level`: number - уровень (1-10)
- `score`: number - процент владения (0-100)
- `description?`: string - описание

**Пример:**
```tsx
<AbilityCard
    name="Основы А/Б"
    level={8}
    score={85}
    description="Отличное понимание базовых принципов"
/>
```

---

### `SkillItem.tsx`
Элемент списка навыков (для топ/слабых навыков).

**Props:**
- `rank`: number - ранг (#1, #2, ...)
- `name`: string - название навыка
- `score`: number - оценка (0-100)
- `isWeak?`: boolean - слабый навык (красный) или сильный (зеленый)

**Пример:**
```tsx
<SkillItem
    rank={1}
    name="Дизайн эксперимента"
    score={92}
    isWeak={false}
/>
```

---

## Утилиты

### `levelUtils.ts`
Вспомогательные функции для работы с уровнями и XP.

**Функции:**

#### `calculateLevel(xp: number): LevelData`
Рассчитывает текущий уровень и прогресс на основе XP.

**Возвращает:**
```typescript
interface LevelData {
    currentLevel: LevelName;
    currentLevelName: string;
    nextLevel: LevelName | null;
    nextLevelName: string;
    currentXP: number;
    nextLevelXP: number;
    progress: number;
    numericLevel: number;
}
```

**Пример:**
```typescript
const levelData = calculateLevel(1856);
// {
//   currentLevel: 'mid',
//   currentLevelName: 'MIDDLE ANALYST',
//   nextLevel: 'senior',
//   nextLevelName: 'SENIOR ANALYST',
//   currentXP: 1856,
//   nextLevelXP: 2000,
//   progress: 72,
//   numericLevel: 19
// }
```

#### `scoreToLevel(score: number): number`
Конвертирует процент (0-100) в уровень (1-10).

**Пример:**
```typescript
scoreToLevel(85) // 9
```

#### `getAbilityDescription(score: number): string`
Возвращает описание уровня владения на основе оценки.

**Пример:**
```typescript
getAbilityDescription(92) // "Мастер! Отличное понимание темы 🌟"
```

---

## Уровни и XP

### Таблица уровней
| Уровень | Название | Min XP | Max XP |
|---------|----------|--------|--------|
| Junior  | JUNIOR ANALYST | 0 | 500 |
| Mid     | MIDDLE ANALYST | 500 | 2000 |
| Senior  | SENIOR ANALYST | 2000 | 5000 |
| Staff   | STAFF ANALYST | 5000 | ∞ |

### Цвета уровней
- **Junior**: Серый градиент
- **Mid**: Синий/Фиолетовый градиент
- **Senior**: Фиолетовый градиент
- **Staff**: Золотой градиент

---

## Использование в главном компоненте

См. `StatisticsScreenGamified.tsx` для примера интеграции всех компонентов.

---

## Стилизация

Все компоненты используют inline styles для удобства и переносимости.

### Цветовая палитра
```css
--bg-primary: #0f0f23;
--bg-secondary: #1a1a3e;
--primary: #6366f1;
--secondary: #8b5cf6;
--success: #10b981;
--warning: #f59e0b;
--danger: #ef4444;
```

### Градиенты для progress bar
- **Высокий (>75%)**: Зеленый → Cyan
- **Средний (50-75%)**: Оранжевый → Желтый
- **Низкий (<50%)**: Красный → Оранжевый
- **Мастер (>90%)**: Фиолетовый

---

## Адаптивность

Компоненты автоматически адаптируются к размеру экрана через props `isMobile` в главном компоненте.

**Breakpoint:** 768px

---

**Создано:** 2025-10-23

