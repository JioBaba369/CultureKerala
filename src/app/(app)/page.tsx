
"use client";

import { Button } from "@/components/ui/button";
import { Search, Handshake, PartyPopper } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useEffect, useState } from "react";
import { useABTest } from "@/hooks/use-ab-test";

export default function HomePage() {
  const [tagline, setTagline] = useState(siteConfig.tagline);
  const taglineVariant = useABTest('homePageTagline');

  useEffect(() => {
    if (taglineVariant && siteConfig?.abTests?.homePageTagline?.[taglineVariant]) {
      setTagline(siteConfig.abTests.homePageTagline[taglineVariant]);
    }
  }, [taglineVariant]);

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-primary/5 border-b">
        <div
          className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5"
          style={{ maskImage: 'linear-gradient(to bottom, transparent, black, black, transparent)' }}
        />
        <div className="container mx-auto px-6 lg:px-8 py-24 sm:py-40 text-center">
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="mx-auto w-max mb-6">
              <p className="inline-flex items-center rounded-lg bg-primary/10 px-4 py-1.5 text-sm font-medium leading-6 text-primary ring-1 ring-inset ring-primary/20">
                Nammal Ellarum Orumichu
              </p>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl font-headline">{tagline}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
             A home for Malayali culture worldwide—discover events, learn Malayalam, support Kerala arts & businesses, and connect with local Malayali groups wherever you live.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/events">Explore Events</Link>
              </Button>
              <Button asChild variant="link" className="text-sm font-semibold leading-6 text-foreground">
                <Link href="/about">Learn More <span aria-hidden>→</span></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
