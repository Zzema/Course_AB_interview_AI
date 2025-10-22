import React, { useEffect, useCallback, useRef, useState } from 'react';
import { styles } from '../styles';
import { User } from '../types';
import { GOOGLE_CLIENT_ID } from '../config';

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
    onStart: (user: User) => void;
    isStarting: boolean;
}

const UserSetup: React.FC<UserSetupProps> = ({ onStart, isStarting }) => {
    const googleButtonRef = useRef<HTMLDivElement>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const isAiStudio = !!window.aistudio;

    // --- Standard Google Sign-In Logic ---
    const handleCredentialResponse = useCallback((response: any) => {
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
                onStart(user);
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
        if (isAiStudio || isStarting) return;

        const initializeGsi = () => {
            if (window.google && googleButtonRef.current) {
                if (googleButtonRef.current.childElementCount > 0) return;
                
                if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.startsWith("ВАШ")) {
                    setAuthError("Ошибка конфигурации: Google Client ID не найден. Откройте файл 'config.ts' и вставьте ваш ключ.");
                    return;
                }

                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse
                });
                window.google.accounts.id.renderButton(
                    googleButtonRef.current,
                    { theme: "filled_black", size: "large", type: 'standard', text: 'signin_with', shape: 'rectangular', logo_alignment: 'left', width: '280' }
                );
                // window.google.accounts.id.prompt(); // One Tap prompt can be annoying for local dev
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
    }, [isStarting, handleCredentialResponse, isAiStudio]);

    // --- AI Studio Logic ---
    const handleAiStudioLogin = async () => {
        try {
            const userInfo = await window.aistudio!.getAuthenticatedUser();
            onStart(userInfo);
        } catch(e) {
            console.error("AI Studio authentication failed:", e);
            setAuthError("Не удалось войти через AI Studio. Попробуйте обновить страницу.");
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
                    Войдите с помощью Google, чтобы начать. Ваш прогресс будет сохранен.
                </p>
                <div ref={googleButtonRef} style={{display: 'flex', justifyContent: 'center'}}></div>
            </div>
        );
    };

    return (
        <div style={styles.userSetup} className="fade-in">
            <h1 style={styles.title}>A/B Hero</h1>
            <p style={styles.subtitle}>Твой персональный AI-тренажер для подготовки к собеседованиям</p>
            {renderContent()}
        </div>
    );
};

export default UserSetup;