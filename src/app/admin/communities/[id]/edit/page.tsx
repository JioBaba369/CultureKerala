
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, UploadCloud, ArrowLeft } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { Item } from "@/types";

const communityFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters.").max(100, "Title must not be longer than 100 characters."),
  description: z.string().max(500, "Description must not be longer than 500 characters.").optional(),
  location: z.string().min(1, "Location is required."),
  image: z.any().optional(), // For file uploads
});

type CommunityFormValues = z.infer<typeof communityFormSchema>;


export default function EditCommunityPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const communityId = params.id;
  const [loading, setLoading] = useState(true);

  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
    },
  });

  useEffect(() => {
    if (communityId) {
      const fetchCommunity = async () => {
        try {
          const docRef = doc(db, "communities", communityId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Item;
            form.reset(data);
          } else {
             toast({ variant: "destructive", title: "Not Found", description: "Community not found." });
             router.push('/admin/communities');
          }
        } catch (error) {
           console.error("Error fetching document:", error)
           toast({ variant: "destructive", title: "Error", description: "Failed to fetch community details." });
        } finally {
          setLoading(false);
        }
      }
      fetchCommunity();
    }
  }, [communityId, form, router, toast]);

  async function onSubmit(data: CommunityFormValues) {
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
      const docRef = doc(db, "communities", communityId);
      await updateDoc(docRef, {
        ...data,
        slug: slug,
      });

      toast({
        title: "Community Updated!",
        description: `The community "${data.title}" has been successfully updated.`,
      });

      router.push('/admin/communities');
      router.refresh();

    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem updating the community. Please try again.",
      });
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
     <div className="container mx-auto px-4 py-8">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/admin/communities"><ArrowLeft /> Back to Communities</Link>
      </Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold">Edit Community</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Changes</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Community Details</CardTitle>
                            <CardDescription>Update the information for this community.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Community Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Bangalore Techies" {...field} />
                                        </FormControl>
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
                                            <Textarea placeholder="A brief description of the community..." {...field} rows={6} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Bangalore" {...field} />
                                        </FormControl>
                                         <FormDescription>
                                            This can be a city, state, or neighborhood.
                                        </FormDescription>
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
                            <CardTitle>Featured Image</CardTitle>
                            <CardDescription>Upload a high-quality image for your community.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer">
                                                <div className="text-center">
                                                    <UploadCloud className="mx-auto h-10 w-10 mb-2" />
                                                    <p className="text-sm">Click or drag to upload</p>
                                                </div>
                                                <Input type="file" className="hidden" {...field} />
                                            </div>
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
      </Form>
    </div>
  );
}
