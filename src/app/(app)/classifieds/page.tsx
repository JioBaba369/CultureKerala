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
import { Search, MapPin, Newspaper } from 'lucide-react';
import { locations } from '@/lib/data';
import type { Item, Classified as ClassifiedType } from '@/types';
import { ItemCard } from '@/components/item-card';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';
import { useSearchParams } from 'next/navigation';

const classifiedCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'for_sale', label: 'For Sale' },
    { value: 'job_opening', label: 'Job Opening' },
    { value: 'service', label: 'Service' },
    { value: 'other', label: 'Other' }
];

export default function ClassifiedsPage() {
  const searchParams = useSearchParams();
  const [classifieds, setClassifieds] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState('all');
  const [category, setCategory] = useState('all');

  const fetchClassifieds = useCallback(async () => {
    setLoading(true);
    try {
      const ref = collection(db, "classifieds");
      let q: Query = query(ref, where("status", "==", "published"));

      if (location !== 'all') {
        q = query(q, where("location.city", "==", location));
      }

      if (category !== 'all') {
        q = query(q, where("category", "==", category));
      }

      q = query(q, orderBy("createdAt", "desc"));
      
      const querySnapshot = await getDocs(q);
      
      const data = querySnapshot.docs.map(doc => {
        const classifiedData = doc.data() as ClassifiedType;
        return { 
          id: doc.id,
          slug: classifiedData.slug,
          title: classifiedData.title,
          description: classifiedData.description || '',
          category: 'Classified',
          location: `${classifiedData.location.city}, ${classifiedData.location.country}`,
          image: classifiedData.imageURL || 'https://picsum.photos/600/400',
        } as Item
      });
      
      setClassifieds(data);
    } catch (error) {
      console.error("Error fetching classifieds: ", error);
    } finally {
      setLoading(false);
    }
  }, [location, category]);

  useEffect(() => {
    fetchClassifieds();
  }, [fetchClassifieds]);

  const filteredItems = useMemo(() => {
    return classifieds.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const descriptionMatch = item.description
        .toLowerCase()
        .includes(searchLower);
      return (titleMatch || descriptionMatch);
    });
  }, [searchQuery, classifieds]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Classifieds</h1>
        <p className="text-muted-foreground mt-2">
          Find jobs, items for sale, and services in the community.
        </p>
      </header>

      <div className="sticky top-[65px] z-10 bg-background -mx-4 px-4 py-4 mb-8 border-b">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search classifieds..."
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
           <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <Newspaper className="h-5 w-5 text-muted-foreground mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {classifiedCategories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
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
        <h3 className="font-headline text-2xl">No Classifieds Found</h3>
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
