
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ItemDetailPage } from '@/components/item-detail-page';
import { notFound } from 'next/navigation';
import type { Deal, Item } from '@/types';

async function getDealBySlug(slug: string): Promise<Item | null> {
  // As we don't have a slug field in deals, we'll use the ID as a slug for now
  const ref = doc(db, 'deals', slug);
  const docSnap = await getDoc(ref);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data() as Deal;
  const businessSnap = await getDoc(doc(db, 'businesses', data.businessId));
  const businessName = businessSnap.exists() ? businessSnap.data().displayName : 'A business';

  return {
    id: docSnap.id,
    slug: docSnap.id, // Using ID as slug
    title: data.title,
    description: data.description || 'No description available.',
    category: "Deal",
    location: businessName,
    image: data.images?.[0] || 'https://placehold.co/1200x600.png',
    date: data.endsAt,
    price: data.priceDiscounted,
    organizer: businessName,
  } as unknown as Item;
}


export default async function DealDetailPage({ params }: { params: { slug: string } }) {
  const item = await getDealBySlug(params.slug);

  if (!item) {
    notFound();
  }
  
  const itemWithDate = {
      ...item,
      date: item.date ? (item.date as any).toDate() : undefined
  }

  return <ItemDetailPage item={itemWithDate} />;
}

// This function generates the static paths for all deals at build time
export async function generateStaticParams() {
  const ref = collection(db, 'deals');
  const snapshot = await getDocs(ref);
  
  return snapshot.docs.map(doc => ({
    slug: doc.id, // Using ID as slug
  }));
}

// Revalidate data at most every 60 seconds
export const revalidate = 60;
