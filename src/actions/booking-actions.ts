
'use server';

import { z } from 'zod';
import { collection, Timestamp, runTransaction, doc } from 'firebase/firestore';
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
        const newBookingId = await runTransaction(db, async (transaction) => {
            const eventRef = doc(db, 'events', validatedData.eventId);
            const eventDoc = await transaction.get(eventRef);

            if (!eventDoc.exists()) {
                throw new Error("Event does not exist!");
            }

            const eventData = eventDoc.data();
            const ticketTiers = eventData.ticketing?.tiers || [];
            const ticketTierIndex = ticketTiers.findIndex((tier: any) => tier.id === validatedData.ticketTypeId);
            
            if (ticketTierIndex === -1) {
                throw new Error("Ticket type not found!");
            }

            const ticketTier = ticketTiers[ticketTierIndex];
            const currentQuantityAvailable = ticketTier.quantityAvailable;

            if (currentQuantityAvailable < validatedData.quantity) {
                throw new Error("Not enough tickets available.");
            }

            // Decrement ticket quantity
            const newQuantity = currentQuantityAvailable - validatedData.quantity;
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
            return bookingRef.id;
        });
        return { success: true, bookingId: newBookingId };
    } catch (error: any) {
        console.error("Error creating booking: ", error);
        throw new Error(error.message || "Could not create booking.");
    }
}
