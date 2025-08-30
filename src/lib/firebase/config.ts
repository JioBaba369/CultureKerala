
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "culturekerala.firebaseapp.com",
  projectId: "culturekerala",
  storageBucket: "culturekerala.firebasestorage.app",
  messagingSenderId: "631229665106",
  appId: "1:631229665106:web:5fd85a96fdf01949ca348b",
};

<<<<<<< HEAD
// Initialize Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const storage = getStorage(app);
=======
// Initialize Firebase with SSR/build-time guard
const isServer = typeof window === 'undefined';

let appInstance: any;
try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0) {
    appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  } else if (!isServer) {
    // On the client, a missing API key is a real error.
    throw new Error('Missing NEXT_PUBLIC_FIREBASE_API_KEY');
  } else {
    // On the server (build/prerender), avoid initializing when no API key.
    appInstance = undefined;
  }
} catch (e) {
  // As a safety net, do not crash the build; export stubs.
  appInstance = undefined;
}

export const app = appInstance as any;
export const db = appInstance ? getFirestore(appInstance) : ({} as any);
export const storage = appInstance ? getStorage(appInstance) : ({} as any);
>>>>>>> c5202bf7b3d7320781f06bd42e129de57b7de569
