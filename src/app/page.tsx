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
  LayoutGrid,
  MapPin,
  Search,
  Store,
  TicketPercent,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { allItems, locations, type Item, type Category } from "@/lib/data";
import { ItemCard } from "@/components/item-card";

const categoryIcons: Record<Category, React.ReactNode> = {
  Events: <CalendarDays className="h-4 w-4" />,
  Communities: <Users className="h-4 w-4" />,
  Businesses: <Store className="h-4 w-4" />,
  Deals: <TicketPercent className="h-4 w-4" />,
  Movies: <Film className="h-4 w-4" />,
};

const categories: Category[] = [
  "Events",
  "Communities",
  "Businesses",
  "Deals",
  "Movies",
];

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [category, setCategory] = useState("all");

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(searchLower);
      const descriptionMatch = item.description.toLowerCase().includes(searchLower);
      const locationMatch = location === "all" || item.location === location;
      const categoryMatch = category === "all" || item.category === category;
      return (titleMatch || descriptionMatch) && locationMatch && categoryMatch;
    });
  }, [searchQuery, location, category]);

  const getItemsForTab = (tab: "all" | Category) => {
    if (tab === "all") return filteredItems;
    return filteredItems.filter((item) => item.category === tab);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
          Discover Your City
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
          From vibrant events to hidden gems, find what your heart desires with DilSePass.
        </p>
      </header>

      <div className="sticky top-[65px] z-10 bg-background/80 backdrop-blur-sm -mx-4 px-4 py-4 mb-8 border-b">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by keyword..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
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
                <LayoutGrid className="h-5 w-5 text-muted-foreground mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-8">
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
            <ItemsGrid items={getItemsForTab(cat)} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function ItemsGrid({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <h3 className="font-headline text-2xl">No Results Found</h3>
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
