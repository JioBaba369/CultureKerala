
'use client';

import { useState, useMemo, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
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
import { locations } from '@/lib/data'; // Keep static locations for now
import type { Item, Business as BusinessType } from '@/types';
import { ItemCard } from '@/components/item-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('all');

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const ref = collection(db, "businesses");
        const q = query(ref, where("status", "==", "published"));
        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map(doc => {
          const bizData = doc.data() as BusinessType;
          return { 
            id: doc.id,
            slug: bizData.slug,
            title: bizData.displayName,
            description: bizData.description || '',
            category: 'Business',
            location: bizData.isOnline ? 'Online' : bizData.locations[0]?.address || 'Location TBD',
            image: bizData.images?.[0] || 'https://placehold.co/600x400.png',
          } as Item
        });
        
        setBusinesses(data);
      } catch (error) {
        console.error("Error fetching businesses: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const filteredItems = useMemo(() => {
    return businesses.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const descriptionMatch = item.description
        .toLowerCase()
        .includes(searchLower);
      const locationMatch = location === 'all' || item.location.toLowerCase().includes(location.toLowerCase());
      return (titleMatch || descriptionMatch) && locationMatch;
    });
  }, [searchQuery, location, businesses]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Businesses</h1>
        <p className="text-muted-foreground mt-2">
          Support local businesses in our community.
        </p>
      </header>

      <div className="sticky top-[65px] z-10 bg-background/80 backdrop-blur-sm -mx-4 px-4 py-4 mb-8 border-b">
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
      <div className="text-center py-16 text-muted-foreground">
        <h3 className="font-headline text-2xl">No Businesses Found</h3>
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

function ItemsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}
