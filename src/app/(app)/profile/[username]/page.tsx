
'use client';

import { notFound } from 'next/navigation';
import { getUserByUsername } from '@/actions/user-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { User, Item } from '@/types';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { getSavedItems } from '@/actions/contact-actions';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';
import { EmptyState } from '@/components/cards/EmptyState';
import { ItemCard } from '@/components/item-card';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { mapDocToItem } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Cake, User as UserIcon, Heart, PlusCircle, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

function ShareProfileDialog({ user }: { user: User | null }) {
    const { toast } = useToast();
    const [shareUrl, setShareUrl] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined' && user?.username) {
            const url = `${window.location.origin}/profile/${user.username}`;
            setShareUrl(url);
            setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}&color=222222&bgcolor=ffffff&margin=10`);
        }
    }, [user?.username]);

    if (!user) return null;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        toast({
            title: "Link Copied!",
            description: "The profile link has been copied to your clipboard.",
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" /> Share Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline">Share {user.displayName}'s Profile</DialogTitle>
                    <DialogDescription>
                        Share this profile with others via link or QR code.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center py-4">
                    <div className="p-4 bg-white rounded-lg">
                        {qrCodeUrl && <Image
                            src={qrCodeUrl}
                            width={150}
                            height={150}
                            alt={`QR Code for ${user.displayName}'s profile`}
                            data-ai-hint="qr code"
                        />}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Input id="link" defaultValue={shareUrl} readOnly />
                    <Button type="button" size="sm" className="px-3" onClick={handleCopyLink}>
                        <span className="sr-only">Copy</span>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

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
    const [savedItems, setSavedItems] = useState<Item[]>([]);
    const [createdItems, setCreatedItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [userExists, setUserExists] = useState(true);

    const fetchCreatedItems = useCallback(async (userId: string) => {
        const collectionsToFetch = ['events', 'communities', 'businesses'];
        const allCreatedItems: Item[] = [];

        for (const collectionName of collectionsToFetch) {
            const ref = collection(db, collectionName);
            const createdByField = collectionName === 'communities' ? 'roles.owners' : 'createdBy';
            const operator = collectionName === 'communities' ? 'array-contains' : '==';
            const q = query(ref, where(createdByField, operator, userId), where('status', '==', 'published'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const items = snapshot.docs.map(doc => mapDocToItem(doc, collectionName)).filter(Boolean) as Item[];
            allCreatedItems.push(...items);
        }
        
        return allCreatedItems.sort((a,b) => {
            const dateA = a.date instanceof Timestamp ? a.date.toMillis() : 0;
            const dateB = b.date instanceof Timestamp ? b.date.toMillis() : 0;
            if (dateA && dateB) {
                return dateB - dateA;
            }
            return 0;
        });
    }, []);

    const fetchUserData = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedUser = await getUserByUsername(params.username);
            
            if (fetchedUser) {
                setUser(fetchedUser);
                const [saved, created] = await Promise.all([
                    getSavedItems(fetchedUser.uid),
                    fetchCreatedItems(fetchedUser.uid)
                ]);
                setSavedItems(saved as Item[]);
                setCreatedItems(created);
            } else {
                setUserExists(false);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            setUserExists(false);
        } finally {
            setLoading(false);
        }
    }, [params.username, fetchCreatedItems]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);


    if (loading) {
        return (
             <div className="container mx-auto max-w-5xl px-4 py-12 md:py-20 space-y-12">
                <Card className="p-8"><ItemsGridSkeleton count={1} /></Card>
                <ItemsGridSkeleton count={3} />
             </div>
        );
    }

    if (!userExists || !user) {
        return notFound();
    }
    
    return (
        <div className="bg-muted/40 min-h-screen">
            <div className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
                <Card className='mb-12 shadow-lg overflow-hidden'>
                    <div className="bg-card p-8">
                        <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6">
                            <Avatar className="w-32 h-32 border-4 border-background outline outline-4 outline-primary">
                                <AvatarImage src={user.photoURL || undefined} alt={user.displayName} data-ai-hint="user profile picture" />
                                <AvatarFallback className="text-4xl">{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow space-y-2">
                                <h1 className="font-headline text-4xl font-bold">{user.displayName}</h1>
                                <p className="text-muted-foreground text-lg">@{user.username}</p>
                                {user.bio && <p className="text-foreground max-w-prose">{user.bio}</p>}
                                <div className='flex items-center justify-center md:justify-start gap-4 pt-1'>
                                    {user.age && (
                                        <div className="text-muted-foreground flex items-center gap-2">
                                            <Cake className="h-4 w-4" /> {user.age} years old
                                        </div>
                                    )}
                                    {user.location && (
                                        <div className="text-muted-foreground flex items-center gap-2">
                                            <MapPin className="h-4 w-4" /> {user.location}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <ShareProfileDialog user={user} />
                        </div>
                         {user.interests && user.interests.length > 0 && (
                            <div className="mt-6 pt-6 border-t">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-2 text-center md:text-left">INTERESTS</h3>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {user.interests.map(interest => (
                                        <Badge key={interest} variant="secondary">{interest}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                <Tabs defaultValue="saved" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="saved"><Heart className="mr-2 h-4 w-4"/>Saved</TabsTrigger>
                        <TabsTrigger value="created"><PlusCircle className="mr-2 h-4 w-4"/>Created</TabsTrigger>
                        <TabsTrigger value="activity"><UserIcon className="mr-2 h-4 w-4"/>Activity</TabsTrigger>
                    </TabsList>
                    <TabsContent value="saved" className="py-8">
                       <ItemsGrid items={savedItems} emptyState={
                           <EmptyState 
                             title="No Saved Items"
                             description={`${user.displayName} hasn't saved any items yet.`}
                            />
                       }/>
                    </TabsContent>
                    <TabsContent value="created" className="py-8">
                       <ItemsGrid items={createdItems} emptyState={
                           <EmptyState 
                             title="Nothing Created Yet"
                             description={`${user.displayName} hasn't created any public content.`}
                            />
                       }/>
                    </TabsContent>
                    <TabsContent value="activity" className="py-8">
                        <EmptyState 
                             title="No Activity"
                             description={`Recent activity for ${user.displayName} will appear here.`}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
