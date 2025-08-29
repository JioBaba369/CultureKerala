
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "culturekerala.firebaseapp.com",
  projectId: "culturekerala",
  storageBucket: "culturekerala.appspot.com",
  messagingSenderId: "631229665106",
  appId: "1:631229665106:web:5fd85a96fdf01949ca348b"
};

// Initialize Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const storage = getStorage(app);

