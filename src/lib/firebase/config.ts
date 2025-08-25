
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
    projectId: "dilsepass",
    appId: "1:887889421538:web:31e04afc33318b1cac6abb",
    storageBucket: "dilsepass.firebasestorage.app",
    apiKey: "AIzaSyAl04k_YBZj95R6cK1bcWseiuzKHrcZlac",
    authDomain: "dilsepass.firebaseapp.com",
    messagingSenderId: "887889421538",
};

// Initialize Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
