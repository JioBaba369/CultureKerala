
'use server';

import { z } from 'zod';
import { doc, updateDoc, setDoc, Timestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { User } from '@/types';

const profileFormSchema = z.object({
  uid: z.string(),
  displayName: z.string().min(2, "Display name must be at least 2 characters.").max(50),
  username: z.string().min(3, "Username must be at least 3 characters.").max(30).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  bio: z.string().max(160, "Bio must not be longer than 160 characters.").optional(),
  photoURL: z.string().url().optional().or(z.literal('')),
});

export async function updateUserProfile(data: z.infer<typeof profileFormSchema>) {
    const validatedData = profileFormSchema.parse(data);

    const usernameQuery = query(collection(db, 'users'), where('username', '==', validatedData.username));
    const usernameSnap = await getDocs(usernameQuery);
    const existingUser = usernameSnap.docs.find(doc => doc.id !== validatedData.uid);

    if (existingUser) {
        throw new Error("Username is already taken. Please choose another one.");
    }
    
    try {
        const userRef = doc(db, 'users', validatedData.uid);
        await updateDoc(userRef, {
            displayName: validatedData.displayName,
            username: validatedData.username,
            bio: validatedData.bio || "",
            photoURL: validatedData.photoURL || null,
            updatedAt: Timestamp.now(),
        });
        return { success: true };
    } catch (error: any) {
        console.error("Error updating user profile: ", error);
        throw new Error(error.message || "Could not update profile.");
    }
}

export async function getUserByUsername(username: string): Promise<User | null> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const userDoc = querySnapshot.docs[0];
    return {
        id: userDoc.id,
        uid: userDoc.id,
        ...userDoc.data()
    } as User;
}

export async function updateUserInterests(userId: string, interests: string[]) {
    if (!userId) {
        throw new Error("User ID is required.");
    }
    
    if (!Array.isArray(interests)) {
        throw new Error("Interests must be an array.");
    }

    const userRef = doc(db, 'users', userId);
    try {
        await updateDoc(userRef, {
            interests: interests,
            updatedAt: Timestamp.now(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating user interests:", error);
        throw new Error(`Could not save your interests: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

const onboardingSchema = z.object({
    userId: z.string(),
    interests: z.array(z.string()).min(3, "Please select at least 3 interests."),
    dob: z.date({
        required_error: "Please select your date of birth.",
    }),
    gender: z.enum(['female', 'male', 'other'], {
        required_error: "Please select a gender.",
    }),
});

export async function completeFullOnboarding(data: z.infer<typeof onboardingSchema>) {
    const validatedData = onboardingSchema.parse(data);
    const { userId, interests, dob, gender } = validatedData;
    
    if (!userId) {
        throw new Error("User ID is required.");
    }

    const userRef = doc(db, 'users', userId);

    try {
        await updateDoc(userRef, {
            interests: interests,
            dob: Timestamp.fromDate(dob),
            gender: gender,
            hasCompletedOnboarding: true,
            updatedAt: Timestamp.now(),
        });
        return { success: true };
    } catch (error: any) {
        console.error("Error completing onboarding:", error);
        throw new Error("Could not save your details. Please try again.");
    }
}
