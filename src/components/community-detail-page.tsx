'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Mail, MapPin, Users, Phone, Facebook, Instagram, X, Youtube, ExternalLink, Share2, Copy } from 'lucide-react';
import type { Community, Event, Item } from '@/types';
import { Button } from './ui/button';
import { InfoList, InfoListItem } from './ui/info-list';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ItemCard } from './item-card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

const communityTypeLabels: Record<string, string> = {
    cultural: 'Cultural',
    student: 'Student',
    religious: 'Religious',
    professional: 'Professional',
    regional: 'Regional',
    other: 'Other'
}

export function CommunityDetailPage({ community }: { community: Community }) {
    const { toast } = useToast();
    const SocialIcons: Record<string, React.ReactNode> = {
        facebook: <Facebook />,
        instagram: <Instagram />,
        x: <X />,
        youtube: <Youtube />,
    }

    const [events, setEvents] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    const handleCopyLink = () => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        navigator.clipboard.writeText(url);
        toast({
        title: "Link Copied!",
        description: "The community link has been copied to your clipboard.",
        });
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${shareUrl}&color=222222&bgcolor=ffffff&margin=10`;


    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const eventsRef = collection(db, 'events');
                const q = query(eventsRef, where('communityId', '==', community.id), where('status', '==', 'published'), limit(3));
                const snapshot = await getDocs(q);
                const eventsData = snapshot.docs.map(doc => {
                    const data = doc.data() as Event;
                    return {
                        id: doc.id,
                        slug: data.slug,
                        title: data.title,
                        description: data.summary || '',
                        category: 'Event',
                        location: data.isOnline ? 'Online' : data.venue?.address || 'Location TBD',
                        image: data.coverURL || 'https://picsum.photos/600/400',
                        date: data.startsAt,
                        price: data.ticketing?.priceMin,
                    } as Item;
                })
                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching community events:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, [community.id]);

  return (
    <div className="bg-muted/40">
        <div className="w-full h-64 bg-card relative">
            {community.bannerURL ? (
                 <Image
                    src={community.bannerURL}
                    alt={`${community.name} banner`}
                    fill
                    className="object-cover"
                    data-ai-hint="community banner"
                />
            ) : (
                <div className="bg-gradient-to-r from-primary/20 to-secondary/20 h-full w-full"></div>
            )}
        </div>
        <div className="container mx-auto px-4 py-8 md:py-12 -mt-24">
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 lg:col-span-3 space-y-8">
                    <Card>
                        <CardHeader className="flex flex-row items-start gap-4">
                            <div className="w-24 h-24 rounded-lg bg-card border-2 border-primary/20 relative flex-shrink-0 -mt-12">
                                <Image
                                    src={community.logoURL || "https://picsum.photos/200/200"}
                                    alt={`${community.name} logo`}
                                    fill
                                    className="object-cover rounded-md"
                                    data-ai-hint="community logo"
                                />
                            </div>
                            <div>
                                <CardTitle className="font-headline text-4xl leading-tight">{community.name}</CardTitle>
                                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                    <MapPin className="h-4 w-4" /> {community.region.city}, {community.region.country}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-lg max-w-none">
                                <h3>About this Community</h3>
                                <p>{community.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {events.length > 0 && (
                         <Card>
                            <CardHeader>
                                <CardTitle className='font-headline'>Upcoming Events</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {events.map(event => (
                                        <ItemCard key={event.id} item={event} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                 {/* Sticky Sidebar */}
                <div className="md:col-span-1 lg:col-span-1">
                    <div className="sticky top-20 space-y-6">
                        <Card>
                             <CardHeader className="grid gap-2">
                                <Button className="w-full" size="lg">
                                    <Users className="mr-2 h-5 w-5" /> Join Community
                                </Button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full" size="lg">
                                            <Share2 className="mr-2 h-5 w-5" /> Share
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="font-headline">Share Community</DialogTitle>
                                            <DialogDescription>
                                                Share this community with friends and invite them to join.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex items-center justify-center py-4">
                                            <div className="p-4 bg-white rounded-lg">
                                                <Image 
                                                    src={qrCodeUrl}
                                                    width={150} 
                                                    height={150} 
                                                    alt="QR Code for community" 
                                                    data-ai-hint="qr code"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                            id="link"
                                            defaultValue={shareUrl}
                                            readOnly
                                            />
                                            <Button type="button" size="sm" className="px-3" onClick={handleCopyLink}>
                                                <span className="sr-only">Copy</span>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                            </CardHeader>
                            <CardContent>
                                <InfoList>
                                     <InfoListItem label="Type">
                                        <Badge variant="secondary">{communityTypeLabels[community.type]}</Badge>
                                    </InfoListItem>
                                    {community.contact?.website && (
                                        <InfoListItem label="Website">
                                           <a href={community.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                                                <Globe className="h-4 w-4" /> Visit <ExternalLink className='h-3 w-3' />
                                            </a>
                                        </InfoListItem>
                                    )}
                                     {community.contact?.email && (
                                        <InfoListItem label="Email">
                                           <a href={`mailto:${community.contact.email}`} className="flex items-center gap-2 text-primary hover:underline">
                                                <Mail className="h-4 w-4" /> Email Us
                                            </a>
                                        </InfoListItem>
                                    )}
                                    {community.contact?.phone && (
                                        <InfoListItem label="Phone">
                                           <a href={`tel:${community.contact.phone}`} className="flex items-center gap-2 text-primary hover:underline">
                                                <Phone className="h-4 w-4" /> Call Us
                                            </a>
                                        </InfoListItem>
                                    )}
                                </InfoList>
                                
                                {community.socials && Object.values(community.socials).some(s => s) && (
                                    <>
                                        <hr className="my-4" />
                                        <div className="flex justify-center gap-2">
                                            {Object.entries(community.socials).map(([key, value]) => {
                                                const icon = SocialIcons[key];
                                                if (value && icon) {
                                                    return (
                                                        <Button asChild variant="ghost" size="icon" key={key}>
                                                            <a href={value} target="_blank" rel="noopener noreferrer" aria-label={key}>
                                                                {icon}
                                                            </a>
                                                        </Button>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
