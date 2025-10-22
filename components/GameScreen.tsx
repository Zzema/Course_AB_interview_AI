import React, { useState, useMemo, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { GameState, User, Feedback, Category, KeyPoint } from '../types';
import { QUESTION_DATABASE, CATEGORIES_CONFIG, KEY_POINT_TO_CATEGORY_MAP } from '../constants';
import { styles } from '../styles';
import { createInitialGameState } from '../api';
import ProgressBar from './ProgressBar';
import Leaderboard from './Leaderboard';
import FeedbackOverlay from './FeedbackOverlay';

interface GameScreenProps {
    user: User;
    onLogout: () => void;
    gameState: GameState;
    setGameState: (state: GameState) => void;
    onShowStats: () => void;
}

const SIMPLE_QUESTION_DIFFICULTY = 4;
const GOOD_SCORE_THRESHOLD = 8;
const STREAK_THRESHOLD = 3;

// Create a reverse map from category name (e.g., "Статистика") to category key (e.g., "statistics")
const categoryNameMap: Record<string, string> = Object.entries(CATEGORIES_CONFIG).reduce((acc, [key, { name }]) => {
    acc[name] = key;
    return acc;
}, {} as Record<string, string>);

const GameScreen: React.FC<GameScreenProps> = ({ user, onLogout, gameState, setGameState, onShowStats }) => {
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    const currentQuestion = useMemo(() => QUESTION_DATABASE[gameState.currentQuestionIndex], [gameState.currentQuestionIndex]);
    const isGameFinished = gameState.currentQuestionIndex >= QUESTION_DATABASE.length;

    const categoryAverages = useMemo(() => {
        const scores = gameState.categoryScores;
        return Object.keys(scores).reduce((acc, key) => {
            const value = scores[key];
            acc[key] = value.count > 0 ? (value.totalScore / value.count) * 10 : 0;
            return acc;
        }, {} as Record<string, number>);
    }, [gameState.categoryScores]);

    const evaluateAnswer = useCallback(async () => {
        if (!answer.trim()) return;
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const model = 'gemini-2.5-flash';
            
            const prompt = `
                Ты — опытный Staff-уровня интервьюер из BigTech, оценивающий ответ кандидата.
                
                КОНТЕКСТ ВОПРОСА:
                - Вопрос: "${currentQuestion.text}"
                - Ключевые моменты для проверки (самое важное!): ${currentQuestion.keyPoints?.join(', ') || 'Нет специфичных'}
                - Категории вопроса: ${currentQuestion.categories.map(c => CATEGORIES_CONFIG[c as Category].name).join(', ')}

                ОТВЕТ КАНДИДATA:
                "${answer}"

                ТВОЯ ЗАДАЧА:
                Оцени ответ и предоставь детальную, но структурированную обратную связь в формате JSON.

                ОБЩИЕ ПРИНЦИПЫ ОЦЕНКИ:
                - Твоя оценка должна в первую очередь базироваться на том, насколько кандидат раскрыл 'Ключевые моменты для проверки'.
                - Краткий, но точный ответ лучше длинного и размытого. Не снижай оценку за лаконичность, если ключевые моменты раскрыты.

                ПРАВИЛА ДЛЯ JSON:
                1.  "overallScore": Общая оценка от 0 до 10.
                2.  "evaluation": { 
                        "strengths": ["Список из 1-2 ключевых сильных сторон ответа."], 
                        "weaknesses": ["Список из 1-2 главных точек роста. САМОЕ ВАЖНОЕ: здесь ты должен ЧЕТКО указать, какие из 'Ключевых моментов для проверки' кандидат упустил или понял неверно. Например: 'Не был раскрыт аспект статистической мощности' или 'Неверно интерпретирована проблема множественных сравнений'."] 
                    }
                3.  "categoryBreakdown": Массив объектов. Для КАЖДОЙ категории из списка "Категории вопроса", предоставь:
                    -   "category": Название категории.
                    -   "score": Оценка от 0 до 10.
                    -   "comment": Развернутый, но лаконичный комментарий (10-20 слов), объясняющий оценку по этой категории.
                
                Верни ТОЛЬКО JSON.
            `;
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            overallScore: { type: Type.NUMBER },
                            evaluation: {
                                type: Type.OBJECT,
                                properties: {
                                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
                                },
                                required: ["strengths", "weaknesses"]
                            },
                            categoryBreakdown: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        category: { type: Type.STRING },
                                        score: { type: Type.NUMBER },
                                        comment: { type: Type.STRING },
                                    },
                                    required: ["category", "score", "comment"],
                                }
                            }
                        },
                         required: ["overallScore", "evaluation", "categoryBreakdown"],
                    }
                }
            });

            const resultJsonText = response.text;
            const parsedFeedback: Feedback = JSON.parse(resultJsonText);
            setFeedback(parsedFeedback);

            const newCategoryScores = { ...gameState.categoryScores };
            const newKeyPointScores = { ...gameState.keyPointScores };

            parsedFeedback.categoryBreakdown.forEach(item => {
                const categoryKey = categoryNameMap[item.category] as Category;
                if (categoryKey && newCategoryScores[categoryKey]) {
                    newCategoryScores[categoryKey].totalScore += item.score;
                    newCategoryScores[categoryKey].count += 1;

                    // Distribute category score to the relevant keypoints of the current question
                    currentQuestion.keyPoints?.forEach(kp => {
                        if (KEY_POINT_TO_CATEGORY_MAP[kp] === categoryKey) {
                             if (!newKeyPointScores[kp]) {
                                newKeyPointScores[kp] = { totalScore: 0, count: 0 };
                            }
                            newKeyPointScores[kp].totalScore += item.score;
                            newKeyPointScores[kp].count += 1;
                        }
                    });
                }
            });

            // Adaptive question logic
            const isSimpleQuestion = currentQuestion.difficulty <= SIMPLE_QUESTION_DIFFICULTY;
            const isGoodScore = parsedFeedback.overallScore >= GOOD_SCORE_THRESHOLD;
            let newStreak = gameState.consecutiveGoodAnswersOnSimpleQuestions || 0;

            if (isSimpleQuestion && isGoodScore) {
                newStreak++;
            } else {
                newStreak = 0;
            }
            
            setGameState({
                ...gameState,
                rating: gameState.rating + parsedFeedback.overallScore,
                categoryScores: newCategoryScores,
                keyPointScores: newKeyPointScores,
                consecutiveGoodAnswersOnSimpleQuestions: newStreak,
            });

        } catch (error: any) {
            console.error("Error evaluating answer:", error);
            alert("Произошла ошибка при оценке ответа. Возможно, проблема с API. Попробуйте обновить страницу или повторить попытку позже.");
        } finally {
            setIsLoading(false);
        }
    }, [answer, currentQuestion, gameState, setGameState]);


    const handleNextQuestion = () => {
        setFeedback(null);
        setAnswer('');

        let nextIndex = gameState.currentQuestionIndex + 1;
        let streakAfterMove = gameState.consecutiveGoodAnswersOnSimpleQuestions;

        if (gameState.consecutiveGoodAnswersOnSimpleQuestions >= STREAK_THRESHOLD) {
             const nextHardQuestionIndex = QUESTION_DATABASE.findIndex(
                (q, index) => index > gameState.currentQuestionIndex && q.difficulty > SIMPLE_QUESTION_DIFFICULTY
            );
            
            if (nextHardQuestionIndex !== -1) {
                console.log(`Streak threshold met! Jumping from ${gameState.currentQuestionIndex} to ${nextHardQuestionIndex}`);
                nextIndex = nextHardQuestionIndex;
                streakAfterMove = 0; // Reset streak after jumping
            }
        }

        setGameState({
            ...gameState,
            currentQuestionIndex: nextIndex,
            consecutiveGoodAnswersOnSimpleQuestions: streakAfterMove,
        });
    };

    if (isGameFinished) {
        return (
            <div style={{...styles.mainContent, ...styles.container, justifyContent: 'center', textAlign: 'center'}}>
                <h2 style={styles.title}>Тренировка завершена!</h2>
                <p style={{fontSize: '1.5rem'}}>Ваш итоговый рейтинг: <span style={{color: 'var(--primary-color)'}}>{gameState.rating}</span></p>
                <button onClick={() => setGameState(createInitialGameState())} style={styles.submitButton}>
                    Начать заново
                </button>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.rating}>
                    🏆 {gameState.rating}
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                    <div style={{width: '200px'}}>
                        <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', textAlign: 'center'}}>
                            Вопрос {gameState.currentQuestionIndex + 1} / {QUESTION_DATABASE.length}
                        </div>
                        <ProgressBar value={(gameState.currentQuestionIndex / QUESTION_DATABASE.length) * 100} />
                    </div>
                     <button onClick={onShowStats} style={{...styles.logoutButton, padding: '0.5rem'}} title="Посмотреть статистику">
                       📊
                    </button>
                </div>
                <div style={styles.userDisplay}>
                    {user.picture && <img src={user.picture} alt="avatar" style={styles.avatar} />}
                    <span style={{color: 'var(--text-secondary)'}}>{user.name}</span>
                    <button onClick={onLogout} style={{...styles.logoutButton, padding: '0.5rem'}} title="Выйти">
                        ↩
                    </button>
                </div>
            </header>

            <main style={styles.mainContent}>
                <div style={styles.gameScreen} className="fade-in">
                    <div style={styles.questionCard}>
                        <div style={styles.questionMeta}>
                            <span>Сложность: {currentQuestion.difficulty}/10</span>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', textAlign: 'right'}}>
                                <span>Уровень: {currentQuestion.seniority.charAt(0).toUpperCase() + currentQuestion.seniority.slice(1)}</span>
                                <span>Категория: {CATEGORIES_CONFIG[currentQuestion.categories[0] as Category].name}</span>
                            </div>
                        </div>
                        <p style={styles.questionText}>{currentQuestion.text}</p>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Введите ваш развернутый ответ..."
                            style={styles.textarea}
                            disabled={isLoading}
                        />
                        <button onClick={evaluateAnswer} style={{ ...styles.submitButton, opacity: isLoading || !answer.trim() ? 0.5 : 1 }} disabled={isLoading || !answer.trim()}>
                            {isLoading ? 'Оцениваем...' : 'Ответить'}
                        </button>
                    </div>
                    <Leaderboard />
                </div>
            </main>

            <footer style={styles.statsFooter}>
                {Object.entries(CATEGORIES_CONFIG).map(([key, { name, color }]) => (
                    <div key={key} style={styles.categoryStat} title={name}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                        <ProgressBar value={categoryAverages[key]} color={color} />
                    </div>
                ))}
            </footer>

            {feedback && <FeedbackOverlay 
                feedback={feedback} 
                onNext={handleNextQuestion} 
                oldRating={gameState.rating - feedback.overallScore}
                question={currentQuestion}
            />}
        </div>
    );
};

export default GameScreen;