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
}

interface LeaderboardEntry {
    name: string;
    score: number;
    isCurrentUser?: boolean;
    ratingHistory?: number[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser, currentRating, currentRatingHistory }) => {
    const leaderboardData = useMemo(() => {
        // Если нет текущего пользователя или рейтинга, показываем статические данные
        if (!currentUser || currentRating === undefined) {
            return LEADERBOARD_DATA.map(entry => ({ ...entry, isCurrentUser: false }));
        }

        // Версия структуры лидерборда (увеличиваем при изменении LEADERBOARD_DATA)
        const LEADERBOARD_VERSION = 2;
        const versionKey = 'leaderboard-version';
        const savedVersion = localStorage.getItem(versionKey);
        
        // Если версия изменилась или не существует - сбрасываем старые данные
        if (!savedVersion || parseInt(savedVersion) !== LEADERBOARD_VERSION) {
            localStorage.removeItem('leaderboard-scores');
            localStorage.setItem(versionKey, LEADERBOARD_VERSION.toString());
        }

        // Получаем сохраненные результаты из localStorage
        const savedScores = localStorage.getItem('leaderboard-scores');
        let allScores: LeaderboardEntry[] = savedScores 
            ? JSON.parse(savedScores) 
            : [...LEADERBOARD_DATA.map(entry => ({ ...entry, isCurrentUser: false }))];

        // Обновляем или добавляем текущего пользователя
        const existingUserIndex = allScores.findIndex(
            entry => entry.name === currentUser.given_name || entry.name === currentUser.name
        );

        const currentUserEntry: LeaderboardEntry = {
            name: currentUser.given_name || currentUser.name,
            score: currentRating,
            isCurrentUser: true,
            ratingHistory: currentRatingHistory
        };

        if (existingUserIndex !== -1) {
            // Обновляем существующий результат
            allScores[existingUserIndex] = currentUserEntry;
        } else {
            // Добавляем нового пользователя
            allScores.push(currentUserEntry);
        }

        // Сортируем по убыванию рейтинга и берем топ-10
        const sortedScores = allScores
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        // Сохраняем обновленный лидерборд
        localStorage.setItem('leaderboard-scores', JSON.stringify(sortedScores));

        return sortedScores;
    }, [currentUser, currentRating, currentRatingHistory]);

    return (
        <div style={styles.questionCard}>
            <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)', color: 'var(--secondary-color)' }}>
                Таблица лидеров
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    {leaderboardData.map((player, index) => (
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
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
