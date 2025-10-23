import React, { useMemo } from 'react';
import { Feedback, Question, Category } from '../types';
import { styles } from '../styles';
import { KEY_POINT_TO_CATEGORY_MAP, CATEGORIES_CONFIG } from '../data/constants';


interface FeedbackOverlayProps {
    feedback: Feedback;
    onNext: () => void;
    oldXP: number;
    question: Question;
    earnedXP?: number;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ feedback, onNext, oldXP, question, earnedXP }) => {
    
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
                
                {/* Детальная разбивка XP */}
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
                        ⭐ Ваш опыт: {oldXP} → <span style={{
                            color: earnedXP && earnedXP >= 0 ? '#10b981' : '#ef4444', 
                            fontWeight: 'bold'
                        }}>
                            {oldXP + (earnedXP ?? 0)} ({earnedXP && earnedXP >= 0 ? '+' : ''}{earnedXP ?? 0})
                        </span>
                    </p>
                    <div style={{
                        fontSize: window.innerWidth <= 768 ? '0.8rem' : '0.9rem', 
                        color: 'var(--text-secondary)', 
                        lineHeight: '1.8'
                    }}>
                        <strong>📊 Расчет опыта:</strong><br/>
                        <div style={{marginTop: '0.5rem'}}>
                            {earnedXP !== undefined && earnedXP > 0 ? (
                                // Положительный XP (оценка >= 4)
                                <>
                                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                                        <span>📝 Качество ответа:</span>
                                        <span style={{fontWeight: 'bold'}}>{feedback.overallScore}/10</span>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                                        <span>🎯 Сложность ({question.seniority}):</span>
                                        <span>{question.difficulty}/10</span>
                                    </div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        fontStyle: 'italic',
                                        marginTop: '0.25rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        💡 Сложные вопросы дают больше XP за хорошие ответы
                                    </div>
                                    <div style={{
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        marginTop: '0.75rem',
                                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                        padding: '0.5rem',
                                        borderRadius: '6px'
                                    }}>
                                        <span>⚙️ Формула:</span>
                                        <span style={{fontWeight: 'bold', color: '#10b981'}}>
                                            ({feedback.overallScore}/10) × {question.difficulty} × 10 = +{earnedXP} ✅
                                        </span>
                                    </div>
                                </>
                            ) : (
                                // Отрицательный XP (оценка < 4)
                                <>
                                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                                        <span>📝 Качество ответа:</span>
                                        <span style={{fontWeight: 'bold', color: '#ef4444'}}>{feedback.overallScore}/10 (нужно ≥4)</span>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                                        <span>🎯 Сложность ({question.seniority}):</span>
                                        <span>{question.difficulty}/10</span>
                                    </div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        fontStyle: 'italic',
                                        marginTop: '0.25rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        ⚠️ Плохой ответ (&lt;4) - штраф к опыту!
                                    </div>
                                    <div style={{
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        marginTop: '0.75rem',
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        padding: '0.5rem',
                                        borderRadius: '6px'
                                    }}>
                                        <span>⚙️ Штраф:</span>
                                        <span style={{fontWeight: 'bold', color: '#ef4444'}}>
                                            ((4-{feedback.overallScore})/4) × {question.difficulty} × (-5) = {earnedXP} ❌
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div style={{
                            marginTop: '0.75rem',
                            padding: '0.5rem',
                            background: earnedXP !== undefined && earnedXP > 0 
                                ? 'rgba(16, 185, 129, 0.1)' 
                                : 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '6px',
                            fontSize: window.innerWidth <= 768 ? '0.75rem' : '0.85rem',
                            fontStyle: 'italic',
                            color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                            💡 {earnedXP !== undefined && earnedXP > 0
                                ? 'Отвечайте на сложные вопросы с высокой оценкой для максимального опыта!' 
                                : 'Оценка <4 отнимает опыт. Стремитесь к 4+ баллам!'}
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