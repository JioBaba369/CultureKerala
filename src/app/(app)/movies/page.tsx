
'use client';

import { useState, useMemo, useEffect } from 'react';
import { collection, getDocs, query, where, arrayContains } from 'firebase/firestore';
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
import type { Item, Movie as MovieType } from '@/types';
import { ItemCard } from '@/components/item-card';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('all');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const ref = collection(db, "movies");
        let q = query(ref, where("status", "==", "now_showing"));

        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map(doc => {
          const movieData = doc.data() as MovieType;
          return { 
            id: doc.id,
            slug: movieData.slug,
            title: movieData.title,
            description: movieData.overview || '',
            category: 'Movie',
            location: movieData.screenings?.[0]?.city || 'TBD',
            image: movieData.posterURL || 'https://picsum.photos/600/400',
          } as Item
        });
        
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const filteredItems = useMemo(() => {
    return movies.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const descriptionMatch = item.description
        .toLowerCase()
        .includes(searchLower);
      const locationMatch = location === 'all' || item.location.toLowerCase().includes(location.toLowerCase());
      return (titleMatch || descriptionMatch) && locationMatch;
    });
  }, [searchQuery, location, movies]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Movies</h1>
        <p className="text-muted-foreground mt-2">
          Discover movie screenings and showtimes.
        </p>
      </header>

      <div className="sticky top-[65px] z-10 bg-background -mx-4 px-4 py-4 mb-8 border-b">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search movies by keyword..."
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
                <SelectItem key={loc} value={loc.toLowerCase()}>
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
        <h3 className="font-headline text-2xl">No Movies Found</h3>
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
