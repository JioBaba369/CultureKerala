
'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
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
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { User as AppUser } from '@/types';

const auth = getAuth(app);

interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  signup: (email: string, pass: string, displayName: string, location: string) => Promise<any>;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleUserRedirects = useCallback((fbUser: FirebaseUser | null) => {
    const isAuthPage = pathname.startsWith('/auth/');
    const isProtectedPage = pathname.startsWith('/admin') || pathname.startsWith('/user');

    if (loading) return;
    
    // If user is not logged in, redirect from protected pages to login
    if (!fbUser && isProtectedPage) {
        router.push(`/auth/login?redirect=${pathname}`);
        return;
    }
    
    // If user is logged in
    if (fbUser) {
        // If email is not verified, force redirect to verification page
        if (!fbUser.emailVerified && pathname !== '/auth/verify-email') {
            router.push('/auth/verify-email');
            return;
        }

        // If email is verified but user is still on an auth page, redirect away
        if (fbUser.emailVerified && isAuthPage) {
            const redirectUrl = searchParams.get('redirect') || '/admin';
            router.push(redirectUrl);
        }
    }
    
  }, [pathname, router, searchParams, loading]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        const appUserData = userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } as AppUser : null;
        setUser(fbUser);
        setAppUser(appUserData);
      } else {
        setUser(null);
        setAppUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    handleUserRedirects(user);
  }, [user, handleUserRedirects]);

  // Poller to check for email verification status changes
   useEffect(() => {
    if (loading || !user || user.emailVerified) return;

    const interval = setInterval(async () => {
      await user.reload();
      const freshUser = auth.currentUser;
      if (freshUser?.emailVerified) {
        clearInterval(interval);
        // Manually update state to trigger redirect logic
        setUser(freshUser);
        const userDoc = await getDoc(doc(db, 'users', freshUser.uid));
        setAppUser(userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } as AppUser : null);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [user, loading]);


  const signup = async (email: string, pass: string, displayName: string, location: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const fbUser = userCredential.user;

        if(fbUser) {
            const username = fbUser.email!.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');

            const newAppUser: AppUser = {
                uid: fbUser.uid,
                id: fbUser.uid,
                email: fbUser.email!,
                displayName: displayName,
                username: username,
                location: location,
                photoURL: fbUser.photoURL,
                roles: { admin: false, moderator: false, organizer: false },
                status: 'active',
                hasCompletedOnboarding: true, // Onboarding is now considered complete after signup
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };
            await setDoc(doc(db, 'users', fbUser.uid), newAppUser);
            await sendEmailVerification(fbUser);
        }
        return userCredential;
    } catch(error: any) {
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('This email address is already in use.');
        } else if (error.code === 'auth/weak-password') {
            throw new Error('Password should be at least 6 characters long.');
        } else if (error.code === 'auth/invalid-email') {
            throw new Error('Please enter a valid email address.');
        }
        console.error("Signup error:", error);
        throw new Error(error.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const login = async (email: string, pass: string) => {
    try {
        return await signInWithEmailAndPassword(auth, email, pass);
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
            // Don't reveal if a user exists or not
            return;
        }
        throw new Error("Failed to send password reset email.");
    }
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error("No user is currently signed in.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, appUser, loading, signup, login, logout, sendPasswordReset, resendVerificationEmail }}>
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
