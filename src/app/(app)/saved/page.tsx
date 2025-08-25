'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { getSavedItems } from '@/actions/contact-actions';
import type { Item } from '@/types';
import { ItemCard } from '@/components/item-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bookmark, Search } from 'lucide-react';
import { EmptyState } from '@/components/cards/EmptyState';
import { Input } from '@/components/ui/input';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';

export default function SavedPage() {
  const { user } = useAuth();
  const [savedItems, setSavedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      getSavedItems(user.uid)
        .then((items) => {
          setSavedItems(items as Item[]);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const filteredItems = savedItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="mt-8">
            <ItemsGridSkeleton />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Please Login"
          description="You need to be logged in to see your saved items."
          link="/auth/login"
          linkText="Login"
        />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
       <header className="mb-8">
            <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
                <Bookmark className="h-8 w-8" />
                Saved Items
            </h1>
            <p className="text-muted-foreground mt-2">
                Your curated list of events, businesses, and more.
            </p>
      </header>

      {savedItems.length > 0 && (
         <div className="relative mb-8 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search in your saved items..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      )}

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
         <EmptyState
            title="No Saved Items Yet"
            description="Start exploring and save items you're interested in!"
            link="/explore"
            linkText="Explore Now"
        />
      )}
    </div>
  );
}
