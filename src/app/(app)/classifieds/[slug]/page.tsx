
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ItemDetailPage } from '@/components/item-detail-page';
import { notFound } from 'next/navigation';
import type { Classified, Item } from '@/types';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

async function getClassifiedBySlug(slug: string): Promise<Classified | null> {
  if (!slug) return null;
  const ref = collection(db, 'classifieds');
  const q = query(ref, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  const data = docSnap.data();

  // Safely construct the Classified object
  return {
    id: docSnap.id,
    title: data.title || 'Untitled Classified',
    slug: data.slug || '',
    description: data.description || '',
    category: data.category || 'other',
    status: data.status || 'draft',
    imageURL: data.imageURL || '',
    contact: data.contact || { name: 'Anonymous' },
    location: data.location || { city: 'Unknown', country: 'Unknown' },
    createdBy: data.createdBy || '',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const classified = await getClassifiedBySlug(params.slug);

  if (!classified) {
    return {};
  }

  const ogImage = classified.imageURL || siteConfig.ogImage;
  const description = classified.description || `Check out this listing: ${classified.title} on ${siteConfig.name}.`;

  return {
    title: classified.title,
    description,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    openGraph: {
      title: classified.title,
      description,
      type: 'article',
      url: `${siteConfig.url}/classifieds/${classified.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: classified.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: classified.title,
      description,
      images: [ogImage],
      creator: '@culturekerala',
    },
  };
}


export default async function ClassifiedDetailPage({ params }: { params: { slug: string } }) {
  const classified = await getClassifiedBySlug(params.slug);

  if (!classified) {
    notFound();
  }
  
   const item: Item = {
    id: classified.id,
    slug: classified.slug,
    title: classified.title,
    description: classified.description,
    category: "Classified",
    location: `${classified.location?.city || 'N/A'}, ${classified.location?.country || 'N/A'}`,
    image: classified.imageURL || 'https://picsum.photos/1200/600',
  };

  return <ItemDetailPage item={item} />;
}

export async function generateStaticParams() {
  try {
    const ref = collection(db, 'classifieds');
    const q = query(ref, where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      slug: doc.data().slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params for classifieds:", error);
    return [];
  }
}

export const revalidate = 60;
