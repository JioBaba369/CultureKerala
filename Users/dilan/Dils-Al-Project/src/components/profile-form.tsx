
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Save, Calendar as CalendarIcon, UserCircle2, Phone, Globe, X, Instagram, Facebook, Linkedin, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";
import { useAuth } from "@/lib/firebase/auth";
import { ImageUploader } from "@/components/ui/image-uploader";
import { updateUserProfile } from "@/actions/user-actions";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { format, addYears } from "date-fns";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { profileFormSchema, type ProfileFormValues } from "@/lib/schemas/user-schema";
import { Timestamp } from "firebase/firestore";
import { interestsData } from "@/lib/data/interests";
import { Checkbox } from "./ui/checkbox";

export function ProfileForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, appUser, loading, refreshAppUser } = useAuth();
  const [isImageUploading, setIsImageUploading] = useState(false);

  const formMethods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
        displayName: "",
        username: "",
        bio: "",
        photoURL: "",
        interests: [],
        phone: "",
        socials: {
            website: "",
            x: "",
            instagram: "",
            facebook: "",
            linkedin: "",
        }
    }
  });

  useEffect(() => {
    if (appUser) {
      let dobDate: Date | undefined = undefined;
      if (appUser.dob) {
        // Timestamps from Firestore need to be converted to Date objects
        if (appUser.dob instanceof Timestamp) {
          dobDate = appUser.dob.toDate();
        } else if (typeof appUser.dob === 'string') {
          dobDate = new Date(appUser.dob);
        } else if (appUser.dob instanceof Date) {
          dobDate = appUser.dob;
        }
      }
        
      formMethods.reset({
        displayName: appUser.displayName || "",
        username: appUser.username || "",
        bio: appUser.bio || "",
        photoURL: appUser.photoURL || "",
        dob: dobDate,
        gender: appUser.gender,
        interests: appUser.interests || [],
        phone: appUser.phone || "",
        socials: appUser.socials || {},
      });
    }
  }, [appUser, formMethods]);

  const handleProfileSave = async (data: ProfileFormValues) => {
    if (!user) {
        toast({ variant: "destructive", title: "Not Authenticated" });
        return;
    }

    try {
      await updateUserProfile(user.uid, data);
      await refreshAppUser(); // Refresh user data from Firestore
      toast({
        title: "Profile Updated!",
        description: "Your profile details have been successfully updated.",
      });
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

  const isSubmitting = formMethods.formState.isSubmitting;

  return (
    <Form {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(handleProfileSave)} className="space-y-8">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><UserCircle2 /> Edit Profile</h1>
                <p className="text-muted-foreground">This information will appear on your public profile.</p>
            </div>
            <Button type="submit" disabled={isSubmitting || isImageUploading}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> 
               : isImageUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Image...</>
               : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
            </Button>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Core Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={formMethods.control}
                            name="photoURL"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Picture</FormLabel>
                                    <FormControl>
                                        <ImageUploader 
                                            fieldName="photoURL" 
                                            aspect={1} 
                                            imageUrl={field.value || undefined}
                                            onUploadingChange={setIsImageUploading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={formMethods.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name (required)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={formMethods.control}
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
                            control={formMethods.control}
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
                        <FormField
                            control={formMethods.control}
                            name="dob"
                            render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date of birth</FormLabel>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value ? (
                                        format(field.value, "PPP")
                                        ) : (
                                        <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                    captionLayout="dropdown-buttons"
                                    fromYear={1950}
                                    toYear={new Date().getFullYear()}
                                    mode="single"
                                    selected={field.value ?? undefined}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                    defaultMonth={addYears(new Date(), -18)}
                                    />
                                </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={formMethods.control}
                            name="gender"
                            render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Gender</FormLabel>
                                <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex items-center space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="male" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Male</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="female" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Female</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="other" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Other</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Contact & Socials</CardTitle>
                        <CardDescription>Add your contact info and social media links.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={formMethods.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone</FormLabel><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="+91..." {...field} className="pl-10"/></FormControl></div><FormMessage /></FormItem>
                        )} />
                        <FormField control={formMethods.control} name="socials.website" render={({ field }) => (
                            <FormItem><FormLabel>Website</FormLabel><div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="https://yourwebsite.com" {...field} className="pl-10" /></FormControl></div><FormMessage /></FormItem>
                        )} />
                        <FormField control={formMethods.control} name="socials.x" render={({ field }) => (
                            <FormItem><FormLabel>X (Twitter)</FormLabel><div className="relative"><X className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="https://x.com/yourhandle" {...field} className="pl-10" /></FormControl></div><FormMessage /></FormItem>
                        )} />
                         <FormField control={formMethods.control} name="socials.instagram" render={({ field }) => (
                            <FormItem><FormLabel>Instagram</FormLabel><div className="relative"><Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="https://instagram.com/yourhandle" {...field} className="pl-10" /></FormControl></div><FormMessage /></FormItem>
                        )} />
                         <FormField control={formMethods.control} name="socials.facebook" render={({ field }) => (
                            <FormItem><FormLabel>Facebook</FormLabel><div className="relative"><Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="https://facebook.com/yourprofile" {...field} className="pl-10" /></FormControl></div><FormMessage /></FormItem>
                        )} />
                         <FormField control={formMethods.control} name="socials.linkedin" render={({ field }) => (
                            <FormItem><FormLabel>LinkedIn</FormLabel><div className="relative"><Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="https://linkedin.com/in/yourprofile" {...field} className="pl-10" /></FormControl></div><FormMessage /></FormItem>
                        )} />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1 space-y-8">
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
                 <Card>
                    <CardHeader>
                        <CardTitle>Interests</CardTitle>
                        <CardDescription>Select your interests to get personalized recommendations.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      {interestsData.map((interest) => (
                        <FormField
                            key={interest}
                            control={formMethods.control}
                            name="interests"
                            render={({ field }) => {
                                return (
                                <FormItem
                                    key={interest}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(interest)}
                                            onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([...(field.value || []), interest])
                                                : field.onChange(
                                                    field.value?.filter(
                                                        (value) => value !== interest
                                                    )
                                                    )
                                            }}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {interest}
                                    </FormLabel>
                                </FormItem>
                                )
                            }}
                         />
                        ))}
                    </CardContent>
                </Card>
            </div>
          </div>
        </form>
      </Form>
    );
}
