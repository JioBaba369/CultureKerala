import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Item, Event, Business, Deal, Community, Movie, Classified, Perk } from "@/types";
import { DocumentSnapshot, DocumentData } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mapDocToItem = (doc: DocumentSnapshot<DocumentData>, collectionName: string): Item | null => {
    const data = doc.data();
    if (!data) return null;

    switch(collectionName) {
        case 'events': {
            const eventData = data as Event;
            return {
                id: doc.id, slug: eventData.slug, title: eventData.title, description: eventData.summary || '',
                category: 'Event', location: eventData.isOnline ? 'Online' : eventData.venue?.address || 'Location TBD',
                image: eventData.coverURL || 'https://placehold.co/600x400.png', date: eventData.startsAt,
                price: eventData.ticketing?.priceMin
            };
        }
        case 'businesses': {
            const bizData = data as Business;
            return {
                id: doc.id, slug: bizData.slug, title: bizData.displayName, description: bizData.description || '',
                category: 'Business', location: bizData.isOnline ? 'Online' : bizData.locations[0]?.address || 'Location TBD',
                image: bizData.images?.[0] || 'https://placehold.co/600x400.png'
            };
        }
        case 'communities': {
            const commData = data as Community;
             return {
                id: doc.id, slug: commData.slug, title: commData.name, description: commData.description || '',
                category: 'Community', location: `${commData.region.city}, ${commData.region.country}`,
                image: commData.logoURL || 'https://placehold.co/600x400.png',
            };
        }
        case 'deals': {
            const dealData = data as Deal;
            return {
                id: doc.id, slug: doc.id, title: dealData.title, description: dealData.description || '',
                category: 'Deal', location: 'Partner Offer', 
                image: dealData.images?.[0] || 'https://placehold.co/600x400.png', date: dealData.endsAt
            };
        }
        case 'movies': {
            const movieData = data as Movie;
            return {
                id: doc.id, slug: movieData.slug, title: movieData.title, description: movieData.overview || '',
                category: 'Movie', location: movieData.screenings?.[0]?.city || 'TBD',
                image: movieData.posterURL || 'https://placehold.co/600x400.png'
            };
        }
        case 'classifieds': {
            const classifiedData = data as Classified;
            return {
                id: doc.id, slug: classifiedData.slug, title: classifiedData.title, description: classifiedData.description || '',
                category: 'Classified', location: `${classifiedData.location.city}, ${classifiedData.location.country}`,
                image: classifiedData.imageURL || 'https://placehold.co/600x400.png',
            };
        }
        case 'perks': {
            const perkData = data as Perk;
             return {
                id: doc.id, slug: perkData.slug, title: perkData.title, description: perkData.description || '',
                category: 'Perk', location: perkData.partnerBusinessId ? 'Partner Offer' : 'Platform Benefit',
                image: perkData.imageURL || 'https://placehold.co/600x400.png',
            };
        }
        default:
            return null;
    }
}
