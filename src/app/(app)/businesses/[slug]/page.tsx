
import { collection, getDocs, query, where, doc, getDoc, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ItemDetailPage } from '@/components/item-detail-page';
import { notFound } from 'next/navigation';
import type { Business, Deal, Item } from '@/types';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

type PageProps = {
  params: {
    slug: string;
  };
};

async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const ref = collection(db, 'businesses');
  const q = query(ref, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data() as Business;

  return {
    ...data,
    id: doc.id,
  } as Business;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const business = await getBusinessBySlug(params.slug);

  if (!business) {
    return {};
  }

  const ogImage = business.images?.[0] || siteConfig.ogImage;
  const description = business.description || `Explore ${business.displayName} on ${siteConfig.name}.`;

  return {
    title: business.displayName,
    description,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    openGraph: {
      title: business.displayName,
      description,
      type: 'article',
      url: `${siteConfig.url}/businesses/${business.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: business.displayName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: business.displayName,
      description,
      images: [ogImage],
      creator: '@culturekerala',
    },
  };
}


export default async function BusinessDetailPage({ params }: PageProps) {
  const business = await getBusinessBySlug(params.slug);

  if (!business) {
    notFound();
  }
  
  const relatedItemsQuery = query(
      collection(db, 'deals'),
      where('businessId', '==', business.id),
      where('status', '==', 'published'),
      limit(3)
  );

  const item = {
    id: business.id,
    slug: business.slug,
    title: business.displayName,
    description: business.description || 'No description available.',
    category: "Business",
    location: business.isOnline ? "Online" : business.locations[0]?.address || 'Location TBD',
    image: business.images?.[0] || 'https://picsum.photos/1200/600',
  } as Item;

  return <ItemDetailPage item={item} relatedItemsQuery={relatedItemsQuery} />;
}

// This function generates the static paths for all businesses at build time
export async function generateStaticParams() {
  try {
    const ref = collection(db, 'businesses');
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ slug: doc.data().slug }));
  } catch (e) {
    console.error('Failed to generate static params for businesses:', e);
    return [] as { slug: string }[];
  }
}

// Revalidate data at most every 60 seconds
export const revalidate = 60;
