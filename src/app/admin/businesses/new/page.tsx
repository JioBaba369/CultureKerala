
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
import { Save } from "lucide-react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import { ImageUploader } from "@/components/ui/image-uploader";

// MVP Schema for Business creation
const businessFormSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters.").max(100),
  description: z.string().max(1000).optional(),
  categoryId: z.string().min(1, "Category is required."),
  isOnline: z.boolean().default(false),
  locations: z.array(z.object({
      address: z.string().min(1, "Address is required"),
  })).optional(),
  contact: z.object({
      website: z.string().url().optional().or(z.literal('')),
      email: z.string().email().optional().or(z.literal('')),
  }).optional(),
  status: z.enum(['draft', 'published']),
  images: z.array(z.string()).optional(),
}).refine(data => data.isOnline || (data.locations && data.locations.length > 0 && data.locations[0].address), {
    message: "An address is required for physical businesses.",
    path: ["locations.0.address"],
});


type BusinessFormValues = z.infer<typeof businessFormSchema>;


export default function CreateBusinessPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, appUser } = useAuth();

  useEffect(() => {
    if (!appUser?.roles.admin && !appUser?.roles.organizer) {
        toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "You do not have permission to create a business.",
        });
        router.push('/admin');
    }
  }, [appUser, router, toast]);

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      displayName: "",
      description: "",
      categoryId: "restaurant",
      isOnline: false,
      locations: [{ address: "" }],
      contact: {
        website: "",
        email: "",
      },
      status: 'published',
      images: [],
    },
  });
  
  const isOnline = form.watch("isOnline");

  async function onSubmit(data: BusinessFormValues) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to create a business.",
        });
        return;
    }

    const slug = data.displayName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
      await addDoc(collection(db, "businesses"), {
        // Core
        displayName: data.displayName,
        slug: slug,
        description: data.description || "",
        categoryId: data.categoryId,
        images: data.images,
        
        // Location
        isOnline: data.isOnline,
        locations: data.isOnline ? [] : data.locations,

        // Contact
        contact: data.contact,

        // Ownership & Status
        ownerId: user.uid,
        verified: false,
        status: data.status,
        
        // System
        createdBy: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      toast({
        title: "Business Created!",
        description: `The business "${data.displayName}" has been successfully created.`,
      });

      router.push('/admin/businesses');
      router.refresh();

    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem creating the business. Please try again.",
      });
    }
  }

  return (
     <div className="container mx-auto px-4 py-8">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold">Create Business</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Business</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Details</CardTitle>
                            <CardDescription>Fill in the core information for your new business listing.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="displayName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Business Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Delhi Spice House" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="restaurant">Restaurant</SelectItem>
                                        <SelectItem value="grocer">Grocer</SelectItem>
                                        <SelectItem value="services">Services</SelectItem>
                                        <SelectItem value="retail">Retail</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="A detailed description of the business..." {...field} rows={6} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Location</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <FormField
                                control={form.control}
                                name="isOnline"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        This is an online-only business
                                      </FormLabel>
                                      <FormDescription>
                                        The business has no physical locations.
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            {!isOnline && (
                                 <FormField
                                    control={form.control}
                                    name="locations.0.address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., 123 Main St, Bangalore" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Contact</CardTitle>
                            <CardDescription>How can customers get in touch?</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormField control={form.control} name="contact.website" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="contact.email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input placeholder="contact@..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                             )} />
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Visibility</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        'Draft' items are not visible to the public.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                                />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Images</CardTitle>
                            <CardDescription>Upload a high-quality logo or hero image.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="images.0"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <ImageUploader fieldName="images.0" />
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
