import React, { useState } from 'react';

interface AbilityCardProps {
    name: string;
    score: number;
    description?: string;
    fullDescription?: string;
}

const AbilityCard: React.FC<AbilityCardProps> = ({ name, score, description, fullDescription }) => {
    const [showModal, setShowModal] = useState(false);
    const getGradient = (score: number) => {
        if (score >= 90) return 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)';
        if (score >= 75) return 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)';
        if (score >= 50) return 'linear-gradient(90deg, #f59e0b 0%, #eab308 100%)';
        return 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)';
    };

    const cardStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '1rem',
        transition: 'all 0.3s',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '110px',
        display: 'flex',
        flexDirection: 'column'
    };

    const glowStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
    };

    const nameStyle: React.CSSProperties = {
        fontSize: '0.95rem',
        fontWeight: 600,
        color: 'white',
        marginBottom: '0.75rem'
    };

    const progressBarBgStyle: React.CSSProperties = {
        height: '8px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '0.5rem'
    };

    const progressBarFillStyle: React.CSSProperties = {
        height: '100%',
        width: `${score}%`,
        background: getGradient(score),
        borderRadius: '6px',
        transition: 'width 1s ease-out'
    };

    const scoreStyle: React.CSSProperties = {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: 'white'
    };

    const descriptionStyle: React.CSSProperties = {
        fontSize: '0.85rem',
        color: 'rgba(255, 255, 255, 0.6)',
        lineHeight: 1.4
    };

    return (
        <>
            <div 
                style={cardStyle}
                onClick={() => fullDescription && setShowModal(true)}
            >
                <div style={glowStyle} />
                <div style={nameStyle}>
                    {name}
                    {fullDescription && (
                        <span style={{ 
                            marginLeft: '0.5rem', 
                            fontSize: '0.8rem',
                            opacity: 0.6 
                        }}>
                            ℹ️
                        </span>
                    )}
                </div>
                <div style={progressBarBgStyle}>
                    <div style={progressBarFillStyle} />
                </div>
                <div style={scoreStyle}>{Math.round(score)}%</div>
            </div>

            {/* Modal */}
            {showModal && fullDescription && (
                <div
                    onClick={() => setShowModal(false)}
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
                        zIndex: 1000,
                        padding: '1rem'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'linear-gradient(180deg, #1a1a3e 0%, #0f0f23 100%)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '16px',
                            padding: '2rem',
                            maxWidth: '500px',
                            width: '100%',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <h2 style={{ margin: 0, marginBottom: '1.5rem', fontSize: '1.5rem', color: 'white' }}>
                            {name}
                        </h2>

                        <div style={{ margin: '1.5rem 0' }}>
                            <div style={progressBarBgStyle}>
                                <div style={progressBarFillStyle} />
                            </div>
                            <div style={{ ...scoreStyle, fontSize: '2rem' }}>{Math.round(score)}%</div>
                        </div>

                        <div style={{ 
                            fontSize: '1rem', 
                            lineHeight: '1.6', 
                            color: 'rgba(255, 255, 255, 0.9)',
                            marginBottom: '1.5rem'
                        }}>
                            {fullDescription}
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                width: '100%',
                                padding: '0.65rem',
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AbilityCard;

