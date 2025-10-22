import React, { useMemo } from 'react';
import { Feedback, Question, Category } from '../types';
import { styles } from '../styles';
import { KEY_POINT_TO_CATEGORY_MAP, CATEGORIES_CONFIG } from '../constants';


interface FeedbackOverlayProps {
    feedback: Feedback;
    onNext: () => void;
    oldRating: number;
    question: Question;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ feedback, onNext, oldRating, question }) => {
    
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
        <div style={styles.feedbackOverlay} className="fade-in">
            <div style={styles.feedbackContent}>
                <div style={styles.overallScore}>{feedback.overallScore} / 10</div>
                 <p style={{...styles.subtitle, marginTop: '-0.5rem', marginBottom: '1.5rem', fontSize: '1.2rem'}}>
                    Ваш рейтинг: {oldRating} → <span style={{color: 'var(--primary-color)', fontWeight: 'bold'}}>{oldRating + feedback.overallScore}</span>
                </p>
                
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