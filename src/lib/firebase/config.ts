
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  "projectId": "culture-kerala",
  "appId": "1:887889421538:web:31e04afc33318b1cac6abb",
  "storageBucket": "culture-kerala.appspot.com",
  "apiKey": "AIzaSyAl04k_YBZj95R6cK1bcWseiuzKHrcZlac",
  "authDomain": "culture-kerala.firebaseapp.com",
  "messagingSenderId": "887889421538"
};

// Initialize Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const storage = getStorage(app);
