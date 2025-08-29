
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
import { Save, ArrowLeft, Award } from "lucide-react";
import { doc, getDoc, updateDoc, Timestamp, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Perk } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";
import { ImageUploader } from "@/components/ui/image-uploader";

const perkFormSchema = z.object({
  title: z.string().min(2, "Name must be at least 2 characters.").max(100),
  description: z.string().max(1000).optional(),
  type: z.enum(['discount', 'exclusive_access', 'partner_offer', 'other']),
  status: z.enum(['active', 'archived']),
  imageURL: z.string().url().min(1, "A representative image is required."),
});

type PerkFormValues = z.infer<typeof perkFormSchema>;

export default function EditPerkPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const perkId = params.id;
  const [loading, setLoading] = useState(true);

  const form = useForm<PerkFormValues>({
    resolver: zodResolver(perkFormSchema),
  });

  useEffect(() => {
    if (perkId) {
      const fetchPerk = async () => {
        setLoading(true);
        try {
          const docRef = doc(db, "perks", perkId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as DocumentData as Perk;
            form.reset(data);
          } else {
             toast({ variant: "destructive", title: "Not Found", description: "Perk not found." });
             router.push('/admin/perks');
          }
        } catch (error) {
           console.error("Error fetching document:", error)
           toast({ variant: "destructive", title: "Error", description: "Failed to fetch perk details." });
        } finally {
          setLoading(false);
        }
      }
      fetchPerk();
    }
  }, [perkId, form, router, toast]);

  async function onSubmit(data: PerkFormValues) {
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
      const docRef = doc(db, "perks", perkId);
      await updateDoc(docRef, {
        ...data,
        slug: slug,
        updatedAt: Timestamp.now(),
      });

      toast({
        title: "Perk Updated!",
        description: `The perk "${data.title}" has been successfully updated.`,
      });

      router.push('/admin/perks');
      router.refresh();

    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem updating the perk. Please try again.",
      });
    }
  }

  if (loading) {
    return <FormSkeleton />;
  }

  return (
     <div className="container mx-auto px-4 py-8">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/admin/perks"><ArrowLeft /> Back to Perks</Link>
      </Button>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><Award /> Edit Perk</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Changes</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Perk Details</CardTitle>
                            <CardDescription>Update the information for this perk.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Perk Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 20% off tickets" {...field} />
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
                                            <Textarea placeholder="A detailed description of the perk and its terms." {...field} rows={6} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="discount">Discount</SelectItem>
                                        <SelectItem value="exclusive_access">Exclusive Access</SelectItem>
                                        <SelectItem value="partner_offer">Partner Offer</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                    </Select>
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
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        'Archived' perks are not visible to users.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                                />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Perk Image</CardTitle>
                            <CardDescription>Upload a representative image for this perk.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="imageURL"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <ImageUploader fieldName="imageURL" imageUrl={form.getValues("imageURL")} />
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
