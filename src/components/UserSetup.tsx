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
    // Определяем разные типы Telegram окружений
    const isTelegramMobileApp = navigator.userAgent.includes('Telegram') && !window.location.hostname.includes('web.telegram.org');
    const isTelegramWeb = window.location.hostname.includes('web.telegram.org') || window.location.hostname.includes('t.me');
    const isTelegramBrowser = isTelegramMobileApp; // Только мобильное приложение использует redirect

    // Система логирования для отладки
    const addLog = (message: string, data?: any) => {
        try {
            // Логируем в консоль
            console.log(message, data || '');

            // Сохраняем в localStorage для Telegram браузера
            const logEntry = {
                timestamp: new Date().toISOString(),
                message,
                data: data ? JSON.stringify(data).substring(0, 200) : null, // Ограничиваем размер
                isTelegramBrowser
            };

            const logs = JSON.parse(localStorage.getItem('auth-debug-logs') || '[]');
            logs.push(logEntry);
            // Оставляем только последние 20 логов
            if (logs.length > 20) logs.shift();
            localStorage.setItem('auth-debug-logs', JSON.stringify(logs));
        } catch (e) {
            // Если логирование сломалось, используем только консоль
            console.error('Logging failed:', message, e);
        }
    };

    // Логируем определение браузера
    useEffect(() => {
        addLog('🌐 Browser detection:', {
            hostname: window.location.hostname,
            userAgent: navigator.userAgent.substring(0, 100) + '...',
            isTelegramMobileApp,
            isTelegramWeb,
            isTelegramBrowser,
            isAiStudio: !!window.aistudio,
            isStarting
        });
    }, []);
    
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

    // Обработка redirect callback для мобильного приложения Telegram
    useEffect(() => {
        const hasAuthParams = window.location.hash.includes('access_token') ||
                             window.location.search.includes('code') ||
                             window.location.search.includes('error');

        if (isTelegramMobileApp && hasAuthParams) {
            addLog('🔵 Detected OAuth redirect callback in Telegram browser', {
                search: window.location.search,
                hash: window.location.hash
            });

            // Google может вернуть токен в URL, попробуем обработать его
            const urlParams = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.substring(1));

            const code = urlParams.get('code') || hashParams.get('code');
            const error = urlParams.get('error') || hashParams.get('error');
            const accessToken = hashParams.get('access_token');

            if (error) {
                addLog('❌ OAuth error in redirect:', { error, urlParams: Object.fromEntries(urlParams), hashParams: Object.fromEntries(hashParams) });
                setAuthError(`Ошибка авторизации: ${error}. Попробуйте еще раз.`);
            } else if (accessToken) {
                addLog('🔵 Found access token in hash, this should not happen with redirect mode');
                setAuthError("Неожиданный формат ответа. Попробуйте еще раз.");
            } else if (code) {
                addLog('🔵 Found authorization code, processing...', { code: code.substring(0, 20) + '...' });
                // В redirect режиме с кодом нужно обменять код на токен через backend
                // Пока показываем ошибку с предложением использовать popup режим
                setAuthError("Авторизация в мобильном приложении Telegram не поддерживается. Откройте в обычном браузере.");
            }
        }
    }, [isTelegramMobileApp]);

    // --- Standard Google Sign-In Logic ---
    const handleCredentialResponse = useCallback(async (response: any) => {
        try {
            addLog('🔵 Google Sign-In callback received:', response);

            if (!response.credential) {
                addLog("❌ Google Sign-In failed: No credential returned.", { response });
                const errorMsg = isTelegramMobileApp
                    ? "Ошибка авторизации в мобильном приложении Telegram. Попробуйте открыть в обычном браузере."
                    : isTelegramWeb
                    ? "Ошибка авторизации в Telegram Web. Попробуйте обновить страницу или другой браузер."
                    : "Произошла ошибка при входе через Google. Попробуйте еще раз.";
                setAuthError(errorMsg);
                return;
            }

            addLog('🔄 Processing credential...');
            const userObject: any = decodeJwt(response.credential);
            addLog('🔄 Decoded JWT:', { hasEmail: !!userObject?.email, hasName: !!userObject?.name });

            if (userObject && userObject.email) {
                const user: User = {
                    name: userObject.name,
                    email: userObject.email,
                    given_name: userObject.given_name,
                    family_name: userObject.family_name,
                    picture: userObject.picture,
                };

                addLog('👤 User data extracted:', { email: user.email, name: user.given_name });

                // Проверяем есть ли сохраненное состояние
                addLog('🔍 Checking game state...');
                const { fetchGameState } = await import('../lib/api');
                const existingState = await fetchGameState(user.email);

                if (existingState && existingState.selectedDifficulty) {
                    // Если есть сохраненное состояние - сразу запускаем игру
                    addLog('✅ Found existing game state, skipping level selection');
                    onStart(user);
                } else {
                    // Новый пользователь - показываем экран выбора уровня
                    addLog('🆕 New user, showing level selection');
                    setTempUser(user);
                }
            } else {
                 addLog("❌ Failed to parse user from Google credential.", { userObject });
                 const errorMsg = isTelegramMobileApp
                     ? "Не удалось получить данные пользователя в мобильном Telegram. Попробуйте обычный браузер."
                     : isTelegramWeb
                     ? "Не удалось получить данные пользователя в Telegram Web. Попробуйте обновить страницу."
                     : "Не удалось получить данные пользователя из ответа Google.";
                 setAuthError(errorMsg);
            }
        } catch (error) {
            addLog("❌ Error processing Google credential:", { error: error?.toString() });
            const errorMsg = isTelegramMobileApp
                ? "Ошибка обработки данных в мобильном Telegram. Попробуйте обычный браузер."
                : isTelegramWeb
                ? "Ошибка обработки данных в Telegram Web. Попробуйте обновить страницу."
                : "Произошла ошибка при обработке данных пользователя.";
            setAuthError(errorMsg);
        }
    }, [onStart]);

    useEffect(() => {
        if (isAiStudio || isStarting || tempUser || (isTelegramMobileApp && authError)) return; // Не инициализируем если уже авторизованы или есть ошибка в мобильном Telegram

        const initializeGsi = () => {
            addLog('🚀 Initializing Google Sign-In', {
                hasGoogle: !!window.google,
                hasButtonRef: !!googleButtonRef.current,
                tempUser: !!tempUser
            });

            if (window.google && googleButtonRef.current && !tempUser) {
                if (googleButtonRef.current.childElementCount > 0) {
                    addLog('⚠️ Google button already rendered, skipping');
                    return;
                }

                if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.startsWith("ВАШ")) {
                    addLog('❌ Google Client ID not configured');
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

                // Специальные настройки для разных Telegram окружений
                if (isTelegramMobileApp) {
                    // Для мобильного приложения Telegram используем redirect режим
                    config.ux_mode = 'redirect';
                    config.redirect_uri = window.location.origin;
                    addLog('🔵 Using redirect mode for Telegram mobile app', { config });

                    // Добавляем timeout для мобильного приложения
                    authTimeout = setTimeout(() => {
                        addLog('⏰ Telegram mobile auth timeout after 30s');
                        const timeoutMsg = "Вход был отменен или истекло время ожидания (30 сек). Попробуйте еще раз.";
                        setAuthError(timeoutMsg);
                        // Очищаем Google кнопку при таймауте
                        if (googleButtonRef.current) {
                            googleButtonRef.current.innerHTML = '';
                            googleButtonRef.current.style.display = 'none';
                        }
                    }, 30000); // 30 секунд
                } else if (isTelegramWeb) {
                    // Для веб версии Telegram используем popup режим, но отключаем авто-выбор
                    addLog('🔵 Using popup mode for Telegram Web', { config });
                } else {
                    // Обычный браузер - popup режим по умолчанию
                    addLog('🔵 Using default popup mode for regular browser');
                }

                addLog('🔧 Initializing Google with config:', config);
                window.google.accounts.id.initialize(config);

                // Добавляем обработку ошибок
                window.google.accounts.id.disableAutoSelect();
                addLog('✅ Google Sign-In initialized successfully');

                addLog('🎨 Rendering Google button...');
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
                addLog('✅ Google button rendered');
            }
        }

        if (!window.google) {
            addLog('⏳ Waiting for Google SDK to load...');
            const interval = setInterval(() => {
                if (window.google) {
                    addLog('✅ Google SDK loaded, initializing...');
                    clearInterval(interval);
                    initializeGsi();
                }
            }, 100);
            return () => clearInterval(interval);
        } else {
            addLog('✅ Google SDK already loaded');
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
        try {
            if (isStarting) {
                return <p style={{textAlign: 'center', color: 'var(--text-secondary)'}}>Загрузка сессии...</p>;
            }

        if (authError) {
            // Получаем логи из localStorage для отображения
            const getDebugLogs = () => {
                try {
                    const logs = JSON.parse(localStorage.getItem('auth-debug-logs') || '[]');
                    return logs.slice(-10); // Показываем последние 10 логов
                } catch (e) {
                    return [];
                }
            };

            const debugLogs = getDebugLogs();
            const debugInfo = isTelegramBrowser ? `
Browser: ${navigator.userAgent}
Location: ${window.location.href}
Telegram: ${isTelegramBrowser}
Time: ${new Date().toISOString()}
Logs: ${debugLogs.length} entries
            `.trim() : null;

            return (
                <div style={{color: 'var(--error-color)', textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(255, 82, 82, 0.1)', borderRadius: '8px', border: '1px solid var(--error-color)'}}>
                    <p style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>Ошибка авторизации</p>
                    <p style={{fontSize: '0.9rem', marginBottom: '0.5rem'}}>{authError}</p>
                    {debugInfo && (
                        <details style={{fontSize: '0.7rem', textAlign: 'left', marginTop: '0.5rem'}}>
                            <summary style={{cursor: 'pointer', fontWeight: 'bold'}}>📋 Техническая информация</summary>
                            <pre style={{
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                marginTop: '0.25rem',
                                whiteSpace: 'pre-wrap',
                                fontSize: '0.6rem',
                                overflow: 'auto'
                            }}>
                                {debugInfo}
                            </pre>
                        </details>
                    )}

                    {debugLogs.length > 0 && (
                        <details style={{fontSize: '0.7rem', textAlign: 'left', marginTop: '0.5rem'}}>
                            <summary style={{cursor: 'pointer', fontWeight: 'bold'}}>🔍 Логи авторизации ({debugLogs.length})</summary>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('auth-debug-logs');
                                    window.location.reload();
                                }}
                                style={{
                                    marginTop: '0.25rem',
                                    padding: '0.25rem 0.5rem',
                                    fontSize: '0.6rem',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    borderRadius: '3px',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                🗑️ Очистить логи
                            </button>
                            <div style={{
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                marginTop: '0.25rem',
                                maxHeight: '200px',
                                overflow: 'auto',
                                fontSize: '0.6rem'
                            }}>
                                {debugLogs.map((log: any, index: number) => (
                                    <div key={index} style={{marginBottom: '0.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem'}}>
                                        <div style={{color: '#888', fontSize: '0.5rem'}}>
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </div>
                                        <div style={{fontWeight: 'bold'}}>{log.message}</div>
                                        {log.data && (
                                            <pre style={{margin: '0.25rem 0', fontSize: '0.5rem', whiteSpace: 'pre-wrap'}}>
                                                {JSON.stringify(log.data, null, 2)}
                                            </pre>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </details>
                    )}
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
                    {isTelegramMobileApp
                        ? "В мобильном приложении Telegram авторизация ограничена. Рекомендуем открыть в обычном браузере."
                        : isTelegramWeb
                        ? "Вы в Telegram Web - авторизация должна работать нормально."
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
        } catch (error) {
            console.error('Render error:', error);
            return (
                <div style={{color: 'var(--error-color)', textAlign: 'center', padding: '2rem'}}>
                    <p style={{fontWeight: 'bold'}}>Произошла ошибка рендеринга</p>
                    <p>Попробуйте перезагрузить страницу</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Перезагрузить
                    </button>
                </div>
            );
        }
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