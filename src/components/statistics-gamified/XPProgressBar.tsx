import React from 'react';

interface XPProgressBarProps {
    currentXP: number;
    nextLevelXP: number;
    nextLevelName: string;
}

const XPProgressBar: React.FC<XPProgressBarProps> = ({ currentXP, nextLevelXP, nextLevelName }) => {
    // Не даем прогрессу быть отрицательным - если XP < 0, прогресс = 0
    const progress = Math.max(0, Math.min(100, (currentXP / nextLevelXP) * 100));
    const remaining = Math.max(0, nextLevelXP - currentXP);
    const isMobile = window.innerWidth <= 768;

    const containerStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '0.75rem' : '1rem',
        marginBottom: isMobile ? '1rem' : '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.5rem',
        fontSize: isMobile ? '0.75rem' : '0.9rem',
        color: 'rgba(255, 255, 255, 0.8)'
    };

    const barBgStyle: React.CSSProperties = {
        height: isMobile ? '24px' : '30px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: isMobile ? '12px' : '15px',
        overflow: 'hidden',
        position: 'relative'
    };

    const barFillStyle: React.CSSProperties = {
        height: '100%',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '15px',
        transition: 'width 1s ease-out',
        position: 'relative',
        overflow: 'hidden'
    };

    const textOverlayStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: isMobile ? '0.7rem' : '0.85rem',
        color: 'white',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
        pointerEvents: 'none'
    };

    const shimmerStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        animation: 'shimmer 2s infinite'
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <span>📈 До {nextLevelName}</span>
                <span>{remaining} XP</span>
            </div>
            <div style={barBgStyle}>
                <div style={barFillStyle}>
                    <div style={shimmerStyle} />
                </div>
                <div style={textOverlayStyle}>
                    {Math.max(0, currentXP)} / {nextLevelXP} XP
                </div>
            </div>
        </div>
    );
};

export default XPProgressBar;

