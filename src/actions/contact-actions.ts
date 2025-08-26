
'use server';

import { z } from 'zod';
import { addDoc, collection, Timestamp, doc, setDoc, deleteDoc, query, where, getDocs, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Item } from '@/types';

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export async function saveContactMessage(formData: {
    name: string,
    email: string,
    subject: string,
    message: string,
}) {
    const validatedData = contactFormSchema.parse(formData);

    try {
        await addDoc(collection(db, 'contact-messages'), {
            ...validatedData,
            createdAt: Timestamp.now(),
            status: 'new', // to track if it has been read
        });
    } catch (error) {
        console.error("Error writing document to Firestore: ", error);
        throw new Error("Could not save message.");
    }
}

const reportFormSchema = z.object({
    itemId: z.string(),
    itemType: z.string(),
    itemTitle: z.string(),
    reason: z.string().min(10, "Please provide a reason with at least 10 characters.").max(1000),
    reporterId: z.string(),
});

export async function reportItem(data: z.infer<typeof reportFormSchema>) {
    const validatedData = reportFormSchema.parse(data);
    if (!validatedData.reporterId) {
        throw new Error("You must be logged in to report an item.");
    }
    try {
        await addDoc(collection(db, 'reports'), {
            ...validatedData,
            status: 'pending',
            createdAt: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error submitting report:", error);
        throw new Error("Could not submit report.");
    }
}


export async function toggleSaveItem(userId: string, itemId: string, itemType: string) {
    if (!userId) {
        throw new Error("You must be logged in to save an item.");
    }
    const saveRef = doc(db, 'saves', `${userId}_${itemId}`);
    const q = query(collection(db, 'saves'), where('userId', '==', userId), where('itemId', '==', itemId));
    
    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // Not saved yet, so save it
            await setDoc(saveRef, {
                userId,
                itemId,
                itemType,
                createdAt: Timestamp.now(),
            });
            return { saved: true };
        } else {
            // Already saved, so unsave it
            await deleteDoc(querySnapshot.docs[0].ref);
            return { saved: false };
        }
    } catch (error) {
        console.error("Error toggling save item:", error);
        throw new Error("Could not update your saved items.");
    }
}

export async function getSavedItems(userId: string) {
    const q = query(collection(db, 'saves'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const savedItems = querySnapshot.docs.map(doc => doc.data());

    const itemDetails = await Promise.all(savedItems.map(async (savedItem) => {
        if (!savedItem.itemType) return null;
        const collectionName = `${savedItem.itemType.toLowerCase()}s`;
        const itemDoc = await getDoc(doc(db, collectionName, savedItem.itemId));
        if (itemDoc.exists()) {
            return {
                ...itemDoc.data(),
                id: itemDoc.id,
                category: savedItem.itemType,
            } as Item;
        }
        return null;
    }));

    return itemDetails.filter(item => item !== null) as Item[];
}
