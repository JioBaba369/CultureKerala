
'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Store, Users } from 'lucide-react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { FeaturedEventsCarousel } from '@/components/featured-events-carousel';
import { WordClock } from '@/components/word-clock';
import Image from 'next/image';

const discoverItems = [
  {
    title: 'Events',
    description: 'Find cultural celebrations, festivals, and meetups.',
    icon: <Calendar className="h-8 w-8 text-primary" />,
    href: '/events',
    aiHint: 'kerala festival',
  },
  {
    title: 'Businesses',
    description: 'Support local Malayalee-owned businesses.',
    icon: <Store className="h-8 w-8 text-primary" />,
    href: '/businesses',
    aiHint: 'local store',
  },
  {
    title: 'Communities',
    description: 'Connect with local associations and groups.',
    icon: <Users className="h-8 w-8 text-primary" />,
    href: '/communities',
    aiHint: 'community gathering',
  },
];

export default function HomePage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/1920/1080?random=2"
            alt="Kovalam lighthouse"
            fill
            className="object-cover"
            data-ai-hint="kovalam lighthouse"
            priority
          />
          <div className="absolute inset-0 bg-green-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4 max-w-4xl">
           <div className="mx-auto w-max mb-4 px-4 py-2 rounded-full bg-stone-800 border-2 border-primary"><span className="bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 to-blue-500 bg-clip-text text-transparent text-lg font-semibold tracking-wider">Culture. Community. Connection.</span></div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl font-heading drop-shadow-md">
            {siteConfig.name}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-200 drop-shadow-sm">
            Discover Kerala, wherever you are—find events, meet Malayalis,
            support Kerala arts & businesses, connect with local groups, and
            unlock deals & perks.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/explore">
                Explore Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-black">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section className="py-16 sm:py-24 bg-primary/10">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              Discover Your Community
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              The central hub for the global Malayalee diaspora.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {discoverItems.map((item) => (
              <Link href={item.href} key={item.title} className="group">
                <div className="h-full rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {item.icon}
                    </div>
                    <h3 className="text-xl font-heading font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 sm:py-24 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              Featured Events
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't miss out on these popular upcoming events near you.
            </p>
          </div>
          <FeaturedEventsCarousel />
        </div>
      </section>
      
      <WordClock />
    </div>
  );
}
