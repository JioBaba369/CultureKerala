
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { CommunityDetailPage } from '@/components/community-detail-page';
import { notFound } from 'next/navigation';
import type { Community } from '@/types';
import type { Metadata, PageProps } from 'next';
import { siteConfig } from '@/config/site';

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

export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  const community = await getCommunityBySlug(params.slug);

  if (!community) {
    return {};
  }

  const ogImage = community.logoURL || community.bannerURL || siteConfig.ogImage;
  const description = community.description || `Join the ${community.name} community on ${siteConfig.name}.`;

  return {
    title: community.name,
    description,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    openGraph: {
      title: community.name,
      description,
      type: 'article',
      url: `${siteConfig.url}/communities/${community.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: community.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: community.name,
      description,
      images: [ogImage],
      creator: '@culturekerala',
    },
  };
}

export default async function CommunitySlugPage({ params }: PageProps<{ slug: string }>) {
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
