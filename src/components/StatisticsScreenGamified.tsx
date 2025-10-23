import React, { useMemo, useState, useEffect } from 'react';
import { GameState, User, KeyPoint } from '../types';
import { CATEGORIES_CONFIG, KEY_POINT_CONFIG, QUESTION_DATABASE } from '../data/constants';
import LevelBadge from './statistics-gamified/LevelBadge';
import XPProgressBar from './statistics-gamified/XPProgressBar';
import QuestCard, { Quest } from './statistics-gamified/QuestCard';
import AbilityCard from './statistics-gamified/AbilityCard';
import SkillItem from './statistics-gamified/SkillItem';
import Leaderboard from './Leaderboard';
import { calculateLevel, scoreToLevel, getAbilityDescription } from './statistics-gamified/levelUtils';
import { 
    calculateWeightedAverageScore, 
    calculateSimpleAverageScore,
    calculateRecentRating
} from '../lib/xpCalculator';

interface StatisticsScreenGamifiedProps {
    user: User;
    gameState: GameState;
    onBack: () => void;
}

const StatisticsScreenGamified: React.FC<StatisticsScreenGamifiedProps> = ({ user, gameState, onBack }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [activeTab, setActiveTab] = useState<'stats' | 'leaderboard'>('stats');
    const [showXPModal, setShowXPModal] = useState(false);
    const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'junior' | 'mid' | 'senior' | 'staff'>(
        gameState.selectedDifficulty || 'all'
    );

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate current XP (rating = experience points)
    const currentXP = gameState.rating;

    const levelData = useMemo(() => calculateLevel(currentXP), [currentXP]);

    // Calculate total questions answered
    const totalQuestionsAnswered = useMemo(() => {
        return gameState.questionAttempts?.length || 0;
    }, [gameState.questionAttempts]);

    // Calculate weighted average score
    const averageOverallScore = useMemo(() => {
        return calculateWeightedAverageScore(gameState.questionAttempts || []);
    }, [gameState.questionAttempts]);
    
    // Простая средняя (для сравнения)
    const simpleAverageScore = useMemo(() => {
        return calculateSimpleAverageScore(gameState.questionAttempts || []);
    }, [gameState.questionAttempts]);

    // Calculate recent rating (last 20 questions)
    const recentRating = useMemo(() => {
        return calculateRecentRating(gameState.questionAttempts || [], 20);
    }, [gameState.questionAttempts]);

    // Calculate category abilities
    const abilities = useMemo(() => {
        return Object.entries(CATEGORIES_CONFIG).map(([key, config]) => {
            const categoryScore = gameState.categoryScores[key];
            const score = categoryScore && categoryScore.count > 0 
                ? (categoryScore.totalScore / categoryScore.count) * 10 
                : 0;
            return {
                key,
                name: config.name,
                score,
                level: scoreToLevel(score),
                description: getAbilityDescription(score),
                fullDescription: config.description, // Полное описание категории
                color: config.color
            };
        });
    }, [gameState.categoryScores]);

    // Calculate key point scores
    const keyPointScores = useMemo(() => {
        return Object.keys(gameState.keyPointScores)
            .map(key => {
                const value = gameState.keyPointScores[key];
                const avgScore = value.count > 0 ? (value.totalScore / value.count) * 10 : 0;
                const config = KEY_POINT_CONFIG[key as KeyPoint];
                return {
                    key,
                    name: config?.name || key,
                    description: config?.description || undefined,
                    score: avgScore,
                    count: value.count
                };
            })
            .filter(item => item.count > 0)
            .sort((a, b) => a.score - b.score);
    }, [gameState.keyPointScores]);

    // Топ навыки - только те, что ≥ 50 (хороший уровень владения)
    // Берем до 4 лучших, но показываем только достойные
    const strongestSkills = [...keyPointScores]
        .reverse()
        .filter(skill => skill.score >= 50)
        .slice(0, 4);
    
    // Слабые навыки - берем 4 худших, НО исключая те, что уже в топе
    // Это важно когда навыков мало (например, всего 5-6)
    const weakestSkills = keyPointScores
        .filter(skill => !strongestSkills.some(strong => strong.key === skill.key))
        .slice(0, 4);

    // Generate quests based on game state
    const quests = useMemo((): Quest[] => {
        const allQuests: Quest[] = [];

        // 🆘 Urgent quest for negative rating (appears only when rating < -50)
        if (gameState.rating < -50) {
            allQuests.push({
                id: 'quest-recovery',
                title: '🆘 Квест восстановления',
                description: `Текущий опыт: ${gameState.rating}. Ответь на вопрос с оценкой 6+, чтобы получить +50 опыта!`,
                progress: { 
                    current: Math.max(0, gameState.rating + 50), 
                    total: 50 
                },
                reward: 50,
                completed: false,
                urgent: true
            });
        }

        // Regular quests
        allQuests.push(
            {
                id: 'quest-50-questions',
                title: 'Ответь на 50 вопросов',
                description: `Прогресс: ${totalQuestionsAnswered}/50`,
                progress: { current: totalQuestionsAnswered, total: 50 },
                reward: 200,
                completed: totalQuestionsAnswered >= 50
            },
            {
                id: 'quest-category-80',
                title: 'Достигни 80% в любой категории',
                description: `Лучшая категория: ${Math.round(Math.max(...abilities.map(a => a.score), 0))}%`,
                progress: { 
                    current: Math.min(Math.max(...abilities.map(a => a.score), 0), 80), 
                    total: 80 
                },
                reward: 150,
                completed: abilities.some(a => a.score >= 80)
            },
            {
                id: 'quest-avg-8',
                title: 'Средняя оценка за ответ выше 8/10',
                description: `Текущая: ${averageOverallScore.toFixed(1)}/10`,
                progress: { 
                    current: Math.min(averageOverallScore, 8), 
                    total: 8 
                },
                reward: 100,
                completed: averageOverallScore >= 8.0
            },
            {
                id: 'quest-100-questions',
                title: 'Ответь на 100 вопросов',
                description: `Прогресс: ${totalQuestionsAnswered}/100`,
                progress: { current: totalQuestionsAnswered, total: 100 },
                reward: 500,
                completed: totalQuestionsAnswered >= 100
            }
        );

        return allQuests;
    }, [totalQuestionsAnswered, abilities, averageOverallScore, gameState.rating]);

    // Styles
    const containerStyle: React.CSSProperties = {
        minHeight: '100vh',
        background: '#0f0f23',
        color: 'white',
        paddingBottom: isMobile ? '1rem' : '2rem',
        overflowY: 'auto',
        overflowX: 'hidden'
    };

    const headerStyle: React.CSSProperties = {
        background: 'rgba(26, 26, 62, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: isMobile ? '0.75rem 1rem' : '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    };

    const backButtonStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: isMobile ? '8px' : '12px',
        padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem',
        color: 'white',
        cursor: 'pointer',
        fontSize: isMobile ? '0.9rem' : '1rem',
        fontWeight: 600,
        transition: 'all 0.3s'
    };

    const heroStyle: React.CSSProperties = {
        background: 'linear-gradient(180deg, #1a1a3e 0%, #0f0f23 100%)',
        padding: isMobile ? '1.5rem 1rem' : '3rem 2rem',
        position: 'relative',
        overflow: 'hidden'
    };

    const heroGlowStyle: React.CSSProperties = {
        position: 'absolute',
        top: '-50%',
        right: isMobile ? '-30%' : '-20%',
        width: isMobile ? '300px' : '500px',
        height: isMobile ? '300px' : '500px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
    };

    const heroContentStyle: React.CSSProperties = {
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '0 auto'
    };

    const heroTitleStyle: React.CSSProperties = {
        fontSize: isMobile ? '1.5rem' : '3rem',
        marginBottom: isMobile ? '0.25rem' : '0.5rem',
        marginTop: isMobile ? '0.5rem' : '1rem',
        background: 'linear-gradient(135deg, #ffffff 0%, #a0a0ff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 800
    };

    const statsRowStyle: React.CSSProperties = {
        display: 'flex',
        gap: isMobile ? '0.75rem' : '3rem',
        marginTop: isMobile ? '1rem' : '2rem',
        flexWrap: 'wrap'
    };

    const statCardStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '0.5rem' : '1rem'
    };

    const statIconStyle: React.CSSProperties = {
        fontSize: isMobile ? '1.5rem' : '2.5rem'
    };

    const statValueStyle: React.CSSProperties = {
        fontSize: isMobile ? '1.25rem' : '2rem',
        fontWeight: 800,
        lineHeight: 1
    };

    const statLabelStyle: React.CSSProperties = {
        fontSize: isMobile ? '0.7rem' : '0.9rem',
        color: 'rgba(255, 255, 255, 0.6)'
    };

    const contentStyle: React.CSSProperties = {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '0.75rem' : '2rem'
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: isMobile ? '1rem' : '1.5rem',
        marginBottom: isMobile ? '1rem' : '1.5rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    };

    const abilitiesGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: isMobile 
            ? 'repeat(2, 1fr)' 
            : 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: isMobile ? '0.5rem' : '1.5rem',
        marginBottom: isMobile ? '1rem' : '2rem'
    };

    const skillsComparisonStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '1rem' : '2rem',
        marginBottom: isMobile ? '1rem' : '2rem'
    };

    const skillsColumnStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '1rem' : '2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    };

    const skillsListStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '0.5rem' : '0.75rem'
    };

    return (
        <div style={containerStyle}>
            {/* Header */}
            <header style={headerStyle}>
                <button onClick={onBack} style={backButtonStyle}>
                    ← Назад
                </button>
                <h1 style={{ 
                    margin: 0, 
                    fontSize: isMobile ? '1rem' : '1.5rem',
                    fontWeight: isMobile ? 600 : 700,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {isMobile 
                        ? `Статистика ${user.given_name || user.name}`
                        : `Статистика ${user.family_name ? `${user.family_name} ${user.given_name}` : user.name}`
                    }
                </h1>
                <div style={{ width: isMobile ? '55px' : '120px' }} /> {/* Spacer for centering */}
            </header>

            {/* Hero Section */}
            <div style={heroStyle}>
                <div style={heroGlowStyle} />
                <div style={heroContentStyle}>
                    {/* Целевая позиция */}
                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(139, 92, 246, 0.2)',
                        border: '1px solid rgba(139, 92, 246, 0.5)',
                        borderRadius: '12px',
                        padding: '0.5rem 1rem',
                        fontSize: isMobile ? '0.8rem' : '0.9rem',
                        color: '#c4b5fd',
                        marginBottom: '1rem',
                        fontWeight: 600
                    }}>
                        🎯 Целевая позиция: {
                            gameState.selectedDifficulty === 'junior' ? 'Junior Analyst' :
                            gameState.selectedDifficulty === 'mid' ? 'Middle Analyst' :
                            gameState.selectedDifficulty === 'senior' ? 'Senior Analyst' :
                            'Staff Analyst'
                        }
                    </div>
                    
                    {/* Уровень мастерства */}
                    <div style={{ marginBottom: '1rem' }}>
                        <LevelBadge level={levelData.currentLevel} />
                    </div>
                    
                    <div style={statsRowStyle}>
                        <div style={statCardStyle}>
                            <div style={statIconStyle}>⭐</div>
                            <div>
                                <div style={statValueStyle}>{currentXP}</div>
                                <div style={statLabelStyle}>
                                    Опыта (XP)
                                    <button
                                        onClick={() => setShowXPModal(true)}
                                        style={{
                                            marginLeft: '0.5rem',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer',
                                            fontSize: '0.7rem',
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                                        }}
                                    >
                                        ?
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style={statCardStyle}>
                            <div style={statIconStyle}>🎯</div>
                            <div>
                                <div style={statValueStyle}>{totalQuestionsAnswered}/{QUESTION_DATABASE.length}</div>
                                <div style={statLabelStyle}>Вопросов пройдено</div>
                            </div>
                        </div>
                        <div style={statCardStyle}>
                            <div style={statIconStyle}>📊</div>
                            <div>
                                <div style={statValueStyle}>{averageOverallScore.toFixed(1)}/10</div>
                                <div style={statLabelStyle}>Средняя оценка за ответ</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={contentStyle}>
                {/* XP Progress Bar */}
                {levelData.nextLevel && (
                    <XPProgressBar
                        currentXP={levelData.currentXP}
                        nextLevelXP={levelData.nextLevelXP}
                        nextLevelName={levelData.nextLevelName}
                    />
                )}

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: isMobile ? '0.5rem' : '1rem',
                    marginBottom: '2rem',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                    paddingBottom: '0.5rem'
                }}>
                    <button
                        onClick={() => setActiveTab('stats')}
                        style={{
                            background: activeTab === 'stats' 
                                ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                                : 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            fontWeight: 600,
                            transition: 'all 0.3s',
                            opacity: activeTab === 'stats' ? 1 : 0.6
                        }}
                    >
                        📊 Статистика
                    </button>
                    <button
                        onClick={() => setActiveTab('leaderboard')}
                        style={{
                            background: activeTab === 'leaderboard' 
                                ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                                : 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            fontWeight: 600,
                            transition: 'all 0.3s',
                            opacity: activeTab === 'leaderboard' ? 1 : 0.6
                        }}
                    >
                        🏆 Лидерборд
                    </button>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'stats' && (
                    <>
                        {/* Quests Section */}
                <h2 style={sectionTitleStyle}>🎮 Текущие квесты</h2>
                {quests.map(quest => (
                    <QuestCard key={quest.id} quest={quest} />
                ))}

                {/* Abilities Section */}
                <h2 style={sectionTitleStyle}>⚔️ Способности аналитика</h2>
                <div style={abilitiesGridStyle}>
                    {abilities.map(ability => (
                        <AbilityCard
                            key={ability.key}
                            name={ability.name}
                            score={ability.score}
                            description={ability.description}
                            fullDescription={ability.fullDescription}
                        />
                    ))}
                </div>

                {/* Skills Comparison */}
                <div style={skillsComparisonStyle}>
                    <div style={skillsColumnStyle}>
                        <h3 style={{ ...sectionTitleStyle, marginBottom: '0.5rem' }}>
                            💪 Топ навыки
                        </h3>
                        <p style={{ 
                            fontSize: '0.75rem', 
                            color: 'rgba(255, 255, 255, 0.5)',
                            margin: '0 0 1rem 0',
                            fontStyle: 'italic'
                        }}>
                            Навыки с оценкой ≥50 баллов (шкала 0-100)
                        </p>
                        <div style={skillsListStyle}>
                            {strongestSkills.length > 0 ? (
                                strongestSkills.map((skill, index) => (
                                    <SkillItem
                                        key={skill.key}
                                        rank={index + 1}
                                        name={skill.name}
                                        score={skill.score}
                                        description={skill.description}
                                    />
                                ))
                            ) : (
                                <div style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5'
                                }}>
                                    {keyPointScores.length > 0 ? (
                                        <>
                                            Пока нет навыков с оценкой ≥50 баллов.<br/>
                                            Продолжайте практиковаться! 💪
                                        </>
                                    ) : (
                                        'Ответьте на вопросы, чтобы увидеть свои сильные стороны! 💪'
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={skillsColumnStyle}>
                        <h3 style={{ ...sectionTitleStyle, marginBottom: '1.5rem' }}>
                            📚 Прокачай эти навыки
                        </h3>
                        <div style={skillsListStyle}>
                            {weakestSkills.length > 0 ? (
                                weakestSkills.map((skill, index) => (
                                    <SkillItem
                                        key={skill.key}
                                        rank={index + 1}
                                        name={skill.name}
                                        score={skill.score}
                                        description={skill.description}
                                        isWeak
                                    />
                                ))
                            ) : (
                                <div style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    fontSize: '0.9rem'
                                }}>
                                    {keyPointScores.length < 5 
                                        ? 'Ответьте на больше вопросов, чтобы выявить точки роста! 📚'
                                        : 'У вас отличные результаты по всем навыкам! 🎉'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                    </>
                )}

                {/* Leaderboard Tab */}
                {activeTab === 'leaderboard' && (
                    <>
                        {/* Leaderboard Section */}
                        <h2 style={sectionTitleStyle}>🏆 Таблица лидеров</h2>
                        
                        {/* Level Filter Selector */}
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginBottom: '1.5rem',
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        }}>
                            {[
                                { value: 'all', label: 'Все', icon: '🌐' },
                                { value: 'junior', label: 'Junior', icon: '🌱' },
                                { value: 'mid', label: 'Middle', icon: '⭐' },
                                { value: 'senior', label: 'Senior', icon: '💎' },
                                { value: 'staff', label: 'Staff', icon: '👑' }
                            ].map((level) => (
                                <button
                                    key={level.value}
                                    onClick={() => setLeaderboardFilter(level.value as any)}
                                    style={{
                                        padding: isMobile ? '0.5rem 1rem' : '0.6rem 1.25rem',
                                        fontSize: isMobile ? '0.85rem' : '0.95rem',
                                        fontWeight: leaderboardFilter === level.value ? 700 : 500,
                                        background: leaderboardFilter === level.value
                                            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                                            : 'rgba(255, 255, 255, 0.05)',
                                        border: leaderboardFilter === level.value
                                            ? '2px solid rgba(139, 92, 246, 0.6)'
                                            : '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        boxShadow: leaderboardFilter === level.value
                                            ? '0 4px 12px rgba(139, 92, 246, 0.3)'
                                            : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (leaderboardFilter !== level.value) {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (leaderboardFilter !== level.value) {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }
                                    }}
                                >
                                    {level.icon} {level.label}
                                </button>
                            ))}
                        </div>

                        <Leaderboard
                            currentUser={user}
                            currentRating={gameState.rating}
                            currentRatingHistory={gameState.ratingHistory}
                            selectedDifficulty={leaderboardFilter}
                            leaderboardType="overall"
                        />

                        {/* Recent Performance Leaderboard */}
                        <h2 style={{ ...sectionTitleStyle, marginTop: '2rem' }}>🔥 Горячая форма (последние 20 вопросов)</h2>
                        <div style={{
                            fontSize: '0.9rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: '1rem',
                            fontStyle: 'italic',
                            textAlign: 'center'
                        }}>
                            Опыт основан только на последних 20 ответах - показывает текущую форму игроков
                        </div>
                        <Leaderboard
                            currentUser={user}
                            currentRating={recentRating}
                            currentRatingHistory={undefined}
                            selectedDifficulty={leaderboardFilter}
                            leaderboardType="recent"
                        />

                        {/* Rating History Chart */}
                        <h2 style={{ ...sectionTitleStyle, marginTop: '2rem' }}>📈 Динамика опыта</h2>
                        {gameState.questionAttempts && gameState.questionAttempts.length > 0 ? (
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '16px',
                                padding: isMobile ? '1.5rem' : '2rem',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <div style={{ width: '100%', overflow: 'hidden' }}>
                                    <svg 
                                        viewBox={`0 0 ${isMobile ? 300 : 600} ${isMobile ? 200 : 300}`}
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
                                            
                                            const maxRating = Math.max(...history, 100);
                                            const minRating = Math.min(...history, 0);
                                            const range = maxRating - minRating || 1;
                                            const width = isMobile ? 300 : 600;
                                            const height = isMobile ? 200 : 300;
                                            const padding = 40;
                                        
                                        const points = history.map((rating, index) => {
                                            const x = padding + (index / (history.length - 1 || 1)) * (width - padding * 2);
                                            const y = height - padding - ((rating - minRating) / range) * (height - padding * 2);
                                            return { x, y, rating };
                                        });

                                        const pathData = points.map((p, i) => 
                                            `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
                                        ).join(' ');

                                        return (
                                            <>
                                                {/* Grid lines */}
                                                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                                                    const y = height - padding - ratio * (height - padding * 2);
                                                    const value = Math.round(minRating + ratio * range);
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
                                                    fill="url(#gradient)"
                                                    opacity="0.2"
                                                />

                                                {/* Line */}
                                                <path
                                                    d={pathData}
                                                    fill="none"
                                                    stroke="url(#lineGradient)"
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
                                                                {p.rating}
                                                            </text>
                                                        )}
                                                    </g>
                                                ))}

                                                {/* Gradients */}
                                                <defs>
                                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                        <stop offset="0%" stopColor="#6366f1" />
                                                        <stop offset="100%" stopColor="#8b5cf6" />
                                                    </linearGradient>
                                                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#6366f1" />
                                                        <stop offset="100%" stopColor="#8b5cf6" />
                                                    </linearGradient>
                                                </defs>
                                            </>
                                        );
                                    })()}
                                    </svg>
                                </div>
                                <div style={{
                                    textAlign: 'center',
                                    marginTop: '1rem',
                                    fontSize: '0.9rem',
                                    color: 'rgba(255, 255, 255, 0.6)'
                                }}>
                                    Всего ответов: {totalQuestionsAnswered}
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '16px',
                                padding: '3rem 2rem',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                textAlign: 'center',
                                color: 'rgba(255, 255, 255, 0.5)'
                            }}>
                                📊 Ответьте на несколько вопросов, чтобы увидеть динамику опыта
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* XP Formula Modal */}
            {showXPModal && (
                <div
                    onClick={() => setShowXPModal(false)}
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
                            padding: isMobile ? '1.5rem' : '2rem',
                            maxWidth: '500px',
                            width: '100%',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <h2 style={{ 
                            marginTop: 0, 
                            marginBottom: '1rem',
                            fontSize: isMobile ? '1.3rem' : '1.5rem',
                            color: 'white'
                        }}>
                            ⭐ Как работает опыт (XP)?
                        </h2>
                        
                        <div style={{ fontSize: isMobile ? '0.9rem' : '1rem', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)' }}>
                            <p><strong style={{ color: '#a0e7a0' }}>За хорошие ответы (оценка ≥ 6):</strong></p>
                            <div style={{ 
                                background: 'rgba(160, 231, 160, 0.1)', 
                                padding: '1rem', 
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                border: '1px solid rgba(160, 231, 160, 0.2)'
                            }}>
                                <code style={{ fontSize: '1.1rem' }}>XP = 10 × сложность × (оценка / 10)</code>
                            </div>
                            
                            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.7)' }}>
                                Примеры:
                            </p>
                            <ul style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                                <li>Сложность 5, оценка 8 → <strong style={{ color: '#a0e7a0' }}>+40 XP</strong></li>
                                <li>Сложность 10, оценка 10 → <strong style={{ color: '#a0e7a0' }}>+100 XP</strong></li>
                                <li>Сложность 3, оценка 7 → <strong style={{ color: '#a0e7a0' }}>+21 XP</strong></li>
                            </ul>

                            <p style={{ marginTop: '1.5rem' }}><strong style={{ color: '#ff6b6b' }}>За плохие ответы (оценка &lt; 6):</strong></p>
                            <div style={{ 
                                background: 'rgba(255, 107, 107, 0.1)', 
                                padding: '1rem', 
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                border: '1px solid rgba(255, 107, 107, 0.2)'
                            }}>
                                <code style={{ fontSize: '1.1rem' }}>XP = -5 × сложность × ((6 - оценка) / 6)</code>
                            </div>
                            
                            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.7)' }}>
                                Примеры:
                            </p>
                            <ul style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                                <li>Сложность 5, оценка 5 → <strong style={{ color: '#ff6b6b' }}>-4 XP</strong></li>
                                <li>Сложность 5, оценка 3 → <strong style={{ color: '#ff6b6b' }}>-12 XP</strong></li>
                                <li>Сложность 10, оценка 2 → <strong style={{ color: '#ff6b6b' }}>-33 XP</strong></li>
                            </ul>

                            <div style={{
                                marginTop: '1.5rem',
                                padding: '1rem',
                                background: 'rgba(139, 92, 246, 0.1)',
                                borderRadius: '8px',
                                border: '1px solid rgba(139, 92, 246, 0.3)'
                            }}>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                    <strong style={{ color: '#c4b5fd' }}>💡 Как растить опыт:</strong><br/>
                                    • Отвечайте на вопросы с оценкой 6+ для получения XP<br/>
                                    • Более сложные вопросы дают больше XP<br/>
                                    • Качество ответа важнее количества<br/>
                                    • Плохие ответы отнимают XP - будьте внимательны!
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowXPModal(false)}
                            style={{
                                marginTop: '1.5rem',
                                width: '100%',
                                padding: isMobile ? '0.65rem' : '0.75rem',
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: isMobile ? '0.95rem' : '1rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Понятно!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatisticsScreenGamified;

