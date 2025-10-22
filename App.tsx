import React, { useState, useEffect, useCallback } from 'react';
import UserSetup from './components/UserSetup';
import ProgressSummary from './components/ProgressSummary';
import GameScreen from './components/GameScreen';
import StatisticsScreen from './components/StatisticsScreen';
import * as api from './api';
import { GameState, Session, User } from './types';

// Define google on the window object for TypeScript
declare global {
    interface Window {
        google: any;
    }
}

function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [view, setView] = useState<'login' | 'summary' | 'game' | 'stats'>('login');
    const [previousView, setPreviousView] = useState<'summary' | 'game'>('summary');
    const [isStarting, setIsStarting] = useState(true);

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

    const handleLogin = useCallback(async (user: User) => {
        setIsStarting(true);
        localStorage.setItem('ab-hero-user', JSON.stringify(user));
        
        const existingState = await api.fetchGameState(user.email);

        if (existingState) {
            setSession({ user, gameState: existingState });
            if (existingState.currentQuestionIndex > 0) {
                setView('summary');
            } else {
                setView('game');
            }
        } else {
            const newGameState = api.createInitialGameState();
            setSession({ user, gameState: newGameState });
            setView('game');
        }
        setIsStarting(false);
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
                       />;
            case 'stats':
                 if (!session) return null;
                 return <StatisticsScreen
                            user={session.user}
                            gameState={session.gameState}
                            onBack={() => setView(previousView)}
                        />
            default:
                return null;
        }
    };

    return (
        <>
            {renderContent()}
        </>
    );
}

export default App;