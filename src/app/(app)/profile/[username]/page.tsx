
'use client';

import { notFound } from 'next/navigation';
import { getUserByUsername } from '@/actions/user-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { User, Item } from '@/types';
import { useEffect, useState, useCallback } from 'react';
import { getSavedItems } from '@/actions/contact-actions';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';
import { EmptyState } from '@/components/cards/EmptyState';
import { ItemCard } from '@/components/item-card';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { mapDocToItem } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Share2, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

function ShareProfileDialog({ user }: { user: User }) {
    const { toast } = useToast();
    const [shareUrl, setShareUrl] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined' && user.username) {
            const url = `${window.location.origin}/profile/${user.username}`;
            setShareUrl(url);
            setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}&color=222222&bgcolor=ffffff&margin=10`);
        }
    }, [user.username]);

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


export default function UserProfilePage({ params }: { params: { username: string }}) {
    const [user, setUser] = useState<User | null>(null);
    const [savedItems, setSavedItems] = useState<Item[]>([]);
    const [createdEvents, setCreatedEvents] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [userExists, setUserExists] = useState(true);

    const fetchCreatedEvents = useCallback(async (userId: string) => {
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, where('createdBy', '==', userId), where('status', '==', 'published'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => mapDocToItem(doc, 'events')).filter(Boolean) as Item[];
    }, []);

    const fetchUserData = useCallback(async () => {
        setLoading(true);
        try {
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
                setUserExists(false);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            setUserExists(false);
        } finally {
            setLoading(false);
        }
    }, [params.username, fetchCreatedEvents]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);


    if (loading) {
        return (
             <div className="container mx-auto max-w-5xl px-4 py-12 md:py-20 space-y-12">
                <ItemsGridSkeleton count={1} />
                <ItemsGridSkeleton count={3} />
                <ItemsGridSkeleton count={3} />
             </div>
        );
    }

    if (!userExists || !user) {
        return notFound();
    }
    
    return (
        <div className="bg-muted/40 min-h-screen">
            <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
                <Card className='mb-12 shadow-lg'>
                    <CardHeader className="flex flex-col items-center text-center p-8 space-y-4">
                        <Avatar className="w-32 h-32 border-4 border-background outline outline-4 outline-primary">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName} data-ai-hint="user profile picture" />
                            <AvatarFallback className="text-4xl">{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <CardTitle className="font-headline text-4xl">{user.displayName}</CardTitle>
                            <p className="text-muted-foreground">@{user.username}</p>
                        </div>
                        {user.bio && <p className="text-lg text-foreground max-w-prose text-center">{user.bio}</p>}
                         <ShareProfileDialog user={user} />
                    </CardHeader>
                </Card>

                <div className='space-y-12'>
                    <section>
                        <h2 className="text-2xl font-headline font-bold mb-4">Saved Items</h2>
                        {savedItems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedItems.map((item) => (
                                    <ItemCard key={`${item.category}-${item.id}`} item={item} />
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {createdEvents.map((item) => (
                                    <ItemCard key={`${item.category}-${item.id}`} item={item} />
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
        </div>
    );
}
