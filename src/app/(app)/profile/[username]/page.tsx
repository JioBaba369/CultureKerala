
'use client';

import { notFound } from 'next/navigation';
import { getUserByUsername } from '@/actions/user-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { User, Item, Event } from '@/types';
import { useEffect, useState } from 'react';
import { getSavedItems } from '@/actions/contact-actions';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';
import { EmptyState } from '@/components/cards/EmptyState';
import { ItemCard } from '@/components/item-card';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function UserProfilePage({ params }: { params: { username: string }}) {
    const [user, setUser] = useState<User | null>(null);
    const [savedItems, setSavedItems] = useState<Item[]>([]);
    const [createdEvents, setCreatedEvents] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const fetchedUser = await getUserByUsername(params.username);
            if (fetchedUser) {
                setUser(fetchedUser);
                const [saved, created] = await Promise.all([
                    getSavedItems(fetchedUser.uid),
                    fetchCreatedEvents(fetchedUser.uid)
                ]);
                setSavedItems(saved as Item[]);
                setCreatedEvents(created);

            } else {
                notFound();
            }
            setLoading(false);
        };

        const fetchCreatedEvents = async (userId: string) => {
            const eventsRef = collection(db, 'events');
            const q = query(eventsRef, where('createdBy', '==', userId), where('status', '==', 'published'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => {
                const data = doc.data() as Event;
                return { 
                    id: doc.id,
                    slug: data.slug,
                    title: data.title,
                    description: data.summary || '',
                    category: 'Event',
                    location: data.isOnline ? 'Online' : data.venue?.address || 'Location TBD',
                    image: data.coverURL || 'https://placehold.co/600x400.png',
                    date: data.startsAt,
                } as Item;
            });
        };

        fetchUserData();
    }, [params.username]);


    if (loading) {
        return <ItemsGridSkeleton count={4} />
    }

    if (!user) {
        return notFound();
    }

    return (
        <div className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
            <Card className='mb-12'>
                <CardHeader className="flex flex-col items-center text-center p-8 space-y-4">
                    <Avatar className="w-32 h-32 border-4 border-primary">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName} data-ai-hint="user profile picture" />
                        <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <CardTitle className="font-headline text-4xl">{user.displayName}</CardTitle>
                        <p className="text-muted-foreground">@{user.username}</p>
                    </div>
                     {user.bio && <p className="text-lg text-muted-foreground max-w-prose">{user.bio}</p>}
                </CardHeader>
            </Card>

            <div className='space-y-12'>
                <section>
                    <h2 className="text-2xl font-headline font-bold mb-4">Saved Items</h2>
                    {savedItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                            {savedItems.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No Saved Items"
                            description={`${user.displayName} hasn't saved any items yet.`}
                        />
                    )}
                </section>
                 <section>
                    <h2 className="text-2xl font-headline font-bold mb-4">Events Created</h2>
                    {createdEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                            {createdEvents.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No Events Created"
                            description={`${user.displayName} hasn't created any events.`}
                        />
                    )}
                </section>
            </div>
        </div>
    );
}
