
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { app, db } from './config';
import { doc, setDoc, Timestamp, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { User as AppUser } from '@/types';

const auth = getAuth(app);

interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  signup: (email: string, pass: string, joinClub?: boolean) => Promise<any>;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            setAppUser(userDoc.data() as AppUser);
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (email: string, pass: string, joinClub: boolean = false) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    if(user) {
        // Create a document in the 'users' collection
        const userDocRef = doc(db, 'users', user.uid);
        
        const baseWelcomePoints = 50;
        const clubBonusPoints = 150;
        const totalPoints = joinClub ? baseWelcomePoints + clubBonusPoints : baseWelcomePoints;

        const newUser: AppUser = {
            uid: user.uid,
            id: user.uid,
            email: user.email!,
            displayName: user.email!.split('@')[0], // Default display name from email
            username: user.email!.split('@')[0], // Default username
            photoURL: user.photoURL,
            roles: { admin: false, moderator: false, organizer: true }, // Default to organizer for now
            status: 'active',
            dilsepassClubMember: joinClub,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),

            // Initialize new fields from blueprint
            wallet: {
                points: totalPoints, 
                lifetimePoints: totalPoints,
                tier: joinClub ? 'platinum' : 'bronze',
                tierPointsYTD: 0,
                lastTierCalcAt: Timestamp.now(),
                expiryAt: null,
            },
            clubMembership: {
                status: joinClub ? 'active' : 'none',
                plan: joinClub ? 'monthly' : null, // Default to monthly, can be changed
                joinedAt: joinClub ? Timestamp.now() : null,
                renewsAt: null, // To be set by Stripe webhook
            },
            dealSubscriptions: {
                cities: [],
                categories: [],
                businessIds: [],
                digest: 'weekly',
            },
            notificationTokens: [],
        };
        await setDoc(userDocRef, newUser);
        setAppUser(newUser);
    }
    return userCredential;
  };

  const login = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            setAppUser(userDoc.data() as AppUser);
        }
    }
    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
    setAppUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, appUser, loading, signup, login, logout }}>
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
