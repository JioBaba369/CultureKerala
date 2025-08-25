
'use server';

import { z } from 'zod';
import { addDoc, collection, Timestamp, runTransaction, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { nanoid } from 'nanoid';

const bookingSchema = z.object({
    eventId: z.string(),
    eventTitle: z.string(),
    userId: z.string(),
    ticketTypeId: z.string(),
    quantity: z.number().int().positive(),
    totalPrice: z.number(),
});

export async function createBooking(data: z.infer<typeof bookingSchema>) {
    const validatedData = bookingSchema.parse(data);

    try {
        await runTransaction(db, async (transaction) => {
            const eventRef = doc(db, 'events', validatedData.eventId);
            const eventDoc = await transaction.get(eventRef);

            if (!eventDoc.exists()) {
                throw "Event does not exist!";
            }

            const eventData = eventDoc.data();
            const ticketTiers = eventData.ticketing?.tiers || [];
            const ticketTierIndex = ticketTiers.findIndex((tier: any) => tier.id === validatedData.ticketTypeId);
            
            if (ticketTierIndex === -1) {
                throw "Ticket type not found!";
            }

            const ticketTier = ticketTiers[ticketTierIndex];

            if (ticketTier.quantityAvailable < validatedData.quantity) {
                throw "Not enough tickets available.";
            }

            // Decrement ticket quantity
            const newQuantity = ticketTier.quantityAvailable - validatedData.quantity;
            ticketTiers[ticketTierIndex].quantityAvailable = newQuantity;
            transaction.update(eventRef, { 'ticketing.tiers': ticketTiers });


            // Create booking
            const bookingRef = doc(collection(db, 'bookings'));
            transaction.set(bookingRef, {
                ...validatedData,
                createdAt: Timestamp.now(),
            });

            // Create individual tickets
            for (let i = 0; i < validatedData.quantity; i++) {
                const ticketId = nanoid();
                const ticketRef = doc(db, 'bookings', bookingRef.id, 'tickets', ticketId);
                transaction.set(ticketRef, {
                    id: ticketId,
                    bookingId: bookingRef.id,
                    eventId: validatedData.eventId,
                    userId: validatedData.userId,
                    ticketTypeId: validatedData.ticketTypeId,
                    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketId}`, // Placeholder QR
                    status: 'valid',
                    createdAt: Timestamp.now(),
                });
            }
        });
    } catch (error) {
        console.error("Error creating booking: ", error);
        throw new Error("Could not create booking.");
    }
}
