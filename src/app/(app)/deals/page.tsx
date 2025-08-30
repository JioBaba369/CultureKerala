
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, orderBy, Query, Timestamp } from 'firebase/firestore';
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
import type { Item, Deal as DealType, Business } from '@/types';
import { ItemCard } from '@/components/item-card';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';
import { mapDocToItem } from '@/lib/utils';
import { EmptyState } from '@/components/cards/EmptyState';

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

      const dealsData = querySnapshot.docs.map(doc => doc.data() as DealType);
      
      const businessIds = [...new Set(dealsData.map(deal => deal.businessId).filter(Boolean))];
      const businessesCache: Record<string, string> = {};

      if (businessIds.length > 0) {
        const businessQuery = query(collection(db, 'businesses'), where('__name__', 'in', businessIds));
        const businessSnapshot = await getDocs(businessQuery);
        businessSnapshot.forEach(doc => {
            businessesCache[doc.id] = (doc.data() as Business).displayName || 'A Business';
        });
      }

      const data = querySnapshot.docs.map((dealDoc) => {
          const dealData = dealDoc.data() as DealType;
           if (!dealData.endsAt || !(dealData.endsAt instanceof Timestamp)) {
              console.warn(`Deal with id ${dealDoc.id} has invalid endsAt date.`);
              return null;
          }
          const item = mapDocToItem(dealDoc, 'deals');
          if (item && dealData.businessId) {
            item.organizer = businessesCache[dealData.businessId];
          }
          return item;
      });
      
      setDeals(data.filter(Boolean) as Item[]);
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

      <div className="sticky top-[65px] z-10 bg-background -mx-4 px-4 py-4 mb-8 border-b">
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
        <EmptyState
            title="No Deals Found"
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
