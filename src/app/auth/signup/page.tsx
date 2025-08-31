
'use client';

import { useState } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { KeralaIcon } from "@/components/ui/kerala-icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { locations } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [isOver18, setIsOver18] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
        setError("Name is required.");
        return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    if (!isOver18) {
        setError("You must confirm you are at least 18 years old.");
        return;
    }
    setError(null);
    setIsLoading(true);
    try {
      // Signup will now handle the redirect to the verify-email page
      await signup(email, password, displayName, location);
    } catch (err: any) {
      setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
     <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Link href="/" className="flex items-center gap-2" aria-label="Back to home">
                    <KeralaIcon className="h-8 w-8 text-primary" />
                    <span className="font-headline font-semibold text-2xl">{siteConfig.name}</span>
                </Link>
            </div>
          <CardTitle className="font-headline text-2xl">
            Create your account
          </CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <Label htmlFor="displayName">Your name</Label>
                    <Input id="displayName" type="text" placeholder="Your Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required disabled={isLoading} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="pr-10"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    <p className="text-sm text-muted-foreground">At least 6 characters are required</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select onValueChange={setLocation} value={location} disabled={isLoading} required>
                        <SelectTrigger id="location">
                            <SelectValue placeholder="Choose your location" />
                        </SelectTrigger>
                        <SelectContent>
                            {locations.map((loc) => (
                                <SelectItem key={loc} value={loc}>
                                    {loc}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="age" checked={isOver18} onCheckedChange={(checked) => setIsOver18(checked as boolean)} disabled={isLoading}/>
                    <Label htmlFor="age" className="text-sm font-normal text-muted-foreground">
                        I am 18 years of age or older.
                    </Label>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading || !displayName.trim() || password.length < 6 || !isOver18}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign up
                </Button>
                <div className="text-sm text-muted-foreground text-center">
                    Already a member?{" "}
                    <Link href="/auth/login" className="font-medium text-primary hover:underline">
                        Log in
                    </Link>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                    By signing up, you agree to our Terms of Service, Privacy Policy, and Cookie Policy.
                </p>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
