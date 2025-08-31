
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/firebase/auth';
import { interestsData } from '@/lib/data/interests';
import { completeFullOnboarding } from '@/actions/user-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar as CalendarIcon, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { EmptyState } from '@/components/cards/EmptyState';
import { ItemsGridSkeleton } from '@/components/skeletons/items-grid-skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

type GenderOption = 'female' | 'male';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [dob, setDob] = useState<Date | undefined>();
    const [selectedGender, setSelectedGender] = useState<GenderOption | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const handleToggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
        );
    };

    const handleFinalSubmit = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }
        if (selectedInterests.length < 3) {
            toast({ variant: 'destructive', title: 'Interests Required', description: 'Please select at least 3 interests.' });
            setStep(1);
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
            toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to save your details. Please try again.' });
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

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <Card>
                    {step === 1 && (
                        <>
                            <CardHeader>
                                <CardTitle className="font-headline text-3xl">What are you interested in?</CardTitle>
                                <CardDescription>Select at least 3 interests to help us recommend relevant content for you.</CardDescription>
                            </CardHeader>
                            <CardContent>
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
                                <div className="mt-8 flex justify-end items-center gap-4">
                                    <Button
                                        onClick={() => setStep(2)}
                                        disabled={selectedInterests.length < 3}
                                        size="lg"
                                    >
                                        Continue ({selectedInterests.length}) <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </>
                    )}
                    {step === 2 && (
                         <>
                            <CardHeader>
                                <CardTitle className="font-headline text-3xl">Just a few more details... 🎂</CardTitle>
                                <CardDescription>This information helps us personalize your experience. It won't be shared publicly.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
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
                                            toYear={new Date().getFullYear() - 18}
                                            initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label>Gender</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <GenderButton label="Female" value="female" isSelected={selectedGender === 'female'} onClick={setSelectedGender} />
                                        <GenderButton label="Male" value="male" isSelected={selectedGender === 'male'} onClick={setSelectedGender} />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-between">
                                     <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                    </Button>
                                    <Button
                                        onClick={handleFinalSubmit}
                                        disabled={!dob || !selectedGender || isLoading}
                                        size="lg"
                                    >
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Finish Setup
                                    </Button>
                                </div>
                            </CardContent>
                         </>
                    )}
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
                "h-16 text-lg relative",
                isSelected && "border-primary border-2"
            )}
            onClick={() => onClick(value)}
        >
            {label}
            {isSelected && <div className="absolute top-2 right-2 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                <Check className="h-4 w-4" />
            </div>}
        </Button>
    )
}
