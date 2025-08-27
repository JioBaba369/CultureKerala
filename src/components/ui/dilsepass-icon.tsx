"use client";

import { Button } from "@/components/ui/button";
import { Search, Handshake, PartyPopper } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useEffect, useState } from "react";
import { FeaturedEventsCarousel } from "@/components/featured-events-carousel";
import { KeralaIcon } from "@/components/ui/kerala-icon";
import { WordClock } from "@/components/word-clock";

export default function HomePage() {
  
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-background border-b">
         <div
          className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5"
          style={{ maskImage: 'linear-gradient(to bottom, transparent, black, black, transparent)' }}
        />
        <div className="container mx-auto px-6 lg:px-8 py-24 sm:py-32 text-center">
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="mx-auto w-max mb-6">
              <p className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium leading-6 text-primary ring-1 ring-inset ring-primary/20">
                Culture. Community. Kerala.
              </p>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl font-headline">{siteConfig.tagline}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
             Discover Kerala, wherever you are—find events, meet Malayalis, support Kerala arts & businesses, connect with local groups, and unlock deals & perks.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/events">Explore Events</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
       {/* Featured Events Section */}
      <div className="py-16 sm:py-24">
        <div className="container mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">Featured Events</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Don't miss out on these popular upcoming events near you.
                </p>
            </div>
            <FeaturedEventsCarousel />
        </div>
      </div>

      <WordClock />
    </div>
  );
}