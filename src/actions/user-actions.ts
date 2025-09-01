
'use server';

import { z } from 'zod';
import { doc, updateDoc, setDoc, Timestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { User } from '@/types';
import { differenceInYears } from 'date-fns';
import { profileFormSchema } from '@/lib/schemas/user-schema';

export async function updateUserProfile(uid: string, data: z.infer<typeof profileFormSchema>) {
    const validatedData = profileFormSchema.parse(data);

    const usernameQuery = query(collection(db, 'users'), where('username', '==', validatedData.username));
    const usernameSnap = await getDocs(usernameQuery);
    const existingUser = usernameSnap.docs.find(doc => doc.id !== uid);

    if (existingUser) {
        throw new Error("Username is already taken. Please choose another one.");
    }
    
    try {
        const userRef = doc(db, 'users', uid);
        
        const updateData: { [key: string]: any } = {
            ...validatedData,
            updatedAt: Timestamp.now(),
        };

        if (validatedData.photoURL === null) {
            updateData.photoURL = null;
        } else if (validatedData.photoURL) {
            updateData.photoURL = validatedData.photoURL;
        }

        if (validatedData.dob) {
            updateData.dob = Timestamp.fromDate(validatedData.dob);
        }

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
    
    // Convert Firestore Timestamps to JS Dates
    const dob = data.dob instanceof Timestamp ? data.dob.toDate() : undefined;
    
    const userData: User = {
        ...data,
        id: userDoc.id,
        uid: userDoc.id,
        dob: data.dob, // Keep as Timestamp for internal use if needed
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    } as User;

    let age;
    if (dob) {
      age = differenceInYears(new Date(), dob);
    }

    return {
        ...userData,
        age,
    };
}

export async function updateUserInterests(uid: string, interests: string[]) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
        interests: interests,
        updatedAt: Timestamp.now(),
    });
}
