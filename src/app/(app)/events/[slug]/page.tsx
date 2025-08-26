
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ItemDetailPage } from '@/components/item-detail-page';
import { notFound } from 'next/navigation';
import type { Event, Item, Community } from '@/types';

async function getEventBySlug(slug: string): Promise<Item | null> {
  const eventsRef = collection(db, 'events');
  const q = query(eventsRef, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  const eventData = docSnap.data() as Event;

  let organizerName = 'An Organizer';
  if (eventData.communityId) {
      const communityDoc = await getDoc(doc(db, 'communities', eventData.communityId));
      if (communityDoc.exists()) {
          organizerName = (communityDoc.data() as Community).name;
      }
  }


  // Adapt the new Event structure to the old Item structure for the detail page
  // This is a temporary compatibility layer
  return {
    id: docSnap.id,
    slug: eventData.slug,
    title: eventData.title,
    description: eventData.summary || 'No description available.',
    category: "Event",
    location: eventData.isOnline ? "Online" : `${eventData.venue?.name}, ${eventData.venue?.address}`,
    image: eventData.coverURL || 'https://placehold.co/1200x600.png',
    date: eventData.startsAt, // ItemDetailPage expects a Timestamp-like object or string
    price: eventData.ticketing?.priceMin,
    organizer: organizerName,
  } as unknown as Item;
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const item = await getEventBySlug(params.slug);

  if (!item) {
    notFound();
  }
  
  // Convert Firestore Timestamp to Date for the component if it exists
  const itemWithDate = {
      ...item,
      date: item.date ? (item.date as any).toDate() : undefined
  }

  return <ItemDetailPage item={itemWithDate} />;
}

// This function generates the static paths for all events at build time
export async function generateStaticParams() {
  const eventsRef = collection(db, 'events');
  const snapshot = await getDocs(eventsRef);
  
  return snapshot.docs.map(doc => ({
    slug: doc.data().slug,
  }));
}

// Revalidate data at most every 60 seconds
export const revalidate = 60;
