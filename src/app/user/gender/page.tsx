
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/firebase/auth';
import { updateUserGender } from '@/actions/user-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Check } from 'lucide-react';
import { EmptyState } from '@/components/cards/EmptyState';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

type GenderOption = 'woman' | 'man';

export default function GenderPage() {
    const [selectedGender, setSelectedGender] = useState<GenderOption | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user, appUser } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const handleContinue = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }
        if (!selectedGender) {
            toast({ variant: 'destructive', title: 'Selection Required', description: 'Please select an option.' });
            return;
        }

        setIsLoading(true);
        try {
            await updateUserGender(user.uid, selectedGender);
            toast({ title: 'Saved!', description: 'One last step...' });
            router.push('/user/read');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save your selection.' });
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
                        <CardTitle className="font-headline text-3xl">What's your gender? ✨</CardTitle>
                        <CardDescription>Your gender helps us suggest events and groups that are right for you. It won't be shared with anyone.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <GenderButton
                             label="Woman"
                             value="woman"
                             isSelected={selectedGender === 'woman'}
                             onClick={setSelectedGender}
                           />
                           <GenderButton
                             label="Man"
                             value="man"
                             isSelected={selectedGender === 'man'}
                             onClick={setSelectedGender}
                           />
                        </div>
                        
                        <div className="pt-4 flex justify-end">
                            <Button
                                onClick={handleContinue}
                                disabled={!selectedGender || isLoading}
                                size="lg"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Continue
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
            variant="outline"
            className={cn(
                "h-20 text-lg relative",
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
