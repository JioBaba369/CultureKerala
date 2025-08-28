
import { collection, getDocs, query, where, doc, getDoc, orderBy, limit, DocumentData } from 'firebase/firestore';
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
  const eventData = { id: docSnap.id, ...docSnap.data() } as Event;

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


  return {
    item: {
        id: docSnap.id,
        slug: eventData.slug,
        title: eventData.title,
        description: eventData.summary || 'No description available.',
        category: "Event",
        location: eventData.isOnline ? "Online" : `${eventData.venue?.name}, ${eventData.venue?.address}`,
        image: eventData.coverURL || 'https://picsum.photos/1200/600',
        date: eventData.startsAt,
        price: eventData.ticketing?.priceMin,
        organizer: organizerName,
    },
    event: eventData,
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getEventBySlug(params.slug);

  if (!data) {
    return {};
  }
  
  const {item} = data;
  const ogImage = item.image || siteConfig.ogImage;
  const description = item.description || `Join us for ${item.title} on ${siteConfig.name}.`;

  return {
    title: item.title,
    description,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    openGraph: {
      title: item.title,
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
      title: item.title,
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
