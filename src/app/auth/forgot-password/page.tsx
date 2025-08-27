
'use client';

import { useState } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Heart, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const { sendPasswordReset } = useAuth();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSent(false);
    try {
      await sendPasswordReset(email);
      setIsSent(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Link href="/" className="flex items-center gap-2">
                    <Heart className="h-8 w-8 text-primary" />
                    <span className="font-headline font-semibold text-2xl">{siteConfig.name}</span>
                </Link>
            </div>
          <CardTitle className="font-headline text-2xl">Forgot Password?</CardTitle>
          <CardDescription>
            No worries, we'll send you reset instructions.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
                 {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {isSent ? (
                    <Alert>
                        <Mail className="h-4 w-4" />
                        <AlertDescription>
                            A password reset link has been sent to your email address. Please check your inbox.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                {!isSent && <Button type="submit" className="w-full">Send Instructions</Button>}
                <p className="text-sm text-center text-muted-foreground">
                    <Link href="/auth/login" className="font-medium text-primary hover:underline">
                        Back to Login
                    </Link>
                </p>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
