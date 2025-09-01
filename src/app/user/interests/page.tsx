
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { interestsData } from "@/lib/data/interests";
import { useState, useEffect } from "react";
import { updateUserInterests } from "@/actions/user-actions";
import { Loader2, Save } from "lucide-react";

export default function InterestsPage() {
  const { appUser, loading } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
        toast({ title: "Interests Updated!", description: "Your interests have been saved."});
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Error", description: error.message || "Could not save interests."})
    } finally {
        setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-headline font-bold">Manage Interests</h1>
                <p className="text-muted-foreground">Select your interests to get personalized recommendations.</p>
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>}
                Save Interests
            </Button>
        </div>
      <Card>
        <CardContent className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {interestsData.map((interest) => (
            <div key={interest} className="flex items-center space-x-2">
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
    </div>
  );
}
