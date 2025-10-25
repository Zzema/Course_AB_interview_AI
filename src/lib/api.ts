import { GameState, LevelProgress } from '../types';
import { CATEGORIES_CONFIG, KEY_POINT_TO_CATEGORY_MAP, QUESTION_DATABASE } from '../data/constants';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initializeActivitySeries } from './activitySeriesManager';
import { initializeLearningProgress } from './learningPathManager';

const DB_KEY = 'ab-hero-database';
const USE_FIREBASE = true; // Firebase включен

/**
 * Fetches game state from Firebase (with localStorage fallback)
 * @param email The user's email, used as a unique identifier.
 * @returns A promise that resolves to the user's game state or null if not found.
 */
export const fetchGameState = async (email: string): Promise<GameState | null> => {
    console.log(`[API] Fetching data for ${email}...`);
    
    // Try Firebase first
    if (USE_FIREBASE && db) {
        try {
            console.log('🔵 Trying to fetch from Firebase...');
            const docRef = doc(db, 'users', email);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                console.log('✅ Data loaded from Firebase');
                const data = docSnap.data() as GameState;
                
                // МИГРАЦИЯ: Добавляем новые поля если их нет
                if (!data.activitySeries) {
                    console.log('🔄 Migrating: adding activitySeries');
                    data.activitySeries = initializeActivitySeries();
                }
                if (!data.inventory) {
                    console.log('🔄 Migrating: adding inventory');
                    data.inventory = {
                        questionSkips: 0,
                        seriesProtection: 0
                    };
                }
                if (!data.completedDailyQuests) {
                    console.log('🔄 Migrating: adding completedDailyQuests');
                    data.completedDailyQuests = [];
                }
                if (!data.learningProgress) {
                    console.log('🔄 Migrating: adding learningProgress');
                    data.learningProgress = initializeLearningProgress();
                }
                
                // Also save to localStorage as backup
                const localDb = localStorage.getItem(DB_KEY);
                const localData = localDb ? JSON.parse(localDb) : {};
                localData[email] = data;
                localStorage.setItem(DB_KEY, JSON.stringify(localData));
                
                return data;
            }
            console.log('ℹ️ No data in Firebase, checking localStorage...');
        } catch (error: any) {
            console.warn('⚠️ Firebase fetch failed, falling back to localStorage:', error.message || error);
            // Не выбрасываем ошибку, просто переходим к localStorage
        }
    }
    
    // Fallback to localStorage
    const dbString = localStorage.getItem(DB_KEY);
    if (!dbString) return null;
    const localDb = JSON.parse(dbString);
    return localDb[email] || null;
};

/**
 * Saves game state to Firebase (with localStorage backup)
 * @param email The user's email, used as a unique identifier.
 * @param gameState The current state of the game.
 * @returns A promise that resolves when the save is complete.
 */
export const saveGameState = async (email: string, gameState: GameState): Promise<void> => {
    console.log(`[API] Saving data for ${email}...`);
    
    // Always save to localStorage as backup
    const dbString = localStorage.getItem(DB_KEY);
    const localDb = dbString ? JSON.parse(dbString) : {};
    localDb[email] = gameState;
    localStorage.setItem(DB_KEY, JSON.stringify(localDb));
    
    // Try to save to Firebase
    if (USE_FIREBASE && db) {
        try {
            console.log('🔵 Trying to save to Firebase...');
            const docRef = doc(db, 'users', email);
            await setDoc(docRef, gameState, { merge: true }); // merge: true для обновления существующих полей
            console.log('✅ Data saved to Firebase');
        } catch (error: any) {
            console.warn('⚠️ Firebase save failed (data saved to localStorage):', error.message || error);
            // Не критично - данные уже в localStorage
        }
    }
};

/**
 * Creates the initial state for a new game session.
 * @returns A fresh GameState object.
 */
export const createInitialGameState = (): GameState => {
    // Инициализируем прогресс для каждого уровня
    const levelProgress: Record<'junior' | 'mid' | 'senior' | 'staff', LevelProgress> = {
        junior: {
            askedQuestionIds: [],
            totalQuestions: QUESTION_DATABASE.filter(q => q.seniority === 'junior').length,
            averageScore: 0
        },
        mid: {
            askedQuestionIds: [],
            totalQuestions: QUESTION_DATABASE.filter(q => q.seniority === 'mid').length,
            averageScore: 0
        },
        senior: {
            askedQuestionIds: [],
            totalQuestions: QUESTION_DATABASE.filter(q => q.seniority === 'senior').length,
            averageScore: 0
        },
        staff: {
            askedQuestionIds: [],
            totalQuestions: QUESTION_DATABASE.filter(q => q.seniority === 'staff').length,
            averageScore: 0
        }
    };

    return {
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
        ratingHistory: [0],
        initialLevel: 'junior',
        selectedDifficulty: 'junior',
        levelProgress,
        questionAttempts: [],
        // НОВЫЕ ПОЛЯ:
        activitySeries: initializeActivitySeries(),
        inventory: {
            questionSkips: 0,
            seriesProtection: 0
        },
        completedDailyQuests: [],
        learningProgress: initializeLearningProgress()
    };
};