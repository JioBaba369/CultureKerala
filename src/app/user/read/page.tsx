
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/cards/EmptyState';
import { ItemCard } from '@/components/item-card';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Item } from '@/types';
import { mapDocToItem } from '@/lib/utils';
import { markOnboardingAsCompleted } from '@/actions/user-actions';

export default function ReadPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, appUser } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const collectionsToFetch = ["events", "communities", "businesses"];
            const allItems: Item[] = [];

            for (const collectionName of collectionsToFetch) {
                const ref = collection(db, collectionName);
                const q = query(ref, where("status", "==", "published"), limit(3));
                const snapshot = await getDocs(q);
                const mappedItems = snapshot.docs.map(doc => mapDocToItem(doc, collectionName)).filter(Boolean) as Item[];
                allItems.push(...mappedItems);
            }
            
            setItems(allItems.sort(() => 0.5 - Math.random()));
        } catch (error) {
            console.error("Error fetching items for read page:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not load content. Please try refreshing.',
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);
    
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleContinue = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }
        
        setIsSubmitting(true);
        try {
            await markOnboardingAsCompleted(user.uid);
            toast({ title: 'Welcome!', description: 'Your profile setup is complete.' });
            router.push('/admin');
        } catch (error) {
             toast({ variant: 'destructive', title: 'Error', description: 'Failed to complete setup.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
             <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <Card>
                        <CardHeader className="text-center">
                             <CardTitle className="font-headline text-3xl">Save what you like</CardTitle>
                             <CardDescription>This helps us recommend things you’ll love.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ItemsGridSkeleton count={6}/>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!appUser) {
        return (
            <div className="container mx-auto px-4 py-12">
                <EmptyState title="Loading..." description="Please wait while we load your information." />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-5xl mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-3xl">Save what you like</CardTitle>
                        <CardDescription>This helps us recommend things you’ll love.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {items.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map((item) => (
                                    <ItemCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                             <EmptyState
                                title="No Content Found"
                                description="We couldn't load any content right now. You can continue to your dashboard."
                            />
                        )}

                        <div className="mt-8 flex justify-end">
                            <Button
                                onClick={handleContinue}
                                disabled={isSubmitting}
                                size="lg"
                            >
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Continue
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
