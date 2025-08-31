
import { collection, getDocs, query, where, doc, getDoc, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ItemDetailPage } from '@/components/item-detail-page';
import { notFound } from 'next/navigation';
import type { Deal, Item } from '@/types';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

async function getDealBySlug(slug: string): Promise<{item: Item, businessId: string} | null> {
  if (!slug) return null;
  const ref = collection(db, 'deals');
  const q = query(ref, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  const data = docSnap.data() as Deal;

  let businessName = 'A business';
  if (data.businessId) {
    const businessSnap = await getDoc(doc(db, 'businesses', data.businessId));
    if (businessSnap.exists()) {
        businessName = businessSnap.data()?.displayName || 'A business';
    }
  }

  return {
    item: {
        id: docSnap.id,
        slug: data.slug || '',
        title: data.title || 'Untitled Deal',
        description: data.description || 'No description available.',
        category: "Deal",
        location: businessName,
        image: data.images?.[0] || 'https://picsum.photos/1200/600',
        date: data.endsAt,
        price: data.priceDiscounted,
        organizer: businessName,
      },
      businessId: data.businessId || '',
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const dealData = await getDealBySlug(params.slug);

  if (!dealData) {
    return {
        title: 'Deal Not Found'
    };
  }
  
  const {item} = dealData;
  const ogImage = item.image || siteConfig.ogImage;
  const description = item.description ? item.description.substring(0, 155) : `Check out this amazing deal: ${item.title} on ${siteConfig.name}.`;
  const pageTitle = `${item.title} - Deal from ${item.organizer}`;

  return {
    title: pageTitle,
    description,
    keywords: [item.title, 'deal', 'offer', 'discount', item.organizer, siteConfig.name],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    openGraph: {
      title: pageTitle,
      description,
      type: 'article',
      url: `${siteConfig.url}/deals/${item.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: item.title,
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


export default async function DealDetailPage({ params }: { params: { slug: string } }) {
  const dealData = await getDealBySlug(params.slug);

  if (!dealData) {
    notFound();
  }
  
  const {item, businessId} = dealData;

  const relatedItemsQuery = query(
      collection(db, 'deals'),
      where('businessId', '==', businessId),
      where('status', '==', 'published'),
      limit(4)
  );

  return <ItemDetailPage item={item} relatedItemsQuery={relatedItemsQuery} />;
}

export async function generateStaticParams() {
  try {
    const ref = collection(db, 'deals');
    const snapshot = await getDocs(ref);
    
    return snapshot.docs.map(doc => ({
      slug: doc.data().slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params for deals:", error);
    return [];
  }
}

export const revalidate = 60;
