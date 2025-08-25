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
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { Movie } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";


const movieFormSchema = z.object({
  title: z.string().min(2, "Name must be at least 2 characters.").max(100),
  overview: z.string().max(1000).optional(),
  languages: z.string().min(1, "Languages are required (comma-separated)."),
  genres: z.string().optional(),
  posterURL: z.string().url().optional().or(z.literal('')),
  status: z.enum(['coming_soon', 'now_showing', 'archived']),
});

type MovieFormValues = z.infer<typeof movieFormSchema>;


export default function EditMoviePage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const movieId = params.id;
  const [loading, setLoading] = useState(true);

  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieFormSchema),
  });

  useEffect(() => {
    if (movieId) {
      const fetchMovie = async () => {
        try {
          const docRef = doc(db, "movies", movieId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Movie;
            // Convert arrays to comma-separated strings for form fields
            form.reset({
                ...data,
                languages: data.languages.join(', '),
                genres: data.genres?.join(', ') || ''
            });
          } else {
             toast({ variant: "destructive", title: "Not Found", description: "Movie not found." });
             router.push('/admin/movies');
          }
        } catch (error) {
           console.error("Error fetching document:", error)
           toast({ variant: "destructive", title: "Error", description: "Failed to fetch movie details." });
        } finally {
          setLoading(false);
        }
      }
      fetchMovie();
    }
  }, [movieId, form, router, toast]);

  async function onSubmit(data: MovieFormValues) {
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
      const docRef = doc(db, "movies", movieId);
      await updateDoc(docRef, {
        title: data.title,
        slug: slug,
        overview: data.overview || "",
        languages: data.languages.split(',').map(s => s.trim()),
        genres: data.genres?.split(',').map(s => s.trim()) || [],
        posterURL: data.posterURL,
        status: data.status,
        updatedAt: Timestamp.now(),
      });

      toast({
        title: "Movie Updated!",
        description: `The movie "${data.title}" has been successfully updated.`,
      });

      router.push('/admin/movies');
      router.refresh();

    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem updating the movie. Please try again.",
      });
    }
  }

  if (loading) {
    return <FormSkeleton />;
  }

  return (
     <div className="container mx-auto px-4 py-8">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/admin/movies"><ArrowLeft /> Back to Movies</Link>
      </Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold">Edit Movie</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Changes</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Movie Details</CardTitle>
                            <CardDescription>Update the core information for this movie.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Movie Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., The Lunchbox" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="overview"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Overview</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="A brief synopsis of the movie..." {...field} rows={6} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="languages"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Languages</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Hindi, English" {...field} />
                                        </FormControl>
                                        <FormDescription>Comma-separated list of languages.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="genres"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Genres</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Romance, Drama" {...field} />
                                        </FormControl>
                                        <FormDescription>Comma-separated list of genres.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="posterURL"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Poster URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
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
                                            <SelectItem value="coming_soon">Coming Soon</SelectItem>
                                            <SelectItem value="now_showing">Now Showing</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Controls where the movie appears on the site.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                                />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Poster Image</CardTitle>
                            <CardDescription>Upload a poster for this movie. (Feature coming soon)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground bg-muted/50">
                                <div className="text-center">
                                    <UploadCloud className="mx-auto h-10 w-10 mb-2" />
                                    <p className="text-sm">Image Upload (disabled)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
      </Form>
    </div>
  );
}
