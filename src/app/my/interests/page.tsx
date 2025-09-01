'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { updateUserInterests } from '@/actions/user-actions';
import { interestsData } from '@/lib/data/interests';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InterestsPage() {
  const { appUser, loading: authLoading } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (appUser?.interests) {
      setSelectedInterests(appUser.interests);
    }
  }, [appUser]);

  const handleInterestChange = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appUser) return;
    setLoading(true);
    try {
      await updateUserInterests(appUser.uid, selectedInterests);
      toast({
        title: 'Interests Updated',
        description: 'Your interests have been saved successfully.',
      });
      router.push('/my/account');
      router.refresh();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
      return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-12">
        <form onSubmit={handleSubmit}>
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                <CardTitle>Select Your Interests</CardTitle>
                <CardDescription>
                    Help us recommend content you'll love by telling us what you're interested in.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" /> Save Interests
                    </Button>
                </CardFooter>
            </Card>
        </form>
    </div>
  );
}
