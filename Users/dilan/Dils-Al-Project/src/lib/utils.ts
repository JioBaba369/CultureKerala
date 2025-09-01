
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Item, Event, Business, Deal, Community, Movie, Classified, Perk } from "@/types";
import { DocumentSnapshot, DocumentData, Timestamp, doc, getDoc } from "firebase/firestore";
import React from "react";
import { db } from "./firebase/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mapDocToItem = async (docSnap: DocumentSnapshot<DocumentData>, collectionName: string): Promise<Item | null> => {
    const data = docSnap.data();
    if (!data) return null;

    const baseItem: Item = {
      id: docSnap.id,
      title: data.title || data.name || data.displayName || 'Untitled',
      slug: data.slug || '',
      category: "Classified", // Default value
      description: data.description || data.summary || data.overview || '',
      location: 'N/A',
      image: 'https://picsum.photos/600/400',
    }

    switch(collectionName) {
        case 'events': {
            const eventData = data as Event;
            return {
                ...baseItem,
                category: 'Event',
                description: eventData.summary || '',
                location: eventData.isOnline ? 'Online' : eventData.venue?.address || 'Location TBD',
                image: eventData.coverURL || 'https://picsum.photos/600/400',
                date: eventData.startsAt,
                price: eventData.ticketing?.priceMin,
                organizer: eventData.organizer
            };
        }
        case 'businesses': {
            const bizData = data as Business;
            return {
                ...baseItem,
                title: bizData.displayName,
                description: bizData.description || 'No description available.',
                category: 'Business',
                location: bizData.isOnline ? 'Online' : bizData.cities?.[0] || 'Location TBD',
                image: bizData.images?.[0] || 'https://picsum.photos/600/400'
            };
        }
        case 'communities': {
            const commData = data as Community;
             return {
                ...baseItem,
                title: commData.name,
                description: commData.description || 'No description available.',
                category: 'Community',
                location: `${commData.region.city}, ${commData.region.country}`,
                image: commData.logoURL || 'https://picsum.photos/600/400',
            };
        }
        case 'deals': {
            const dealData = data as Deal;
            let businessName = 'A business';
            if (dealData.businessId) {
                try {
                    const businessSnap = await getDoc(doc(db, 'businesses', dealData.businessId));
                    if (businessSnap.exists()) {
                        businessName = (businessSnap.data() as Business).displayName || 'A business';
                    }
                } catch (e) { console.error(e) }
            }
            return {
                ...baseItem,
                description: dealData.description || 'No description available.',
                category: 'Deal', 
                location: businessName, 
                image: dealData.images?.[0] || 'https://picsum.photos/600/400', 
                date: dealData.endsAt,
                organizer: businessName,
            };
        }
        case 'movies': {
            const movieData = data as Movie;
            return {
                ...baseItem,
                description: movieData.overview || 'No description available.',
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
                description: classifiedData.description || 'No description available.',
                category: 'Classified',
                location: `${classifiedData.location.city}, ${classifiedData.location.country}`,
                image: classifiedData.imageURL || 'https://picsum.photos/600/400',
                date: classifiedData.createdAt,
            };
        }
        case 'perks': {
            const perkData = data as Perk;
             return {
                ...baseItem,
                description: perkData.description || 'No description available.',
                category: 'Perk',
                location: perkData.partnerBusinessId ? 'Partner Offer' : 'Platform Benefit',
                image: perkData.imageURL || 'https://picsum.photos/600/400',
                date: perkData.createdAt,
            };
        }
        default:
             // Fallback for unknown collection types if necessary
            return {
                ...baseItem,
                description: 'No description available.',
                category: collectionName.slice(0, -1).charAt(0).toUpperCase() + collectionName.slice(0, -1).slice(1) as Item['category'],
            }
    }
}

export function linkify(text: string): React.ReactNode {
    if (!text) return text;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
        if (part.match(urlRegex)) {
            return React.createElement('a', {
                href: part,
                key: index,
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'text-primary hover:underline'
            }, part);
        }
        return part;
    });
}
