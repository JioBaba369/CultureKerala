
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
import { Save, ArrowLeft, Newspaper } from "lucide-react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Classified } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";
import { ImageUploader } from "@/components/ui/image-uploader";

const classifiedFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters.").max(2000),
  category: z.enum(['for_sale', 'job_opening', 'service', 'other']),
  status: z.enum(['draft', 'published', 'archived']),
  imageURL: z.string().url().optional().or(z.literal('')),
  contact: z.object({
      name: z.string().min(2, "Contact name is required."),
      email: z.string().email().optional().or(z.literal('')),
      phone: z.string().optional(),
  }),
  location: z.object({
      city: z.string().min(1, "City is required."),
      country: z.string().min(1, "Country is required."),
  }),
});

type ClassifiedFormValues = z.infer<typeof classifiedFormSchema>;

export default function EditClassifiedPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const classifiedId = params.id;
  const [loading, setLoading] = useState(true);

  const form = useForm<ClassifiedFormValues>({
    resolver: zodResolver(classifiedFormSchema),
  });

  useEffect(() => {
    if (classifiedId) {
      const fetchClassified = async () => {
        try {
          const docRef = doc(db, "classifieds", classifiedId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Classified;
            form.reset(data);
          } else {
             toast({ variant: "destructive", title: "Not Found", description: "Classified not found." });
             router.push('/admin/PlatformAdmin/classifieds');
          }
        } catch (error) {
           console.error("Error fetching document:", error)
           toast({ variant: "destructive", title: "Error", description: "Failed to fetch classified details." });
        } finally {
          setLoading(false);
        }
      }
      fetchClassified();
    }
  }, [classifiedId, form, router, toast]);

  async function onSubmit(data: ClassifiedFormValues) {
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
      const docRef = doc(db, "classifieds", classifiedId);
      await updateDoc(docRef, {
        ...data,
        slug: slug,
        updatedAt: Timestamp.now(),
      });

      toast({
        title: "Classified Updated!",
        description: `The classified "${data.title}" has been successfully updated.`,
      });

      router.push('/admin/PlatformAdmin/classifieds');
      router.refresh();

    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem updating the classified. Please try again.",
      });
    }
  }

  if (loading) {
    return <FormSkeleton />;
  }

  return (
     <div className="container mx-auto px-4 py-8">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/admin/PlatformAdmin/classifieds"><ArrowLeft /> Back to Classifieds</Link>
      </Button>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><Newspaper /> Edit Classified</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Changes</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Listing Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Used Sofa for Sale" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="for_sale">For Sale</SelectItem>
                                        <SelectItem value="job_opening">Job Opening</SelectItem>
                                        <SelectItem value="service">Service</SelectItem>
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
                                            <Textarea placeholder="A detailed description..." {...field} rows={8} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact & Location</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormField control={form.control} name="contact.name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Name</FormLabel>
                                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="contact.email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Email</FormLabel>
                                    <FormControl><Input placeholder="contact@example.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                             )} />
                            <FormField control={form.control} name="contact.phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Phone</FormLabel>
                                    <FormControl><Input placeholder="+91..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                             )} />
                             <FormField
                                control={form.control}
                                name="location.city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Bangalore" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                        <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
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
                            <CardTitle>Image</CardTitle>
                            <CardDescription>Upload a photo for the listing.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="imageURL"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <ImageUploader fieldName="imageURL" imageUrl={form.getValues("imageURL") || ''} />
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
