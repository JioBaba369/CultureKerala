
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { interestsData } from "@/lib/data/interests";
import { useState, useEffect } from "react";
import { updateUserInterests, completeOnboarding } from "@/actions/user-actions";
import { Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingInterestsPage() {
  const { appUser } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (appUser?.interests) {
      setSelectedInterests(appUser.interests);
    }
  }, [appUser]);

  const handleInterestChange = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(item => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (!appUser) return;
    setIsSubmitting(true);
    try {
        await updateUserInterests(appUser.uid, selectedInterests);
        await completeOnboarding(appUser.uid);
        toast({ title: "Interests Saved!", description: "Your profile is now complete."});
        router.push('/');
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Error", description: error.message || "Could not save interests."})
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-headline font-bold">What are your interests?</h1>
        <p className="text-muted-foreground mt-2">
            Select at least three to help us personalize your experience.
        </p>
       
        <Card className="mt-8">
            <CardContent className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {interestsData.map((interest) => (
                <div key={interest} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
                <Checkbox
                    id={interest}
                    checked={selectedInterests.includes(interest)}
                    onCheckedChange={() => handleInterestChange(interest)}
                />
                <label
                    htmlFor={interest}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {interest}
                </label>
                </div>
            ))}
            </CardContent>
        </Card>
        <div className="mt-8 flex justify-end">
             <Button onClick={handleSubmit} disabled={isSubmitting || selectedInterests.length < 3}>
                {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : null}
                Finish Setup <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
        </div>
    </div>
  );
}
