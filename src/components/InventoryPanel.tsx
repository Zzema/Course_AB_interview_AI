/**
 * ============================================================================
 * INVENTORY PANEL
 * ============================================================================
 * Компонент для отображения инвентаря пользователя
 * Показывает доступные предметы и их количество
 */

import React from 'react';
import { Inventory } from '../types';

interface InventoryPanelProps {
  inventory: Inventory;
  compact?: boolean; // Компактный режим (только иконки с числами)
}

const InventoryPanel: React.FC<InventoryPanelProps> = ({ inventory, compact = false }) => {
  // Если компактный режим - показываем только иконки
  if (compact) {
    return (
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        {inventory.questionSkips > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'rgba(251, 191, 36, 0.2)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              borderRadius: '8px',
              padding: '0.35rem 0.6rem',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
            title="Пропуски вопроса"
          >
            <span>🎲</span>
            <span style={{ color: '#fbbf24' }}>{inventory.questionSkips}</span>
          </div>
        )}
        
        {inventory.seriesProtection > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: '8px',
              padding: '0.35rem 0.6rem',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
            title="Защита серии"
          >
            <span>🛡️</span>
            <span style={{ color: '#c4b5fd' }}>{inventory.seriesProtection}</span>
          </div>
        )}
      </div>
    );
  }
  
  // Полный режим - карточки с описанием
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 700,
        margin: '0 0 1rem 0',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        whiteSpace: 'nowrap'
      }}>
        🎒 Инвентарь
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
        gap: '1rem'
      }}>
        {/* Пропуск вопроса */}
        <div style={{
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '2rem' }}>🎲</span>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#fbbf24'
            }}>
              {inventory.questionSkips}
            </span>
          </div>
          <div style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'white'
          }}>
            Пропуск вопроса
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: '1.4'
          }}>
            Позволяет получить новый вопрос вместо текущего
          </div>
        </div>
        
        {/* Защита серии */}
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '2rem' }}>🛡️</span>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#c4b5fd'
            }}>
              {inventory.seriesProtection}
            </span>
          </div>
          <div style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'white'
          }}>
            Защита серии
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: '1.4'
          }}>
            Защищает от потери серии на 1 день
          </div>
        </div>
      </div>
      
      {/* Подсказка если инвентарь пуст */}
      {inventory.questionSkips === 0 && inventory.seriesProtection === 0 && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '8px',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.85rem'
        }}>
          💡 Получай предметы за выполнение ежедневных заданий и достижение milestone'ов серии!
        </div>
      )}
    </div>
  );
};

export default InventoryPanel;

