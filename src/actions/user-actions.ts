
'use server';

import { z } from 'zod';
import { doc, updateDoc, setDoc, Timestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { User } from '@/types';
import { differenceInYears } from 'date-fns';
import { profileFormSchema } from '@/lib/schemas/user-schema';

type ProfileUpdateData = z.infer<typeof profileFormSchema>;


export async function updateUserProfile(uid: string, data: ProfileUpdateData) {
    const validatedData = profileFormSchema.parse(data);

    const usernameQuery = query(collection(db, 'users'), where('username', '==', validatedData.username));
    const usernameSnap = await getDocs(usernameQuery);
    const existingUser = usernameSnap.docs.find(doc => doc.id !== uid);

    if (existingUser) {
        throw new Error("Username is already taken. Please choose another one.");
    }
    
    try {
        const userRef = doc(db, 'users', uid);
        
        const updateData: Partial<User> = {
            displayName: validatedData.displayName,
            username: validatedData.username,
            bio: validatedData.bio || "",
            photoURL: validatedData.photoURL || undefined,
            dob: validatedData.dob ? Timestamp.fromDate(validatedData.dob) : undefined,
            gender: validatedData.gender || undefined,
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
    const data = userDoc.data();
    
    let dobDate: Date | undefined = undefined;
    if (data.dob && data.dob instanceof Timestamp) {
        dobDate = data.dob.toDate();
    }

    const userData: User = {
        ...data,
        id: userDoc.id,
        uid: userDoc.id,
        dob: dobDate,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
    } as User;

    let age;
    if (userData.dob) {
        age = differenceInYears(new Date(), userData.dob);
    }

    return {
        ...userData,
        age,
    };
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
