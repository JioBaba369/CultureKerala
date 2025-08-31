
'use server';

import { z } from 'zod';
import { doc, updateDoc, setDoc, Timestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { User } from '@/types';
import { differenceInYears, isBefore, isEqual, addYears } from 'date-fns';

const profileFormSchema = z.object({
  uid: z.string(),
  displayName: z.string().min(2, "Display name must be at least 2 characters.").max(50),
  username: z.string().min(3, "Username must be at least 3 characters.").max(30).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  bio: z.string().max(160, "Bio must not be longer than 160 characters.").optional(),
  photoURL: z.string().url().optional().or(z.literal('')),
  dob: z.date().refine((date) => {
    const today = new Date();
    const eighteenYearsAgo = addYears(today, -18);
    return isBefore(date, eighteenYearsAgo) || isEqual(date, eighteenYearsAgo);
  }, { message: "You must be at least 18 years old." }).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
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
        
        const updateData: Record<string, any> = {
            displayName: validatedData.displayName,
            username: validatedData.username,
            bio: validatedData.bio || "",
            photoURL: validatedData.photoURL || null,
            dob: validatedData.dob ? Timestamp.fromDate(validatedData.dob) : null,
            gender: validatedData.gender || null,
            updatedAt: Timestamp.now(),
        };

        await updateDoc(userRef, updateData);
        
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
    const data = userDoc.data()
    const userData = {
        ...data,
        dob: data.dob?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
    } as User;

    let age;
    if (userData.dob) {
        age = differenceInYears(new Date(), userData.dob);
    }

    return {
        ...userData,
        id: userDoc.id,
        uid: userDoc.id,
        age,
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
