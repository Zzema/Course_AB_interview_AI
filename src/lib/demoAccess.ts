/**
 * ============================================================================
 * DEMO ACCESS SYSTEM
 * ============================================================================
 * Позволяет тестировать приложение без авторизации через специальный URL
 */

import { User } from '../types';

export const DEMO_USER: User = {
    name: 'Demo User',
    email: 'demo@abhero.app',
    given_name: 'Demo',
    family_name: 'User',
    picture: ''
};

/**
 * Проверяет, используется ли демо-режим
 */
export function isDemoMode(): boolean {
    const params = new URLSearchParams(window.location.search);
    return params.get('demo') === 'true';
}

/**
 * Получает демо-пользователя
 */
export function getDemoUser(): User {
    return DEMO_USER;
}

/**
 * Создает URL для демо-доступа
 */
export function getDemoURL(): string {
    const baseURL = window.location.origin;
    return `${baseURL}?demo=true`;
}

