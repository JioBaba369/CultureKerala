
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ItemDetailPage } from '@/components/item-detail-page';
import { notFound } from 'next/navigation';
import type { Item } from '@/types';

async function getCommunityBySlug(slug: string): Promise<Item | null> {
  const communitiesRef = collection(db, 'communities');
  const q = query(communitiesRef, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
  } as Item;
}

export default async function CommunityDetailPage({ params }: { params: { slug: string } }) {
  const item = await getCommunityBySlug(params.slug);

  if (!item) {
    notFound();
  }

  return <ItemDetailPage item={item} />;
}

// This function generates the static paths for all communities at build time
export async function generateStaticParams() {
  const communitiesRef = collection(db, 'communities');
  const snapshot = await getDocs(communitiesRef);
  
  return snapshot.docs.map(doc => ({
    slug: doc.data().slug,
  }));
}

// Ensure dynamic segments are revalidated
export const revalidate = 60; // Revalidate every 60 seconds
