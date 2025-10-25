import React, { useState, useEffect, useCallback } from 'react';
import UserSetup from './components/UserSetup';
import ProgressSummary from './components/ProgressSummary';
import GameScreen from './components/GameScreen';
import StatisticsScreen from './components/StatisticsScreenGamified';
import LearningPathScreen from './components/LearningPathScreen';
import ModuleDetailScreen from './components/ModuleDetailScreen';
import * as api from './lib/api';
import { GameState, Session, User } from './types';
import { checkAndUpdateSeries, getCurrentDateString } from './lib/activitySeriesManager';

// Define google on the window object for TypeScript
declare global {
    interface Window {
        google: any;
    }
}

function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [view, setView] = useState<'login' | 'summary' | 'game' | 'stats' | 'learningPath' | 'moduleDetail' | 'moduleGame'>('login');
    const [previousView, setPreviousView] = useState<'summary' | 'game'>('summary');
    const [isStarting, setIsStarting] = useState(true);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

    // Скролл к началу при смене view
    useEffect(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, [view]);

    useEffect(() => {
        const savedUserString = localStorage.getItem('ab-hero-user');
        if (savedUserString) {
            try {
                const savedUser: User = JSON.parse(savedUserString);
                handleLogin(savedUser);
            } catch (error) {
                console.error("Failed to parse saved user:", error);
                localStorage.removeItem('ab-hero-user'); // Clear corrupted data
                setIsStarting(false);
            }
        } else {
            setIsStarting(false);
        }
    }, []); 

    const handleLogin = useCallback(async (user: User, selectedLevel?: 'junior' | 'mid' | 'senior' | 'staff') => {
        console.log('🔵 handleLogin START', { user: user.email, selectedLevel });
        setIsStarting(true);
        
        try {
            localStorage.setItem('ab-hero-user', JSON.stringify(user));
            
            console.log('🔵 Fetching game state...');
            const existingState = await api.fetchGameState(user.email);
            console.log('🔵 Game state fetched:', existingState ? 'exists' : 'new user');

            if (existingState) {
                // Migrate old data: add ratingHistory if it doesn't exist
                if (!existingState.ratingHistory) {
                    existingState.ratingHistory = [0, existingState.rating];
                }
                // Migrate old data: add selectedDifficulty if it doesn't exist
                if (!existingState.selectedDifficulty) {
                    existingState.selectedDifficulty = 'junior';
                }
                // Migrate old data: add askedQuestionIds if it doesn't exist
                if (!existingState.askedQuestionIds) {
                    existingState.askedQuestionIds = [];
                }
                // Migrate old data: add levelProgress if it doesn't exist
                if (!existingState.levelProgress) {
                    console.log('🔄 Migrating: Creating levelProgress');
                    const { QUESTION_DATABASE } = await import('./data/constants');
                    existingState.levelProgress = {
                        junior: {
                            askedQuestionIds: existingState.askedQuestionIds?.filter(id => 
                                QUESTION_DATABASE.find(q => q.id === id)?.seniority === 'junior'
                            ) || [],
                            totalQuestions: QUESTION_DATABASE.filter(q => q.seniority === 'junior').length,
                            averageScore: 0
                        },
                        mid: {
                            askedQuestionIds: existingState.askedQuestionIds?.filter(id => 
                                QUESTION_DATABASE.find(q => q.id === id)?.seniority === 'mid'
                            ) || [],
                            totalQuestions: QUESTION_DATABASE.filter(q => q.seniority === 'mid').length,
                            averageScore: 0
                        },
                        senior: {
                            askedQuestionIds: existingState.askedQuestionIds?.filter(id => 
                                QUESTION_DATABASE.find(q => q.id === id)?.seniority === 'senior'
                            ) || [],
                            totalQuestions: QUESTION_DATABASE.filter(q => q.seniority === 'senior').length,
                            averageScore: 0
                        },
                        staff: {
                            askedQuestionIds: existingState.askedQuestionIds?.filter(id => 
                                QUESTION_DATABASE.find(q => q.id === id)?.seniority === 'staff'
                            ) || [],
                            totalQuestions: QUESTION_DATABASE.filter(q => q.seniority === 'staff').length,
                            averageScore: 0
                        }
                    };
                    console.log('✅ Migration complete:', existingState.levelProgress);
                } else {
                    console.log('✅ levelProgress already exists:', existingState.levelProgress);
                }
                
                // Migrate old data: add questionAttempts if it doesn't exist
                if (!existingState.questionAttempts) {
                    console.log('🔄 Migrating: Creating questionAttempts');
                    existingState.questionAttempts = [];
                }
                
                // Migrate: Sync rating with XP from questionAttempts
                if (existingState.questionAttempts && existingState.questionAttempts.length > 0) {
                    console.log('🔄 Migrating: Syncing rating with actual XP from questionAttempts');
                    let calculatedRating = 0;
                    existingState.questionAttempts.forEach(attempt => {
                        calculatedRating += attempt.earnedXP ?? 0;
                    });
                    
                    // Only update if there's a mismatch
                    if (existingState.rating !== calculatedRating) {
                        console.log(`🔄 Rating mismatch: ${existingState.rating} → ${calculatedRating}`);
                        existingState.rating = calculatedRating;
                        
                        // Rebuild rating history from attempts
                        const newRatingHistory = [0];
                        let cumulative = 0;
                        existingState.questionAttempts.forEach(attempt => {
                            cumulative += attempt.earnedXP ?? 0;
                            newRatingHistory.push(cumulative);
                        });
                        existingState.ratingHistory = newRatingHistory;
                        console.log(`✅ Rating synced: ${calculatedRating} XP`);
                    } else {
                        console.log(`✅ Rating already in sync: ${calculatedRating} XP`);
                    }
                }
                
                // Migrate questionAttempts: add earnedXP if missing
                if (existingState.questionAttempts && existingState.questionAttempts.length > 0) {
                    const hasOldAttempts = existingState.questionAttempts.some(a => a.earnedXP === undefined);
                    if (hasOldAttempts) {
                        console.log('🔄 Migrating: Adding earnedXP to questionAttempts');
                        const { calculateXP } = await import('./lib/xpCalculator');
                        existingState.questionAttempts = existingState.questionAttempts.map(attempt => {
                            if (attempt.earnedXP === undefined) {
                                const xpResult = calculateXP(attempt.feedback.overallScore, attempt.difficulty);
                                return { ...attempt, earnedXP: xpResult.earnedXP };
                            }
                            return attempt;
                        });
                        console.log('✅ Migration complete: earnedXP added');
                    }
                }
                
                // НОВОЕ: Проверяем и обновляем серию активности при логине
                console.log('🔥 Checking activity series...');
                const currentDate = getCurrentDateString();
                const { series, status, previousSeries } = checkAndUpdateSeries(existingState, currentDate);
                
                console.log('🔥 Series status:', status, {
                    currentSeries: series.currentSeries,
                    previousSeries,
                    todayCompleted: series.todayCompleted
                });
                
                existingState.activitySeries = series;
                
                // TODO: Показать модалку если серия прервана (status === 'broken' && previousSeries > 3)
                // Это будет реализовано в Этапе 3
                
                setSession({ user, gameState: existingState });
                // Показываем summary если пользователь уже отвечал на вопросы
                if (existingState.questionAttempts && existingState.questionAttempts.length > 0) {
                    setView('summary');
                } else {
                    setView('game');
                }
            } else {
                // Новый пользователь
                // Если уровень еще не выбран - показываем экран выбора (view остается 'login')
                if (!selectedLevel) {
                    console.log('🔵 New user, waiting for level selection...');
                    setIsStarting(false);
                    return;
                }
                
                // Создаем состояние с выбранным уровнем
                console.log('🔵 Creating new game state for new user...');
                const newGameState = api.createInitialGameState();
                console.log('🔵 Setting selected difficulty:', selectedLevel);
                newGameState.selectedDifficulty = selectedLevel;
                console.log('🔵 Setting session...');
                setSession({ user, gameState: newGameState });
                console.log('🔵 Setting view to game...');
                setView('game');
            }
            console.log('🔵 handleLogin COMPLETE');
        } catch (error) {
            console.error('❌ Error in handleLogin:', error);
            alert('Произошла ошибка при входе. Попробуйте еще раз.');
        } finally {
            setIsStarting(false);
        }
    }, []);

    const handleLogout = useCallback(() => {
        // Important: disable auto sign-in for standard Google flow
        if (window.google) {
            window.google.accounts.id.disableAutoSelect();
        }
        localStorage.removeItem('ab-hero-user');
        setSession(null);
        setView('login');
    }, []);

    const handleReset = () => {
        if (session) {
            const newGameState = api.createInitialGameState();
            setSession({ ...session, gameState: newGameState });
            setView('game');
        }
    };

    const handleUpdateGameState = useCallback((newState: GameState) => {
        if (session) {
            const newSession = { ...session, gameState: newState };
            setSession(newSession);
            api.saveGameState(session.user.email, newState);
        }
    }, [session]);

    const renderContent = () => {
        if (isStarting && !session) {
             return <UserSetup onStart={()=>{}} isStarting={true} />;
        }

        switch (view) {
            case 'login':
                return <UserSetup onStart={handleLogin} isStarting={isStarting} />;
            case 'summary':
                if (!session) return null;
                return <ProgressSummary 
                            user={session.user} 
                            gameState={session.gameState} 
                            onContinue={() => setView('game')}
                            onReset={handleReset}
                            onShowStats={() => { setPreviousView('summary'); setView('stats'); }}
                        />;
            case 'game':
                if (!session) return null;
                return <GameScreen 
                            user={session.user} 
                            onLogout={handleLogout} 
                            gameState={session.gameState}
                            setGameState={handleUpdateGameState}
                            onShowStats={() => { setPreviousView('game'); setView('stats'); }}
                            onShowLearningPath={() => setView('learningPath')}
                       />;
            case 'moduleGame':
                if (!session || !selectedModuleId) return null;
                return <GameScreen 
                            user={session.user} 
                            onLogout={handleLogout} 
                            gameState={session.gameState}
                            setGameState={handleUpdateGameState}
                            onShowStats={() => { setPreviousView('moduleGame'); setView('stats'); }}
                            moduleFilter={selectedModuleId}
                            onExitModule={() => setView('moduleDetail')}
                       />;
            case 'stats':
                 if (!session) return null;
                 return <StatisticsScreen
                            user={session.user}
                            gameState={session.gameState}
                            onBack={() => setView(previousView)}
                        />
            case 'learningPath':
                if (!session) return null;
                return <LearningPathScreen
                            gameState={session.gameState}
                            onSelectModule={(moduleId) => {
                                setSelectedModuleId(moduleId);
                                setView('moduleDetail');
                            }}
                            onBack={() => setView('game')}
                        />
            case 'moduleDetail':
                if (!session || !selectedModuleId) return null;
                return <ModuleDetailScreen
                            gameState={session.gameState}
                            moduleId={selectedModuleId}
                            onBack={() => setView('learningPath')}
                            onStartQuestions={(moduleId) => {
                                setSelectedModuleId(moduleId);
                                setView('moduleGame');
                            }}
                        />
            default:
                return null;
        }
    };

    return renderContent();
}

export default App;