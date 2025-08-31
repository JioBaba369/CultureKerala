
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Check, ChevronsUpDown, X, CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";
import { useAuth } from "@/lib/firebase/auth";
import { ImageUploader } from "@/components/ui/image-uploader";
import { updateUserProfile, updateUserInterests } from "@/actions/user-actions";
import { interestsData } from "@/lib/data/interests";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { addYears, format } from "date-fns";


const profileFormSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters.").max(50),
  username: z.string().min(3, "Username must be at least 3 characters.").max(30).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  bio: z.string().max(160, "Bio must not be longer than 160 characters.").optional(),
  photoURL: z.string().url("A valid image URL is required.").optional().or(z.literal('')),
  interests: z.array(z.string()),
  dob: z.date().optional(),
  gender: z.enum(['female', 'male', 'other']).optional(),
}).refine((data) => {
    if (!data.dob) return true; // Allow empty DOB
    const eighteenYearsAgo = addYears(new Date(), -18);
    return data.dob <= eighteenYearsAgo;
}, {
    message: "You must be at least 18 years old.",
    path: ["dob"],
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
        interests: [],
    }
  });

  useEffect(() => {
    if (appUser) {
      form.reset({
        displayName: appUser.displayName || "",
        username: appUser.username || "",
        bio: appUser.bio || "",
        photoURL: appUser.photoURL || "",
        interests: appUser.interests || [],
        dob: appUser.dob?.toDate(),
        gender: appUser.gender,
      });
    }
  }, [appUser, form]);


  const handleProfileSave = async () => {
    if (!user) {
        toast({ variant: "destructive", title: "Not Authenticated" });
        return;
    }
    const isValid = await form.trigger(["displayName", "username", "bio", "photoURL", "dob", "gender"]);
    if (!isValid) return;

    const data = form.getValues();
    try {
      await updateUserProfile({ uid: user.uid, ...data });
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

  const handleInterestsSave = async () => {
    if (!user) {
        toast({ variant: "destructive", title: "Not Authenticated" });
        return;
    }
    const isValid = await form.trigger(["interests"]);
    if (!isValid) return;

    const data = form.getValues();
    try {
        await updateUserInterests(user.uid, data.interests);
        toast({ title: "Interests Saved!", description: "Your interests have been updated." });
    } catch(e: any) {
        toast({ variant: "destructive", title: "Error", description: e.message });
    }
  }

  if (loading || !appUser) {
    return <FormSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
          <div>
              <h1 className="text-3xl font-headline font-bold">Edit Profile</h1>
              <p className="text-muted-foreground">This information will appear on your public profile.</p>
          </div>
      </div>
       <Form {...form}>
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="photoURL"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Picture</FormLabel>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-24 h-24">
                                            <ImageUploader fieldName="photoURL" aspect={1} imageUrl={field.value} />
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
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
                        <CardTitle>Personal Details</CardTitle>
                        <CardDescription>This information helps us personalize your experience. It is not shared publicly.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <FormField
                            control={form.control}
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
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                            initialFocus
                                            captionLayout="dropdown-buttons"
                                            fromYear={1920}
                                            toYear={new Date().getFullYear()}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Gender</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl><RadioGroupItem value="female" /></FormControl>
                                            <FormLabel className="font-normal">Female</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl><RadioGroupItem value="male" /></FormControl>
                                            <FormLabel className="font-normal">Male</FormLabel>
                                        </FormItem>
                                         <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl><RadioGroupItem value="other" /></FormControl>
                                            <FormLabel className="font-normal">Other</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </CardContent>
                     <CardFooter>
                         <Button onClick={handleProfileSave} disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Details</>}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="md:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Interests</CardTitle>
                        <CardDescription>Select interests to help us recommend relevant content.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="interests"
                            render={({ field }) => (
                                <InterestsSelect selected={field.value || []} onSelect={field.onChange} />
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleInterestsSave} disabled={form.formState.isSubmitting}>
                            <Save className="mr-2 h-4 w-4" /> 
                            {form.formState.isSubmitting ? "Saving..." : "Save Interests"}
                        </Button>
                    </CardFooter>
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
        </div>
       </Form>
    </div>
  );
}

function InterestsSelect({ selected, onSelect }: { selected: string[], onSelect: (value: string[]) => void }) {
    const [open, setOpen] = useState(false)

    const handleSelect = (interest: string) => {
        const isSelected = selected.includes(interest);
        if (isSelected) {
            onSelect(selected.filter(item => item !== interest));
        } else {
            onSelect([...selected, interest]);
        }
    }
    
    return (
        <div className="space-y-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    >
                    {selected.length > 0 ? `${selected.length} selected` : "Select interests..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                    <CommandInput placeholder="Search interests..." />
                    <CommandList>
                        <CommandEmpty>No interests found.</CommandEmpty>
                        <CommandGroup>
                        {interestsData.map((interest) => (
                            <CommandItem
                            key={interest}
                            onSelect={() => handleSelect(interest)}
                            >
                            <Check
                                className={cn(
                                "mr-2 h-4 w-4",
                                selected.includes(interest) ? "opacity-100" : "opacity-0"
                                )}
                            />
                            {interest}
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-2">
                {selected.map(interest => (
                    <Badge key={interest} variant="secondary" className="text-sm">
                        {interest}
                        <button onClick={() => handleSelect(interest)} className="ml-1 rounded-full p-0.5 hover:bg-destructive/20">
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    )
}
