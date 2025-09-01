
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
        
        // Convert date to timestamp before sending to Firestore
        const dobTimestamp = validatedData.dob ? Timestamp.fromDate(validatedData.dob) : null;
        
        const updateData = {
            ...validatedData,
            dob: dobTimestamp,
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
    
    const userData: User = {
        ...data,
        id: userDoc.id,
        uid: userDoc.id,
        dob: data.dob, // Keep as timestamp for now
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
    } as User;

    let age;
    if (userData.dob && userData.dob.toDate) {
      // Convert the Firebase Timestamp to a JavaScript Date object for calculation
      age = differenceInYears(new Date(), userData.dob.toDate());
    }

    return {
        ...userData,
        age,
    };
}
