'use server';

import { z } from 'zod';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

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
