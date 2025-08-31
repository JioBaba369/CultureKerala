
'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Store, Users, Handshake, BookOpen, Star } from 'lucide-react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { FeaturedEventsCarousel } from '@/components/featured-events-carousel';
import Image from 'next/image';
import { WordClock } from '@/components/features/word-clock';

const discoverItems = [
  {
    title: 'Events',
    description: 'Find cultural celebrations, festivals, and meetups.',
    icon: <Calendar className="h-8 w-8 text-primary" />,
    href: '/events',
    image: 'https://picsum.photos/600/400',
    aiHint: 'kerala festival',
  },
  {
    title: 'Businesses',
    description: 'Support local Malayalee-owned businesses.',
    icon: <Store className="h-8 w-8 text-primary" />,
    href: '/businesses',
    image: 'https://picsum.photos/600/400',
    aiHint: 'local store',
  },
  {
    title: 'Communities',
    description: 'Connect with local associations and groups.',
    icon: <Users className="h-8 w-8 text-primary" />,
    href: '/communities',
    image: 'https://picsum.photos/600/400',
    aiHint: 'community gathering',
  },
];

const whyChooseUsItems = [
    {
        icon: <Handshake className="h-10 w-10 text-primary" />,
        title: "Connect Your Community",
        description: "From local associations to global networks, find and join groups that share your interests and heritage."
    },
    {
        icon: <BookOpen className="h-10 w-10 text-primary" />,
        title: "Preserve Your Culture",
        description: "Access resources to learn Malayalam, discover cultural history, and pass traditions to the next generation."
    },
    {
        icon: <Star className="h-10 w-10 text-primary" />,
        title: "Discover Local Gems",
        description: "Find Malayalee-owned businesses, exclusive deals, and community-centric services right in your neighborhood."
    }
]

export default function HomePage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/1920/1080"
            alt="Kovalam lighthouse"
            fill
            sizes="100vw"
            className="object-cover"
            data-ai-hint="kovalam lighthouse"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/30 to-transparent" />
           <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 container mx-auto px-4 max-w-4xl">
           <div className="mx-auto w-max mb-4 px-4 py-2 rounded-full bg-black/30 border border-white/20 backdrop-blur-sm"><span className="text-lg font-semibold tracking-wider text-white">Culture. Community. Connection.</span></div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl font-heading drop-shadow-md">
            {siteConfig.name}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-200 drop-shadow-sm max-w-2xl mx-auto">
            {siteConfig.description}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/explore">
                Explore Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section className="py-16 sm:py-24 bg-muted/40">
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
                <div className="h-full rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
                    <div className="aspect-video relative">
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={item.aiHint}
                        />
                    </div>
                  <div className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
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
      <section className="py-16 sm:py-24 bg-background">
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

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-24 bg-muted/40">
        <div className="container mx-auto">
           <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-heading font-bold">The Heart of the Community</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    More than just a directory. We are a platform for connection, culture, and growth.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {whyChooseUsItems.map(item => (
                     <div key={item.title} className="flex flex-col items-center text-center p-8 bg-card rounded-lg border">
                        <div className="p-4 bg-primary/10 rounded-full mb-4 border border-primary/20">
                            {item.icon}
                        </div>
                        <h3 className="text-2xl font-headline font-semibold">{item.title}</h3>
                        <p className="mt-2 text-muted-foreground">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
      
    </div>
  );
}
