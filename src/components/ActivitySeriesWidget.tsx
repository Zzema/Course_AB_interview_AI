/**
 * ============================================================================
 * ACTIVITY SERIES WIDGET
 * ============================================================================
 * Компонент для отображения текущей серии активности пользователя
 * 
 * Функционал:
 * - Отображение текущей серии дней
 * - Календарь последних 7 дней (визуализация активности)
 * - Прогресс до следующего milestone
 * - Рекорд серии
 * - Компактный режим для шапки
 */

import React from 'react';
import { ActivitySeries } from '../types';
import { getNextMilestone, getCurrentDateString, getDaysBetween } from '../lib/activitySeriesManager';

interface ActivitySeriesWidgetProps {
  series: ActivitySeries;
  compact?: boolean; // Компактный режим для шапки GameScreen
}

const ActivitySeriesWidget: React.FC<ActivitySeriesWidgetProps> = ({ series, compact = false }) => {
  const nextMilestone = getNextMilestone(series);
  const currentDate = getCurrentDateString();
  
  // Генерируем данные для календаря последних 7 дней
  const generateLast7Days = () => {
    const days = [];
    const today = new Date(currentDate + 'T00:00:00');
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Проверяем, был ли этот день в серии
      const daysDiff = getDaysBetween(dateString, series.lastActiveDate);
      const isActive = daysDiff <= series.currentSeries && 
                      (dateString <= series.lastActiveDate);
      
      days.push({
        date: dateString,
        isActive,
        isToday: dateString === currentDate
      });
    }
    
    return days;
  };
  
  const last7Days = generateLast7Days();
  
  // ========================================
  // КОМПАКТНЫЙ РЕЖИМ (для шапки)
  // ========================================
  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(255, 107, 36, 0.15)',
        border: '1px solid rgba(255, 107, 36, 0.3)',
        borderRadius: '8px',
        padding: '0.5rem 0.75rem'
      }}>
        <span style={{ fontSize: '1.2rem' }}>🔥</span>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.1rem'
        }}>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#FF6B24'
          }}>
            {series.currentSeries} {series.currentSeries === 1 ? 'день' : 'дней'}
          </span>
          {nextMilestone && (
            <span style={{
              fontSize: '0.65rem',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              до {nextMilestone.days}: {nextMilestone.days - series.currentSeries}
            </span>
          )}
        </div>
      </div>
    );
  }
  
  // ========================================
  // ПОЛНЫЙ РЕЖИМ (для статистики)
  // ========================================
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      {/* Заголовок */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🔥 Серия активности
        </h3>
        <div style={{
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          Рекорд: {series.longestSeries} {series.longestSeries === 1 ? 'день' : 'дней'}
        </div>
      </div>
      
      {/* Текущая серия */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          fontSize: '3rem',
          filter: 'drop-shadow(0 0 10px rgba(255, 107, 36, 0.5))'
        }}>
          🔥
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1,
            background: 'linear-gradient(135deg, #FF6B24 0%, #FF9A56 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {series.currentSeries}
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginTop: '0.25rem'
          }}>
            {series.currentSeries === 1 ? 'день подряд' : 'дней подряд'}
          </div>
        </div>
      </div>
      
      {/* Календарь последних 7 дней */}
      <div style={{
        marginBottom: '1.5rem'
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.5)',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Последние 7 дней
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          {last7Days.map((day, idx) => (
            <div
              key={idx}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: day.isActive 
                  ? 'linear-gradient(135deg, #FF6B24 0%, #FF9A56 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: day.isToday 
                  ? '2px solid rgba(255, 255, 255, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.2s'
              }}
              title={day.date}
            >
              {day.isActive && '🔥'}
            </div>
          ))}
        </div>
      </div>
      
      {/* Прогресс до следующего milestone */}
      {nextMilestone && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              До следующей награды
            </span>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#FF6B24'
            }}>
              {series.currentSeries}/{nextMilestone.days} дней
            </span>
          </div>
          
          {/* Прогресс-бар */}
          <div style={{
            height: '8px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${(series.currentSeries / nextMilestone.days) * 100}%`,
              background: 'linear-gradient(90deg, #FF6B24 0%, #FF9A56 100%)',
              borderRadius: '4px',
              transition: 'width 0.5s ease-out'
            }} />
          </div>
          
          {/* Награда */}
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              🎁 Награда за {nextMilestone.days} дней:
            </span>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#c4b5fd'
            }}>
              {nextMilestone.reward.description}
            </span>
          </div>
        </div>
      )}
      
      {/* Все milestone'ы достигнуты */}
      {!nextMilestone && series.currentSeries >= 30 && (
        <div style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            marginBottom: '0.5rem'
          }}>
            🏆
          </div>
          <div style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'white'
          }}>
            Все награды получены!
          </div>
          <div style={{
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginTop: '0.25rem'
          }}>
            Продолжай в том же духе! 💪
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitySeriesWidget;

