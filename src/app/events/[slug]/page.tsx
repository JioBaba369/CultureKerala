import { allItemsBySlug } from '@/lib/data';
import { ItemDetailPage } from '@/components/item-detail-page';
import { notFound } from 'next/navigation';

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const item = allItemsBySlug[params.slug];

  if (!item) {
    notFound();
  }

  return <ItemDetailPage item={item} />;
}
