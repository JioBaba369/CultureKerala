
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Building, Users, Search, Handshake, PartyPopper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ItemCard } from "@/components/item-card";
import { siteConfig } from "@/config/site";
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Item, Community, Business } from "@/types";
import { FeaturedEventsCarousel } from "@/components/featured-events-carousel";
import { useEffect, useState } from "react";
import { useABTest } from "@/hooks/use-ab-test";


async function getFeaturedBusinesses(): Promise<Item[]> {
  const ref = collection(db, "businesses");
  // Simple query for now, can be expanded with a "featured" flag later
  const q = query(ref, where("status", "==", "published"), orderBy("displayName"), limit(3));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const bizData = doc.data() as Business;
    return {
      id: doc.id,
      slug: bizData.slug,
      title: bizData.displayName,
      description: bizData.description || '',
      category: 'Business',
      location: bizData.isOnline ? 'Online' : bizData.locations[0]?.address || 'Location TBD',
      image: bizData.images?.[0] || 'https://picsum.photos/600/400',
    } as Item;
  });
}

async function getFeaturedCommunities(): Promise<Item[]> {
    const ref = collection(db, "communities");
    // Simple query, can be expanded with "verified" or "featured" flag
    const q = query(ref, where("status", "==", "published"), orderBy("name"), limit(2));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data() as Community;
        return {
            id: doc.id,
            slug: data.slug,
            title: data.name,
            description: data.description || '',
            category: 'Community',
            location: data.region ? `${data.region.city}, ${data.region.country}` : 'Location TBD',
            image: data.logoURL || 'https://picsum.photos/600/400',
        } as Item;
    });
}

const howItWorksItems = [
    {
        icon: <Search className="h-10 w-10 text-primary" />,
        title: "Discover",
        description: "Explore a curated directory of cultural events, local businesses, and community groups."
    },
    {
        icon: <Handshake className="h-10 w-10 text-primary" />,
        title: "Connect",
        description: "Join communities, attend meetups, and build meaningful connections with like-minded people."
    },
    {
        icon: <PartyPopper className="h-10 w-10 text-primary" />,
        title: "Engage",
        description: "Find exclusive deals, support local entrepreneurs, and celebrate the richness of our culture."
    }
]


export default function HomePage() {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Item[]>([]);
  const [featuredCommunities, setFeaturedCommunities] = useState<Item[]>([]);
  const [tagline, setTagline] = useState(siteConfig.tagline);
  const taglineVariant = useABTest('homePageTagline');


  useEffect(() => {
    getFeaturedBusinesses().then(setFeaturedBusinesses);
    getFeaturedCommunities().then(setFeaturedCommunities);
  }, []);
  
  useEffect(() => {
      setTagline(siteConfig.abTests.homePageTagline[taglineVariant]);
  }, [taglineVariant])


  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-primary/10 border-b">
         <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5" style={{
          maskImage: 'linear-gradient(to bottom, transparent, black, black, transparent)'
        }}></div>
        <div className="container mx-auto px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl font-headline">
             {tagline}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
             Discover cultural events, build real connections, and support local businesses—on one trusted platform.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/explore">Explore Directory</Link>
              </Button>
              <Button asChild variant="link" className="text-sm font-semibold leading-6 text-foreground">
                <Link href="/about">
                  Learn More <span aria-hidden="true">→</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="container mx-auto px-4 py-16 space-y-24">
        
        {/* Upcoming Events Carousel */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-headline font-bold flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              Upcoming Events
            </h2>
            <Button asChild variant="outline">
              <Link href="/events">View All</Link>
            </Button>
          </div>
          <FeaturedEventsCarousel />
        </section>

        {/* How It Works */}
        <section className="bg-card border rounded-lg p-8 md:p-12">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-headline font-bold">How It Works</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Your one-stop destination for everything in the diaspora.
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
                {howItWorksItems.map((item, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                        <div className="p-4 bg-primary/10 rounded-full mb-4 border border-primary/20">
                           {item.icon}
                        </div>
                        <h3 className="text-xl font-headline font-semibold">{item.title}</h3>
                        <p className="mt-2 text-muted-foreground">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Featured Businesses */}
        {featuredBusinesses.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-headline font-bold flex items-center gap-3">
                <Building className="h-8 w-8 text-primary" />
                Featured Businesses
              </h2>
              <Button asChild variant="outline">
                <Link href="/businesses">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBusinesses.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Join a Community */}
        {featuredCommunities.length > 0 && (
          <section>
            <div className="bg-card border rounded-lg p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="p-3 bg-primary/10 rounded-full w-max mb-4 border border-primary/20">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl font-headline font-bold">Connect and Belong</h2>
                <p className="text-muted-foreground text-lg">
                  Find your tribe. Our communities are the perfect place to meet like-minded people, share your passions, and build lasting friendships.
                </p>
                <Button asChild size="lg" className="mt-4">
                  <Link href="/communities">Discover Communities</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuredCommunities.map(item => (
                    <Card key={item.id} className="overflow-hidden h-full group">
                      <Link href={`/communities/${item.slug}`} className="flex flex-col h-full">
                        <div className="relative h-32 w-full">
                            <Image 
                            src={item.image} 
                            alt={item.title} 
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105" 
                            data-ai-hint={`${item.category} ${item.title}`}
                            />
                        </div>
                        <CardHeader className="flex-grow">
                          <CardTitle className="text-base font-headline truncate">{item.title}</CardTitle>
                        </CardHeader>
                      </Link>
                    </Card>
                  ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
