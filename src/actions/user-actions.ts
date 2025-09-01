
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
        
        const updateData: { [key: string]: any } = {
            displayName: validatedData.displayName,
            username: validatedData.username,
            bio: validatedData.bio || "",
            updatedAt: Timestamp.now(),
        };

        if (validatedData.photoURL) {
            updateData.photoURL = validatedData.photoURL;
        } else {
            updateData.photoURL = null; 
        }

        if (validatedData.dob) {
            updateData.dob = Timestamp.fromDate(validatedData.dob);
        }

        if (validatedData.gender) {
            updateData.gender = validatedData.gender;
        }
        
        if (validatedData.interests) {
            updateData.interests = validatedData.interests;
        }

        await updateDoc(userRef, updateData);
        
        return { success: true };
    } catch (error: any) {
        console.error("Error updating user profile: ", error);
        throw new Error(error.message || "Could not update profile.");
    }
}

export async function updateUserInterests(uid: string, interests: string[]) {
    const userRef = doc(db, 'users', uid);
    try {
        await updateDoc(userRef, {
            interests: interests,
            updatedAt: Timestamp.now()
        });
        return { success: true };
    } catch (error: any) {
        console.error("Error updating interests: ", error);
        throw new Error(error.message || "Could not update interests.");
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
        dob: data.dob,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    } as User;

    let age;
    if (userData.dob && userData.dob.toDate) {
      age = differenceInYears(new Date(), userData.dob.toDate());
    }

    return {
        ...userData,
        age,
    };
}
