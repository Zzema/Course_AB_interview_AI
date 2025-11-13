import React, { useState, useEffect } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { styles } from '../styles';
import { User } from '../types';

interface UserSetupProps {
    onStart: (user: User) => void;
    isStarting: boolean;
}

const UserSetupClean: React.FC<UserSetupProps> = ({ onStart, isStarting }) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log('🔵 [INIT] UserSetup mounted');
        
        let isMounted = true;
        
        const checkAuth = async () => {
            try {
                // Подписываемся на изменения auth state - это ЕДИНСТВЕННЫЙ надежный способ
                const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                    if (!isMounted) return;
                    
                    console.log('🔍 [AUTH STATE] User:', firebaseUser ? firebaseUser.email : 'null');
                    
                    if (firebaseUser) {
                        console.log('✅ [SUCCESS] User authenticated:', firebaseUser.email);
                        const user: User = {
                            name: firebaseUser.displayName || 'User',
                            email: firebaseUser.email || '',
                            picture: firebaseUser.photoURL || ''
                        };
                        console.log('🔵 [SUCCESS] Calling onStart with:', user.email);
                        onStart(user);
                    } else {
                        // Проверяем getRedirectResult только если нет currentUser
                        console.log('🔍 [CHECK] Checking redirect result...');
                        const result = await getRedirectResult(auth);
                        
                        if (result && result.user) {
                            console.log('✅ [REDIRECT] User from redirect:', result.user.email);
                            const user: User = {
                                name: result.user.displayName || 'User',
                                email: result.user.email || '',
                                picture: result.user.photoURL || ''
                            };
                            console.log('🔵 [REDIRECT] Calling onStart with:', user.email);
                            onStart(user);
                        } else {
                            console.log('ℹ️ [CHECK] No user - showing login');
                        }
                    }
                });
                
                return unsubscribe;
            } catch (error: any) {
                console.error('❌ [ERROR]:', error);
                setError(error.message);
            }
        };
        
        checkAuth();
        
        return () => {
            isMounted = false;
        };
    }, [onStart]);

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Определяем Safari
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            
            console.log('🔵 [LOGIN] Browser detection:', { isSafari, isMobile, userAgent: navigator.userAgent });
            
            // Safari на iOS ВСЕГДА использует redirect (popup не работает из-за ITP)
            if (isSafari && isMobile) {
                console.log('🍎 [LOGIN] Safari iOS detected - using redirect (required for ITP)...');
                await signInWithRedirect(auth, googleProvider);
                console.log('🔵 [LOGIN] Redirect initiated');
                return;
            }
            
            // На остальных браузерах пробуем popup
            console.log('🔵 [LOGIN] Attempting popup login...');
            const result = await signInWithPopup(auth, googleProvider);
            console.log('✅ [LOGIN] Popup success:', result.user.email);
            
            const user: User = {
                name: result.user.displayName || 'User',
                email: result.user.email || '',
                picture: result.user.photoURL || ''
            };
            console.log('🔵 [LOGIN] Calling onStart with:', user.email);
            onStart(user);
        } catch (error: any) {
            console.error('❌ [LOGIN ERROR]:', error.code, error.message);
            console.error('❌ [LOGIN ERROR] Full error:', error);
            
            // Если popup заблокирован или не работает - пробуем redirect
            if (error.code === 'auth/popup-blocked' || 
                error.code === 'auth/popup-closed-by-user' || 
                error.code === 'auth/cancelled-popup-request' ||
                error.code === 'auth/network-request-failed') {
                console.log('⚠️ [LOGIN] Popup failed, trying redirect...');
                try {
                    await signInWithRedirect(auth, googleProvider);
                    console.log('🔵 [LOGIN] Redirect initiated');
                } catch (redirectError: any) {
                    console.error('❌ [REDIRECT ERROR]:', redirectError);
                    setError(redirectError.message || 'Ошибка входа');
                    setIsLoading(false);
                }
            } else {
                setError(error.message || 'Ошибка входа');
                setIsLoading(false);
            }
        }
    };

    if (isStarting) {
        return (
            <div style={styles.container}>
                <h1 style={{ ...styles.header, textAlign: 'center' as const, color: '#667eea' }}>
                    A/B Hero
                </h1>
                <p style={{ textAlign: 'center' as const, fontSize: '16px', color: '#555' }}>
                    Загрузка...
                </p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={{ ...styles.header, textAlign: 'center' as const, color: '#667eea' }}>
                A/B Hero
            </h1>
            <p style={{ textAlign: 'center' as const, fontSize: '16px', color: '#555', marginBottom: '30px' }}>
                Твой персональный AI-тренажер для подготовки к собеседованиям
            </p>

            <div style={{
                padding: '30px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                maxWidth: '400px',
                margin: '0 auto'
            }}>
                <p style={{ textAlign: 'center' as const, marginBottom: '20px', color: '#666' }}>
                    Войдите с помощью Google, чтобы начать. Ваш прогресс будет сохранен.
                </p>

                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '14px 20px',
                        backgroundColor: isLoading ? '#ccc' : '#4285f4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: 'all 0.2s'
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20455Z" fill="#4285F4"/>
                        <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
                        <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                        <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
                    </svg>
                    {isLoading ? 'Переход к Google...' : 'Войти через Google'}
                </button>

                {error && (
                    <div style={{
                        marginTop: '20px',
                        padding: '12px',
                        backgroundColor: '#fee',
                        borderLeft: '4px solid #f44',
                        borderRadius: '4px',
                        color: '#d33',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <p style={{
                    marginTop: '20px',
                    fontSize: '12px',
                    color: '#999',
                    textAlign: 'center' as const
                }}>
                    {/^((?!chrome|android).)*safari/i.test(navigator.userAgent) && /iPhone|iPad|iPod/i.test(navigator.userAgent)
                        ? '🍎 Safari iOS: откроется страница Google для входа'
                        : 'Firebase Auth (Popup с fallback на redirect)'
                    }
                </p>
            </div>
        </div>
    );
};

export default UserSetupClean;

