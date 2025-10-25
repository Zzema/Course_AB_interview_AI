/**
 * ============================================================================
 * SERIES LOST MODAL
 * ============================================================================
 * Модальное окно при потере серии активности
 * Показывается один раз при первом логине после разрыва серии
 */

import React from 'react';

interface SeriesLostModalProps {
  previousSeries: number; // Потерянная серия
  longestSeries: number; // Рекорд серии
  onClose: () => void;
}

const SeriesLostModal: React.FC<SeriesLostModalProps> = ({
  previousSeries,
  longestSeries,
  onClose
}) => {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1rem',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #1a1a3e 0%, #0f0f23 100%)',
          border: '2px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '450px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Иконка */}
        <div style={{
          fontSize: '4rem',
          textAlign: 'center',
          marginBottom: '1rem',
          filter: 'grayscale(100%)',
          opacity: 0.5
        }}>
          💔
        </div>
        
        {/* Заголовок */}
        <h2 style={{
          margin: '0 0 1rem 0',
          fontSize: '1.5rem',
          textAlign: 'center',
          color: 'white'
        }}>
          Серия прервана
        </h2>
        
        {/* Описание */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            Ты пропустил день и потерял серию из
          </p>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#ff6b6b',
            margin: '0.5rem 0'
          }}>
            {previousSeries}
          </div>
          <p style={{
            margin: '0.5rem 0 0 0',
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            {previousSeries === 1 ? 'дня' : 'дней'} 🔥
          </p>
        </div>
        
        {/* Рекорд */}
        {previousSeries < longestSeries && (
          <div style={{
            padding: '1rem',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '0.25rem'
            }}>
              Твой рекорд:
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#c4b5fd'
            }}>
              🏆 {longestSeries} {longestSeries === 1 ? 'день' : 'дней'}
            </div>
          </div>
        )}
        
        {/* Мотивация */}
        <div style={{
          padding: '1rem',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            fontSize: '0.95rem',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: '1.5',
            textAlign: 'center'
          }}>
            💪 Не сдавайся! Начни новую серию прямо сейчас. {previousSeries >= longestSeries && 'Попробуй побить свой рекорд!'}
          </div>
        </div>
        
        {/* Кнопка */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Начать заново 🔥
        </button>
      </div>
      
      {/* Анимации */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SeriesLostModal;

