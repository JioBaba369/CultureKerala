
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ItemDetailPage } from '@/components/item-detail-page';
import { notFound } from 'next/navigation';
import type { Business, Item } from '@/types';

async function getBusinessBySlug(slug: string): Promise<Item | null> {
  const ref = collection(db, 'businesses');
  const q = query(ref, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data() as Business;

  return {
    id: doc.id,
    slug: data.slug,
    title: data.displayName,
    description: data.description || 'No description available.',
    category: "Business",
    location: data.isOnline ? "Online" : data.locations[0]?.address || 'Location TBD',
    image: data.images?.[0] || 'https://placehold.co/1200x600.png',
  } as Item;
}


export default async function BusinessDetailPage({ params }: { params: { slug: string } }) {
  const item = await getBusinessBySlug(params.slug);

  if (!item) {
    notFound();
  }

  return <ItemDetailPage item={item} />;
}

// This function generates the static paths for all businesses at build time
export async function generateStaticParams() {
  const ref = collection(db, 'businesses');
  const snapshot = await getDocs(ref);
  
  return snapshot.docs.map(doc => ({
    slug: doc.data().slug,
  }));
}

// Revalidate data at most every 60 seconds
export const revalidate = 60;
