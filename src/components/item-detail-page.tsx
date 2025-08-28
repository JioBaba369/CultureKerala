'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Film, Users, Store, TicketPercent, Share2, Copy, UserSquare, Building, Download, Newspaper, Award } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Item, Category, Deal, Event, Business, Classified } from '@/types';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { InfoList, InfoListItem } from './ui/info-list';
import { useToast } from '@/hooks/use-toast';
import { ItemCard } from './item-card';
import { BookingDialog } from './tickets/BookingDialog';
import { Timestamp, collection, getDocs, limit, query, where, doc, getDoc, Query } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { mapDocToItem } from '@/lib/utils';

const categoryIcons: Record<Category, React.ReactNode> = {
    Event: <Calendar className="h-4 w-4" />,
    Community: <Users className="h-4 w-4" />,
    Business: <Store className="h-4 w-4" />,
    Deal: <TicketPercent className="h-4 w-4" />,
    Movie: <Film className="h-4 w-4" />,
    Classified: <Newspaper className="h-4 w-4" />,
    Perk: <Award className="h-4 w-4" />,
};

function ShareDialog({ item }: { item: Item }) {
    const { toast } = useToast();
    const [itemUrl, setItemUrl] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = window.location.href;
            setItemUrl(url);
            setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}&color=222222&bgcolor=ffffff&margin=10`);
        }
    }, []);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(itemUrl);
        toast({
            title: "Link Copied!",
            description: "The link has been copied to your clipboard.",
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Share2 className='mr-2 h-4 w-4' /> Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline">Share "{item.title}"</DialogTitle>
                    <DialogDescription>
                        Share this with your friends via link or QR code.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center py-4">
                    <div className="p-4 bg-white rounded-lg">
                        {qrCodeUrl && <Image src={qrCodeUrl} width={150} height={150} alt="QR Code" data-ai-hint="qr code" />}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Input id="link" defaultValue={itemUrl} readOnly />
                    <Button type="button" size="sm" className="px-3" onClick={handleCopyLink}>
                        <span className="sr-only">Copy</span>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function ItemDetailPage({ item, relatedItemsQuery: initialRelatedItemsQuery }: { item: Item, relatedItemsQuery?: Query }) {
    const { toast } = useToast();
    const [relatedItems, setRelatedItems] = useState<Item[]>([]);
    const [event, setEvent] = useState<Event | null>(null);
    
    useEffect(() => {
        const fetchRelated = async () => {
            let relatedItemsQuery = initialRelatedItemsQuery;

            if (!relatedItemsQuery) {
                const collectionName = `${item.category.toLowerCase()}s`;
                relatedItemsQuery = query(collection(db, collectionName), where('status', 'in', ['published', 'active', 'now_showing']), limit(4));
            }
            
            const snapshot = await getDocs(relatedItemsQuery);
            if (snapshot.empty) return;
            
            const collectionName = snapshot.docs[0].ref.parent.id;

            const items = snapshot.docs
                .map(doc => mapDocToItem(doc, collectionName))
                .filter(Boolean) as Item[];

            setRelatedItems(items.filter(i => i.id !== item.id));
        }

        const fetchEventDetails = async () => {
            if (item.category === 'Event') {
                const eventRef = doc(db, 'events', item.id);
                const eventSnap = await getDoc(eventRef);
                if (eventSnap.exists()) {
                    setEvent({ id: eventSnap.id, ...eventSnap.data() } as Event);
                }
            }
        };

        fetchEventDetails();
        fetchRelated();
    }, [initialRelatedItemsQuery, item.id, item.category]);

    const handleAddToCalendar = () => {
        if (!event) return;

        const formatICSDate = (date: Timestamp) => {
            return date.toDate().toISOString().replace(/-|:|\.\d{3}/g, '');
        }

        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//CultureKerala//EN",
            "BEGIN:VEVENT",
            `UID:${event.id}@culturekerala.com`,
            `DTSTAMP:${formatICSDate(event.createdAt)}`,
            `DTSTART:${formatICSDate(event.startsAt)}`,
            `DTEND:${formatICSDate(event.endsAt)}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.summary || ''}`,
            `LOCATION:${event.isOnline ? 'Online' : event.venue?.address || ''}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join('\n');
        
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${event.slug}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Calendar File Downloading",
            description: "Check your downloads to add the event to your calendar.",
        });
    };

    const isEvent = item.category === 'Event';
    
    const getDate = () => {
        if (!item.date) return null;
        if (item.date instanceof Timestamp) {
            return item.date.toDate();
        }
        if(typeof item.date === 'string') {
            return new Date(item.date);
        }
        if(item.date instanceof Date) {
            return item.date;
        }
        return null;
    }
    const date = getDate();

  return (
    <div className="bg-muted/40">
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="aspect-video relative mb-8">
                    <Image
                    src={item.image || 'https://picsum.photos/1200/600'}
                    alt={item.title}
                    fill
                    className="object-cover rounded-lg"
                    data-ai-hint={`${item.category.toLowerCase()} ${item.title}`}
                    />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                <div className="md:col-span-2 lg:col-span-3 space-y-12">
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
                        <div>
                             <h2 className="text-2xl font-headline font-bold mb-4">Related in {item.category === 'Deal' ? 'Deals' : `${item.category}s`}</h2>
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedItems.map(relatedItem => (
                                    <ItemCard key={relatedItem.id} item={relatedItem} />
                                ))}
                             </div>
                        </div>
                    )}

                </div>

                <div className="md:col-span-1 lg:col-span-1">
                    <div className="sticky top-20 space-y-6">
                        <Card>
                             <CardHeader>
                                {isEvent && event ? (
                                    <BookingDialog event={event}>
                                        <Button className="w-full" size="lg">Get Tickets</Button>
                                    </BookingDialog>
                                ) : item.category === 'Business' ? (
                                    <Button className="w-full" size="lg" asChild>
                                        <a href={`mailto:${(item as any).contact?.email}`}>Contact Business</a>
                                    </Button>
                                ) : item.category === 'Deal' ? (
                                    <Button className="w-full" size="lg" asChild>
                                        <a href='#'>Get Deal</a>
                                    </Button>
                                ) : (
                                     <Button className="w-full" size="lg" asChild>
                                        <Link href={`/${item.category.toLowerCase()}s/${item.slug}`}>
                                            View Details
                                        </Link>
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent>
                                <InfoList>
                                     <InfoListItem label="Category">
                                        <Badge variant="secondary" className="gap-2">
                                            {categoryIcons[item.category] || <Store className="h-4 w-4" />} {item.category}
                                        </Badge>
                                    </InfoListItem>
                                    {item.location && <InfoListItem label="Location">
                                        <span className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" /> {item.location}
                                        </span>
                                    </InfoListItem>}
                                    {date && (
                                        <InfoListItem label={item.category === 'Deal' ? 'Expires' : 'Date'}>
                                            <span className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                {format(date, "PPP")}
                                            </span>
                                        </InfoListItem>
                                    )}
                                    {item.price !== undefined && item.price > 0 && (
                                        <InfoListItem label="Starts from">
                                            <span>₹{item.price.toLocaleString()}</span>
                                        </InfoListItem>
                                    )}
                                    {item.organizer && (
                                         <InfoListItem label="Organizer">
                                            <span className="flex items-center gap-2">
                                                <UserSquare className="h-4 w-4 text-muted-foreground" /> {item.organizer}
                                            </span>
                                        </InfoListItem>
                                    )}
                                </InfoList>
                                <Separator className='my-4' />
                                <div className='flex items-center justify-center gap-2'>
                                     <ShareDialog item={item} />
                                    {isEvent && (
                                         <Button variant="outline" size="sm" onClick={handleAddToCalendar}>
                                            <Download className='mr-2 h-4 w-4' /> Add to Calendar
                                        </Button>
                                    )}
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
