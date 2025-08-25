
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Film, Users, Store, TicketPercent, Share2, Copy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Item } from '@/types';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { InfoList, InfoListItem } from './ui/info-list';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ItemCard } from './item-card';
import { allItems } from '@/lib/data';

const categoryIcons: Record<string, React.ReactNode> = {
    Event: <Calendar className="h-4 w-4" />,
    Community: <Users className="h-4 w-4" />,
    Business: <Store className="h-4 w-4" />,
    Deal: <TicketPercent className="h-4 w-4" />,
    Movie: <Film className="h-4 w-4" />,
};

export function ItemDetailPage({ item }: { item: Item }) {
    const { toast } = useToast();
    // Note: Related items are still coming from static data. This can be updated later.
    const relatedItems = allItems.filter(i => i.category === item.category && i.id !== item.id).slice(0, 3);

    const handleCopyLink = () => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        navigator.clipboard.writeText(url);
        toast({
        title: "Link Copied!",
        description: "The link has been copied to your clipboard.",
        });
    };

  return (
    <div className="bg-muted/40">
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="aspect-video relative mb-8">
                    <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover rounded-lg"
                    data-ai-hint={`${item.category} ${item.title}`}
                    />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 lg:col-span-3">
                    <Card>
                        <CardHeader>
                             <CardTitle className="font-headline text-4xl leading-tight">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-lg max-w-none">
                                <h3>About this {item.category}</h3>
                                <p>{item.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {relatedItems.length > 0 && (
                        <div className='mt-12'>
                             <h2 className="text-2xl font-headline font-bold mb-4">Related in {item.category}s</h2>
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedItems.map(relatedItem => (
                                    <ItemCard key={relatedItem.id} item={relatedItem} />
                                ))}
                             </div>
                        </div>
                    )}

                </div>

                 {/* Sticky Sidebar */}
                <div className="md:col-span-1 lg:col-span-1">
                    <div className="sticky top-20 space-y-6">
                        <Card>
                             <CardHeader>
                                <Button className="w-full" size="lg">Get Tickets</Button>
                            </CardHeader>
                            <CardContent>
                                <InfoList>
                                     <InfoListItem label="Category">
                                        <Badge variant="secondary" className="gap-2">
                                            {categoryIcons[item.category]} {item.category}
                                        </Badge>
                                    </InfoListItem>
                                    <InfoListItem label="Location">
                                        <span className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" /> {item.location}
                                        </span>
                                    </InfoListItem>
                                    {item.date && (
                                        <InfoListItem label="Date">
                                            <span className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                {format(new Date(item.date), "PPP")}
                                            </span>
                                        </InfoListItem>
                                    )}
                                    {item.director && (
                                        <InfoListItem label="Director">
                                            {item.director}
                                        </InfoListItem>
                                    )}
                                    {item.cast && (
                                        <InfoListItem label="Cast">
                                            {item.cast.join(', ')}
                                        </InfoListItem>
                                    )}
                                     {item.genre && (
                                        <InfoListItem label="Genre">
                                            {item.genre}
                                        </InfoListItem>
                                    )}
                                </InfoList>
                                <Separator className='my-4' />
                                <div className='flex items-center justify-center gap-2'>
                                    <Button variant="outline" size="sm" onClick={handleCopyLink}>
                                        <Copy className='mr-2 h-4 w-4' /> Copy Link
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Share2 className='mr-2 h-4 w-4' /> Share
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
