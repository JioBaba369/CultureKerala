
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, orderBy, Query } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { locations } from '@/lib/data';
import type { Item } from '@/types';
import { ItemCard } from '@/components/item-card';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';
import { mapDocToItem } from '@/lib/utils';
import { EmptyState } from '@/components/cards/EmptyState';

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('all');

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const ref = collection(db, "businesses");
      let q: Query = query(ref, where("status", "==", "published"));

      if (location !== 'all') {
        q = query(q, where("cities", "array-contains", location));
      }

      q = query(q, orderBy("displayName", "asc"));
      
      const querySnapshot = await getDocs(q);

      const data = (
        await Promise.all(
          querySnapshot.docs.map((doc) => mapDocToItem(doc, 'businesses'))
        )
      ).filter(Boolean) as Item[];
      
      setBusinesses(data);
    } catch (error) {
      console.error("Error fetching businesses: ", error);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const filteredItems = useMemo(() => {
    return businesses.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const descriptionMatch = item.description
        .toLowerCase()
        .includes(searchLower);
      return (titleMatch || descriptionMatch);
    });
  }, [searchQuery, businesses]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Businesses</h1>
        <p className="text-muted-foreground mt-2">
          Support local businesses in our community.
        </p>
      </header>

      <div className="sticky top-[65px] z-10 bg-background -mx-4 px-4 py-4 mb-8 border-b">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search businesses by keyword..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? <ItemsGridSkeleton /> : <ItemsGrid items={filteredItems} />}
    </div>
  );
}

function ItemsGrid({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <EmptyState 
        title="No Businesses Found"
        description="Try adjusting your search or filters."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
