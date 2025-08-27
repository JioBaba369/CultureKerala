
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ItemDetailPage } from '@/components/item-detail-page';
import { notFound } from 'next/navigation';
import type { Classified, Item } from '@/types';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

async function getClassifiedBySlug(slug: string): Promise<Classified | null> {
  const ref = collection(db, 'classifieds');
  const q = query(ref, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  const data = docSnap.data() as Classified;

  return {
    ...data,
    id: docSnap.id,
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const classified = await getClassifiedBySlug(slug);

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


export default async function ClassifiedDetailPage({ params }: Props) {
  const { slug } = await params;
  const classified = await getClassifiedBySlug(slug);

  if (!classified) {
    notFound();
  }
  
   const item = {
    id: classified.id,
    slug: classified.slug,
    title: classified.title,
    description: classified.description,
    category: "Classified",
    location: `${classified.location.city}, ${classified.location.country}`,
    image: classified.imageURL || 'https://picsum.photos/1200/600',
  } as Item;

  return <ItemDetailPage item={item} />;
}

export async function generateStaticParams() {
  const ref = collection(db, 'classifieds');
  const q = query(ref, where('status', '==', 'published'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    slug: doc.data().slug,
  }));
}

export const revalidate = 60;
