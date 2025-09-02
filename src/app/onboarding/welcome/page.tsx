
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/firebase/auth";
import { ArrowRight, PartyPopper } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
    const { appUser } = useAuth();
    const router = useRouter();

    const handleGetStarted = () => {
        router.push('/onboarding/profile');
    }

    return (
        <div className="flex items-center justify-center py-12">
            <Card className="w-full max-w-xl text-center">
                <CardHeader>
                    <div className="mx-auto w-fit rounded-full bg-primary/10 p-4 border border-primary/20">
                        <PartyPopper className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-3xl mt-4">
                        Welcome to Culture Kerala, {appUser?.displayName?.split(' ')[0]}!
                    </CardTitle>
                    <CardDescription className="text-lg">
                        You're just a few steps away from unlocking the full experience. Let's personalize your profile.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        This quick setup will help us tailor content and recommendations just for you.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button size="lg" onClick={handleGetStarted}>
                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button variant="link" asChild>
                        <Link href="/">Skip for now</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
