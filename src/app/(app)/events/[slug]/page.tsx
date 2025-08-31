
import { collection, getDocs, query, where, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ItemDetailPage } from '@/components/item-detail-page';
import { notFound } from 'next/navigation';
import type { Event, Item, Community, Business } from '@/types';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

async function getEventBySlug(slug: string): Promise<{item: Item, event: Event} | null> {
  if (!slug) return null;
  const eventsRef = collection(db, 'events');
  const q = query(eventsRef, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  const eventData = docSnap.data();

  let organizerName = 'An Organizer';
  if (eventData.communityId) {
      const communityDoc = await getDoc(doc(db, 'communities', eventData.communityId));
      if (communityDoc.exists()) {
          organizerName = (communityDoc.data() as Community).name;
      }
  } else if (eventData.businessId) {
    const businessDoc = await getDoc(doc(db, 'businesses', eventData.businessId));
    if (businessDoc.exists()) {
        organizerName = (businessDoc.data() as Business).displayName;
    }
  }

  const safeEventData: Event = {
      id: docSnap.id,
      title: eventData.title || 'Untitled Event',
      slug: eventData.slug || '',
      summary: eventData.summary || '',
      organizers: eventData.organizers || [],
      organizer: organizerName,
      startsAt: eventData.startsAt,
      endsAt: eventData.endsAt,
      timezone: eventData.timezone || 'UTC',
      isOnline: eventData.isOnline || false,
      venue: eventData.venue || {},
      ticketing: eventData.ticketing || {},
      status: eventData.status || 'draft',
      visibility: eventData.visibility || 'public',
      createdBy: eventData.createdBy || '',
      createdAt: eventData.createdAt,
      updatedAt: eventData.updatedAt,
      coverURL: eventData.coverURL || '',
      communityId: eventData.communityId,
      businessId: eventData.businessId,
  };


  return {
    item: {
        id: docSnap.id,
        slug: safeEventData.slug,
        title: safeEventData.title,
        description: safeEventData.summary || 'No description available.',
        category: "Event",
        location: safeEventData.isOnline ? "Online" : `${safeEventData.venue?.name || ''}, ${safeEventData.venue?.address || ''}`,
        image: safeEventData.coverURL || 'https://picsum.photos/1200/600',
        date: safeEventData.startsAt,
        price: safeEventData.ticketing?.priceMin,
        organizer: organizerName,
    },
    event: safeEventData,
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getEventBySlug(params.slug);

  if (!data) {
    return {
        title: 'Event Not Found'
    };
  }
  
  const {item} = data;
  const ogImage = item.image || siteConfig.ogImage;
  const description = item.description ? item.description.substring(0, 155) : `Join us for ${item.title} at ${item.location}. Get your tickets on ${siteConfig.name}.`;
  const pageTitle = `${item.title} - An event by ${item.organizer}`;

  return {
    title: pageTitle,
    description,
    keywords: [item.title, 'kerala event', 'malayalee event', item.organizer || 'event', item.location, siteConfig.name],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    openGraph: {
      title: pageTitle,
      description,
      type: 'article',
      url: `${siteConfig.url}/events/${item.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [ogImage],
      creator: '@culturekerala',
    },
  };
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const data = await getEventBySlug(params.slug);

  if (!data) {
    notFound();
  }

  const { item, event } = data;
  
  // Prioritize related events from the same community
  let relatedItemsQuery;
  if (event.communityId) {
      relatedItemsQuery = query(
          collection(db, 'events'),
          where('communityId', '==', event.communityId),
          where('status', '==', 'published'),
          orderBy('startsAt', 'desc'),
          limit(4)
      );
  } else if (event.businessId) {
        relatedItemsQuery = query(
            collection(db, 'events'),
            where('businessId', '==', event.businessId),
            where('status', '==', 'published'),
            orderBy('startsAt', 'desc'),
            limit(4)
        );
  } else {
      // Fallback for events without a community
      relatedItemsQuery = query(
          collection(db, 'events'),
          where('status', '==', 'published'),
          orderBy('startsAt', 'desc'),
          limit(4)
      );
  }


  return <ItemDetailPage item={item} relatedItemsQuery={relatedItemsQuery} />;
}

// This function generates the static paths for all events at build time
export async function generateStaticParams() {
  try {
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    
    return snapshot.docs.map(doc => ({
      slug: doc.data().slug,
    }));
  } catch(error) {
    console.error("Failed to generate static params for events:", error);
    return [];
  }
}

// Revalidate data at most every 60 seconds
export const revalidate = 60;
