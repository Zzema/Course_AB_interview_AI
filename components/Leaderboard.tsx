import React from 'react';
import { LEADERBOARD_DATA } from '../constants';
import { styles } from '../styles';

const Leaderboard: React.FC = () => (
    <div style={styles.questionCard}>
        <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)', color: 'var(--secondary-color)' }}>Таблица лидеров</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
                {LEADERBOARD_DATA.map((player, index) => (
                    <tr key={index} style={{ borderBottom: index < LEADERBOARD_DATA.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{index + 1}. {player.name}</td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: 'var(--primary-color)', fontWeight: 'bold' }}>{player.score}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default Leaderboard;
