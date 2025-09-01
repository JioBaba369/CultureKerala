'use client';

import { ProfileForm } from '@/components/profile-form';
import { useAuth } from '@/lib/firebase/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function MyAccountPage() {
    const { appUser } = useAuth();
    return (
        <div className="container mx-auto px-4 py-8">
            <ProfileForm />

             <Card className="mt-8">
                <CardHeader>
                    <CardTitle>My Interests</CardTitle>
                    <CardDescription>
                        Select your interests to help us recommend more relevant content to you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {appUser?.interests && appUser.interests.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {appUser.interests.map(interest => (
                                <Button key={interest} variant="secondary" asChild>
                                    <Link href="/my/interests">{interest}</Link>
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">You haven't selected any interests yet.</p>
                    )}
                     <Button asChild className="mt-4">
                        <Link href="/my/interests">
                            Edit Interests <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
