import React, { useState } from 'react';

interface SkillItemProps {
    rank: number;
    name: string;
    score: number;
    isWeak?: boolean;
    description?: string;
}

const SkillItem: React.FC<SkillItemProps> = ({ rank, name, score, isWeak = false, description }) => {
    const [showModal, setShowModal] = useState(false);
    const itemStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        transition: 'all 0.3s',
        cursor: 'pointer'
    };

    const rankBadgeStyle: React.CSSProperties = {
        width: '36px',
        height: '36px',
        background: isWeak 
            ? 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)'
            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '0.95rem',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
    };

    const nameStyle: React.CSSProperties = {
        flex: 1,
        fontSize: '0.95rem',
        color: 'white'
    };

    const getScoreColor = (score: number, isWeak: boolean) => {
        if (isWeak) return '#f97316'; // Оранжевый для слабых
        if (score >= 80) return '#10b981'; // Зеленый для отличных
        if (score >= 70) return '#06b6d4'; // Голубой для хороших
        return '#8b5cf6'; // Фиолетовый для нормальных
    };

    const scoreStyle: React.CSSProperties = {
        fontSize: '1.3rem',
        fontWeight: 700,
        color: getScoreColor(score, isWeak),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.1rem'
    };

    const percentStyle: React.CSSProperties = {
        fontSize: '0.7rem',
        opacity: 0.6,
        fontWeight: 500
    };

    return (
        <>
            <div 
                style={itemStyle}
                onClick={() => description && setShowModal(true)}
            >
                <div style={rankBadgeStyle}>#{rank}</div>
                <div style={nameStyle}>
                    {name}
                    {description && (
                        <span style={{ 
                            marginLeft: '0.5rem', 
                            fontSize: '0.8rem',
                            opacity: 0.6 
                        }}>
                            ℹ️
                        </span>
                    )}
                </div>
                <div style={scoreStyle}>
                    <div>{Math.round(score)}</div>
                    <div style={percentStyle}>баллов</div>
                </div>
            </div>

            {/* Modal */}
            {showModal && description && (
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
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>
                                {name}
                            </h2>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: 700,
                                color: isWeak ? '#f97316' : '#10b981'
                            }}>
                                {Math.round(score)}
                            </div>
                        </div>

                        <div style={{ 
                            fontSize: '1rem', 
                            lineHeight: '1.6', 
                            color: 'rgba(255, 255, 255, 0.9)',
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            {description}
                        </div>

                        <div style={{
                            padding: '1rem',
                            background: isWeak 
                                ? 'rgba(239, 68, 68, 0.1)' 
                                : 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '8px',
                            border: isWeak 
                                ? '1px solid rgba(239, 68, 68, 0.3)' 
                                : '1px solid rgba(16, 185, 129, 0.3)',
                            marginBottom: '1.5rem'
                        }}>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                {isWeak ? (
                                    <>
                                        <strong style={{ color: '#f97316' }}>💡 Как улучшить:</strong><br/>
                                        Проходите больше вопросов по этой теме и внимательно изучайте обратную связь AI. Повторение - ключ к мастерству!
                                    </>
                                ) : (
                                    <>
                                        <strong style={{ color: '#10b981' }}>🎉 Отлично!</strong><br/>
                                        Вы хорошо владеете этой темой. Продолжайте в том же духе и помогайте другим!
                                    </>
                                )}
                            </p>
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

export default SkillItem;

