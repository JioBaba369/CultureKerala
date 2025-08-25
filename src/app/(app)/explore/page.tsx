
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  CalendarDays,
  Film,
  MapPin,
  Search,
  Store,
  TicketPercent,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemCard } from "@/components/item-card";
import type { Item, Event, Community, Business, Movie } from "@/types";
import { EmptyState } from "@/components/cards/EmptyState";
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Skeleton } from "@/components/ui/skeleton";
import { locations, deals } from "@/lib/data"; // Keep static locations & deals for now

type CategoryPlural = "Events" | "Communities" | "Businesses" | "Deals" | "Movies";

const categoryIcons: Record<CategoryPlural, React.ReactNode> = {
  Events: <CalendarDays className="h-4 w-4" />,
  Communities: <Users className="h-4 w-4" />,
  Businesses: <Store className="h-4 w-4" />,
  Deals: <TicketPercent className="h-4 w-4" />,
  Movies: <Film className="h-4 w-4" />,
};

const categories: CategoryPlural[] = [
  "Events",
  "Communities",
  "Businesses",
  "Deals",
  "Movies",
];

function ItemsGrid({ items }: { items: Item[] }) {
    if (items.length === 0) {
        return (
            <EmptyState
                title="No Results Found"
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

function FilterableItemGrid({ items, location, searchQuery, category, loading }: { items: Item[], location: string, searchQuery: string, category: string, loading: boolean }) {
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            if (category !== 'All' && item.category !== category) return false;
            const searchLower = searchQuery.toLowerCase();
            const titleMatch = item.title.toLowerCase().includes(searchLower);
            const descriptionMatch = item.description.toLowerCase().includes(searchLower);
            const locationMatch = location === "all" || item.location.toLowerCase().includes(location.toLowerCase());
            return (titleMatch || descriptionMatch) && locationMatch;
        });
    }, [items, searchQuery, location, category]);

    if (loading) {
        return <ItemsGridSkeleton />
    }

    return <ItemsGrid items={filteredItems} />;
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


export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("all");
    const [activeTab, setActiveTab] = useState('all');
    
    const [events, setEvents] = useState<Item[]>([]);
    const [communities, setCommunities] = useState<Item[]>([]);
    const [businesses, setBusinesses] = useState<Item[]>([]);
    const [movies, setMovies] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Events
                const eventsRef = collection(db, "events");
                const eventsQuery = query(eventsRef, where("status", "==", "published"), orderBy("startsAt", "asc"));
                const eventsSnapshot = await getDocs(eventsQuery);
                const eventsData = eventsSnapshot.docs.map(doc => {
                    const data = doc.data() as Event;
                    return {
                        id: doc.id,
                        slug: data.slug,
                        title: data.title,
                        description: data.summary || '',
                        category: 'Event',
                        location: data.isOnline ? 'Online' : data.venue?.address || 'Location TBD',
                        image: data.coverURL || 'https://placehold.co/600x400.png',
                        date: data.startsAt,
                        price: data.ticketing?.priceMin,
                    } as Item;
                });
                setEvents(eventsData);

                // Communities
                const communitiesRef = collection(db, "communities");
                const communitiesQuery = query(communitiesRef, where("status", "==", "published"), orderBy("name", "asc"));
                const communitiesSnapshot = await getDocs(communitiesQuery);
                const communitiesData = communitiesSnapshot.docs.map(doc => {
                    const data = doc.data() as Community;
                    return {
                        id: doc.id,
                        slug: data.slug,
                        title: data.name,
                        description: data.description || '',
                        category: 'Community',
                        location: data.region ? `${data.region.city}, ${data.region.country}` : 'Location TBD',
                        image: data.logoURL || 'https://placehold.co/600x400.png',
                    } as Item;
                });
                setCommunities(communitiesData);

                // Businesses
                const businessesRef = collection(db, "businesses");
                const businessesQuery = query(businessesRef, where("status", "==", "published"), orderBy("displayName", "asc"));
                const businessesSnapshot = await getDocs(businessesQuery);
                const businessesData = businessesSnapshot.docs.map(doc => {
                    const bizData = doc.data() as Business;
                    return {
                        id: doc.id,
                        slug: bizData.slug,
                        title: bizData.displayName,
                        description: bizData.description || '',
                        category: 'Business',
                        location: bizData.isOnline ? 'Online' : bizData.locations[0]?.address || 'Location TBD',
                        image: bizData.images?.[0] || 'https://placehold.co/600x400.png',
                    } as Item;
                });
                setBusinesses(businessesData);
                
                // Movies
                const moviesRef = collection(db, "movies");
                const moviesQuery = query(moviesRef, where("status", "==", "now_showing"));
                const moviesSnapshot = await getDocs(moviesQuery);
                const moviesData = moviesSnapshot.docs.map(doc => {
                  const movieData = doc.data() as Movie;
                  return {
                    id: doc.id,
                    slug: movieData.slug,
                    title: movieData.title,
                    description: movieData.overview || '',
                    category: 'Movie',
                    location: movieData.screenings?.[0]?.city || 'TBD',
                    image: movieData.posterURL || 'https://placehold.co/600x400.png',
                  } as Item
                });
                setMovies(moviesData);

            } catch (error) {
                console.error("Error fetching data for explore page:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAllData();
    }, [])

    const categoryData: Record<CategoryPlural, Item[]> = {
        Events: events,
        Communities: communities,
        Businesses: businesses,
        Deals: deals, // Static for now
        Movies: movies,
    }

    const allItems = [...events, ...communities, ...businesses, ...deals, ...movies];

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-4xl font-headline font-bold">Explore the Directory</h1>
                <p className="text-muted-foreground mt-2">
                    Find exactly what you're looking for, from events to local businesses.
                </p>
            </header>

            <div className="sticky top-[65px] z-10 bg-background/80 backdrop-blur-sm -mx-4 px-4 py-4 mb-8 border-b">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="relative md:col-span-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search by keyword..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-1">
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
            </div>
            <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value)}>
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mb-8">
                    <TabsTrigger value="all">All</TabsTrigger>
                    {categories.map((cat) => (
                        <TabsTrigger key={cat} value={cat} className="gap-2">
                            {categoryIcons[cat]} {cat}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="all">
                     <FilterableItemGrid items={allItems} location={location} searchQuery={searchQuery} category="All" loading={loading} />
                </TabsContent>
                {categories.map((cat) => (
                    <TabsContent key={cat} value={cat}>
                        <FilterableItemGrid items={categoryData[cat]} location={location} searchQuery={searchQuery} category={cat} loading={loading && activeTab === cat} />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
