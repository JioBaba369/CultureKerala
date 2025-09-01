
'use client';

import { useAuth } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
    const { user, resendVerificationEmail, loading, logout } = useAuth();
    const { toast } = useToast();
    const [isSending, setIsSending] = useState(false);
    const router = useRouter();

    if(loading) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-background p-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
             </div>
        )
    }

    if (!user) {
        // This case should ideally not be hit if routing is correct
        router.push('/auth/login');
        return null;
    }

    if (user.emailVerified) {
         router.push('/my/dashboard');
         return null;
    }

    const handleResend = async () => {
        setIsSending(true);
        try {
            await resendVerificationEmail();
            toast({
                title: 'Email Sent!',
                description: 'A new verification email has been sent to your address.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to send verification email. Please try again.',
            });
        } finally {
            setIsSending(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
            <div className="mx-auto w-fit rounded-full bg-primary/10 p-3">
                <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl mt-4">Verify Your Email</CardTitle>
            <CardDescription>
                We've sent a verification link to <strong>{user.email}</strong>. Please check your inbox and click the link to finish setting up your account.
            </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
                <p>Once you've verified, you'll be automatically redirected. This may take a few moments.</p>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button onClick={handleResend} className="w-full" disabled={isSending}>
                    {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Resend Email
                </Button>
                 <Button variant="link" size="sm" onClick={logout}>
                    Use a different email
                </Button>
            </CardFooter>
        </Card>
        </div>
    );
}
