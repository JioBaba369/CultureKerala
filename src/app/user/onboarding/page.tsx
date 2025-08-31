
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/firebase/auth';
import { interestsData } from '@/lib/data/interests';
import { completeFullOnboarding } from '@/actions/user-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar as CalendarIcon, Check } from 'lucide-react';
import { EmptyState } from '@/components/cards/EmptyState';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, subYears } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

type GenderOption = 'female' | 'male' | 'other';

export default function OnboardingPage() {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [dob, setDob] = useState<Date | undefined>();
    const [selectedGender, setSelectedGender] = useState<GenderOption | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const progressValue = useMemo(() => {
        let value = 0;
        if (selectedInterests.length >= 3) value += 33.3;
        if (dob) value += 33.3;
        if (selectedGender) value += 33.4;
        return value;
    }, [selectedInterests, dob, selectedGender]);

    const handleToggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
        );
    };

    const handleFinalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }
        if (selectedInterests.length < 3) {
            toast({ variant: 'destructive', title: 'Interests Required', description: 'Please select at least 3 interests.' });
            return;
        }
        if (!dob) {
            toast({ variant: 'destructive', title: 'Date Required', description: 'Please select your date of birth.' });
            return;
        }
        if (!selectedGender) {
            toast({ variant: 'destructive', title: 'Gender Required', description: 'Please select your gender.' });
            return;
        }
        
        setIsLoading(true);
        try {
            await completeFullOnboarding({ userId: user.uid, interests: selectedInterests, dob, gender: selectedGender });
            toast({ title: 'Welcome!', description: 'Your profile has been set up.' });
            router.push('/admin');
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message || 'Could not save your details. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <ItemsGridSkeleton />
            </div>
        )
    }
    
    if (!user) {
        return (
            <div className="container mx-auto px-4 py-12">
                <EmptyState title="Not Authenticated" description="Please log in to continue." link="/auth/login" linkText="Login" />
            </div>
        )
    }
    
    const maxDate = subYears(new Date(), 18);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                 <Card className="overflow-hidden">
                    <div className="p-6">
                        <h1 className="font-headline text-3xl">Complete Your Profile</h1>
                        <p className="text-muted-foreground">Just a few more details to get you started.</p>
                        <Progress value={progressValue} className="mt-4" />
                    </div>
                    <form onSubmit={handleFinalSubmit}>
                        <CardContent className="space-y-10">
                            <div className="space-y-4">
                                <h2 className="font-headline text-2xl">Tell us what you're into</h2>
                                <p className="text-muted-foreground">Select at least 3 interests to help us recommend relevant content.</p>
                                <div className="flex flex-wrap gap-2">
                                    {interestsData.map(interest => {
                                        const isSelected = selectedInterests.includes(interest);
                                        return (
                                            <button key={interest} onClick={() => handleToggleInterest(interest)} type="button">
                                                <Badge variant={isSelected ? 'default' : 'secondary'} className="text-base px-4 py-2 cursor-pointer">
                                                    {interest}
                                                </Badge>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="font-headline text-2xl">A little more about you</h2>
                                <p className="text-muted-foreground">This information helps us personalize your experience. It won't be shared publicly.</p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Date of Birth</Label>
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
                                                toDate={maxDate}
                                                initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Gender</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <GenderButton label="Female" value="female" isSelected={selectedGender === 'female'} onClick={setSelectedGender} />
                                            <GenderButton label="Male" value="male" isSelected={selectedGender === 'male'} onClick={setSelectedGender} />
                                            <GenderButton label="Other" value="other" isSelected={selectedGender === 'other'} onClick={setSelectedGender} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={progressValue < 100 || isLoading}
                                    size="lg"
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Finish Setup
                                </Button>
                            </div>
                        </CardContent>
                    </form>
                </Card>
            </div>
        </div>
    );
}

function GenderButton({ label, value, isSelected, onClick }: { label: string, value: GenderOption, isSelected: boolean, onClick: (value: GenderOption) => void}) {
    return (
        <Button
            type="button"
            variant="outline"
            className={cn(
                "h-12 text-base relative",
                isSelected && "border-primary border-2"
            )}
            onClick={() => onClick(value)}
        >
            {label}
            {isSelected && <div className="absolute top-1 right-1 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                <Check className="h-4 w-4" />
            </div>}
        </Button>
    )
}
