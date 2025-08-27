
"use client";

import { useState, useMemo, useEffect, Suspense, useCallback } from "react";
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
import type { Item, Event, Community, Business, Movie, Deal } from "@/types";
import { EmptyState } from "@/components/cards/EmptyState";
import { collection, getDocs, query, where, orderBy, Query } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { locations } from "@/lib/data"; 
import { ItemsGridSkeleton } from "@/components/skeletons/items-grid-skeleton";
import { useSearchParams } from "next/navigation";

type CategoryPlural = "Events" | "Communities" | "Businesses" | "Deals" | "Movies" | "All";

const categoryIcons: Record<Exclude<CategoryPlural, "All">, React.ReactNode> = {
  Events: <CalendarDays className="h-4 w-4" />,
  Communities: <Users className="h-4 w-4" />,
  Businesses: <Store className="h-4 w-4" />,
  Deals: <TicketPercent className="h-4 w-4" />,
  Movies: <Film className="h-4 w-4" />,
};

const categories: Exclude<CategoryPlural, "All">[] = [
  "Events",
  "Communities",
  "Businesses",
  "Deals",
  "Movies",
];

function ItemsGrid({ items, loading, category }: { items: Item[], loading: boolean, category: string }) {
    if (loading) {
      return <ItemsGridSkeleton />;
    }

    if (items.length === 0) {
        return (
            <EmptyState
                title={`No ${category} Found`}
                description="Try adjusting your search or filters."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
                <ItemCard key={`${item.category}-${item.id}`} item={item} />
            ))}
        </div>
    );
}

function ExplorePageContent() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('q') || "";
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [location, setLocation] = useState("all");
    const [activeTab, setActiveTab] = useState<CategoryPlural>('All');
    
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const collectionsToFetch: {name: string, statusField: string, statusValue: string, orderByField: string, orderDirection?: "asc" | "desc"}[] = [
                { name: 'events', statusField: 'status', statusValue: 'published', orderByField: 'startsAt', orderDirection: 'asc' },
                { name: 'communities', statusField: 'status', statusValue: 'published', orderByField: 'name', orderDirection: 'asc' },
                { name: 'businesses', statusField: 'status', statusValue: 'published', orderByField: 'displayName', orderDirection: 'asc' },
                { name: 'deals', statusField: 'status', statusValue: 'published', orderByField: 'endsAt', orderDirection: 'desc' },
                { name: 'movies', statusField: 'status', statusValue: 'now_showing', orderByField: 'title', orderDirection: 'asc' },
            ];

            const activeCollections = activeTab === 'All'
                ? collectionsToFetch
                : collectionsToFetch.filter(c => c.name.toLowerCase() === activeTab.toLowerCase());

            const allPromises = activeCollections.map(c => {
                let q: Query = query(collection(db, c.name), where(c.statusField, "==", c.statusValue));
                if (location !== 'all') {
                     if (c.name === 'communities') q = query(q, where('region.city', '==', location));
                }
                q = query(q, orderBy(c.orderByField, c.orderDirection));
                return getDocs(q);
            });

            const allSnapshots = await Promise.all(allPromises);
            
            const allItems: Item[] = [];
            allSnapshots.forEach((snapshot, index) => {
                const collectionName = activeCollections[index].name;
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    switch(collectionName) {
                        case 'events':
                            const eventData = data as Event;
                            allItems.push({
                                id: doc.id, slug: eventData.slug, title: eventData.title, description: eventData.summary || '',
                                category: 'Event', location: eventData.isOnline ? 'Online' : eventData.venue?.address || 'Location TBD',
                                image: eventData.coverURL || 'https://placehold.co/600x400.png', date: eventData.startsAt, price: eventData.ticketing?.tiers?.[0]?.price
                            });
                            break;
                        case 'communities':
                            const commData = data as Community;
                            allItems.push({
                                id: doc.id, slug: commData.slug, title: commData.name, description: commData.description || '',
                                category: 'Community', location: commData.region ? `${commData.region.city}, ${commData.region.country}` : 'Location TBD',
                                image: commData.logoURL || 'https://placehold.co/600x400.png'
                            });
                            break;
                        case 'businesses':
                            const bizData = data as Business;
                            allItems.push({
                                id: doc.id, slug: bizData.slug, title: bizData.displayName, description: bizData.description || '',
                                category: 'Business', location: bizData.isOnline ? 'Online' : bizData.locations[0]?.address || 'Location TBD',
                                image: bizData.images?.[0] || 'https://placehold.co/600x400.png'
                            });
                            break;
                        case 'deals':
                            const dealData = data as Deal;
                            allItems.push({
                                id: doc.id, slug: doc.id, title: dealData.title, description: dealData.description || '',
                                category: 'Deal', location: 'Multiple Locations', 
                                image: dealData.images?.[0] || 'https://placehold.co/600x400.png', date: dealData.endsAt,
                            });
                            break;
                        case 'movies':
                            const movieData = data as Movie;
                            allItems.push({
                                id: doc.id, slug: movieData.slug, title: movieData.title, description: movieData.overview || '',
                                category: 'Movie', location: movieData.screenings?.[0]?.city || 'TBD',
                                image: movieData.posterURL || 'https://placehold.co/600x400.png'
                            });
                            break;
                    }
                })
            })
            setItems(allItems);
        } catch (error) {
            console.error("Error fetching data for explore page:", error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, location])

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData])

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const searchLower = searchQuery.toLowerCase();
            const titleMatch = item.title.toLowerCase().includes(searchLower);
            const descriptionMatch = item.description?.toLowerCase().includes(searchLower) || false;
            
            if (location !== 'all' && item.location.toLowerCase().indexOf(location.toLowerCase()) === -1) {
                return false;
            }

            return titleMatch || descriptionMatch;
        });
    }, [items, searchQuery, location]);

    const getItemsForTab = (tab: CategoryPlural) => {
        if (tab === 'All') return filteredItems;
        const category = tab.slice(0, -1) as Item['category'];
        return filteredItems.filter(item => item.category === category);
    }

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
            <Tabs defaultValue="All" className="w-full" onValueChange={(value) => setActiveTab(value as CategoryPlural)}>
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mb-8">
                    <TabsTrigger value="All">All</TabsTrigger>
                    {categories.map((cat) => (
                        <TabsTrigger key={cat} value={cat} className="gap-2">
                            {categoryIcons[cat]} {cat}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="All">
                     <ItemsGrid items={filteredItems} loading={loading} category="Results" />
                </TabsContent>
                {categories.map((cat) => (
                    <TabsContent key={cat} value={cat}>
                        <ItemsGrid items={getItemsForTab(cat)} loading={loading} category={cat} />
                    </TabsContent>
                ))}
            </Tabs>
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
