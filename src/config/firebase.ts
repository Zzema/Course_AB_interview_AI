import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBk20x0NWvcLvSChKp0mhiWOchDDrEuJ5c",
    authDomain: "course-ab-interview.firebaseapp.com",
    projectId: "course-ab-interview",
    storageBucket: "course-ab-interview.firebasestorage.app",
    messagingSenderId: "251933681601",
    appId: "1:251933681601:web:47bf36492a4c337274b140"
};

// Initialize Firebase
let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization failed:', error);
}

export { db };
export default app;

