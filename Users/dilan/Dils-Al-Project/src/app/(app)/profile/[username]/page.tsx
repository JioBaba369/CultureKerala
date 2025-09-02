
'use client';

import { notFound } from 'next/navigation';
import { getUserByUsername } from '@/actions/user-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import type { User, Item } from '@/types';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';
import { ItemCard } from '@/components/item-card';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { mapDocToItem } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Globe, Cake, MapPin, X, Instagram, Facebook, Linkedin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function ItemsGrid({ items, emptyState }: { items: Item[]; emptyState: React.ReactNode }) {
  if (items.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard key={`${item.category}-${item.id}`} item={item} />
      ))}
    </div>
  );
}

export default function UserProfilePage({ params }: { params: { username: string }}) {
    const [user, setUser] = useState<User | null>(null);
    const [createdItems, setCreatedItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCreatedItems = useCallback(async (userId: string) => {
        const collectionsToFetch = ['businesses', 'communities', 'events'];
        const allCreatedItems: Item[] = [];

        for (const collectionName of collectionsToFetch) {
            const ref = collection(db, collectionName);
            
            let q;
            if (collectionName === 'communities') {
                q = query(ref, where('roles.owners', 'array-contains', userId));
            } else {
                q = query(ref, where('createdBy', '==', userId));
            }

            const snapshot = await getDocs(q);
            const items = (
                await Promise.all(
                    snapshot.docs.map((doc) => mapDocToItem(doc, collectionName))
                )
            ).filter(Boolean) as Item[];
            allCreatedItems.push(...items);
        }
        
        return allCreatedItems.sort((a,b) => (a.title > b.title ? 1 : -1));
    }, []);
    
    const fetchUserData = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedUser = await getUserByUsername(params.username);
            if (!fetchedUser) {
                notFound();
                return;
            }
            setUser(fetchedUser);

            const created = await fetchCreatedItems(fetchedUser.uid);
            setCreatedItems(created);

        } catch (error) {
            console.error("Failed to fetch user data:", error);
            notFound();
        } finally {
            setLoading(false);
        }
    }, [params.username, fetchCreatedItems]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const socialLinks = useMemo(() => {
        if (!user?.socials) return [];
        return Object.entries(user.socials)
            .map(([key, value]) => {
                if (!value) return null;
                const iconMap: Record<string, React.ReactNode> = {
                    website: <Globe />,
                    x: <X />,
                    instagram: <Instagram />,
                    facebook: <Facebook />,
                    linkedin: <Linkedin />,
                };
                return {
                    href: value,
                    icon: iconMap[key],
                    label: key.charAt(0).toUpperCase() + key.slice(1)
                }
            })
            .filter(Boolean) as { href: string, icon: React.ReactNode, label: string }[];
    }, [user?.socials]);


    if (loading || !user) {
        return (
             <div className="container mx-auto max-w-5xl px-4 py-12 md:py-20 space-y-12">
                <Card className="p-8"><ItemsGridSkeleton count={1} /></Card>
                <ItemsGridSkeleton count={3} />
             </div>
        );
    }
    
    return (
        <div className="bg-muted/40 min-h-screen">
            <div className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
                <Card className="p-8">
                     <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-8">
                        <Avatar className="w-32 h-32 border-4 border-background outline outline-4 outline-primary shrink-0">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName} data-ai-hint="user profile picture" />
                            <AvatarFallback className="text-4xl">{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <h1 className="font-headline text-4xl font-bold">{user.displayName}</h1>
                            <p className="text-muted-foreground text-lg">@{user.username}</p>
                            {user.bio && <p className="text-foreground max-w-prose text-base">{user.bio}</p>}
                            <div className='flex items-center justify-center sm:justify-start flex-wrap gap-x-4 gap-y-2 pt-1'>
                                {user.age && (
                                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                        <Cake className="h-4 w-4" /> {user.age} years old
                                    </div>
                                )}
                                {user.location && (
                                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4" /> {user.location}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                     {user.interests && user.interests.length > 0 && (
                        <div className="mt-6 pt-6 border-t text-center">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {user.interests.map(interest => (
                                    <Badge key={interest} variant="secondary">{interest}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {socialLinks.length > 0 && (
                         <div className="mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                           {socialLinks.map(link => (
                                <Button asChild key={link.href} variant="outline" className="justify-start gap-3">
                                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                                        {link.icon}
                                        <span className="truncate">{link.label}</span>
                                    </a>
                                </Button>
                           ))}
                        </div>
                    )}
                </Card>
                
                 {createdItems.length > 0 && (
                    <div className="mt-8 pt-8">
                        <h2 className="text-2xl font-headline font-bold text-center mb-6">{user.displayName}'s Contributions</h2>
                        <ItemsGrid items={createdItems} emptyState={<></>} />
                    </div>
                 )}
            </div>
        </div>
    );
}
