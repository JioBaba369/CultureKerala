
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar, Users, Ticket, ArrowRight, Star } from 'lucide-react';
import { EmptyState } from '@/components/cards/EmptyState';
import { ItemCard } from '@/components/item-card';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Item, Booking, Community } from '@/types';
import { mapDocToItem } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

export default function ReadPage() {
    const [suggestedItems, setSuggestedItems] = useState<Item[]>([]);
    const [userBookings, setUserBookings] = useState<Booking[]>([]);
    const [userCommunities, setUserCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, appUser, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const fetchDashboardData = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            // Fetch bookings (user's events)
            const bookingsQuery = query(collection(db, 'bookings'), where('userId', '==', user.uid), limit(5));
            const bookingsSnapshot = await getDocs(bookingsQuery);
            setUserBookings(bookingsSnapshot.docs.map(doc => doc.data() as Booking));

            // Fetch user's communities
            const communitiesQuery = query(collection(db, 'communities'), where('roles.owners', 'array-contains', user.uid), limit(5));
            const communitiesSnapshot = await getDocs(communitiesQuery);
            setUserCommunities(communitiesSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Community)));
            
            // Fetch suggested items
            const eventsQuery = query(collection(db, "events"), where("status", "==", "published"), limit(3));
            const eventsSnapshot = await getDocs(eventsQuery);
            const events = (
                await Promise.all(
                    eventsSnapshot.docs.map((doc) => mapDocToItem(doc, 'events'))
                )
            ).filter(Boolean) as Item[];
            setSuggestedItems(events);
            
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not load your dashboard content.',
            });
        } finally {
            setLoading(false);
        }
    }, [user, toast]);
    
    useEffect(() => {
        if (!authLoading) {
            fetchDashboardData();
        }
    }, [authLoading, fetchDashboardData]);
    
    if (authLoading || loading) {
         return <ItemsGridSkeleton count={8} />
    }

    if (!appUser) {
        return (
            <div className="container mx-auto px-4 py-12">
                <EmptyState title="Loading..." description="Please wait while we load your information." />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-12">
            <div>
                <h1 className="text-4xl font-headline font-bold">Welcome, {appUser.displayName?.split(' ')[0]} 👋</h1>
            </div>

            {/* Upcoming Events */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-headline font-bold">Upcoming events</h2>
                    <div className="hidden md:flex items-center gap-2">
                        <Button variant="ghost" size="sm">This week</Button>
                        <Button variant="ghost" size="sm">This weekend</Button>
                        <Button variant="ghost" size="sm">Next week</Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Your next events</CardTitle>
                        <CardDescription>Events you have registered for will appear here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {userBookings.length > 0 ? (
                           <div className="grid gap-4">
                               {userBookings.map(booking => (
                                   <div key={booking.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                       <span>{booking.eventTitle}</span>
                                       <Button variant="secondary" size="sm" asChild>
                                           <Link href={`/events/${booking.eventId}`}>View Event</Link>
                                       </Button>
                                   </div>
                               ))}
                           </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                <Ticket className="mx-auto h-12 w-12" />
                                <h3 className="font-semibold mt-4">You have not registered for any events</h3>
                                <p className="text-sm">Events you have registered for will appear here.</p>
                                <Button variant="outline" className="mt-4" asChild><Link href="/events">Discover Events</Link></Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>

             {/* Your Groups */}
             <section>
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-headline font-bold">Your groups</h2>
                    <Button variant="link" asChild><Link href="/admin/communities">See all your groups <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                 </div>
                <Card>
                    <CardContent className="pt-6">
                       {userCommunities.length > 0 ? (
                           <div className="grid gap-4 md:grid-cols-2">
                               {userCommunities.map(community => (
                                   <div key={community.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                                       <div className="w-12 h-12 rounded-lg bg-muted relative flex-shrink-0">
                                            <Image 
                                              src={community.logoURL || "https://picsum.photos/100/100"} 
                                              alt={community.name} 
                                              width={48}
                                              height={48}
                                              className="w-full h-full object-cover rounded-lg" 
                                            />
                                       </div>
                                       <div>
                                            <h4 className="font-semibold">{community.name}</h4>
                                            <p className="text-sm text-muted-foreground">{community.region.city}</p>
                                       </div>
                                       <Button variant="outline" size="sm" className="ml-auto" asChild><Link href={`/communities/${community.slug}`}>View</Link></Button>
                                   </div>
                               ))}
                           </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                <Users className="mx-auto h-12 w-12" />
                                <h3 className="font-semibold mt-4">You have not joined any groups</h3>
                                <p className="text-sm">Groups you join will appear here.</p>
                                 <Button variant="outline" className="mt-4" asChild><Link href="/communities">Discover Groups</Link></Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
             </section>
             
              {/* Your Interests */}
              <section>
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-headline font-bold">Your interests</h2>
                    <Button variant="link" asChild><Link href="/user/interests">Select interests <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                 </div>
                <Card>
                    <CardContent className="pt-6">
                        {appUser.interests && appUser.interests.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {appUser.interests.map(interest => (
                                    <Badge key={interest} variant="secondary" className="text-base px-3 py-1">{interest}</Badge>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-8 text-muted-foreground">
                                <p>Select interests to get better recommendations.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
             </section>

            {/* Suggested Events */}
             <section>
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-headline font-bold">Suggested Events</h2>
                 </div>
                 {suggestedItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {suggestedItems.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No Suggested Events"
                        description="Check back later for events tailored to your interests."
                    />
                )}
             </section>

        </div>
    );
}
