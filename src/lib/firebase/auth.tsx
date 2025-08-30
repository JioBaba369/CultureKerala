
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { app, db } from './config';
import { doc, setDoc, Timestamp, getDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import type { User as AppUser } from '@/types';

// Avoid initializing auth on the server during build/prender
const auth: any = typeof window !== 'undefined' && app ? getAuth(app) : null;

interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  signup: (email: string, pass: string, displayName: string, location: string) => Promise<any>;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (user.emailVerified) {
            if (userDoc.exists()) {
                const appUserData = { id: userDoc.id, ...userDoc.data() } as AppUser;
                setAppUser(appUserData);
                // Redirect to interests page if onboarding is not complete
                if (!appUserData.hasCompletedOnboarding) {
                    router.push('/user/interests');
                }
            }
        } else {
             setAppUser(null);
        }
      } else {
        setUser(null);
        setAppUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleAuthSuccess = (isNewUser: boolean = false) => {
    const redirectUrl = searchParams.get('redirect');
    if (isNewUser) {
        router.push('/user/interests');
    } else if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push('/user/read');
    }
  }

  const signup = async (email: string, pass: string, displayName: string, location: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        if(user) {
            await sendEmailVerification(user);
            const userDocRef = doc(db, 'users', user.uid);
            
            const isAdmin = user.email === 'jiobaba369@gmail.com';
            const username = user.email!.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');

            const newUser: AppUser = {
                uid: user.uid,
                id: user.uid,
                email: user.email!,
                displayName: displayName,
                username: username,
                location: location,
                photoURL: user.photoURL,
                roles: { admin: isAdmin, moderator: isAdmin, organizer: isAdmin },
                status: 'active',
                hasCompletedOnboarding: false,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };
            await setDoc(userDocRef, newUser);
        }
        return userCredential;
    } catch(error: any) {
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('This email address is already in use.');
        } else if (error.code === 'auth/weak-password') {
            throw new Error('Password should be at least 6 characters.');
        } else if (error.code === 'auth/invalid-email') {
            throw new Error('Please enter a valid email address.');
        }
        console.error("Signup error:", error);
        throw new Error(error.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const login = async (email: string, pass: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const appUserData = { id: userDoc.id, ...userDoc.data() } as AppUser;
            if (!user.emailVerified) {
                await signOut(auth);
                throw new Error('Please verify your email before logging in.');
            }
            setAppUser(appUserData);

            if (!appUserData.hasCompletedOnboarding) {
                router.push('/user/interests');
            } else {
                 handleAuthSuccess();
            }
        } else {
             handleAuthSuccess();
        }
        return userCredential;
    } catch (error: any) {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            throw new Error('Invalid email or password. Please try again.');
        } else if (error.code === 'auth/user-disabled') {
            throw new Error('This account has been disabled.');
        } else if (error.code === 'auth/too-many-requests') {
             throw new Error('Too many failed login attempts. Please try again later.');
        }
        throw error;
    }
  };
  
  const sendPasswordReset = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
         if (error.code === 'auth/user-not-found') {
            // Don't reveal that the user doesn't exist.
            return;
        }
        throw new Error("Failed to send password reset email.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, appUser, loading, signup, login, logout, sendPasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
