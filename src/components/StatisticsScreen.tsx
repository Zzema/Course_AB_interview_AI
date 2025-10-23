import React, { useMemo, useState, useEffect } from 'react';
import { GameState, User, KeyPoint } from '../types';
import { CATEGORIES_CONFIG, KEY_POINT_CONFIG, QUESTION_DATABASE } from '../data/constants';
import { styles } from '../styles';
import ProgressBar from './ProgressBar';
import Leaderboard from './Leaderboard';
import RatingProgressChart from './RatingProgressChart';


interface StatisticsScreenProps {
    user: User;
    gameState: GameState;
    onBack: () => void;
}

const KeyPointStats: React.FC<{ title: string; data: { name: string; score: number; key?: string }[], color: string }> = ({ title, data, color }) => (
    <div style={styles.keypointCard}>
        <h4 style={{ ...styles.summaryTitle, color: color, textAlign: 'center' }}>{title}</h4>
        <div style={styles.keypointList}>
            {data.length > 0 ? data.map(kp => {
                // Найдем описание для ключевого поинта
                const keyPointEntry = Object.entries(KEY_POINT_CONFIG).find(([_, value]) => value.name === kp.name);
                const description = keyPointEntry ? keyPointEntry[1].description : '';
                
                return (
                    <div key={kp.name} title={description}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.9rem', cursor: 'help' }}>{kp.name}</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{Math.round(kp.score)}%</span>
                        </div>
                        <ProgressBar value={kp.score} color={color} />
                    </div>
                );
            }) : <p style={{color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem'}}>Недостаточно данных</p>}
        </div>
    </div>
);


const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ user, gameState, onBack }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [activeTab, setActiveTab] = useState<'stats' | 'leaderboard'>('stats');

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 600);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const categoryAverages = useMemo(() => {
        const scores = gameState.categoryScores;
        return Object.keys(scores).reduce((acc, key) => {
            const value = scores[key];
            acc[key] = value.count > 0 ? (value.totalScore / value.count) * 10 : 0;
            return acc;
        }, {} as Record<string, number>);
    }, [gameState.categoryScores]);

    const keyPointAverages = useMemo(() => {
        const scores = gameState.keyPointScores;
        const processedScores = Object.keys(scores)
            .map(key => {
                const value = scores[key];
                const avgScore = value.count > 0 ? (value.totalScore / value.count) * 10 : 0;
                return {
                    name: KEY_POINT_CONFIG[key as KeyPoint]?.name || key,
                    score: avgScore,
                    count: value.count
                };
            })
            .filter(item => item.count > 0); 

        processedScores.sort((a, b) => a.score - b.score);
        return processedScores;

    }, [gameState.keyPointScores]);
    
    const weakestKeyPoints = keyPointAverages.slice(0, 5);
    const strongestKeyPoints = [...keyPointAverages].reverse().slice(0, 5);

    // Рассчитываем количество отвеченных вопросов на основе questionAttempts
    const totalQuestionsAnswered = useMemo(() => {
        return gameState.questionAttempts?.length || 0;
    }, [gameState.questionAttempts]);
    
    // Рассчитываем среднюю оценку на основе questionAttempts
    const averageOverallScore = useMemo(() => {
        if (!gameState.questionAttempts || gameState.questionAttempts.length === 0) {
            return 0;
        }
        
        // Средний балл overallScore по всем вопросам
        const totalScore = gameState.questionAttempts.reduce((sum, attempt) => 
            sum + attempt.feedback.overallScore, 0
        );
        
        return totalScore / gameState.questionAttempts.length;
    }, [gameState.questionAttempts]);

    // Отладочная информация
    console.log('StatisticsScreen Debug:', {
        questionAttemptsCount: gameState.questionAttempts?.length || 0,
        totalQuestionsAnswered,
        averageOverallScore,
        attempts: gameState.questionAttempts?.map(a => ({
            id: a.questionId,
            score: a.feedback.overallScore
        }))
    });

    const headerTitleStyle = {
        ...styles.title,
        fontSize: isMobile ? '1.5rem' : '1.75rem',
        margin: 0,
        color: 'var(--text-primary)'
    };

    const mainContentStyle = {
        ...styles.mainContent,
        padding: isMobile ? '1rem' : '1.5rem',
    };

    const summaryGridStyle = {
        ...styles.statsSummaryGrid,
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
    };

    const summaryCardValueStyle = {
        fontSize: isMobile ? '1.8rem' : '2rem',
        fontFamily: 'var(--font-display)',
        fontWeight: '700',
    };
    
    const chartLabelStyle = {
        ...styles.chartLabel,
        fontSize: isMobile ? '0.7rem' : '0.75rem'
    };

    const keypointGridStyle = {
        ...styles.keypointGrid,
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    };

    return (
        <div style={styles.container} className="fade-in">
            <header style={styles.header}>
                <h1 style={headerTitleStyle}>Статистика</h1>
                <button onClick={onBack} style={{...styles.logoutButton, color: 'var(--text-primary)'}}>
                    ↩ Назад
                </button>
            </header>
            
            {/* Вкладки */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                padding: '0 1.5rem',
                marginBottom: '1rem',
                borderBottom: '2px solid var(--border-color)'
            }}>
                <button
                    onClick={() => setActiveTab('stats')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'stats' ? '3px solid var(--primary-color)' : '3px solid transparent',
                        color: activeTab === 'stats' ? 'var(--primary-color)' : 'var(--text-secondary)',
                        fontWeight: activeTab === 'stats' ? '600' : '400',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginBottom: '-2px'
                    }}
                >
                    📊 Моя статистика
                </button>
                <button
                    onClick={() => setActiveTab('leaderboard')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'leaderboard' ? '3px solid var(--primary-color)' : '3px solid transparent',
                        color: activeTab === 'leaderboard' ? 'var(--primary-color)' : 'var(--text-secondary)',
                        fontWeight: activeTab === 'leaderboard' ? '600' : '400',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginBottom: '-2px'
                    }}
                >
                    🏆 Лидерборд
                </button>
            </div>
            
            <main style={mainContentStyle}>
                {activeTab === 'stats' ? (
                    <>
                {/* График прогресса рейтинга */}
                {gameState.ratingHistory && gameState.ratingHistory.length > 1 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <RatingProgressChart 
                            ratingHistory={gameState.ratingHistory} 
                            currentUserName={user.given_name || user.name}
                        />
                    </div>
                )}
                
                <div style={summaryGridStyle}>
                    <div style={styles.statsSummaryCard}>
                        <div style={{...summaryCardValueStyle, color: 'var(--primary-color)'}}>{gameState.rating}</div>
                        <div style={{color: 'var(--text-secondary)', fontSize: isMobile ? '0.85rem' : '0.8rem', fontWeight: '500'}}>Общий рейтинг</div>
                    </div>
                    <div style={styles.statsSummaryCard}>
                        <div style={{...summaryCardValueStyle, color: 'var(--secondary-color)'}}>{totalQuestionsAnswered}</div>
                        <div style={{color: 'var(--text-secondary)', fontSize: isMobile ? '0.85rem' : '0.8rem', fontWeight: '500'}}>Отвечено</div>
                    </div>
                     <div style={styles.statsSummaryCard}>
                        <div style={{...summaryCardValueStyle, color: '#00e5ff'}}>{QUESTION_DATABASE.length}</div>
                        <div style={{color: 'var(--text-secondary)', fontSize: isMobile ? '0.85rem' : '0.8rem', fontWeight: '500'}}>Всего вопросов</div>
                    </div>
                    <div style={styles.statsSummaryCard}>
                        <div style={{...summaryCardValueStyle, color: '#ffc400'}}>{averageOverallScore.toFixed(1)}</div>
                        <div style={{color: 'var(--text-secondary)', fontSize: isMobile ? '0.85rem' : '0.8rem', fontWeight: '500'}}>Средняя оценка</div>
                    </div>
                </div>
                 <div style={keypointGridStyle}>
                    <KeyPointStats title="✅ Сильные стороны" data={strongestKeyPoints} color="var(--primary-color)" />
                    <KeyPointStats title="💡 Зоны роста" data={weakestKeyPoints} color="var(--error-color)" />
                </div>

                <div style={styles.chartCard}>
                    <h3 style={{ marginBottom: '2rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Качество знаний по категориям</h3>
                    {isMobile ? (
                        // Мобильная версия: горизонтальные прогресс-бары
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {Object.entries(CATEGORIES_CONFIG).map(([key, { name, color, description }]) => {
                                const value = categoryAverages[key] || 0;
                                return (
                                    <div key={key} title={description}>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            marginBottom: '0.5rem',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ 
                                                fontSize: '0.9rem', 
                                                fontWeight: 600,
                                                color: 'var(--text-primary)',
                                                cursor: 'help'
                                            }}>
                                                {name}
                                            </span>
                                            <span style={{ 
                                                fontSize: '1rem', 
                                                fontWeight: 'bold',
                                                color: color
                                            }}>
                                                {Math.round(value)}%
                                            </span>
                                        </div>
                                        <ProgressBar value={value} color={color} />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        // Десктопная версия: вертикальные столбцы
                        <div style={styles.chartContainer}>
                            {Object.entries(CATEGORIES_CONFIG).map(([key, { name, color, description }]) => {
                                const value = categoryAverages[key] || 0;
                                return (
                                    <div key={key} style={styles.chartBarWrapper} title={description}>
                                        <div style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 600 }}>{Math.round(value)}%</div>
                                        <div style={{...styles.chartBar, height: `${value}%`, backgroundColor: color, cursor: 'help'}}></div>
                                        <div style={{...chartLabelStyle, cursor: 'help'}}>{name}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                    </>
                ) : (
                    /* Вкладка "Лидерборд" */
                    <Leaderboard 
                        currentUser={user} 
                        currentRating={gameState.rating}
                        currentRatingHistory={gameState.ratingHistory}
                    />
                )}
            </main>
        </div>
    );
};

export default StatisticsScreen;