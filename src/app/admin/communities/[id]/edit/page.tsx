
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
import { Save, ArrowLeft, Users } from "lucide-react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Community } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCountries } from "@/hooks/use-countries";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";
import { ImageUploader } from "@/components/ui/image-uploader";

const communityFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
  description: z.string().max(2000).optional(),
  type: z.enum(['cultural', 'student', 'religious', 'professional', 'regional', 'other']),
  status: z.enum(['draft', 'published', 'archived']),
  logoURL: z.string().url().optional().or(z.literal('')),
  bannerURL: z.string().url().optional().or(z.literal('')),
  region: z.object({
      city: z.string().min(1, "City is required."),
      country: z.string().min(1, "Country is required."),
  }),
  contact: z.object({
      email: z.string().email().optional().or(z.literal('')),
      phone: z.string().optional(),
      website: z.string().url().optional().or(z.literal('')),
  }),
});

type CommunityFormValues = z.infer<typeof communityFormSchema>;

type Props = {
    params: {
        id: string;
    };
};

export default function EditCommunityPage({ params }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const communityId = params.id;
  const { countries } = useCountries();
  const [loading, setLoading] = useState(true);

  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(communityFormSchema),
  });

  useEffect(() => {
    if (communityId) {
      const fetchCommunity = async () => {
        try {
          const docRef = doc(db, "communities", communityId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Community;
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
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
      const docRef = doc(db, "communities", communityId);
      await updateDoc(docRef, {
        ...data,
        slug: slug,
        updatedAt: Timestamp.now(),
      });

      toast({
        title: "Community Updated!",
        description: `The community "${data.name}" has been successfully updated.`,
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
    return <FormSkeleton />;
  }

  return (
     <div className="container mx-auto px-4 py-8">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/admin/communities"><ArrowLeft /> Back to Communities</Link>
      </Button>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><Users /> Edit Community</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Changes</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Community Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem><FormLabel>Community Name</FormLabel><FormControl><Input placeholder="e.g., Sydney Malayalee Association" {...field} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe your community..." {...field} rows={6} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="cultural">Cultural</SelectItem><SelectItem value="student">Student</SelectItem><SelectItem value="religious">Religious</SelectItem><SelectItem value="professional">Professional</SelectItem><SelectItem value="regional">Regional</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage/></FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact & Location</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="contact.email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="contact@community.com" {...field} /></FormControl><FormMessage/></FormItem>
                            )} />
                             <FormField control={form.control} name="contact.phone" render={({ field }) => (
                                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+61..." {...field} /></FormControl><FormMessage/></FormItem>
                            )} />
                             <FormField control={form.control} name="contact.website" render={({ field }) => (
                                <FormItem className="md:col-span-2"><FormLabel>Website</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage/></FormItem>
                            )} />
                            <FormField control={form.control} name="region.city" render={({ field }) => (
                                <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g., Sydney" {...field} /></FormControl><FormMessage/></FormItem>
                            )} />
                            <FormField control={form.control} name="region.country" render={({ field }) => (
                                <FormItem><FormLabel>Country</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{countries.map(country => (<SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>))}</SelectContent></Select><FormMessage/></FormItem>
                            )} />
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1 space-y-8">
                     <Card>
                        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
                        <CardContent>
                             <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Visibility</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select><FormMessage/></FormItem>
                            )} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Logo</CardTitle></CardHeader>
                        <CardContent>
                             <FormField control={form.control} name="logoURL" render={({ field }) => (
                                <FormItem><FormControl><ImageUploader fieldName="logoURL" aspect={1} imageUrl={form.getValues("logoURL") || ""} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Banner</CardTitle></CardHeader>
                        <CardContent>
                             <FormField control={form.control} name="bannerURL" render={({ field }) => (
                                <FormItem><FormControl><ImageUploader fieldName="bannerURL" aspect={16/9} imageUrl={form.getValues("bannerURL") || ""} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
      </FormProvider>
    </div>
  );
}
