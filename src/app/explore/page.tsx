
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
import { allItems, locations } from "@/lib/data";
import { ItemCard } from "@/components/ItemCard";
import type { Item, Category } from "@/types";
import { EmptyState } from "@/components/cards/EmptyState";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [category, setCategory] = useState<"all" | Category>("all");

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

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Explore</h1>
        <p className="text-muted-foreground mt-2">
          Find exactly what you're looking for.
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
           <Select value={category} onValueChange={(value) => setCategory(value as "all" | Category)}>
            <SelectTrigger>
              <CalendarDays className="h-5 w-5 text-muted-foreground mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Event">Event</SelectItem>
              <SelectItem value="Community">Community</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Deal">Deal</SelectItem>
              <SelectItem value="Movie">Movie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ItemsGrid items={filteredItems} />
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
