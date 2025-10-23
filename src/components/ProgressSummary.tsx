import React, { useState, useEffect } from 'react';
import { GameState, User } from '../types';
import { styles } from '../styles';

interface ProgressSummaryProps {
    user: User;
    gameState: GameState;
    onContinue: () => void;
    onReset: () => void;
    onShowStats: () => void;
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ user, gameState, onContinue, onReset, onShowStats }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 600);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Функция для форматирования времени последнего ответа
    const formatLastAnswer = (): string => {
        const attempts = gameState.questionAttempts;
        if (!attempts || attempts.length === 0) return 'ещё не отвечали';
        
        const lastAttempt = attempts[attempts.length - 1];
        const now = Date.now();
        const diffMs = now - lastAttempt.timestamp;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSeconds < 60) return `${diffSeconds} сек назад`;
        if (diffMinutes < 60) return `${diffMinutes} мин назад`;
        if (diffHours < 24) return `${diffHours} ч назад`;
        if (diffDays < 30) return `${diffDays} дн назад`;
        
        const diffMonths = Math.floor(diffDays / 30);
        return `${diffMonths} мес назад`;
    };

    const currentXP = gameState.rating || 0;

    const titleStyle = {
        ...styles.title,
        fontSize: isMobile ? '1.5rem' : '2rem'
    };
    
    const buttonGroupStyle = {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem',
        flexDirection: isMobile ? 'column' : 'row' as 'column' | 'row'
    };
    
    return (
        <div style={styles.progressSummaryCard} className="fade-in">
            <h2 style={titleStyle}>С возвращением, {user.given_name}!</h2>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
                flexWrap: isMobile ? 'wrap' : 'nowrap',
                gap: '0.5rem'
            }}>
                <p style={{...styles.subtitle, margin: 0}}>
                    ⭐ Ваш опыт: <span style={{fontSize: '1.5rem', color: 'var(--primary-color)', fontWeight: 700}}>{currentXP}</span>
                </p>
                <p style={{
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                    margin: 0
                }}>
                    🕒 Последний ответ {formatLastAnswer()}
                </p>
                        </div>

            {/* Progress Chart */}
            {gameState.questionAttempts && gameState.questionAttempts.length > 0 ? (
                <div style={{
                    background: 'rgba(106, 90, 205, 0.1)',
                    borderRadius: '16px',
                    padding: isMobile ? '1rem' : '1.5rem',
                    marginTop: '1.5rem',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(106, 90, 205, 0.2)'
                }}>
                    <div style={{
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '1rem',
                        textAlign: 'center',
                        fontWeight: 600
                    }}>
                        📈 Динамика опыта
                    </div>
                    <div style={{ width: '100%', overflow: 'hidden' }}>
                        <svg 
                            viewBox={`0 0 ${isMobile ? 300 : 600} ${isMobile ? 150 : 200}`}
                            width="100%"
                            height="auto"
                            preserveAspectRatio="xMidYMid meet"
                            style={{ display: 'block' }}
                        >
                            {(() => {
                                // Build rating history from question attempts
                                const attempts = gameState.questionAttempts || [];
                                const history = [0]; // Start with 0
                                let cumulativeRating = 0;
                                
                                attempts.forEach(attempt => {
                                    cumulativeRating += attempt.earnedXP || 0;
                                    history.push(cumulativeRating);
                                });
                                
                                if (history.length < 2) return null;

                                const maxXP = Math.max(...history, 100);
                                const minXP = Math.min(...history, -50);
                                const range = maxXP - minXP || 1;
                                const width = isMobile ? 300 : 600;
                                const height = isMobile ? 150 : 200;
                                const padding = 40;
                            
                            const points = history.map((xp, index) => {
                                const x = padding + (index / (history.length - 1 || 1)) * (width - padding * 2);
                                const y = height - padding - ((xp - minXP) / range) * (height - padding * 2);
                                return { x, y, xp };
                            });

                            const pathData = points.map((p, i) => 
                                `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
                            ).join(' ');

                            return (
                                <>
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                        <linearGradient id="progressLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#a855f7" />
                                        </linearGradient>
                                    </defs>

                                    {/* Grid lines */}
                                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                                        const y = height - padding - ratio * (height - padding * 2);
                                        const value = Math.round(minXP + ratio * range);
                                        return (
                                            <g key={i}>
                                                <line
                                                    x1={padding}
                                                    y1={y}
                                                    x2={width - padding}
                                                    y2={y}
                                                    stroke="rgba(255, 255, 255, 0.1)"
                                                    strokeWidth="1"
                                                />
                                                <text
                                                    x={padding - 10}
                                                    y={y + 5}
                                                    fill="rgba(255, 255, 255, 0.5)"
                                                    fontSize="12"
                                                    textAnchor="end"
                                                >
                                                    {value}
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {/* Area under curve */}
                                    <path
                                        d={`${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`}
                                        fill="url(#progressGradient)"
                                        opacity="0.2"
                                    />

                                    {/* Line */}
                                    <path
                                        d={pathData}
                                        fill="none"
                                        stroke="url(#progressLineGradient)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    {/* Points */}
                                    {points.map((p, i) => (
                                        <g key={i}>
                                            <circle
                                                cx={p.x}
                                                cy={p.y}
                                                r="5"
                                                fill="white"
                                                stroke="#6366f1"
                                                strokeWidth="2"
                                            />
                                            {(i === 0 || i === points.length - 1) && (
                                                <text
                                                    x={p.x}
                                                    y={p.y - 15}
                                                    fill="white"
                                                    fontSize="12"
                                                    textAnchor="middle"
                                                    fontWeight="bold"
                                                >
                                                    {p.xp}
                                                </text>
                                            )}
                                        </g>
                                    ))}
                                </>
                            );
                        })()}
                        </svg>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '0.5rem',
                        fontSize: isMobile ? '0.7rem' : '0.8rem',
                        color: 'var(--text-secondary)'
                    }}>
                        <span>Начало</span>
                        <span>Сейчас</span>
                    </div>
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic'
                }}>
                    Ответьте на несколько вопросов, чтобы увидеть динамику вашего прогресса! 📈
            </div>
            )}

            <button onClick={onContinue} style={styles.submitButton}>Продолжить тренировку</button>
            <div style={buttonGroupStyle}>
                 <button onClick={onShowStats} style={{...styles.secondaryButton, marginTop: 0}}>Статистика 📊</button>
            </div>
        </div>
    )
};

export default ProgressSummary;