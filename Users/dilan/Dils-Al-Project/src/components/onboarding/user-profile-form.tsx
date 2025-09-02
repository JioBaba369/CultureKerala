
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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Calendar as CalendarIcon, Loader2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { ImageUploader } from "@/components/ui/image-uploader";
import { updateUserProfile } from "@/actions/user-actions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, addYears } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { profileFormSchema, type ProfileFormValues } from "@/lib/schemas/user-schema";
import { Timestamp } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";

export function UserProfileForm({ onSave }: { onSave: () => void }) {
  const { toast } = useToast();
  const { user, appUser, loading, refreshAppUser } = useAuth();
  const [isImageUploading, setIsImageUploading] = useState(false);

  const formMethods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
        displayName: "",
        username: "",
        bio: "",
        photoURL: "",
        gender: undefined,
    }
  });

  useEffect(() => {
    if (appUser) {
      formMethods.reset({
        displayName: appUser.displayName || "",
        username: appUser.username || "",
        bio: appUser.bio || "",
        photoURL: appUser.photoURL || "",
        dob: appUser.dob instanceof Timestamp ? appUser.dob.toDate() : undefined,
        gender: appUser.gender,
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
      await refreshAppUser();
      toast({
        title: "Profile Saved!",
        description: "Your profile details have been updated.",
      });
      onSave();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "There was a problem updating your profile.",
      });
    }
  }

  if (loading || !appUser) {
    return (
        <div className="space-y-8">
            <Card>
                <CardContent className="p-6 space-y-6">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
            <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    )
  }

  const isSubmitting = formMethods.formState.isSubmitting;

  return (
    <Form {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(handleProfileSave)} className="space-y-8">
        <Card>
            <CardContent className="p-6 space-y-6">
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

        <div className="flex justify-end">
             <Button type="submit" disabled={isSubmitting || isImageUploading}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> 
               : isImageUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Image...</>
               : <>Next <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
        </div>
        
      </form>
    </Form>
  );
}

    