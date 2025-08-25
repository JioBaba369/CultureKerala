
"use client";

import { useState, useMemo } from "react";
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
import { allItems, locations, events, communities, businesses, deals, movies } from "@/lib/data";
import { ItemCard } from "@/components/item-card";
import type { Item } from "@/types";
import { EmptyState } from "@/components/cards/EmptyState";

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

const categoryData: Record<CategoryPlural, Item[]> = {
    Events: events,
    Communities: communities,
    Businesses: businesses,
    Deals: deals,
    Movies: movies,
}

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [activeTab, setActiveTab] = useState<"all" | CategoryPlural>("all");

  const filteredItems = useMemo(() => {
    let itemsToFilter: Item[] = activeTab === "all" ? allItems : categoryData[activeTab];

    return itemsToFilter.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const descriptionMatch = item.description.toLowerCase().includes(searchLower);
      const locationMatch = location === "all" || item.location === location;
      
      // The category is already filtered by the active tab selection
      return (titleMatch || descriptionMatch) && locationMatch;
    });
  }, [searchQuery, location, activeTab]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12 py-16 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5" style={{
          maskImage: 'linear-gradient(to bottom, transparent, black, black, transparent)'
        }}></div>
         <div className="relative bg-background/60 backdrop-blur-sm p-8 max-w-3xl mx-auto rounded-xl border shadow-md">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
              The Heartbeat of Our Community
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              From vibrant events to hidden gems, find what your heart desires with DilSePass.
            </p>
        </div>
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
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | CategoryPlural)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mb-8">
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map((cat) => (
                    <TabsTrigger key={cat} value={cat} className="gap-2">
                        {categoryIcons[cat]} {cat}
                    </TabsTrigger>
                ))}
            </TabsList>
            
            <TabsContent value="all">
                <ItemsGrid items={filteredItems} />
            </TabsContent>
             {categories.map((cat) => (
                <TabsContent key={cat} value={cat}>
                    <ItemsGrid items={filteredItems} />
                </TabsContent>
            ))}
        </Tabs>
    </div>
  );
}

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
