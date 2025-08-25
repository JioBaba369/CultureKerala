
'use server';

import { z } from 'zod';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const bookingSchema = z.object({
    eventId: z.string(),
    eventTitle: z.string(),
    userId: z.string(),
    quantity: z.number().int().positive(),
    totalPrice: z.number(),
});

export async function createBooking(data: z.infer<typeof bookingSchema>) {
    const validatedData = bookingSchema.parse(data);

    try {
        await addDoc(collection(db, 'bookings'), {
            ...validatedData,
            createdAt: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error creating booking: ", error);
        throw new Error("Could not create booking.");
    }
}
