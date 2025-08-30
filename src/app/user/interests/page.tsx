
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/firebase/auth';
import { interestsData } from '@/lib/data/interests';
import { updateUserInterests } from '@/actions/user-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/cards/EmptyState';

export default function InterestsPage() {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user, appUser } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const handleToggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
        );
    };

    const handleContinue = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }
        if (selectedInterests.length < 3) {
            toast({ variant: 'destructive', title: 'Selection Required', description: 'Please select at least 3 interests.' });
            return;
        }

        setIsLoading(true);
        try {
            await updateUserInterests(user.uid, selectedInterests);
            toast({ title: 'Success', description: 'Your interests have been saved.' });
            router.push('/admin');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save interests.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!appUser) {
        return (
            <div className="container mx-auto px-4 py-12">
                <EmptyState title="Loading..." description="Please wait while we load your information." />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">Get started by picking a few interests</CardTitle>
                        <CardDescription>These help with future event and group recommendations. Select at least 3 interests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {interestsData.map(interest => {
                                const isSelected = selectedInterests.includes(interest);
                                return (
                                    <button key={interest} onClick={() => handleToggleInterest(interest)}>
                                        <Badge variant={isSelected ? 'default' : 'secondary'} className="text-base px-4 py-2 cursor-pointer">
                                            {interest}
                                        </Badge>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button
                                onClick={handleContinue}
                                disabled={selectedInterests.length < 3 || isLoading}
                                size="lg"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Continue ({selectedInterests.length})
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
