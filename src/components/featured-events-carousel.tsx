
'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Item, Event as EventType } from '@/types';
import { ItemCard } from '@/components/item-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"

export function FeaturedEventsCarousel() {
  const [events, setEvents] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("status", "==", "published"), orderBy("startsAt", "asc"), limit(6));
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map(doc => {
        const data = doc.data() as EventType;
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
    } catch (error) {
      console.error("Error fetching events: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if(events.length === 0) {
      return null;
  }

  return (
    <Carousel 
        opts={{
            align: "start",
            loop: true,
        }}
        plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
            }),
        ]}
        className="w-full"
    >
      <CarouselContent>
        {events.map((item) => (
          <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <ItemCard item={item} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
