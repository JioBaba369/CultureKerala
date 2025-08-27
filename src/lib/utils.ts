
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Item, Event, Business, Deal, Community, Movie, Lesson } from "@/types";
import { DocumentSnapshot, DocumentData } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mapDocToItem = (doc: DocumentSnapshot<DocumentData>, collectionName: string): Item | null => {
    const data = doc.data();
    if (!data) return null;

    switch(collectionName) {
        case 'events':
            const eventData = data as Event;
            return {
                id: doc.id,
                slug: doc.id, // Events don't have slugs in the new model yet
                title: eventData.title,
                description: eventData.subtitle || '',
                category: 'Event',
                location: eventData.city,
                image: eventData.coverImage || 'https://placehold.co/600x400.png',
                date: eventData.startsAt,
                price: eventData.priceFrom
            };
        case 'businesses':
            const bizData = data as Business;
            return {
                id: doc.id,
                slug: doc.id,
                title: bizData.name,
                description: `A ${bizData.category} in ${bizData.city}`,
                category: 'Business',
                location: bizData.city,
                image: 'https://placehold.co/600x400.png', // No image in model yet
            };
        case 'communities': // This uses the Org model now
            const orgData = data as Org;
             return {
                id: doc.id,
                slug: doc.id,
                title: orgData.name,
                description: `A ${orgData.type} in ${orgData.city}`,
                category: 'Community',
                location: orgData.city,
                image: 'https://placehold.co/600x400.png',
            };
        case 'deals':
            const dealData = data as Deal;
            return {
                id: doc.id,
                slug: doc.id,
                title: dealData.title,
                description: dealData.description,
                category: 'Deal',
                location: dealData.cities.join(', '),
                image: 'https://placehold.co/600x400.png',
                date: dealData.validTo,
            };
        case 'lessons':
             const lessonData = data as Lesson;
             return {
                id: doc.id,
                slug: doc.id,
                title: lessonData.title,
                description: `A ${lessonData.level} lesson.`,
                category: 'Lesson',
                location: 'Online',
                image: 'https://placehold.co/600x400.png',
            };
        default:
            return null;
    }
}
