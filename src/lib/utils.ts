import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Item, Event, Business, Deal, Community, Movie, Classified, Perk } from "@/types";
import { DocumentSnapshot, DocumentData, Timestamp } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mapDocToItem = (doc: DocumentSnapshot<DocumentData>, collectionName: string): Item | null => {
    const data = doc.data();
    if (!data) return null;

    const baseItem = {
      id: doc.id,
      title: data.title || data.name || data.displayName,
      slug: data.slug,
      category: collectionName.slice(0, -1).charAt(0).toUpperCase() + collectionName.slice(0, -1).slice(1) as Item['category'],
    }

    switch(collectionName) {
        case 'events': {
            const eventData = data as Event;
            return {
                ...baseItem,
                description: eventData.summary || '',
                location: eventData.isOnline ? 'Online' : eventData.venue?.address || 'Location TBD',
                image: eventData.coverURL || 'https://picsum.photos/600/400',
                date: eventData.startsAt,
                price: eventData.ticketing?.priceMin
            };
        }
        case 'businesses': {
            const bizData = data as Business;
            return {
                ...baseItem,
                title: bizData.displayName,
                description: bizData.description || '',
                location: bizData.isOnline ? 'Online' : bizData.cities?.[0] || 'Location TBD',
                image: bizData.images?.[0] || 'https://picsum.photos/600/400'
            };
        }
        case 'communities': {
            const commData = data as Community;
             return {
                ...baseItem,
                title: commData.name,
                description: commData.description || '',
                location: `${commData.region.city}, ${commData.region.country}`,
                image: commData.logoURL || 'https://picsum.photos/600/400',
            };
        }
        case 'deals': {
            const dealData = data as Deal;
            return {
                ...baseItem,
                description: dealData.description || '',
                category: 'Deal', 
                location: 'Partner Offer', 
                image: dealData.images?.[0] || 'https://picsum.photos/600/400', 
                date: dealData.endsAt
            };
        }
        case 'movies': {
            const movieData = data as Movie;
            return {
                ...baseItem,
                description: movieData.overview || '',
                category: 'Movie',
                location: movieData.screenings?.[0]?.city || 'TBD',
                image: movieData.posterURL || 'https://picsum.photos/600/400',
                date: movieData.releaseDate
            };
        }
        case 'classifieds': {
            const classifiedData = data as Classified;
            return {
                ...baseItem,
                description: classifiedData.description || '',
                category: 'Classified',
                location: `${classifiedData.location.city}, ${classifiedData.location.country}`,
                image: classifiedData.imageURL || 'https://picsum.photos/600/400',
            };
        }
        case 'perks': {
            const perkData = data as Perk;
             return {
                ...baseItem,
                description: perkData.description || '',
                category: 'Perk',
                location: perkData.partnerBusinessId ? 'Partner Offer' : 'Platform Benefit',
                image: perkData.imageURL || 'https://picsum.photos/600/400',
            };
        }
        default:
            return null;
    }
}
