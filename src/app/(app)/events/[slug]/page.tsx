
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ItemDetailPage } from '@/components/item-detail-page';
import { notFound } from 'next/navigation';
import type { Item } from '@/types';

async function getEventBySlug(slug: string): Promise<Item | null> {
  const eventsRef = collection(db, 'events');
  const q = query(eventsRef, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    // Convert Firestore Timestamp to a serializable format (ISO string)
    date: data.date.toDate().toISOString(),
  } as Item;
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const item = await getEventBySlug(params.slug);

  if (!item) {
    notFound();
  }
  
  // Re-serialize date string back to a Date object for the component
  const itemWithDate = {
      ...item,
      date: item.date ? new Date(item.date) : undefined
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
