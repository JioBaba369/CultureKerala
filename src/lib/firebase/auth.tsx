
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

  const handleAuthRedirect = useCallback((targetUser: FirebaseUser, targetAppUser: AppUser | null) => {
    const isAuthPage = pathname.startsWith('/auth/');
    
    if (!targetUser.emailVerified) {
      if (pathname !== '/auth/verify-email') {
        router.push('/auth/verify-email');
      }
      return;
    }
    
    if (targetAppUser && !targetAppUser.hasCompletedOnboarding) {
        if (!pathname.startsWith('/user/')) {
            router.push('/user/interests');
        }
        return;
    }

    if (isAuthPage) {
        const redirectUrl = searchParams.get('redirect') || '/admin';
        router.push(redirectUrl);
    }
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        // Always set the firebase user
        setUser(fbUser);
        
        // Fetch app user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        const appUserData = userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } as AppUser : null;
        setAppUser(appUserData);

        handleAuthRedirect(fbUser, appUserData);
        
      } else {
        setUser(null);
        setAppUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [handleAuthRedirect]);

  // Add a poller to check email verification status
  useEffect(() => {
    if (loading || !user || user.emailVerified) return;

    const interval = setInterval(async () => {
      await user.reload();
      const freshUser = auth.currentUser;
      if (freshUser && freshUser.emailVerified) {
        setUser(freshUser);
        clearInterval(interval);
        // Re-fetch app user and redirect
        const userDoc = await getDoc(doc(db, 'users', freshUser.uid));
        if (userDoc.exists()) {
          const appUserData = { id: userDoc.id, ...userDoc.data() } as AppUser;
          setAppUser(appUserData);
          handleAuthRedirect(freshUser, appUserData);
        }
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [user, loading, handleAuthRedirect]);


  const signup = async (email: string, pass: string, displayName: string, location: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const fbUser = userCredential.user;

        if(fbUser) {
            await sendEmailVerification(fbUser);
            const userDocRef = doc(db, 'users', fbUser.uid);
            
            const isAdmin = fbUser.email === 'jiobaba369@gmail.com';
            const username = fbUser.email!.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');

            const newAppUser: AppUser = {
                uid: fbUser.uid,
                id: fbUser.uid,
                email: fbUser.email!,
                displayName: displayName,
                username: username,
                location: location,
                photoURL: fbUser.photoURL,
                roles: { admin: isAdmin, moderator: isAdmin, organizer: isAdmin },
                status: 'active',
                hasCompletedOnboarding: false,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };
            await setDoc(userDocRef, newAppUser);
            
            // Redirect to verify email page after signup
            router.push('/auth/verify-email');
        }
        return userCredential;
    } catch(error: any) {
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('This email address is already in use.');
        } else if (error.code === 'auth/weak-password') {
            throw new Error('Password should be at least 10 characters long.');
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
        // The onAuthStateChanged listener will handle the redirect.
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
            // Don't reveal that the user doesn't exist for security reasons.
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
    router.push('/auth/login');
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
