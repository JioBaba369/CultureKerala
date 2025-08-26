
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Flame, Sparkles, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type SignupPath = 'community' | 'club';

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupPath, setSignupPath] = useState<SignupPath>('community');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signup } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    try {
      await signup(email, password, signupPath === 'club');
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
     <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Link href="/" className="flex items-center gap-2">
                    <Flame className="h-8 w-8 text-primary" />
                    <span className="font-headline font-semibold text-2xl">DilSePass</span>
                </Link>
            </div>
          <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
          <CardDescription>Enter your details to create your new account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                
                <div className="space-y-2 pt-2">
                    <Label className="font-medium">Choose your path</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <ChoiceCard
                            title="Community App"
                            description="Discover events, join groups, and support businesses."
                            isSelected={signupPath === 'community'}
                            onSelect={() => setSignupPath('community')}
                        />
                         <ChoiceCard
                            title="DilSePass Club"
                            description="Exclusive perks, early access, and 1.5x points."
                            icon={<Sparkles className="h-5 w-5 text-primary" />}
                            isSelected={signupPath === 'club'}
                            onSelect={() => setSignupPath('club')}
                        />
                    </div>
                </div>

            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full">Create Account</Button>
                <p className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="font-medium text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}


function ChoiceCard({
    title,
    description,
    icon,
    isSelected,
    onSelect
} : {
    title: string;
    description: string;
    icon?: React.ReactNode;
    isSelected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                "p-4 rounded-lg border-2 text-left relative transition-all",
                isSelected ? "border-primary bg-primary/5 shadow-lg" : "border-border bg-transparent hover:border-muted-foreground/50"
            )}
        >
             {isSelected && (
                <CheckCircle className="h-5 w-5 text-primary absolute -top-2 -right-2 bg-background rounded-full" />
            )}
            <div className="font-semibold flex items-center gap-2 mb-1">
                {icon} {title}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
        </button>
    )
}
