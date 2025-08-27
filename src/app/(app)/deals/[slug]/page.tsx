
import { collection, getDocs, query, where, doc, getDoc, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ItemDetailPage } from '@/components/item-detail-page';
import { notFound } from 'next/navigation';
import type { Deal, Item } from '@/types';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

async function getDealBySlug(slug: string): Promise<{item: Item, businessId: string} | null> {
  const ref = collection(db, 'deals');
  const q = query(ref, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  const data = docSnap.data() as Deal;
  const businessSnap = await getDoc(doc(db, 'businesses', data.businessId));
  const businessName = businessSnap.exists() ? businessSnap.data().displayName : 'A business';

  return {
    item: {
        id: docSnap.id,
        slug: data.slug,
        title: data.title,
        description: data.description || 'No description available.',
        category: "Deal",
        location: businessName,
        image: data.images?.[0] || 'https://picsum.photos/1200/600',
        date: data.endsAt,
        price: data.priceDiscounted,
        organizer: businessName,
      } as unknown as Item,
      businessId: data.businessId,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dealData = await getDealBySlug(slug);

  if (!dealData) {
    return {};
  }
  
  const {item} = dealData;
  const ogImage = item.image || siteConfig.ogImage;
  const description = item.description || `Check out this amazing deal: ${item.title} on ${siteConfig.name}.`;

  return {
    title: item.title,
    description,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    openGraph: {
      title: item.title,
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
      title: item.title,
      description,
      images: [ogImage],
      creator: '@culturekerala',
    },
  };
}


export default async function DealDetailPage({ params }: Props) {
  const { slug } = await params;
  const dealData = await getDealBySlug(slug);

  if (!dealData) {
    notFound();
  }
  
  const {item, businessId} = dealData;
  const itemWithDate = {
      ...item,
      date: item.date ? (item.date as any).toDate() : undefined
  }

  const relatedItemsQuery = query(
      collection(db, 'deals'),
      where('businessId', '==', businessId),
      where('status', '==', 'published'),
      limit(4)
  );

  return <ItemDetailPage item={itemWithDate} relatedItemsQuery={relatedItemsQuery} />;
}

export async function generateStaticParams() {
  const ref = collection(db, 'deals');
  const snapshot = await getDocs(ref);
  
  return snapshot.docs.map(doc => ({
    slug: doc.data().slug,
  }));
}

export const revalidate = 60;
