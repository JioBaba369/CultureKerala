
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

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [activeTab, setActiveTab] = useState<"all" | CategoryPlural>("all");

  const filteredItems = useMemo(() => {
    let itemsToFilter: Item[] = activeTab === "all" ? allItems : categoryData[activeTab as CategoryPlural] ?? [];

    return itemsToFilter.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const descriptionMatch = item.description.toLowerCase().includes(searchLower);
      const locationMatch = location === "all" || item.location === location;
      
      return (titleMatch || descriptionMatch) && locationMatch;
    });
  }, [searchQuery, location, activeTab]);

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
