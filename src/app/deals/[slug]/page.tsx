import { allItemsBySlug } from '@/lib/data';
import { ItemDetailPage } from '@/components/item-detail-page';

export default function DealDetailPage({ params }: { params: { slug:string } }) {
  const item = allItemsBySlug[params.slug];

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Deal not found</h1>
        <p>The deal you are looking for does not exist.</p>
      </div>
    );
  }

  return <ItemDetailPage item={item} />;
}
