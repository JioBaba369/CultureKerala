'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";
import { useAuth } from "@/lib/firebase/auth";
import { ImageUploader } from "@/components/ui/image-uploader";
import { updateUserProfile } from "@/actions/user-actions";


const profileFormSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters.").max(50),
  username: z.string().min(3, "Username must be at least 3 characters.").max(30).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  bio: z.string().max(160, "Bio must not be longer than 160 characters.").optional(),
  photoURL: z.string().url("A valid image URL is required.").optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;


export function ProfileForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, appUser, loading } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
        displayName: "",
        username: "",
        bio: "",
        photoURL: "",
    }
  });

  useEffect(() => {
    if (appUser) {
      form.reset({
        displayName: appUser.displayName || "",
        username: appUser.username || "",
        bio: appUser.bio || "",
        photoURL: appUser.photoURL || "",
      });
    }
  }, [appUser, form]);


  async function onSubmit(data: ProfileFormValues) {
     if (!user) {
        toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to update your profile."});
        return;
    }

    try {
      await updateUserProfile({ uid: user.uid, ...data });
      toast({
        title: "Profile Updated!",
        description: "Your profile has been successfully updated.",
      });
      // Refresh the page to reflect changes in the user object
      router.refresh(); 

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "There was a problem updating your profile.",
      });
    }
  }

  if (loading || !appUser) {
    return <FormSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold flex items-center gap-3"><UserCircle /> My Account</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Changes</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>Update your public profile information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="displayName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="your_username" {...field} />
                                        </FormControl>
                                        <FormDescription>This will be your unique URL handle.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Tell us a little about yourself." {...field} rows={4} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>These details cannot be changed.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <FormLabel>Email</FormLabel>
                                <Input value={appUser.email} disabled />
                            </div>
                            <div className="space-y-2">
                                <FormLabel>User Account Number (UID)</FormLabel>
                                <Input value={appUser.uid} disabled />
                            </div>
                        </CardContent>
                     </Card>
                </div>
                <div className="md:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <FormField
                                control={form.control}
                                name="photoURL"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <ImageUploader fieldName="photoURL" aspect={1} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
      </FormProvider>
    </div>
  );
}
