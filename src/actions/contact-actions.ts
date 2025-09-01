
'use server';

import { z } from 'zod';
import { addDoc, collection, Timestamp, doc, setDoc, deleteDoc, query, where, getDocs, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Item, SavedItem } from '@/types';
import { mapDocToItem } from '@/lib/utils';

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
    const saveId = `${userId}_${itemId}`;
    const saveRef = doc(db, 'saves', saveId);
    
    try {
        const docSnap = await getDoc(saveRef);

        if (!docSnap.exists()) {
            // Not saved yet, so save it
            await setDoc(saveRef, {
                userId,
                itemId,
                itemType: itemType.toLowerCase(),
                createdAt: Timestamp.now(),
            });
            return { saved: true };
        } else {
            // Already saved, so unsave it
            await deleteDoc(saveRef);
            return { saved: false };
        }
    } catch (error) {
        console.error("Error toggling save item:", error);
        throw new Error("Could not update your saved items.");
    }
}

export async function getSavedItems(userId: string): Promise<Item[]> {
    const savesRef = collection(db, 'saves');
    const q = query(savesRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const savedItemsData = querySnapshot.docs.map(doc => doc.data() as SavedItem);

    const itemDetailsPromises = savedItemsData.map(async (savedItem) => {
        if (!savedItem.itemType || !savedItem.itemId) return null;
        
        // Ensure itemType is plural for collection name
        const collectionName = `${savedItem.itemType.toLowerCase()}s`;

        try {
            const itemDocRef = doc(db, collectionName, savedItem.itemId);
            const itemDocSnap = await getDoc(itemDocRef);

            if (itemDocSnap.exists()) {
                // Use mapDocToItem to standardize the item structure
                return await mapDocToItem(itemDocSnap, collectionName);
            }
        } catch (error) {
            console.error(`Error fetching saved item from ${collectionName} with id ${savedItem.itemId}:`, error);
        }
        return null;
    });

    const itemDetails = await Promise.all(itemDetailsPromises);

    return itemDetails.filter(item => item !== null) as Item[];
}
