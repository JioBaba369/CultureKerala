
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Building, Users, Search, Handshake, PartyPopper, ShieldCheck, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ItemCard } from "@/components/item-card";
import { siteConfig } from "@/config/site";
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Item, Community, Business, Event } from "@/types";
import { FeaturedEventsCarousel } from "@/components/featured-events-carousel";
import { useEffect, useState } from "react";
import { useABTest } from "@/hooks/use-ab-test";


async function getFeaturedItems(): Promise<{ events: Item[], businesses: Item[], communities: Item[] }> {
  const eventsQuery = query(collection(db, "events"), where("status", "==", "published"), orderBy("startsAt", "asc"), limit(4));
  const businessesQuery = query(collection(db, "businesses"), where("status", "==", "published"), orderBy("displayName"), limit(4));
  const communitiesQuery = query(collection(db, "communities"), where("status", "==", "published"), orderBy("name"), limit(4));

  const [eventsSnapshot, businessesSnapshot, communitiesSnapshot] = await Promise.all([
    getDocs(eventsQuery),
    getDocs(businessesQuery),
    getDocs(communitiesQuery),
  ]);

  const events = eventsSnapshot.docs.map(doc => {
    const data = doc.data() as Event;
    return {
      id: doc.id,
      slug: data.slug,
      title: data.title,
      description: data.summary || '',
      category: 'Event',
      location: data.isOnline ? 'Online' : data.venue?.address || 'Location TBD',
      image: data.coverURL || 'https://picsum.photos/600/400',
      date: data.startsAt,
      price: data.ticketing?.tiers?.[0]?.price,
    } as Item;
  });

  const businesses = businessesSnapshot.docs.map(doc => {
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

  const communities = communitiesSnapshot.docs.map(doc => {
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

  return { events, businesses, communities };
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

const whyChooseUsItems = [
    {
        icon: <Star className="h-8 w-8 text-amber-400" />,
        title: "Curated for the Diaspora",
        description: "Every listing is relevant to the diaspora, making it easy to find things that matter to you."
    },
    {
        icon: <ShieldCheck className="h-8 w-8 text-green-500" />,
        title: "Trusted & Verified",
        description: "We verify communities and businesses to ensure a safe and reliable experience for everyone."
    },
    {
        icon: <Sparkles className="h-8 w-8 text-violet-500" />,
        title: "All-in-One Platform",
        description: "From movie tickets to community events and local deals, find everything in one place."
    }
]


export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState<{ events: Item[], businesses: Item[], communities: Item[] }>({ events: [], businesses: [], communities: []});
  const [tagline, setTagline] = useState(siteConfig.tagline);
  const taglineVariant = useABTest('homePageTagline');


  useEffect(() => {
    getFeaturedItems().then(setFeaturedItems);
  }, []);
  
  useEffect(() => {
    if (taglineVariant) {
      setTagline(siteConfig.abTests.homePageTagline[taglineVariant]);
    }
  }, [taglineVariant])


  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-primary/5 border-b">
         <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5" style={{
          maskImage: 'linear-gradient(to bottom, transparent, black, black, transparent)'
        }}></div>
        <div className="container mx-auto px-6 lg:px-8 py-24 sm:py-40 text-center">
          <div className="max-w-4xl mx-auto">
             <div className="mx-auto w-max mb-6">
                <p className="inline-flex items-center rounded-lg bg-primary/10 px-4 py-1.5 text-sm font-medium leading-6 text-primary ring-1 ring-inset ring-primary/20">
                    Your Community Hub
                </p>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl font-headline">
             {tagline}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
             Discover cultural events, build real connections, and support local businesses—all on one trusted platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
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
      <div className="container mx-auto px-4 py-16 sm:py-24 space-y-24 sm:space-y-32">
        
        {/* Upcoming Events Carousel */}
        {featuredItems.events.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-headline font-bold flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                Upcoming Events
              </h2>
              <Button asChild variant="outline">
                <Link href="/events">View All <span className="hidden sm:inline ml-1">Events</span></Link>
              </Button>
            </div>
            <FeaturedEventsCarousel />
          </section>
        )}

        {/* Featured Showcase */}
        {(featuredItems.communities.length > 0 || featuredItems.businesses.length > 0) && (
             <section>
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-headline font-bold">Find Your Place</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        From vibrant communities to amazing local businesses, your connections start here.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                   {featuredItems.communities[0] && <ItemCard item={featuredItems.communities[0]} />}
                   {featuredItems.businesses[0] && <ItemCard item={featuredItems.businesses[0]} />}
                   {featuredItems.events[1] && <ItemCard item={featuredItems.events[1]} />}
                </div>
             </section>
        )}
       

        {/* How It Works */}
        <section className="bg-card border rounded-xl p-8 md:p-16">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-headline font-bold">How It Works</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Your one-stop destination for everything in the diaspora.
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
                {howItWorksItems.map((item, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-4">
                        <div className="p-4 bg-primary/10 rounded-full mb-4 border border-primary/20">
                           {item.icon}
                        </div>
                        <h3 className="text-xl font-headline font-semibold">{item.title}</h3>
                        <p className="mt-2 text-muted-foreground">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>

         {/* Why Choose Us */}
        <section>
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-headline font-bold">Why Choose DilSePass?</h2>
                 <p className="mt-4 text-lg text-muted-foreground">
                    The perfect platform to find and create connections.
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
                 {whyChooseUsItems.map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                        <div className="p-2 bg-muted rounded-full mt-1">
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-headline font-semibold">{item.title}</h3>
                            <p className="mt-1 text-muted-foreground">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </div>
    </div>
  );
}

