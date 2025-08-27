
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Item } from '@/types';
import { ItemCard } from '@/components/item-card';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';
import { useSearchParams } from 'next/navigation';
import { mapDocToItem } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { EmptyState } from '@/components/cards/EmptyState';

const collectionsToSearch = [
  "events", "communities", "businesses", "deals", "movies", "classifieds"
];

function ExplorePageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const fetchAllItems = async () => {
      setLoading(true);
      try {
        const allItems: Item[] = [];
        const promises = collectionsToSearch.map(async (collectionName) => {
          const ref = collection(db, collectionName);
          const q = query(
            ref, 
            where('status', 'in', ['published', 'now_showing', 'active']), 
            limit(20)
          );
          const snapshot = await getDocs(q);
          const mappedItems = snapshot.docs
            .map(doc => mapDocToItem(doc, collectionName))
            .filter(Boolean) as Item[];
          allItems.push(...mappedItems);
        });

        await Promise.all(promises);
        
        // Randomize the order
        setItems(allItems.sort(() => Math.random() - 0.5));
      } catch (error) {
        console.error("Error fetching items for explore page: ", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      if (!searchLower) return true;
      
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const descriptionMatch = item.description.toLowerCase().includes(searchLower);
      const locationMatch = item.location.toLowerCase().includes(searchLower);
      const categoryMatch = item.category.toLowerCase().includes(searchLower);

      return titleMatch || descriptionMatch || locationMatch || categoryMatch;
    });
  }, [searchQuery, items]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Explore</h1>
        <p className="text-muted-foreground mt-2">
          Discover everything happening in the community.
        </p>
      </header>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search for events, businesses, deals, and more..."
          className="pl-10 h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? <ItemsGridSkeleton /> : <ItemsGrid items={filteredItems} />}
    </div>
  );
}


function ItemsGrid({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return <EmptyState title="No Results Found" description="Try broadening your search terms." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={`${item.category}-${item.id}`} item={item} />
      ))}
    </div>
  );
}

export default function ExplorePage() {
    return (
        <Suspense fallback={<ItemsGridSkeleton />}>
            <ExplorePageContent />
        </Suspense>
    )
}
