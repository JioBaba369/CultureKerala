'use client';

import { allItems } from '@/lib/data';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TicketPercent, MapPin } from 'lucide-react';

export default function DealDetailPage() {
  const params = useParams();
  const { id } = params;

  const item = allItems.find((item) => item.id === id);

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Deal not found</h1>
        <p>The deal you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="aspect-video relative mb-4">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover rounded-t-lg"
               data-ai-hint={`${item.category} ${item.title}`}
            />
          </div>
          <CardTitle className="font-headline text-4xl mt-4">{item.title}</CardTitle>
          <CardDescription className="flex items-center gap-4 pt-2">
            <Badge variant="secondary" className="gap-2">
                <TicketPercent className="h-4 w-4" /> {item.category}
            </Badge>
             <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {item.location}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{item.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}