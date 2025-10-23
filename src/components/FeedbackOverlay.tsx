import React, { useMemo } from 'react';
import { Feedback, Question, Category } from '../types';
import { styles } from '../styles';
import { KEY_POINT_TO_CATEGORY_MAP, CATEGORIES_CONFIG } from '../data/constants';


interface FeedbackOverlayProps {
    feedback: Feedback;
    onNext: () => void;
    oldRating: number;
    question: Question;
    earnedPoints?: number;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ feedback, onNext, oldRating, question, earnedPoints }) => {
    
    // Calculate rating breakdown for display
    const ratingBreakdown = useMemo(() => {
        const difficultyMultiplier = 1 + (question.difficulty - 5) * 0.1;
        const adjustedPoints = feedback.overallScore * difficultyMultiplier;
        
        let qualityBonus = 0;
        let qualityBonusText = '';
        if (feedback.overallScore >= 8) {
            qualityBonus = 5;
            qualityBonusText = 'Отличный ответ (≥8)';
        } else if (feedback.overallScore >= 6) {
            qualityBonus = 2;
            qualityBonusText = 'Хороший ответ (6-7)';
        }
        
        return {
            baseScore: feedback.overallScore,
            difficulty: question.difficulty,
            difficultyMultiplier: difficultyMultiplier.toFixed(2),
            adjustedPoints: adjustedPoints.toFixed(1),
            qualityBonus,
            qualityBonusText,
            totalEarned: earnedPoints ?? Math.round(adjustedPoints + qualityBonus)
        };
    }, [feedback.overallScore, question.difficulty, earnedPoints]);
    
    const filteredBreakdown = useMemo(() => {
        // If the question has no key points, we can't filter, so we show the breakdown as is from the API.
        if (!question.keyPoints || question.keyPoints.length === 0) {
            return feedback.categoryBreakdown;
        }

        // Create a set of relevant category *names* based on the question's key points.
        const relevantCategoryNames = new Set<string>();
        question.keyPoints.forEach(kp => {
            const categoryKey = KEY_POINT_TO_CATEGORY_MAP[kp];
            if (categoryKey) {
                relevantCategoryNames.add(CATEGORIES_CONFIG[categoryKey].name);
            }
        });
        
        // Filter the breakdown from Gemini to only include items whose category is in our relevant set.
        return feedback.categoryBreakdown.filter(item => 
            relevantCategoryNames.has(item.category)
        );
    }, [feedback.categoryBreakdown, question.keyPoints]);


    return (
        <div style={{
            ...styles.feedbackOverlay,
            alignItems: 'flex-start', // Выравниваем по верхнему краю
            padding: window.innerWidth <= 768 ? '1rem' : '2rem', // Меньше padding на мобильных
            paddingTop: window.innerWidth <= 768 ? '2rem' : '2rem' // Небольшой отступ сверху
        }} className="fade-in">
            <div style={{
                ...styles.feedbackContent,
                marginTop: window.innerWidth <= 768 ? '0' : 'auto', // На мобильных убираем авто-центрирование
                marginBottom: window.innerWidth <= 768 ? '0' : 'auto'
            }}>
                <div style={{
                    ...styles.overallScore,
                    fontSize: window.innerWidth <= 768 ? '3.5rem' : '5rem', // Меньше на мобильных
                    marginBottom: window.innerWidth <= 768 ? '1rem' : '1.5rem'
                }}>{feedback.overallScore} / 10</div>
                
                {/* Детальная разбивка очков */}
                <div style={{
                    backgroundColor: 'rgba(106, 90, 205, 0.1)',
                    borderRadius: '12px',
                    padding: window.innerWidth <= 768 ? '0.75rem' : '1rem',
                    marginTop: '-0.5rem',
                    marginBottom: window.innerWidth <= 768 ? '1rem' : '1.5rem'
                }}>
                    <p style={{
                        fontSize: window.innerWidth <= 768 ? '0.95rem' : '1.1rem', 
                        marginBottom: '0.75rem', 
                        textAlign: 'center'
                    }}>
                        Ваш рейтинг: {oldRating} → <span style={{color: 'var(--primary-color)', fontWeight: 'bold'}}>{oldRating + ratingBreakdown.totalEarned}</span>
                    </p>
                    <div style={{
                        fontSize: window.innerWidth <= 768 ? '0.8rem' : '0.9rem', 
                        color: 'var(--text-secondary)', 
                        lineHeight: '1.8'
                    }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                            <span>📝 Базовая оценка:</span>
                            <span style={{fontWeight: 'bold'}}>{ratingBreakdown.baseScore}/10</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                            <span>🎯 Сложность вопроса:</span>
                            <span>{ratingBreakdown.difficulty}/10</span>
                        </div>
                        <div style={{
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginBottom: '0.5rem',
                            paddingLeft: '1rem',
                            fontSize: '0.85rem',
                            fontStyle: 'italic'
                        }}>
                            <span>↳ Множитель сложности:</span>
                            <span>×{ratingBreakdown.difficultyMultiplier}</span>
                        </div>
                        <div style={{
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginBottom: '0.5rem',
                            backgroundColor: 'rgba(106, 90, 205, 0.05)',
                            padding: '0.5rem',
                            borderRadius: '6px'
                        }}>
                            <span>⚙️ После умножения:</span>
                            <span style={{fontWeight: 'bold'}}>
                                {ratingBreakdown.baseScore} × {ratingBreakdown.difficultyMultiplier} = {ratingBreakdown.adjustedPoints}
                            </span>
                        </div>
                        {ratingBreakdown.qualityBonus > 0 && (
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                                <span>⭐ Бонус за качество:</span>
                                <span style={{color: 'var(--success-color)', fontWeight: 'bold'}}>
                                    +{ratingBreakdown.qualityBonus} ({ratingBreakdown.qualityBonusText})
                                </span>
                            </div>
                        )}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '0.5rem',
                            paddingTop: '0.5rem',
                            borderTop: '2px solid var(--border-color)',
                            fontWeight: 'bold',
                            color: 'var(--primary-color)',
                            fontSize: '1rem'
                        }}>
                            <span>🏆 Итого заработано:</span>
                            <span>+{ratingBreakdown.totalEarned} очков</span>
                        </div>
                    </div>
                </div>
                
                <div style={styles.evaluationSummary}>
                    {feedback.evaluation.strengths.length > 0 && feedback.evaluation.strengths[0] && (
                        <div style={styles.summarySection}>
                            <h4 style={{ ...styles.summaryTitle, color: 'var(--primary-color)' }}>✅ Сильные стороны</h4>
                            <ul style={styles.summaryList}>
                                {feedback.evaluation.strengths.map((s, i) => (
                                    <li key={`s-${i}`} style={styles.summaryItem}>
                                        <span style={{
                                            position: 'absolute', left: '0', top: '0.5em',
                                            width: '8px', height: '8px', borderRadius: '50%',
                                            backgroundColor: 'var(--primary-color)'
                                        }}></span>
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {feedback.evaluation.weaknesses.length > 0 && feedback.evaluation.weaknesses[0] && (
                        <div style={styles.summarySection}>
                            <h4 style={{ ...styles.summaryTitle, color: 'var(--error-color)' }}>💡 Точки роста</h4>
                            <ul style={styles.summaryList}>
                                {feedback.evaluation.weaknesses.map((w, i) => (
                                     <li key={`w-${i}`} style={styles.summaryItem}>
                                        <span style={{
                                            position: 'absolute', left: '0', top: '0.5em',
                                            width: '8px', height: '8px', borderRadius: '50%',
                                            backgroundColor: 'var(--error-color)'
                                        }}></span>
                                        {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {filteredBreakdown.length > 0 && (
                    <div style={styles.categoryScores}>
                        <h4 style={{...styles.summaryTitle, color: 'var(--text-primary)', textAlign: 'center', marginBottom: '1rem'}}>Разбор по ключевым аспектам</h4>
                        {filteredBreakdown.map(item => (
                            <div key={item.category}>
                                <strong>{item.category}: {item.score}/10</strong> - <span style={{color: 'var(--text-secondary)'}}>{item.comment}</span>
                            </div>
                        ))}
                    </div>
                )}


                <button onClick={onNext} style={styles.submitButton}>
                    Следующий вопрос
                </button>
            </div>
        </div>
    );
};

export default FeedbackOverlay;