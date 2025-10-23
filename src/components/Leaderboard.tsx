import React, { useMemo } from 'react';
import { LEADERBOARD_DATA } from '../data/constants';
import { styles } from '../styles';
import { User } from '../types';

// Mini sparkline chart component
const MiniSparkline: React.FC<{ history: number[] }> = ({ history }) => {
    if (!history || history.length < 2) return null;
    
    const maxRating = Math.max(...history, 10);
    const width = 60;
    const height = 20;
    
    const points = history.map((rating, index) => {
        const x = (index / (history.length - 1)) * width;
        const y = height - (rating / maxRating) * height;
        return `${x},${y}`;
    }).join(' ');
    
    return (
        <svg width={width} height={height} style={{ marginLeft: '8px', verticalAlign: 'middle' }}>
            <polyline
                points={points}
                fill="none"
                stroke="var(--primary-color)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
            />
        </svg>
    );
};

interface LeaderboardProps {
    currentUser?: User;
    currentRating?: number;
    currentRatingHistory?: number[];
    selectedDifficulty?: 'all' | 'junior' | 'mid' | 'senior' | 'staff';
    leaderboardType?: 'overall' | 'recent'; // Тип рейтинга (общий или за последние 20 вопросов)
}

interface LeaderboardEntry {
    name: string;
    score: number;
    isCurrentUser?: boolean;
    ratingHistory?: number[];
    difficulty?: 'junior' | 'mid' | 'senior' | 'staff';
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
    currentUser, 
    currentRating, 
    currentRatingHistory,
    selectedDifficulty = 'mid',
    leaderboardType = 'overall'
}) => {
    const leaderboardData = useMemo(() => {
        // Если нет текущего пользователя или рейтинга, показываем статические данные
        if (!currentUser || currentRating === undefined) {
            return LEADERBOARD_DATA.map(entry => ({ ...entry, isCurrentUser: false }));
        }

        // Версия структуры лидерборда (увеличиваем при изменении LEADERBOARD_DATA)
        const LEADERBOARD_VERSION = 4; // Увеличили версию для поддержки recent rating
        const storageKey = leaderboardType === 'recent' ? 'leaderboard-scores-recent' : 'leaderboard-scores';
        const versionKey = `${storageKey}-version`;
        const savedVersion = localStorage.getItem(versionKey);
        
        // Если версия изменилась или не существует - сбрасываем старые данные
        if (!savedVersion || parseInt(savedVersion) !== LEADERBOARD_VERSION) {
            localStorage.removeItem(storageKey);
            localStorage.setItem(versionKey, LEADERBOARD_VERSION.toString());
        }

        // Получаем сохраненные результаты из localStorage
        const savedScores = localStorage.getItem(storageKey);
        let allScores: LeaderboardEntry[] = savedScores 
            ? JSON.parse(savedScores) 
            : [...LEADERBOARD_DATA.map(entry => ({ ...entry, isCurrentUser: false, difficulty: 'mid' }))];

        // Обновляем или добавляем текущего пользователя
        const existingUserIndex = allScores.findIndex(
            entry => entry.name === currentUser.given_name || entry.name === currentUser.name
        );

        const currentUserEntry: LeaderboardEntry = {
            name: currentUser.given_name || currentUser.name,
            score: currentRating,
            isCurrentUser: true,
            ratingHistory: currentRatingHistory,
            difficulty: selectedDifficulty === 'all' ? 'mid' : selectedDifficulty
        };

        if (existingUserIndex !== -1) {
            // Обновляем существующий результат
            allScores[existingUserIndex] = currentUserEntry;
        } else {
            // Добавляем нового пользователя
            allScores.push(currentUserEntry);
        }

        // Фильтруем по selectedDifficulty (если не 'all') и сортируем по убыванию рейтинга
        const filteredScores = allScores
            .filter(entry => selectedDifficulty === 'all' || entry.difficulty === selectedDifficulty)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        // Сохраняем обновленный лидерборд (всех пользователей, не только отфильтрованных)
        localStorage.setItem(storageKey, JSON.stringify(allScores));

        return filteredScores;
    }, [currentUser, currentRating, currentRatingHistory, selectedDifficulty, leaderboardType]);

    const difficultyLabel = {
        all: 'Все уровни',
        junior: 'Junior',
        mid: 'Middle',
        senior: 'Senior',
        staff: 'Staff'
    }[selectedDifficulty || 'mid'];

    return (
        <div style={styles.questionCard}>
            <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)', color: 'var(--secondary-color)' }}>
                Таблица лидеров
            </h3>
            <div style={{ 
                fontSize: '0.85rem', 
                color: 'var(--text-secondary)', 
                marginBottom: '0.75rem',
                fontStyle: 'italic'
            }}>
                🎯 Уровень: {difficultyLabel} Analyst
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    {leaderboardData.map((player, index) => {
                        const levelIcons = {
                            junior: '🌱',
                            mid: '⭐',
                            senior: '💎',
                            staff: '👑'
                        };
                        
                        return (
                            <tr 
                                key={`${player.name}-${index}`} 
                                style={{ 
                                    borderBottom: index < leaderboardData.length - 1 ? '1px solid var(--border-color)' : 'none',
                                    backgroundColor: player.isCurrentUser ? 'rgba(106, 90, 205, 0.1)' : 'transparent'
                                }}
                            >
                                <td style={{ 
                                    padding: '0.75rem 0.5rem',
                                    fontWeight: player.isCurrentUser ? 'bold' : 'normal'
                                }}>
                                    {index + 1}. {player.name} {player.isCurrentUser && '👤'}
                                </td>
                                {selectedDifficulty === 'all' && (
                                    <td style={{
                                        padding: '0.75rem 0.5rem',
                                        textAlign: 'center',
                                        fontSize: '1.2rem',
                                        width: '40px'
                                    }}>
                                        {levelIcons[player.difficulty || 'mid']}
                                    </td>
                                )}
                                <td style={{ 
                                    padding: '0.75rem 0.5rem', 
                                    textAlign: 'center',
                                    width: '80px'
                                }}>
                                    {player.ratingHistory && player.ratingHistory.length > 1 && (
                                        <MiniSparkline history={player.ratingHistory} />
                                    )}
                                </td>
                                <td style={{ 
                                    padding: '0.75rem 0.5rem', 
                                    textAlign: 'right', 
                                    color: 'var(--primary-color)', 
                                    fontWeight: 'bold',
                                    width: '60px'
                                }}>
                                    {player.score}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
