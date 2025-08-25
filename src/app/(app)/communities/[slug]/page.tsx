
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { CommunityDetailPage } from '@/components/community-detail-page';
import { notFound } from 'next/navigation';
import type { Community } from '@/types';

async function getCommunityBySlug(slug: string): Promise<Community | null> {
  const communitiesRef = collection(db, 'communities');
  const q = query(communitiesRef, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const communityDoc = querySnapshot.docs[0];
  const data = communityDoc.data();
  return {
    id: communityDoc.id,
    ...data,
  } as Community;
}

export default async function CommunitySlugPage({ params }: { params: { slug: string } }) {
  const community = await getCommunityBySlug(params.slug);

  if (!community) {
    notFound();
  }

  return <CommunityDetailPage community={community} />;
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
