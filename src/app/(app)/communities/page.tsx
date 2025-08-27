
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy, where, Query } from 'firebase/firestore';
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
import type { Community as CommunityType, Item } from '@/types';
import { ItemCard } from '@/components/item-card';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('all');

  const fetchCommunities = useCallback(async () => {
    setLoading(true);
    try {
      const communitiesRef = collection(db, "communities");
      let q: Query = query(communitiesRef, where("status", "==", "published"));
      
      if (location !== 'all') {
          q = query(q, where('region.city', '==', location));
      }
      
      q = query(q, orderBy("name", "asc"));

      const querySnapshot = await getDocs(q);
      
      const communitiesData = querySnapshot.docs.map(doc => {
        const data = doc.data() as CommunityType;
        return { 
          id: doc.id,
          slug: data.slug,
          title: data.name,
          description: data.description || '',
          category: 'Community',
          location: data.region ? `${data.region.city}, ${data.region.country}` : 'Location TBD',
          image: data.logoURL || 'https://placehold.co/600x400.png',
        } as Item
      });
      
      setCommunities(communitiesData);
    } catch (error) {
      console.error("Error fetching communities: ", error);
    } finally {
      setLoading(false);
    }
  }, [location]);
  
  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const filteredItems = useMemo(() => {
    return communities.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const descriptionMatch = item.description
        .toLowerCase()
        .includes(searchLower);
      return titleMatch || descriptionMatch;
    });
  }, [searchQuery, communities]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Communities</h1>
        <p className="text-muted-foreground mt-2">
          Find and join communities near you.
        </p>
      </header>

      <div className="sticky top-[65px] z-10 bg-background/80 backdrop-blur-sm -mx-4 px-4 py-4 mb-8 border-b">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search communities by keyword..."
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
        <h3 className="font-headline text-2xl">No Communities Found</h3>
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
