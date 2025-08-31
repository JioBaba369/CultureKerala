
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { CommunityDetailPage } from '@/components/community-detail-page';
import { notFound } from 'next/navigation';
import type { Community } from '@/types';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

async function getCommunityBySlug(slug: string): Promise<Community | null> {
  if (!slug) return null;
  const communitiesRef = collection(db, 'communities');
  const q = query(communitiesRef, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const communityDoc = querySnapshot.docs[0];
  const data = communityDoc.data();

  // Safely construct the Community object
  return {
    id: communityDoc.id,
    name: data.name || 'Unnamed Community',
    slug: data.slug || '',
    type: data.type || 'other',
    description: data.description || '',
    logoURL: data.logoURL || '',
    bannerURL: data.bannerURL || '',
    region: data.region || { city: 'Unknown', country: 'Unknown' },
    contact: data.contact || {},
    socials: data.socials || {},
    roles: data.roles || { owners: [], admins: [] },
    memberCount: data.memberCount || 0,
    verified: data.verified || false,
    status: data.status || 'draft',
    createdBy: data.createdBy || '',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const community = await getCommunityBySlug(params.slug);

  if (!community) {
    return {
        title: 'Community Not Found'
    };
  }

  const ogImage = community.bannerURL || community.logoURL || siteConfig.ogImage;
  const description = community.description ? community.description.substring(0, 155) : `Join the ${community.name} community on ${siteConfig.name}. Connect with local Malayalees in ${community.region.city}.`;
  const pageTitle = `${community.name} - Malayalee Community in ${community.region.city}`;

  return {
    title: pageTitle,
    description,
    keywords: [community.name, 'malayalee community', 'kerala association', community.region.city, siteConfig.name],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    openGraph: {
      title: pageTitle,
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
      title: pageTitle,
      description,
      images: [ogImage],
      creator: '@culturekerala',
    },
  };
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
  try {
    const communitiesRef = collection(db, 'communities');
    const snapshot = await getDocs(communitiesRef);
    
    return snapshot.docs.map(doc => ({
      slug: doc.data().slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params for communities:", error);
    return [];
  }
}

// Ensure dynamic segments are revalidated
export const revalidate = 60; // Revalidate every 60 seconds
