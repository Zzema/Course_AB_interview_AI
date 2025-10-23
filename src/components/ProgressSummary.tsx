import React, { useMemo, useState, useEffect } from 'react';
import { GameState, User } from '../types';
import { CATEGORIES_CONFIG } from '../data/constants';
import { styles } from '../styles';
import ProgressBar from './ProgressBar';

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
    
    const categoryAverages = useMemo(() => {
        const scores = gameState.categoryScores;
        return Object.keys(scores).reduce((acc, key) => {
            const value = scores[key];
            acc[key] = value.count > 0 ? (value.totalScore / value.count) * 10 : 0;
            return acc;
        }, {} as Record<string, number>);
    }, [gameState.categoryScores]);

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
            <p style={styles.subtitle}>Ваш текущий рейтинг: <span style={{fontSize: '1.5rem', color: 'var(--primary-color)'}}>{gameState.rating}</span></p>

            <div style={styles.progressCategoryList}>
                {Object.entries(CATEGORIES_CONFIG).map(([key, {name, color}]) => (
                    <div key={key}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                            <span style={{fontSize: '0.9rem'}}>{name}</span>
                            <span style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>{Math.round(categoryAverages[key] || 0)}%</span>
                        </div>
                        <ProgressBar value={categoryAverages[key] || 0} color={color} />
                    </div>
                ))}
            </div>

            <button onClick={onContinue} style={styles.submitButton}>Продолжить тренировку</button>
            <div style={buttonGroupStyle}>
                 <button onClick={onReset} style={{...styles.secondaryButton, marginTop: 0}}>Начать заново</button>
                 <button onClick={onShowStats} style={{...styles.secondaryButton, marginTop: 0}}>Статистика 📊</button>
            </div>
        </div>
    )
};

export default ProgressSummary;