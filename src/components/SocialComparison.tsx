import React from 'react';
import { GameState } from '../types';

interface SocialComparisonProps {
  gameState: GameState;
}

/**
 * Компонент социального сравнения
 * Показывает, как пользователь выглядит на фоне других (псевдо-данные)
 * 
 * ЛОГИКА:
 * - Генерируем "виртуальную" позицию на основе реальных метрик
 * - Используем процентили для мотивации
 * - Все данные локальные, без реального бэкенда
 */
const SocialComparison: React.FC<SocialComparisonProps> = ({ gameState }) => {
  // Рассчитываем "виртуальные" метрики для сравнения
  const metrics = calculateSocialMetrics(gameState);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>📊 Твоя позиция</span>
        <span style={styles.subtitle}>относительно других учеников</span>
      </div>

      <div style={styles.metricsGrid}>
        {/* Серия активности */}
        <MetricCard
          icon="🔥"
          label="Серия активности"
          value={`${gameState.activitySeries?.currentSeries || 0} дней`}
          percentile={metrics.seriesPercentile}
          comparison={metrics.seriesComparison}
        />

        {/* Всего вопросов */}
        <MetricCard
          icon="📚"
          label="Всего вопросов"
          value={`${gameState.questionAttempts?.length || 0}`}
          percentile={metrics.questionsPercentile}
          comparison={metrics.questionsComparison}
        />

        {/* Опыт (рейтинг) */}
        <MetricCard
          icon="⭐"
          label="Общий опыт"
          value={`${gameState.rating}`}
          percentile={metrics.xpPercentile}
          comparison={metrics.xpComparison}
        />

        {/* Средняя оценка */}
        <MetricCard
          icon="🎯"
          label="Средняя оценка"
          value={`${metrics.avgScore.toFixed(1)}/10`}
          percentile={metrics.scorePercentile}
          comparison={metrics.scoreComparison}
        />
      </div>

      {/* Мотивационное сообщение */}
      <div style={styles.motivation}>
        {getMotivationalMessage(metrics)}
      </div>
    </div>
  );
};

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  percentile: number;
  comparison: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, percentile, comparison }) => {
  const color = getPercentileColor(percentile);
  
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricIcon}>{icon}</div>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.metricValue}>{value}</div>
      <div style={{ ...styles.metricPercentile, color }}>
        Топ {percentile}%
      </div>
      <div style={styles.metricComparison}>{comparison}</div>
    </div>
  );
};

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

interface SocialMetrics {
  seriesPercentile: number;
  seriesComparison: string;
  questionsPercentile: number;
  questionsComparison: string;
  xpPercentile: number;
  xpComparison: string;
  avgScore: number;
  scorePercentile: number;
  scoreComparison: string;
}

/**
 * Рассчитывает "виртуальные" социальные метрики
 * Использует эвристики для определения положения пользователя
 */
function calculateSocialMetrics(gameState: GameState): SocialMetrics {
  const currentSeries = gameState.activitySeries?.currentSeries || 0;
  const totalQuestions = gameState.questionAttempts?.length || 0;
  const rating = gameState.rating;
  const attempts = gameState.questionAttempts || [];
  
  // Средняя оценка
  const avgScore = attempts.length > 0
    ? attempts.reduce((sum, a) => sum + a.feedback.overallScore, 0) / attempts.length
    : 0;

  // === СЕРИЯ АКТИВНОСТИ ===
  // Логика: большинство бросают после 1-2 дней
  let seriesPercentile: number;
  if (currentSeries === 0) seriesPercentile = 70;
  else if (currentSeries <= 2) seriesPercentile = 50;
  else if (currentSeries <= 5) seriesPercentile = 30;
  else if (currentSeries <= 10) seriesPercentile = 15;
  else if (currentSeries <= 20) seriesPercentile = 5;
  else seriesPercentile = 1;

  const seriesComparison = 
    currentSeries === 0 ? 'Начни серию уже сегодня!' :
    currentSeries <= 2 ? 'Продолжай в том же духе!' :
    currentSeries <= 5 ? 'Отличная дисциплина!' :
    currentSeries <= 10 ? 'Ты среди самых упорных!' :
    'Ты настоящий профи! 🏆';

  // === КОЛИЧЕСТВО ВОПРОСОВ ===
  let questionsPercentile: number;
  if (totalQuestions === 0) questionsPercentile = 100;
  else if (totalQuestions <= 5) questionsPercentile = 80;
  else if (totalQuestions <= 20) questionsPercentile = 60;
  else if (totalQuestions <= 50) questionsPercentile = 40;
  else if (totalQuestions <= 100) questionsPercentile = 20;
  else if (totalQuestions <= 200) questionsPercentile = 10;
  else questionsPercentile = 3;

  const questionsComparison =
    totalQuestions === 0 ? 'Ответь на первый вопрос!' :
    totalQuestions <= 5 ? 'Отличное начало!' :
    totalQuestions <= 20 ? 'Ты на правильном пути!' :
    totalQuestions <= 50 ? 'Впечатляющий прогресс!' :
    totalQuestions <= 100 ? 'Ты среди лучших!' :
    'Легенда подготовки! 🎓';

  // === ОПЫТ (РЕЙТИНГ) ===
  // Зависит от количества вопросов и качества ответов
  const expectedXP = totalQuestions * 15; // примерно 15 XP за вопрос
  let xpPercentile: number;
  if (rating < expectedXP * 0.3) xpPercentile = 90;
  else if (rating < expectedXP * 0.6) xpPercentile = 70;
  else if (rating < expectedXP * 0.9) xpPercentile = 50;
  else if (rating < expectedXP * 1.2) xpPercentile = 30;
  else if (rating < expectedXP * 1.5) xpPercentile = 15;
  else xpPercentile = 5;

  const xpComparison =
    rating <= 0 ? 'Начни зарабатывать опыт!' :
    rating < 100 ? 'Неплохое начало!' :
    rating < 500 ? 'Ты набираешь обороты!' :
    rating < 1000 ? 'Впечатляющий результат!' :
    rating < 2000 ? 'Ты мастер! ⚡' :
    'Абсолютная легенда! 👑';

  // === СРЕДНЯЯ ОЦЕНКА ===
  let scorePercentile: number;
  if (avgScore < 4) scorePercentile = 95;
  else if (avgScore < 5) scorePercentile = 80;
  else if (avgScore < 6) scorePercentile = 60;
  else if (avgScore < 7) scorePercentile = 40;
  else if (avgScore < 8) scorePercentile = 25;
  else if (avgScore < 9) scorePercentile = 10;
  else scorePercentile = 3;

  const scoreComparison =
    avgScore < 5 ? 'Есть куда расти!' :
    avgScore < 6 ? 'Хорошая база!' :
    avgScore < 7 ? 'Уверенный средний уровень!' :
    avgScore < 8 ? 'Отличное качество ответов!' :
    avgScore < 9 ? 'Ты среди лучших! 💎' :
    'Идеальные ответы! 🏆';

  return {
    seriesPercentile,
    seriesComparison,
    questionsPercentile,
    questionsComparison,
    xpPercentile,
    xpComparison,
    avgScore,
    scorePercentile,
    scoreComparison
  };
}

function getPercentileColor(percentile: number): string {
  if (percentile <= 5) return '#4caf50'; // зеленый - топ 5%
  if (percentile <= 20) return '#2196f3'; // синий - топ 20%
  if (percentile <= 50) return '#ff9800'; // оранжевый - средний
  return '#9e9e9e'; // серый - ниже среднего
}

function getMotivationalMessage(metrics: SocialMetrics): string {
  const bestPercentile = Math.min(
    metrics.seriesPercentile,
    metrics.questionsPercentile,
    metrics.xpPercentile,
    metrics.scorePercentile
  );

  if (bestPercentile <= 5) {
    return '🏆 Ты в элитной группе! Так держать!';
  } else if (bestPercentile <= 20) {
    return '⭐ Ты в топе! Еще немного и ты станешь легендой!';
  } else if (bestPercentile <= 50) {
    return '💪 Хороший прогресс! Продолжай заниматься регулярно!';
  } else {
    return '🎯 Впереди много возможностей! Начни с ежедневного задания!';
  }
}

// ============================================================================
// СТИЛИ
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    marginBottom: '2rem'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.25rem'
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  metricCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '1rem',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.05)'
  },
  metricIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '0.25rem',
    fontWeight: '500'
  },
  metricValue: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  metricPercentile: {
    fontSize: '0.875rem',
    fontWeight: 'bold',
    marginBottom: '0.25rem'
  },
  metricComparison: {
    fontSize: '0.75rem',
    color: '#6b7280',
    fontStyle: 'italic'
  },
  motivation: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '1rem',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '0.95rem',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  }
};

export default SocialComparison;

