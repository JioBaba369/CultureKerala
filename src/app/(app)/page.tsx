
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { events, businesses, communities } from "@/lib/data";
import { ArrowRight, Calendar, Building, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ItemCard } from "@/components/item-card";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  const featuredEvents = events.slice(0, 3);
  const featuredBusinesses = businesses.slice(0, 3);
  const featuredCommunities = communities.slice(0, 2);

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
             {siteConfig.tagline}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
             Discover cultural events, build real connections, and support local businesses—on one trusted platform.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/explore">Explore Directory</Link>
              </Button>
              <Button asChild variant="link" size="lg" className="text-foreground">
                <Link href="/about">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="container mx-auto px-4 py-16 space-y-16">
        
        {/* Upcoming Events */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Featured Businesses */}
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

        {/* Join a Community */}
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
                  <Card key={item.id} className="overflow-hidden">
                    <Link href={`/communities/${item.slug}`}>
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        width={300} 
                        height={200} 
                        className="w-full h-32 object-cover" 
                        data-ai-hint={`${item.category}`}
                      />
                      <CardHeader>
                        <CardTitle className="text-base font-headline truncate">{item.title}</CardTitle>
                      </CardHeader>
                    </Link>
                  </Card>
                ))}
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
