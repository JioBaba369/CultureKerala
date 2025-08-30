
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/firebase/auth';
import { updateUserDateOfBirth } from '@/actions/user-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/cards/EmptyState';

export default function DateOfBirthPage() {
    const [dob, setDob] = useState<Date | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const { user, appUser } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const handleContinue = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }
        if (!dob) {
            toast({ variant: 'destructive', title: 'Date Required', description: 'Please select your date of birth.' });
            return;
        }

        setIsLoading(true);
        try {
            await updateUserDateOfBirth(user.uid, dob);
            toast({ title: 'Welcome!', description: 'Your profile setup is complete.' });
            router.push('/admin');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save your date of birth.' });
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
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-3xl">Let's get to know you! 🎂</CardTitle>
                        <CardDescription>Knowing your age helps us find the right events and groups for you. It won't be shared with anyone.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal h-12 text-base",
                                    !dob && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={dob}
                                onSelect={setDob}
                                captionLayout="dropdown-buttons"
                                fromYear={1920}
                                toYear={new Date().getFullYear() - 18}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        
                        <div className="pt-4 flex justify-end">
                            <Button
                                onClick={handleContinue}
                                disabled={!dob || isLoading}
                                size="lg"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Complete Setup
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
