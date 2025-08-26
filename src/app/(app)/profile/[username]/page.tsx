
'use client';

import { notFound } from 'next/navigation';
import { getUserByUsername } from '@/actions/user-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { User, Item } from '@/types';
import { siteConfig } from '@/config/site';
import { useEffect, useState } from 'react';
import { getSavedItems } from '@/actions/contact-actions';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';
import { EmptyState } from '@/components/cards/EmptyState';
import { ItemCard } from '@/components/item-card';

// Note: Metadata generation needs to be in a separate generateMetadata function
// if we want to keep this page a client component for fetching saved items.
// For now, we assume this is handled or we can add it back if needed.

export default function UserProfilePage({ params }: { params: { username: string }}) {
    const [user, setUser] = useState<User | null>(null);
    const [savedItems, setSavedItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const fetchedUser = await getUserByUsername(params.username);
            if (fetchedUser) {
                setUser(fetchedUser);
                const items = await getSavedItems(fetchedUser.uid);
                setSavedItems(items as Item[]);
            } else {
                notFound();
            }
            setLoading(false);
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
            <Card className='mb-8'>
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

            <div>
                <h2 className="text-2xl font-headline font-bold mb-4">Saved Items</h2>
                {savedItems.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {savedItems.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No Saved Items"
                        description="This user hasn't saved any items yet."
                    />
                )}
            </div>
        </div>
    );
}

// Revalidate data at most every 5 minutes
export const revalidate = 300;
