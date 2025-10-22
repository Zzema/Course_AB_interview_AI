import { GameState } from './types';
import { CATEGORIES_CONFIG, KEY_POINT_TO_CATEGORY_MAP } from './constants';

const DB_KEY = 'ab-hero-database';

/**
 * Simulates fetching the game state for a user from a database.
 * @param email The user's email, used as a unique identifier.
 * @returns A promise that resolves to the user's game state or null if not found.
 */
export const fetchGameState = async (email: string): Promise<GameState | null> => {
    console.log(`[API SIM] Fetching data for ${email}...`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const dbString = localStorage.getItem(DB_KEY);
    if (!dbString) return null;
    const db = JSON.parse(dbString);
    return db[email] || null;
};

/**
 * Simulates saving the game state for a user to a database.
 * @param email The user's email, used as a unique identifier.
 * @param gameState The current state of the game.
 * @returns A promise that resolves when the save is complete.
 */
export const saveGameState = async (email: string, gameState: GameState): Promise<void> => {
    console.log(`[API SIM] Saving data for ${email}...`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    const dbString = localStorage.getItem(DB_KEY);
    const db = dbString ? JSON.parse(dbString) : {};
    db[email] = gameState;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

/**
 * Creates the initial state for a new game session.
 * @returns A fresh GameState object.
 */
export const createInitialGameState = (): GameState => ({
    currentQuestionIndex: 0,
    rating: 0,
    categoryScores: Object.keys(CATEGORIES_CONFIG).reduce((acc, key) => {
        acc[key] = { totalScore: 0, count: 0 };
        return acc;
    }, {} as Record<string, { totalScore: number; count: number }>),
    keyPointScores: Object.keys(KEY_POINT_TO_CATEGORY_MAP).reduce((acc, key) => {
        acc[key] = { totalScore: 0, count: 0 };
        return acc;
    }, {} as Record<string, { totalScore: number; count: number }>),
    consecutiveGoodAnswersOnSimpleQuestions: 0,
});