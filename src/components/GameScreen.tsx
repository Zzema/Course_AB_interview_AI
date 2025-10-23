import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { GameState, User, Feedback, Category, KeyPoint } from '../types';
import { QUESTION_DATABASE, CATEGORIES_CONFIG, KEY_POINT_TO_CATEGORY_MAP } from '../data/constants';
import { GEMINI_PROXY_URL } from '../config/config';
import { styles } from '../styles';
import { createInitialGameState } from '../lib/api';
import ProgressBar from './ProgressBar';
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

const MIN_ANSWER_LENGTH = 100;
const RECOMMENDED_MAX_LENGTH = 800;
const HARD_MAX_LENGTH = 1000;

const GameScreen: React.FC<GameScreenProps> = ({ user, onLogout, gameState, setGameState, onShowStats }) => {
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [lastEarnedPoints, setLastEarnedPoints] = useState<number>(0);
    const [levelUpNotification, setLevelUpNotification] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Получаем текущий вопрос с учетом уровня и рандомизации
    const currentQuestion = useMemo(() => {
        // Если уже есть текущий вопрос - возвращаем его
        if (gameState.currentQuestionId) {
            const existingQuestion = QUESTION_DATABASE.find(q => q.id === gameState.currentQuestionId);
            if (existingQuestion) {
                return existingQuestion;
            }
        }
        
        // Иначе выбираем новый вопрос
        const difficulty = gameState.selectedDifficulty || 'junior';
        const askedIds = gameState.askedQuestionIds || [];
        
        // Фильтруем вопросы по текущему уровню
        const currentLevelQuestions = difficulty === 'all' 
            ? QUESTION_DATABASE 
            : QUESTION_DATABASE.filter(q => q.seniority === difficulty);
        
        // Находим вопросы текущего уровня, которые еще не задавали
        const availableQuestions = currentLevelQuestions.filter(q => !askedIds.includes(q.id));
        
        if (availableQuestions.length > 0) {
            // Выбираем случайный вопрос из доступных
            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            const newQuestion = availableQuestions[randomIndex];
            
            // Сохраняем ID выбранного вопроса
            if (newQuestion && !gameState.currentQuestionId) {
                setTimeout(() => {
                    setGameState({
                        ...gameState,
                        currentQuestionId: newQuestion.id
                    });
                }, 0);
            }
            
            return newQuestion;
        }
        
        // Если вопросы текущего уровня закончились, переходим на следующий
        const levelOrder: Array<'junior' | 'mid' | 'senior' | 'staff'> = ['junior', 'mid', 'senior', 'staff'];
        const currentLevelIndex = levelOrder.indexOf(difficulty as any);
        
        if (currentLevelIndex < levelOrder.length - 1) {
            // Есть следующий уровень
            return null; // Сигнал для повышения уровня
        }
        
        // Все уровни пройдены
        return undefined; // Сигнал завершения игры
    }, [gameState.selectedDifficulty, gameState.askedQuestionIds, gameState.currentQuestionId, gameState, setGameState]);
    
    const isGameFinished = currentQuestion === undefined;
    const needLevelUp = currentQuestion === null;

    // Автоматическое повышение уровня
    React.useEffect(() => {
        if (needLevelUp && gameState.selectedDifficulty !== 'all') {
            const levelOrder: Array<'junior' | 'mid' | 'senior' | 'staff'> = ['junior', 'mid', 'senior', 'staff'];
            const currentLevelIndex = levelOrder.indexOf((gameState.selectedDifficulty || 'junior') as any);
            
            if (currentLevelIndex < levelOrder.length - 1) {
                const nextLevel = levelOrder[currentLevelIndex + 1];
                const levelIcons = { junior: '🌱', mid: '⭐', senior: '💎', staff: '👑' };
                const levelNames = { junior: 'Junior', mid: 'Mid', senior: 'Senior', staff: 'Staff' };
                
                // Показываем уведомление
                setLevelUpNotification(`${levelIcons[nextLevel]} Поздравляем! Переход на уровень ${levelNames[nextLevel]}`);
                
                // Скрываем через 3 секунды
                setTimeout(() => setLevelUpNotification(null), 3000);
                
                // Небольшая задержка для плавности
                setTimeout(() => {
                    setGameState({
                        ...gameState,
                        selectedDifficulty: nextLevel,
                        currentQuestionIndex: 0,
                        currentQuestionId: undefined, // Сбрасываем текущий вопрос при повышении уровня
                    });
                }, 100);
            }
        }
    }, [needLevelUp, gameState, setGameState]);

    // Отслеживание размера экрана
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Обработчик изменения текста с ограничением по длине
    const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        // Hard limit - не даем ввести больше 1000 символов
        if (newValue.length <= HARD_MAX_LENGTH) {
            setAnswer(newValue);
        }
    };

    // Запрет копипаста
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
    };

    // Определяем цвет и сообщение для счетчика символов
    const getCharCountInfo = () => {
        const length = answer.length;
        
        if (length < MIN_ANSWER_LENGTH) {
            return {
                color: '#ff5252',
                message: `Минимум ${MIN_ANSWER_LENGTH} символов`
            };
        } else if (length <= 500) {
            // От 100 до 500 символов - зеленый, оптимально
            return {
                color: '#00e676',
                message: 'Оптимальное количество символов ✓'
            };
        } else if (length <= RECOMMENDED_MAX_LENGTH) {
            // От 500 до 800 - желтый, предупреждаем о приближении к лимиту
            return {
                color: '#ffc400',
                message: `Можно короче (оптимально до 500)`
            };
        } else if (length <= HARD_MAX_LENGTH) {
            // От 800 до 1000 - оранжевый, рекомендуем сократить
            return {
                color: '#ff9800',
                message: `Рекомендуем сократить (лимит ${HARD_MAX_LENGTH})`
            };
        }
        
        return {
            color: '#ff5252',
            message: 'Лимит достигнут'
        };
    };

    const evaluateAnswer = useCallback(async () => {
        if (!answer.trim()) return;
        
        // Проверка минимальной длины
        if (answer.length < MIN_ANSWER_LENGTH) {
            alert(`Ответ слишком короткий. Минимум ${MIN_ANSWER_LENGTH} символов.`);
            return;
        }
        
        setIsLoading(true);

        try {
            // Используем Cloudflare Worker прокси вместо прямого запроса к Gemini
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
                
                Верни ТОЛЬКО JSON с полями: overallScore (число 0-10), evaluation (объект с массивами strengths и weaknesses), categoryBreakdown (массив объектов с полями category, score, comment).
            `;

            // Запрос через Cloudflare Worker
            const proxyResponse = await fetch(GEMINI_PROXY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                            type: 'object',
                        properties: {
                                overallScore: { type: 'number' },
                            evaluation: {
                                    type: 'object',
                                    properties: {
                                        strengths: { type: 'array', items: { type: 'string' } },
                                        weaknesses: { type: 'array', items: { type: 'string' } }
                                    },
                                    required: ['strengths', 'weaknesses']
                                },
                                categoryBreakdown: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            category: { type: 'string' },
                                            score: { type: 'number' },
                                            comment: { type: 'string' },
                                        },
                                        required: ['category', 'score', 'comment'],
                                    }
                                }
                            },
                            required: ['overallScore', 'evaluation', 'categoryBreakdown'],
                        }
                    }
                })
            });

            if (!proxyResponse.ok) {
                throw new Error(`Proxy error: ${proxyResponse.status} ${proxyResponse.statusText}`);
            }

            const proxyData = await proxyResponse.json();
            
            // Извлекаем текст из ответа Gemini
            const resultJsonText = proxyData.candidates?.[0]?.content?.parts?.[0]?.text || 
                                   JSON.stringify(proxyData);
            
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
            
            // Calculate rating with difficulty and quality bonuses
            const difficultyMultiplier = 1 + (currentQuestion.difficulty - 5) * 0.1;
            const basePoints = parsedFeedback.overallScore * difficultyMultiplier;
            
            let qualityBonus = 0;
            if (parsedFeedback.overallScore >= 8) {
                qualityBonus = 5;  // Отличный ответ
            } else if (parsedFeedback.overallScore >= 6) {
                qualityBonus = 2;  // Хороший ответ
            }
            
            const earnedPoints = Math.round(basePoints + qualityBonus);
            const newRating = gameState.rating + earnedPoints;
            
            // Save earned points for display in feedback
            setLastEarnedPoints(earnedPoints);
            
            // Update rating history
            const newRatingHistory = [...(gameState.ratingHistory || [0]), newRating];
            
            // 🆕 Сохраняем попытку ответа на вопрос
            const questionAttempt = {
                questionId: currentQuestion.id,
                timestamp: Date.now(),
                answer: answer,
                feedback: parsedFeedback,
                earnedPoints: earnedPoints,
                difficulty: currentQuestion.difficulty,
                seniority: currentQuestion.seniority,
            };
            
            const newQuestionAttempts = [...(gameState.questionAttempts || []), questionAttempt];
            
            setGameState({
                ...gameState,
                rating: newRating,
                categoryScores: newCategoryScores,
                keyPointScores: newKeyPointScores,
                consecutiveGoodAnswersOnSimpleQuestions: newStreak,
                ratingHistory: newRatingHistory,
                questionAttempts: newQuestionAttempts, // 🆕
            });

        } catch (error: any) {
            console.error("Error evaluating answer:", error);
            
            // Определяем тип ошибки для более понятного сообщения
            let errorMessage = "Произошла ошибка при оценке ответа. ";
            
            if (error.message?.includes('503') || error.message?.includes('Service Unavailable')) {
                errorMessage = "⚠️ Сервис Gemini AI временно перегружен.\n\n" +
                              "Это временная проблема на стороне Google.\n" +
                              "Попробуйте повторить через 1-2 минуты.\n\n" +
                              "Ваш ответ сохранен в поле ввода.";
            } else if (error.message?.includes('overloaded')) {
                errorMessage = "⚠️ Модель Gemini перегружена.\n\n" +
                              "Попробуйте еще раз через минуту.";
            } else {
                errorMessage += "Попробуйте обновить страницу или повторить попытку позже.";
            }
            
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [answer, currentQuestion, gameState, setGameState]);


    const handleDifficultyChange = (difficulty: 'all' | 'junior' | 'mid' | 'senior' | 'staff') => {
        setGameState({
            ...gameState,
            selectedDifficulty: difficulty,
            currentQuestionIndex: 0,
            askedQuestionIds: [], // Сбрасываем историю вопросов при смене уровня
            currentQuestionId: undefined, // Сбрасываем текущий вопрос
        });
        setFeedback(null);
        setAnswer('');
    };

    const handleNextQuestion = () => {
        setFeedback(null);
        setAnswer('');

        // Добавляем ID текущего вопроса в список заданных и сбрасываем currentQuestionId
        if (currentQuestion) {
            const updatedAskedIds = [...(gameState.askedQuestionIds || []), currentQuestion.id];
            
            // Обновляем прогресс для текущего уровня
            const currentLevel = currentQuestion.seniority as 'junior' | 'mid' | 'senior' | 'staff';
            const updatedLevelProgress = {
                ...gameState.levelProgress,
                [currentLevel]: {
                    ...gameState.levelProgress?.[currentLevel],
                    askedQuestionIds: [
                        ...(gameState.levelProgress?.[currentLevel]?.askedQuestionIds || []),
                        currentQuestion.id
                    ],
                    totalQuestions: gameState.levelProgress?.[currentLevel]?.totalQuestions || 
                        QUESTION_DATABASE.filter(q => q.seniority === currentLevel).length
                }
            };

        setGameState({
            ...gameState,
                askedQuestionIds: updatedAskedIds,
                currentQuestionIndex: gameState.currentQuestionIndex + 1,
                currentQuestionId: undefined, // Сбрасываем, чтобы выбрать новый вопрос
                levelProgress: updatedLevelProgress
            });
        }
    };

    if (isGameFinished) {
        const totalAsked = gameState.askedQuestionIds?.length || 0;

        return (
            <div style={{...styles.mainContent, ...styles.container, justifyContent: 'center', textAlign: 'center'}}>
                <h2 style={styles.title}>🎉 Поздравляем! Все уровни пройдены!</h2>
                <div style={{
                    backgroundColor: 'rgba(106, 90, 205, 0.1)',
                    borderRadius: '16px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    maxWidth: '500px'
                }}>
                    <p style={{fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-secondary)'}}>
                        Пройдены все уровни: 🌱 Junior → ⭐ Mid → 💎 Senior → 👑 Staff
                    </p>
                    <p style={{fontSize: '2rem', margin: '1rem 0'}}>
                        Ваш итоговый рейтинг: 
                    </p>
                    <p style={{fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: '0.5rem 0'}}>
                        {gameState.rating}
                    </p>
                    <p style={{fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '1rem'}}>
                        Пройдено вопросов: {totalAsked}
                    </p>
                </div>
                <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                    <button 
                        onClick={() => setGameState(createInitialGameState())} 
                        style={styles.submitButton}
                    >
                        🔄 Начать заново
                </button>
                </div>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <header style={{
                ...styles.header,
                flexDirection: 'column',
                gap: isMobile ? '0.5rem' : '1rem',
                padding: isMobile ? '0.75rem 1rem' : '1rem 1.5rem',
                alignItems: 'stretch',
                flexWrap: 'nowrap'
            }}>
                {/* Первая строка: Рейтинг + Уровень + Кнопки */}
                <div style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    gap: isMobile ? '0.5rem' : '1rem',
                    width: '100%'
                }}>
                    {/* Рейтинг и уровень в одной строке на мобилке */}
                    <div style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: isMobile ? '0.5rem' : '0.75rem',
                        flex: '1',
                        minWidth: 0
                    }}>
                        <div style={{
                            ...styles.rating, 
                            fontSize: isMobile ? '1.1rem' : '1.5rem',
                            whiteSpace: 'nowrap'
                        }} title="Рейтинг рассчитывается с учетом сложности вопросов и качества ответов">
                            🏆 {gameState.rating}
                        </div>
                        <div style={{
                            fontSize: isMobile ? '0.7rem' : '0.75rem',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'rgba(106, 90, 205, 0.1)',
                            padding: isMobile ? '0.2rem 0.5rem' : '0.25rem 0.6rem',
                            borderRadius: '6px',
                            fontWeight: '500',
                            whiteSpace: 'nowrap'
                        }}>
                            {({
                                'all': '🎯 Все',
                                'junior': '🌱 Junior',
                                'mid': '⭐ Mid',
                                'senior': '💎 Senior',
                                'staff': '👑 Staff'
                            }[gameState.selectedDifficulty || 'all'])}
                        </div>
                    </div>
                    
                    {/* Кнопки справа */}
                    <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                        {isMobile && (
                            <>
                                <button onClick={onShowStats} style={{...styles.logoutButton, padding: '0.4rem', fontSize: '1.1rem'}} title="Посмотреть статистику">
                                   📊
                                </button>
                                <button onClick={onLogout} style={{...styles.logoutButton, padding: '0.4rem', fontSize: '1.1rem'}} title="Выйти">
                                    ↩
                                </button>
                            </>
                        )}
                        {!isMobile && (
                            <>
                                <button onClick={onShowStats} style={styles.logoutButton}>Статистика</button>
                                <button onClick={onLogout} style={styles.logoutButton}>Выйти</button>
                            </>
                        )}
                    </div>
                </div>
                
                {/* Вторая строка: Селектор уровня + Прогресс */}
                <div style={{display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1rem', width: isMobile ? '100%' : 'auto', minWidth: 0, flex: isMobile ? '1 1 100%' : '1 1 auto'}}>
                    {/* Селектор уровня сложности */}
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flex: isMobile ? '0 0 auto' : '0 0 auto', minWidth: 0}}>
                        <div style={{fontSize: isMobile ? '0.7rem' : '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap'}}>Уровень</div>
                        <select 
                            value={gameState.selectedDifficulty || 'all'}
                            onChange={(e) => handleDifficultyChange(e.target.value as any)}
                            style={{
                                padding: isMobile ? '0.4rem 0.5rem' : '0.4rem 0.6rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-color)',
                                color: 'var(--text-primary)',
                                fontSize: isMobile ? '0.85rem' : '0.85rem',
                                cursor: 'pointer',
                                fontWeight: '500',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        >
                            <option value="all">{isMobile ? 'Все' : 'Все уровни'}</option>
                            <option value="junior">Junior</option>
                            <option value="mid">Mid</option>
                            <option value="senior">Senior</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>
                    
                    <div style={{width: isMobile ? 'auto' : '220px', flex: isMobile ? '1' : 'initial'}}>
                        {(() => {
                            const difficulty = gameState.selectedDifficulty || 'junior';
                            
                            // Используем askedQuestionIds и фильтруем по текущему уровню
                            const askedIds = gameState.askedQuestionIds || [];
                            const currentLevelQuestions = difficulty === 'all' 
                                ? QUESTION_DATABASE 
                                : QUESTION_DATABASE.filter(q => q.seniority === difficulty);
                            
                            // Подсчитываем, сколько вопросов текущего уровня уже задано
                            const askedThisLevel = difficulty === 'all'
                                ? askedIds.length  // Для "all" просто берем длину массива
                                : askedIds.filter(id => 
                                    currentLevelQuestions.some(q => q.id === id)
                                  ).length;
                            
                            const totalThisLevel = currentLevelQuestions.length;
                            const remainingThisLevel = totalThisLevel - askedThisLevel;
                            
                            // Отладка
                            console.log('Header Debug:', {
                                difficulty,
                                askedIds,
                                askedIdsLength: askedIds.length,
                                totalThisLevel,
                                askedThisLevel,
                                remainingThisLevel
                            });
                            
                            return (
                                <>
                        <div style={{fontSize: isMobile ? '0.65rem' : '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', textAlign: 'center'}}>
                                        {isMobile ? `${askedThisLevel} / ${remainingThisLevel}` : `Пройдено: ${askedThisLevel} | Осталось: ${remainingThisLevel}`}
                        </div>
                                    <ProgressBar value={(askedThisLevel / totalThisLevel) * 100} />
                                </>
                            );
                        })()}
                    </div>
                    
                    {/* Юзер инфо (только десктоп) */}
                    {!isMobile && (
                        <div style={{...styles.userDisplay, minWidth: 0, flex: '0 0 auto'}}>
                            {user.picture && <img src={user.picture} alt="avatar" style={styles.avatar} />}
                            <span style={{color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px'}}>{user.name}</span>
                        </div>
                    )}
                </div>
            </header>

            <main style={{
                ...styles.mainContent,
                padding: isMobile ? '0.75rem' : '1.5rem',
                gap: isMobile ? '0.75rem' : '1.5rem'
            }}>
                <div style={{
                    ...styles.gameScreen,
                    gap: isMobile ? '0.75rem' : '1.5rem'
                }} className="fade-in">
                    <div style={{
                        ...styles.questionCard,
                        padding: isMobile ? '0.75rem' : '1.5rem'
                    }}>
                        <div style={{
                            ...styles.questionMeta,
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'stretch' : 'center',
                            gap: isMobile ? '0.5rem' : '0',
                            fontSize: isMobile ? '0.7rem' : '0.9rem',
                            marginBottom: isMobile ? '0.5rem' : '1rem'
                        }}>
                            <span>Сложность: {currentQuestion.difficulty}/10</span>
                            <div style={{
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: isMobile ? 'flex-start' : 'flex-end', 
                                gap: '0.25rem', 
                                textAlign: isMobile ? 'left' : 'right'
                            }}>
                                <span>Уровень: {currentQuestion.seniority.charAt(0).toUpperCase() + currentQuestion.seniority.slice(1)}</span>
                                <span>Категория: {CATEGORIES_CONFIG[currentQuestion.categories[0] as Category].name}</span>
                            </div>
                        </div>
                        <p 
                            style={{
                                ...styles.questionText,
                                fontSize: isMobile ? '1rem' : '1.2rem',
                                lineHeight: isMobile ? '1.4' : '1.6',
                                marginBottom: isMobile ? '0.75rem' : '1.5rem',
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                MozUserSelect: 'none',
                                msUserSelect: 'none'
                            }}
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                        >
                            {currentQuestion.text}
                        </p>
                        <div style={{ position: 'relative', width: '100%' }}>
                        <textarea
                            value={answer}
                                onChange={handleAnswerChange}
                                onPaste={handlePaste}
                            placeholder="Введите ваш развернутый ответ... (минимум 100 символов)"
                            style={{
                                ...styles.textarea,
                                minHeight: isMobile ? '120px' : '150px',
                                fontSize: isMobile ? '0.9rem' : '1rem',
                                padding: isMobile ? '0.75rem' : '1rem'
                            }}
                            disabled={isLoading}
                        />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '0.5rem',
                                fontSize: '0.85rem',
                                padding: '0 0.5rem'
                            }}>
                                <div style={{ 
                                    color: getCharCountInfo().color,
                                    fontWeight: '500'
                                }}>
                                    {getCharCountInfo().message}
                                </div>
                                <div style={{ 
                                    color: getCharCountInfo().color,
                                    fontWeight: 'bold'
                                }}>
                                    {answer.length} / {HARD_MAX_LENGTH}
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={evaluateAnswer} 
                            style={{ 
                                ...styles.submitButton,
                                padding: isMobile ? '0.75rem' : '1rem',
                                fontSize: isMobile ? '0.95rem' : '1rem',
                                opacity: isLoading || answer.length < MIN_ANSWER_LENGTH ? 0.5 : 1 
                            }} 
                            disabled={isLoading || answer.length < MIN_ANSWER_LENGTH}
                            title={answer.length < MIN_ANSWER_LENGTH ? `Минимум ${MIN_ANSWER_LENGTH} символов` : ''}
                        >
                            {isLoading ? 'Оцениваем...' : 'Ответить'}
                        </button>
                    </div>
                </div>
            </main>

            {feedback && <FeedbackOverlay 
                feedback={feedback} 
                onNext={handleNextQuestion} 
                oldRating={gameState.rating - lastEarnedPoints}
                question={currentQuestion}
                earnedPoints={lastEarnedPoints}
            />}
            
            {/* Level Up Notification */}
            {levelUpNotification && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    zIndex: 10000,
                    animation: 'slideDown 0.3s ease-out'
                }} className="fade-in">
                    {levelUpNotification}
                </div>
            )}
        </div>
    );
};

export default GameScreen;