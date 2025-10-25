import React, { useState, useEffect } from 'react';
import { Quest } from '../../types';
import { getTimeRemaining } from '../../lib/activitySeriesManager';

interface QuestCardProps {
    quest: Quest;
    onClaim?: (questId: string) => void; // Для претензии наград за серии
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onClaim }) => {
    const progress = (quest.progress.current / quest.progress.total) * 100;
    const isCloseToCompletion = progress >= 80 && !quest.completed;
    const isUrgent = quest.urgent && !quest.completed;
    const isDaily = quest.type === 'daily';
    const canClaim = quest.type === 'achievement' && quest.completed && onClaim;
    
    // Таймер для ежедневных квестов
    const [timeRemaining, setTimeRemaining] = useState<string>('');
    
    useEffect(() => {
        if (!isDaily || !quest.expiresAt) return;
        
        // Обновляем таймер каждую минуту
        const updateTimer = () => {
            const remaining = getTimeRemaining(quest.expiresAt!);
            setTimeRemaining(remaining);
        };
        
        updateTimer();
        const interval = setInterval(updateTimer, 60000); // каждую минуту
        
        return () => clearInterval(interval);
    }, [isDaily, quest.expiresAt]);

    const cardStyle: React.CSSProperties = {
        background: isUrgent 
            ? 'rgba(239, 68, 68, 0.15)' 
            : isDaily 
            ? 'rgba(99, 102, 241, 0.1)'
            : 'rgba(255, 255, 255, 0.05)',
        border: `2px solid ${
            isUrgent 
                ? 'rgba(239, 68, 68, 0.6)'
                : isDaily
                ? 'rgba(99, 102, 241, 0.4)'
                : quest.completed 
                ? 'rgba(16, 185, 129, 0.3)' 
                : isCloseToCompletion 
                ? 'rgba(251, 191, 36, 0.3)' 
                : 'rgba(255, 255, 255, 0.1)'
        }`,
        borderRadius: '12px',
        padding: '1.25rem',
        boxShadow: isUrgent 
            ? '0 0 20px rgba(239, 68, 68, 0.3)' 
            : isDaily 
            ? '0 0 15px rgba(99, 102, 241, 0.2)'
            : 'none',
        marginBottom: '1rem',
        transition: 'all 0.3s',
        cursor: canClaim ? 'pointer' : 'default',
        opacity: quest.completed && !canClaim ? 0.7 : 1
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem'
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '1rem',
        fontWeight: 600,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    };

    const rewardStyle: React.CSSProperties = {
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        padding: '0.25rem 0.75rem',
        borderRadius: '8px',
        fontSize: '0.85rem',
        fontWeight: 700,
        color: '#1a1a3e'
    };

    const progressTextStyle: React.CSSProperties = {
        fontSize: '0.9rem',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '0.5rem'
    };

    const progressBarBgStyle: React.CSSProperties = {
        height: '8px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '4px',
        overflow: 'hidden'
    };

    const progressBarFillStyle: React.CSSProperties = {
        height: '100%',
        width: `${progress}%`,
        background: quest.completed 
            ? 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)'
            : 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '4px',
        transition: 'width 1s ease-out'
    };

    return (
        <div style={cardStyle} onClick={canClaim ? () => onClaim!(quest.id) : undefined}>
            <div style={headerStyle}>
                <div style={titleStyle}>
                    {quest.completed ? '✅' : '🎯'} {quest.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Таймер для ежедневных квестов */}
                    {isDaily && timeRemaining && !quest.completed && (
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px'
                        }}>
                            ⏰ {timeRemaining}
                        </div>
                    )}
                    
                    {/* Награды */}
                    {quest.rewards && quest.rewards.length > 0 ? (
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {quest.rewards.map((reward, idx) => (
                                <div key={idx} style={rewardStyle}>
                                    {reward.type === 'xp' ? `+${reward.value} XP` : reward.description}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={rewardStyle}>+{quest.reward} XP</div>
                    )}
                </div>
            </div>
            
            <div style={progressTextStyle}>
                {quest.description || `Прогресс: ${quest.progress.current}/${quest.progress.total}`}
            </div>
            
            <div style={progressBarBgStyle}>
                <div style={progressBarFillStyle} />
            </div>
            
            {/* Кнопка "Забрать награду" для achievements */}
            {canClaim && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClaim!(quest.id);
                    }}
                    style={{
                        marginTop: '1rem',
                        width: '100%',
                        padding: '0.75rem',
                        background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    🎁 Забрать награду
                </button>
            )}
        </div>
    );
};

export default QuestCard;

