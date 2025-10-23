import React, { useMemo } from 'react';
import { styles } from '../styles';

interface RatingProgressChartProps {
    ratingHistory: number[];
    currentUserName?: string;
}

const RatingProgressChart: React.FC<RatingProgressChartProps> = ({ ratingHistory, currentUserName }) => {
    const chartData = useMemo(() => {
        if (!ratingHistory || ratingHistory.length === 0) return null;

        const maxRating = Math.max(...ratingHistory, 100);
        const points = ratingHistory.map((rating, index) => ({
            x: (index / (ratingHistory.length - 1 || 1)) * 100,
            y: 100 - (rating / maxRating) * 100,
            rating
        }));

        return { points, maxRating };
    }, [ratingHistory]);

    if (!chartData || chartData.points.length < 2) {
        return null;
    }

    const { points, maxRating } = chartData;
    
    // Create SVG path
    const pathD = points
        .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`)
        .join(' ');

    return (
        <div style={styles.questionCard}>
            <h3 style={{ 
                marginBottom: '1rem', 
                fontFamily: 'var(--font-display)', 
                color: 'var(--secondary-color)',
                textAlign: 'center'
            }}>
                📈 График прогресса рейтинга
                {currentUserName && <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}> ({currentUserName})</span>}
            </h3>
            
            <div style={{ position: 'relative', width: '100%', height: '200px', marginBottom: '0.5rem' }}>
                <svg 
                    viewBox="0 0 100 100" 
                    style={{ 
                        width: '100%', 
                        height: '100%',
                        overflow: 'visible'
                    }}
                    preserveAspectRatio="none"
                >
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(y => (
                        <line
                            key={`grid-${y}`}
                            x1="0"
                            y1={y}
                            x2="100"
                            y2={y}
                            stroke="var(--border-color)"
                            strokeWidth="0.2"
                            opacity="0.3"
                        />
                    ))}
                    
                    {/* Area under the curve */}
                    <path
                        d={`${pathD} L 100,100 L 0,100 Z`}
                        fill="url(#gradient)"
                        opacity="0.2"
                    />
                    
                    {/* Main line */}
                    <path
                        d={pathD}
                        fill="none"
                        stroke="var(--primary-color)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    
                    {/* Points */}
                    {points.map((point, i) => (
                        <g key={`point-${i}`}>
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="1.5"
                                fill="var(--primary-color)"
                                stroke="white"
                                strokeWidth="0.5"
                            />
                            <title>{`Вопрос ${i}: ${point.rating} очков`}</title>
                        </g>
                    ))}
                    
                    {/* Gradient definition */}
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            
            {/* Labels */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                marginTop: '0.5rem'
            }}>
                <span>Начало</span>
                <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                    Текущий: {ratingHistory[ratingHistory.length - 1]} очков
                </span>
                <span>Вопрос {ratingHistory.length - 1}</span>
            </div>
            
            {/* Stats */}
            {ratingHistory.length > 1 && (
                <div style={{ 
                    marginTop: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(106, 90, 205, 0.05)',
                    borderRadius: '8px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '0.5rem',
                    fontSize: '0.85rem'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Средний прирост</div>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                            +{Math.round(ratingHistory[ratingHistory.length - 1] / (ratingHistory.length - 1))}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Лучший скачок</div>
                        <div style={{ fontWeight: 'bold', color: 'var(--success-color)' }}>
                            +{Math.max(...ratingHistory.slice(1).map((r, i) => r - ratingHistory[i]))}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Всего вопросов</div>
                        <div style={{ fontWeight: 'bold' }}>
                            {ratingHistory.length - 1}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RatingProgressChart;

