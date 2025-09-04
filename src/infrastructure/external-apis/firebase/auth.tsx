
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
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import { app, db } from './config';
import { doc, setDoc, Timestamp, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { User as AppUser } from '@/types';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  signup: (email: string, pass: string, displayName: string) => Promise<any>;
  login: (email: string, pass: string) => Promise<any>;
  googleSignIn: () => Promise<any>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshAppUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const refreshAppUser = useCallback(async () => {
    if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            setAppUser({ id: userDocSnap.id, ...userDocSnap.data() } as AppUser);
        }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        let appUserData: AppUser | null = null;
        
        if (userDocSnap.exists()) {
            appUserData = { id: userDocSnap.id, ...userDocSnap.data() } as AppUser;
            if (!appUserData.photoURL && fbUser.photoURL) {
                await updateDoc(userDocRef, { photoURL: fbUser.photoURL });
                appUserData.photoURL = fbUser.photoURL;
            }
        } else {
             const username = fbUser.email!.split('@')[0].replace(/[^a-zA-Z0-9_.]/g, '');
             appUserData = {
                uid: fbUser.uid,
                id: fbUser.uid,
                email: fbUser.email!,
                displayName: fbUser.displayName || 'New User',
                username: username,
                photoURL: fbUser.photoURL,
                roles: { admin: false, moderator: false, organizer: false },
                status: 'pending_verification',
                onboarding: { completed: false, step: 'welcome' },
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
             } as AppUser;
             await setDoc(userDocRef, appUserData);
        }
        
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
    if (loading) return;

    const isAuthPage = pathname.startsWith('/auth/');
    const isVerifyPage = pathname === '/auth/verify-email';
    const isUserPage = pathname.startsWith('/user/');
    const isAdminPage = pathname.startsWith('/admin/');
    const isOnboardingPage = pathname.startsWith('/onboarding/');

    if (!user) {
        if (isUserPage || isAdminPage || isOnboardingPage) {
            router.push(`/auth/login?redirect=${pathname}`);
        }
        return;
    }
    
    if (!user.emailVerified) {
        if (!isVerifyPage) {
            router.push('/auth/verify-email');
        }
        return;
    }

    if (appUser && !appUser.onboarding?.completed && !isOnboardingPage && !isAuthPage) {
        router.push('/onboarding/welcome');
        return;
    }

    if (isAuthPage || (isOnboardingPage && appUser?.onboarding?.completed)) {
        const redirectUrl = searchParams.get('redirect') || '/user/dashboard';
        router.push(redirectUrl);
    }
  }, [user, appUser, loading, pathname, router, searchParams]);

  useEffect(() => {
    if (loading || !user || user.emailVerified) return;

    const interval = setInterval(async () => {
      await user.reload();
      const freshUser = auth.currentUser;
      if (freshUser?.emailVerified) {
        clearInterval(interval);
        setUser(freshUser);
        refreshAppUser();
      }
    }, 5000); 

    return () => clearInterval(interval);
  }, [user, loading, refreshAppUser]);


  const signup = async (email: string, pass: string, displayName: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const fbUser = userCredential.user;

        if(fbUser) {
            const username = fbUser.email!.split('@')[0].replace(/[^a-zA-Z0-9_.]/g, '');
            const newAppUser = {
                uid: fbUser.uid,
                email: fbUser.email!,
                displayName: displayName,
                username: username,
                roles: { admin: false, moderator: false, organizer: false },
                status: 'pending_verification',
                onboarding: { completed: false, step: 'welcome' },
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

  const googleSignIn = async () => {
      try {
          return await signInWithPopup(auth, googleProvider);
      } catch (error: any) {
           if (error.code === 'auth/popup-closed-by-user') {
                return;
            }
            console.error("Google Sign-in error:", error);
            throw new Error(error.message || "Could not sign in with Google.");
      }
  }

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
    <AuthContext.Provider value={{ user, appUser, loading, signup, login, googleSignIn, logout, sendPasswordReset, resendVerificationEmail, refreshAppUser }}>
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
