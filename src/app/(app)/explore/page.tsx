
'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
        setItems([]);
        setHasSearched(false);
        return;
    }
    
    setLoading(true);
    setHasSearched(true);
    try {
      const allItems: Item[] = [];
      const searchLower = query.toLowerCase();

      // In a production app, a dedicated search service like Algolia or Typesense 
      // with full-text search capabilities would be more performant and accurate.
      // This client-side implementation is a simplified approach.
      const promises = collectionsToSearch.map(async (collectionName) => {
        const ref = collection(db, collectionName);
        // We fetch a larger limit and then filter client-side.
        // A more robust solution would involve more complex queries or a search service.
        const q = query(ref, where('status', 'in', ['published', 'active', 'now_showing']), limit(50));
        
        const snapshot = await getDocs(q);
        const mappedItems = snapshot.docs
          .map(doc => mapDocToItem(doc, collectionName))
          .filter(Boolean) as Item[];
        
        const filtered = mappedItems.filter(item => 
            (item.title && item.title.toLowerCase().includes(searchLower)) ||
            (item.description && item.description.toLowerCase().includes(searchLower)) ||
            (item.category && item.category.toLowerCase().includes(searchLower)) ||
            (item.location && item.location.toLowerCase().includes(searchLower))
        );
        allItems.push(...filtered);
      });

      await Promise.all(promises);
      
      // Deduplicate and randomize results
      const uniqueItems = Array.from(new Map(allItems.map(item => [`${item.category}-${item.id}`, item])).values());
      setItems(uniqueItems.sort(() => 0.5 - Math.random()));

    } catch (error) {
      console.error("Error fetching items for explore page: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
        handleSearch(initialQuery);
    }
  }, [initialQuery, handleSearch]);

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(searchQuery);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Explore</h1>
        <p className="text-muted-foreground mt-2">
          Discover everything happening in the community.
        </p>
      </header>

      <form onSubmit={onFormSubmit} className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search for events, businesses, deals, and more..."
          className="pl-10 h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      {loading ? <ItemsGridSkeleton /> : <ItemsGrid items={items} hasSearched={hasSearched} />}
    </div>
  );
}


function ItemsGrid({ items, hasSearched }: { items: Item[], hasSearched: boolean }) {
  if (!hasSearched) {
      return <EmptyState title="Discover Something New" description="Enter a search term above to find events, businesses, and more across the platform." />;
  }

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
