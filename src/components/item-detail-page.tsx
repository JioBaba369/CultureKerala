
'use client';

import Image from 'next/image';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Film, Users, Store, TicketPercent } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Item, Category } from '@/types';
import { format } from 'date-fns';


const categoryIcons: Record<Category, React.ReactNode> = {
    Event: <Calendar className="h-4 w-4" />,
    Community: <Users className="h-4 w-4" />,
    Business: <Store className="h-4 w-4" />,
    Deal: <TicketPercent className="h-4 w-4" />,
    Movie: <Film className="h-4 w-4" />,
};

export function ItemDetailPage({ item }: { item: Item }) {
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
                <CardDescription className="flex flex-wrap items-center gap-4 pt-2 text-base">
                    <Badge variant="secondary" className="gap-2">
                        {categoryIcons[item.category]} {item.category}
                    </Badge>
                    <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {item.location}
                    </span>
                    {item.date && (
                        <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(item.date), "PPP")}
                        </span>
                    )}
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
