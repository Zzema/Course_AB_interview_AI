import React from 'react';

export interface Quest {
    id: string;
    title: string;
    description: string;
    progress: { current: number; total: number };
    reward: number;
    completed: boolean;
    urgent?: boolean;
}

interface QuestCardProps {
    quest: Quest;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
    const progress = (quest.progress.current / quest.progress.total) * 100;
    const isCloseToCompletion = progress >= 80 && !quest.completed;
    const isUrgent = quest.urgent && !quest.completed;

    const cardStyle: React.CSSProperties = {
        background: isUrgent 
            ? 'rgba(239, 68, 68, 0.15)' 
            : 'rgba(255, 255, 255, 0.05)',
        border: `2px solid ${
            isUrgent 
                ? 'rgba(239, 68, 68, 0.6)'
                : quest.completed 
                ? 'rgba(16, 185, 129, 0.3)' 
                : isCloseToCompletion 
                ? 'rgba(251, 191, 36, 0.3)' 
                : 'rgba(255, 255, 255, 0.1)'
        }`,
        borderRadius: '12px',
        padding: '1.25rem',
        boxShadow: isUrgent ? '0 0 20px rgba(239, 68, 68, 0.3)' : 'none',
        marginBottom: '1rem',
        transition: 'all 0.3s',
        cursor: 'pointer',
        opacity: quest.completed ? 0.7 : 1
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
        <div style={cardStyle}>
            <div style={headerStyle}>
                <div style={titleStyle}>
                    {quest.completed ? '✅' : '🎯'} {quest.title}
                </div>
                <div style={rewardStyle}>+{quest.reward} XP</div>
            </div>
            <div style={progressTextStyle}>
                {quest.description || `Прогресс: ${quest.progress.current}/${quest.progress.total}`}
            </div>
            <div style={progressBarBgStyle}>
                <div style={progressBarFillStyle} />
            </div>
        </div>
    );
};

export default QuestCard;

