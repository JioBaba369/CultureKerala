
import { collection, getDocs, query, where, doc, getDoc, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ItemDetailPage } from '@/components/item-detail-page';
import { notFound } from 'next/navigation';
import type { Deal, Item } from '@/types';

type Props = {
    params: {
        slug: string;
    };
};

async function getDealBySlug(slug: string): Promise<{item: Item, businessId: string} | null> {
  const ref = doc(db, 'deals', slug);
  const docSnap = await getDoc(ref);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data() as Deal;
  const businessSnap = await getDoc(doc(db, 'businesses', data.businessId));
  const businessName = businessSnap.exists() ? businessSnap.data().displayName : 'A business';

  return {
    item: {
        id: docSnap.id,
        slug: docSnap.id, // Using ID as slug
        title: data.title,
        description: data.description || 'No description available.',
        category: "Deal",
        location: businessName,
        image: data.images?.[0] || 'https://placehold.co/1200x600.png',
        date: data.endsAt,
        price: data.priceDiscounted,
        organizer: businessName,
      } as unknown as Item,
      businessId: data.businessId,
  };
}


export default async function DealDetailPage({ params }: Props) {
  const dealData = await getDealBySlug(params.slug);

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
    slug: doc.id,
  }));
}

export const revalidate = 60;
