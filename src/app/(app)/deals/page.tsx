
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
import type { Item, Deal as DealType } from '@/types';
import { ItemCard } from '@/components/item-card';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';
import { mapDocToItem } from '@/lib/utils';

export default function DealsPage() {
  const [deals, setDeals] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('all');

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const ref = collection(db, "deals");
      let q: Query = query(ref, where("status", "==", "published"));
      
      if(location !== 'all') {
        q = query(q, where("cities", "array-contains", location));
      }
      
      q = query(q, orderBy("endsAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const data = querySnapshot.docs.map(doc => mapDocToItem(doc, 'deals')).filter(Boolean) as Item[];
      
      setDeals(data);
    } catch (error) {
      console.error("Error fetching deals: ", error);
    } finally {
      setLoading(false);
    }
  }, [location]);
  
  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return deals;
    return deals.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const descriptionMatch = item.description
        .toLowerCase()
        .includes(searchLower);
      return (titleMatch || descriptionMatch);
    });
  }, [searchQuery, deals]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Deals</h1>
        <p className="text-muted-foreground mt-2">
          Find exclusive deals from local businesses.
        </p>
      </header>

      <div className="sticky top-[65px] z-10 bg-background/80 backdrop-blur-sm -mx-4 px-4 py-4 mb-8 border-b">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search deals by keyword..."
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
      <div className="text-center py-16 text-muted-foreground">
        <h3 className="font-headline text-2xl">No Deals Found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
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
