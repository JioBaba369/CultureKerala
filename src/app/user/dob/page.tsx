
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/firebase/auth';
import { completeOnboarding } from '@/actions/user-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar as CalendarIcon, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/cards/EmptyState';
import { Label } from '@/components/ui/label';

type GenderOption = 'woman' | 'man' | 'other';

export default function DateOfBirthPage() {
    const [dob, setDob] = useState<Date | undefined>();
    const [selectedGender, setSelectedGender] = useState<GenderOption | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user, loading: authLoading } = useAuth();
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
        if (!selectedGender) {
            toast({ variant: 'destructive', title: 'Gender Required', description: 'Please select your gender.' });
            return;
        }

        setIsLoading(true);
        try {
            await completeOnboarding({ userId: user.uid, dob, gender: selectedGender });
            toast({ title: 'Welcome!', description: 'Your profile has been set up.' });
            router.push('/admin'); // Redirect to the main dashboard
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save your details. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (authLoading) {
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
                                <GenderButton
                                    label="Female"
                                    value="woman"
                                    isSelected={selectedGender === 'woman'}
                                    onClick={setSelectedGender}
                                />
                                <GenderButton
                                    label="Male"
                                    value="man"
                                    isSelected={selectedGender === 'man'}
                                    onClick={setSelectedGender}
                                />
                            </div>
                        </div>
                        
                        <div className="pt-4 flex justify-end">
                            <Button
                                onClick={handleContinue}
                                disabled={!dob || !selectedGender || isLoading}
                                size="lg"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Finish Setup
                            </Button>
                        </div>
                    </CardContent>
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
