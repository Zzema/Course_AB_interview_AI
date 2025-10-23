import React from 'react';

interface LevelBadgeProps {
    level: 'junior' | 'mid' | 'senior' | 'staff';
    compact?: boolean;
}

const LEVEL_CONFIG = {
    junior: {
        label: 'НОВИЧОК',
        color: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
        icon: '🌱'
    },
    mid: {
        label: 'ПРАКТИК',
        color: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        icon: '⚡'
    },
    senior: {
        label: 'МАСТЕР',
        color: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
        icon: '👑'
    },
    staff: {
        label: 'ЭКСПЕРТ',
        color: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        icon: '💎'
    }
};

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, compact = false }) => {
    const config = LEVEL_CONFIG[level];

    const style: React.CSSProperties = {
        display: 'inline-block',
        background: config.color,
        padding: compact ? '0.25rem 0.75rem' : '0.5rem 1.5rem',
        borderRadius: compact ? '12px' : '50px',
        fontSize: compact ? '0.75rem' : '0.9rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
    };

    return (
        <div style={style}>
            {config.icon} {config.label}
        </div>
    );
};

export default LevelBadge;

