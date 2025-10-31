import React, { useEffect, useCallback, useRef, useState } from 'react';
import { styles } from '../styles';
import { User } from '../types';
import { GOOGLE_CLIENT_ID } from '../config/config';

// Helper to decode JWT for user info (no signature verification needed on client)
function decodeJwt(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT", e);
        return null;
    }
}

// Define google and aistudio on the window object for TypeScript
// FIX: Defined an AIStudio interface to resolve type conflicts and strongly type the aistudio object.
interface AIStudio {
    getAuthenticatedUser: () => Promise<User>;
}
declare global {
    interface Window {
        google: any;
        aistudio?: AIStudio;
    }
}

interface UserSetupProps {
    onStart: (user: User, selectedLevel?: 'junior' | 'mid' | 'senior' | 'staff') => void;
    isStarting: boolean;
}

const UserSetup: React.FC<UserSetupProps> = ({ onStart, isStarting }) => {
    const googleButtonRef = useRef<HTMLDivElement>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [tempUser, setTempUser] = useState<User | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<'junior' | 'mid' | 'senior' | 'staff'>('junior');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const isAiStudio = !!window.aistudio;
    const isTelegramBrowser = navigator.userAgent.includes('Telegram') || window.location.hostname.includes('t.me');
    
    // Отслеживание размера экрана
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
        // Очистка Google кнопки при авторизации
    useEffect(() => {
        if (tempUser && googleButtonRef.current) {
            // Полностью очищаем Google кнопку и iframe
            googleButtonRef.current.innerHTML = '';
            googleButtonRef.current.style.display = 'none';

            // Также отключаем Google SDK
            if (window.google && window.google.accounts && window.google.accounts.id) {
                try {
                    window.google.accounts.id.cancel();
                } catch (e) {
                    console.log('Google SDK cleanup:', e);
                }
            }
        }
    }, [tempUser]);

    // Обработка redirect callback для Telegram браузера
    useEffect(() => {
        if (isTelegramBrowser && window.location.hash.includes('access_token') || window.location.search.includes('code')) {
            console.log('🔵 Detected OAuth redirect callback in Telegram browser');
            // Google может вернуть токен в URL, попробуем обработать его
            const urlParams = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.substring(1));

            // Если есть код авторизации, попробуем обменять его на токен
            const code = urlParams.get('code') || hashParams.get('code');
            if (code) {
                console.log('🔵 Found authorization code, processing...');
                // Здесь можно добавить логику обмена кода на токен через backend
                // Пока просто показываем ошибку, что нужно использовать popup режим
                setAuthError("Для авторизации в Telegram используйте обычный браузер или попробуйте еще раз.");
            }
        }
    }, [isTelegramBrowser]);

    // --- Standard Google Sign-In Logic ---
    const handleCredentialResponse = useCallback(async (response: any) => {
        console.log('🔵 Google Sign-In callback received:', response);

        if (!response.credential) {
            console.error("Google Sign-In failed: No credential returned.");
            setAuthError("Произошла ошибка при входе через Google. Попробуйте еще раз.");
            return;
        }
        
        try {
            const userObject: any = decodeJwt(response.credential);
            if (userObject && userObject.email) {
                const user: User = {
                    name: userObject.name,
                    email: userObject.email,
                    given_name: userObject.given_name,
                    family_name: userObject.family_name,
                    picture: userObject.picture,
                };
                
                // Проверяем есть ли сохраненное состояние
                const { fetchGameState } = await import('../lib/api');
                const existingState = await fetchGameState(user.email);
                
                if (existingState && existingState.selectedDifficulty) {
                    // Если есть сохраненное состояние - сразу запускаем игру
                    console.log('✅ Found existing game state, skipping level selection');
                    onStart(user);
                } else {
                    // Новый пользователь - показываем экран выбора уровня
                    console.log('🆕 New user, showing level selection');
                    setTempUser(user);
                }
            } else {
                 console.error("Failed to parse user from Google credential.");
                 setAuthError("Не удалось получить данные пользователя из ответа Google.");
            }
        } catch (error) {
            console.error("Error processing Google credential:", error);
            setAuthError("Произошла ошибка при обработке данных пользователя.");
        }
    }, [onStart]);

    useEffect(() => {
        if (isAiStudio || isStarting || tempUser || (isTelegramBrowser && authError)) return; // Не инициализируем если уже авторизованы или есть ошибка в Telegram

        const initializeGsi = () => {
            if (window.google && googleButtonRef.current && !tempUser) {
                if (googleButtonRef.current.childElementCount > 0) return;

                if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.startsWith("ВАШ")) {
                    setAuthError("Ошибка конфигурации: Google Client ID не найден. Откройте файл 'config.ts' и вставьте ваш ключ.");
                    return;
                }

                let authTimeout: NodeJS.Timeout | null = null;

                const wrappedCallback = (response: any) => {
                    if (authTimeout) {
                        clearTimeout(authTimeout);
                        authTimeout = null;
                    }
                    handleCredentialResponse(response);
                };

                const config: any = {
                    client_id: GOOGLE_CLIENT_ID,
                    callback: wrappedCallback
                };

                // Для Telegram браузера отключаем popup режим и используем redirect
                if (isTelegramBrowser) {
                    config.ux_mode = 'redirect';
                    config.redirect_uri = window.location.origin;
                    console.log('🔵 Using redirect mode for Telegram browser');

                    // Добавляем timeout для Telegram браузера
                    authTimeout = setTimeout(() => {
                        console.log('🔵 Telegram auth timeout, showing error');
                        setAuthError("Вход был отменен или истекло время ожидания. Попробуйте еще раз.");
                        // Очищаем Google кнопку при таймауте
                        if (googleButtonRef.current) {
                            googleButtonRef.current.innerHTML = '';
                            googleButtonRef.current.style.display = 'none';
                        }
                    }, 30000); // 30 секунд
                }

                window.google.accounts.id.initialize(config);

                // Добавляем обработку ошибок
                window.google.accounts.id.disableAutoSelect();

                window.google.accounts.id.renderButton(
                    googleButtonRef.current,
                    {
                        theme: "filled_black",
                        size: "large",
                        type: 'standard',
                        text: 'signin_with',
                        shape: 'rectangular',
                        logo_alignment: 'left',
                        width: '280'
                    }
                );
            }
        }

        if (!window.google) {
            const interval = setInterval(() => {
                if (window.google) {
                    clearInterval(interval);
                    initializeGsi();
                }
            }, 100);
            return () => clearInterval(interval);
        } else {
            initializeGsi();
        }
    }, [isStarting, handleCredentialResponse, isAiStudio, tempUser]);

    // --- AI Studio Logic ---
    const handleAiStudioLogin = async () => {
        try {
            const userInfo = await window.aistudio!.getAuthenticatedUser();
            
            // Проверяем есть ли сохраненное состояние
            const { fetchGameState } = await import('../lib/api');
            const existingState = await fetchGameState(userInfo.email);
            
            if (existingState && existingState.selectedDifficulty) {
                // Если есть сохраненное состояние - сразу запускаем игру
                console.log('✅ Found existing game state, skipping level selection');
                onStart(userInfo);
            } else {
                // Новый пользователь - показываем экран выбора уровня
                console.log('🆕 New user, showing level selection');
                setTempUser(userInfo);
            }
        } catch(e) {
            console.error("AI Studio authentication failed:", e);
            setAuthError("Не удалось войти через AI Studio. Попробуйте обновить страницу.");
        }
    };
    
    // Обработчик выбора уровня и начала игры
    const handleStartWithLevel = () => {
        if (tempUser) {
            onStart(tempUser, selectedLevel);
        }
    };
    
    const renderContent = () => {
        if (isStarting) {
            return <p style={{textAlign: 'center', color: 'var(--text-secondary)'}}>Загрузка сессии...</p>;
        }

        if (authError) {
            return (
                <div style={{color: 'var(--error-color)', textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(255, 82, 82, 0.1)', borderRadius: '8px', border: '1px solid var(--error-color)'}}>
                    <p style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>Ошибка</p>
                    <p style={{fontSize: '0.9rem'}}>{authError}</p>
                </div>
            );
        }

        // Экран выбора уровня после авторизации
        if (tempUser) {
            return (
                <div style={{
                    width: '100%', 
                    maxWidth: isMobile ? '100%' : '450px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: isMobile ? '1rem' : '1.5rem', 
                    alignItems: 'center',
                    padding: isMobile ? '0' : '0',
                    position: 'relative',
                    zIndex: 10, // Поверх Google кнопки
                    backgroundColor: 'var(--surface-color)' // Перекрываем фоном
                }}>
                    <div style={{textAlign: 'center'}}>
                        <p style={{
                            fontSize: isMobile ? '1rem' : '1.1rem', 
                            marginBottom: '0.5rem', 
                            color: 'var(--text-primary)'
                        }}>
                            Добро пожаловать, <strong>{tempUser.given_name}!</strong>
                        </p>
                        <p style={{
                            color: 'var(--text-secondary)', 
                            fontSize: isMobile ? '0.85rem' : '0.95rem',
                            marginBottom: '0.25rem'
                        }}>
                            Выберите целевую позицию для подготовки
                        </p>
                        <p style={{
                            color: 'rgba(139, 92, 246, 0.8)', 
                            fontSize: isMobile ? '0.75rem' : '0.85rem',
                            fontStyle: 'italic'
                        }}>
                            Это определит сложность вопросов. Ваш уровень мастерства будет расти по мере прохождения.
                        </p>
                    </div>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr',
                        gap: isMobile ? '0.75rem' : '1rem',
                        width: '100%'
                    }}>
                        {[
                            { value: 'junior', icon: '🌱', label: 'Junior', desc: 'Базовые вопросы' },
                            { value: 'mid', icon: '⭐', label: 'Middle', desc: 'Средний уровень' },
                            { value: 'senior', icon: '💎', label: 'Senior', desc: 'Сложные кейсы' },
                            { value: 'staff', icon: '👑', label: 'Staff', desc: 'Экспертные темы' }
                        ].map(level => (
                            <button
                                key={level.value}
                                onClick={() => setSelectedLevel(level.value as any)}
                                style={{
                                    padding: isMobile ? '0.75rem 0.5rem' : '1rem 0.75rem',
                                    borderRadius: isMobile ? '10px' : '12px',
                                    border: selectedLevel === level.value 
                                        ? '2px solid var(--primary-color)' 
                                        : '2px solid var(--border-color)',
                                    backgroundColor: selectedLevel === level.value 
                                        ? 'rgba(106, 90, 205, 0.1)' 
                                        : 'var(--bg-color)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: isMobile ? '0.25rem' : '0.4rem',
                                    minHeight: 'auto',
                                    height: isMobile ? 'auto' : '110px'
                                }}
                                onMouseOver={(e) => {
                                    if (selectedLevel !== level.value) {
                                        e.currentTarget.style.borderColor = 'var(--primary-color)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (selectedLevel !== level.value) {
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                    }
                                }}
                            >
                                <div style={{fontSize: isMobile ? '1.5rem' : '2rem'}}>{level.icon}</div>
                                <div style={{
                                    fontWeight: 'bold', 
                                    fontSize: isMobile ? '0.9rem' : '1rem', 
                                    color: 'var(--text-primary)'
                                }}>{level.label}</div>
                                <div style={{
                                    fontSize: isMobile ? '0.7rem' : '0.8rem', 
                                    color: 'var(--text-secondary)',
                                    textAlign: 'center',
                                    lineHeight: '1.2'
                                }}>{level.desc}</div>
                            </button>
                        ))}
                    </div>
                    
                    <button 
                        onClick={handleStartWithLevel} 
                        style={{
                            ...styles.submitButton,
                            width: '100%',
                            maxWidth: isMobile ? '100%' : '300px',
                            fontSize: isMobile ? '0.95rem' : '1rem',
                            padding: isMobile ? '0.9rem 1.5rem' : '1rem 2rem'
                        }}
                    >
                        Начать тренировку 🚀
                    </button>
                </div>
            );
        }

        if (isAiStudio) {
            return (
                 <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center'}}>
                     <p style={{textAlign: 'center', color: 'var(--text-secondary)'}}>
                        Используйте аккаунт AI Studio для сохранения прогресса.
                    </p>
                    <button onClick={handleAiStudioLogin} style={styles.submitButton}>
                        Войти
                    </button>
                </div>
            )
        }

        return (
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center'}}>
                 <p style={{textAlign: 'center', color: 'var(--text-secondary)'}}>
                    {isTelegramBrowser
                        ? "В Telegram браузере авторизация может работать нестабильно. Рекомендуем открыть в обычном браузере."
                        : "Войдите с помощью Google, чтобы начать. Ваш прогресс будет сохранен."
                    }
                </p>
                <div 
                    ref={googleButtonRef} 
                    style={{
                        display: 'flex', 
                        justifyContent: 'center',
                        width: '100%',
                        position: 'relative',
                        zIndex: 1
                    }}
                ></div>
            </div>
        );
    };

    return (
        <div style={{
            ...styles.userSetup,
            maxWidth: isMobile ? '100%' : '550px',
            padding: isMobile ? '1.5rem 1rem' : '2rem',
            margin: isMobile ? '0' : 'auto'
        }} className="fade-in">
            <h1 style={{
                ...styles.title,
                fontSize: isMobile ? '1.8rem' : '2.5rem'
            }}>A/B Hero</h1>
            <p style={{
                ...styles.subtitle,
                fontSize: isMobile ? '0.9rem' : '1rem'
            }}>Твой персональный AI-тренажер для подготовки к собеседованиям</p>
            {renderContent()}
        </div>
    );
};

export default UserSetup;