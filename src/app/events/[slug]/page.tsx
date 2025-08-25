
'use client';

import { allItemsBySlug } from '@/lib/data';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const item = allItemsBySlug[slug as string];

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <p>The event you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="aspect-video relative mb-8">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover rounded-lg"
              data-ai-hint={`${item.category} ${item.title}`}
            />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:gap-8">
            <div className="flex-grow">
                 <CardTitle className="font-headline text-4xl">{item.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 pt-2">
                    <Badge variant="secondary" className="gap-2">
                        <Calendar className="h-4 w-4" /> {item.category}
                    </Badge>
                    <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {item.location}
                    </span>
                </CardDescription>
            </div>
        </div>

        <Separator className="my-8" />
        
        <div className="prose prose-lg max-w-none">
            <p>{item.description}</p>
        </div>
      </div>
    </div>
  );
}
