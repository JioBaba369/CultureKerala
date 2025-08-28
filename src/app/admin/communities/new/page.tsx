
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
import { Save, Users } from "lucide-react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCountries } from "@/hooks/use-countries";
import { ImageUploader } from "@/components/ui/image-uploader";

const communityFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
  description: z.string().max(2000).optional(),
  type: z.enum(['cultural', 'student', 'religious', 'professional', 'regional', 'other']).default('other'),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  logoURL: z.string().url().optional().or(z.literal('')),
  bannerURL: z.string().url().optional().or(z.literal('')),
  region: z.object({
      city: z.string().min(1, "City is required."),
      country: z.string().min(1, "Country is required.").default('IN'),
  }),
  contact: z.object({
      email: z.string().email().optional().or(z.literal('')),
      phone: z.string().optional(),
      website: z.string().url().optional().or(z.literal('')),
  }),
});

type CommunityFormValues = z.infer<typeof communityFormSchema>;

export default function CreateCommunityPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const { countries } = useCountries();

  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "other",
      status: 'published',
      logoURL: "",
      bannerURL: "",
      region: {
          city: "",
          country: "IN",
      },
    },
  });

  async function onSubmit(data: CommunityFormValues) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to create a community.",
        });
        return;
    }

    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
      await addDoc(collection(db, "communities"), {
        ...data,
        slug: slug,
        roles: {
            owners: [user.uid],
            admins: [user.uid],
        },
        memberCount: 1,
        verified: false,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      toast({
        title: "Community Created!",
        description: `The community "${data.name}" has been successfully created.`,
      });

      router.push('/admin/communities');
      router.refresh();

    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem creating the community. Please try again.",
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><Users /> Create Community</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Community</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Community Details</CardTitle>
                            <CardDescription>Fill in the main information for your new community.</CardDescription>
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
                                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe your community, its mission, and who it's for..." {...field} rows={6} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="cultural">Cultural</SelectItem><SelectItem value="student">Student</SelectItem><SelectItem value="religious">Religious</SelectItem><SelectItem value="professional">Professional</SelectItem><SelectItem value="regional">Regional</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage/></FormItem>
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
                                <FormItem><FormLabel>Country</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{countries.map(country => (<SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>))}</SelectContent></Select><FormMessage/></FormItem>
                            )} />
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1 space-y-8">
                     <Card>
                        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
                        <CardContent>
                             <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Visibility</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select><FormDescription>'Draft' items are not visible to the public.</FormDescription><FormMessage/></FormItem>
                            )} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Logo</CardTitle>
                            <CardDescription>Upload a square logo (1:1 aspect ratio).</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <FormField control={form.control} name="logoURL" render={({ field }) => (
                                <FormItem><FormControl><ImageUploader fieldName="logoURL" aspect={1} imageUrl={form.getValues("logoURL") || ''} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Banner</CardTitle>
                            <CardDescription>Upload a wide banner (16:9 aspect ratio).</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <FormField control={form.control} name="bannerURL" render={({ field }) => (
                                <FormItem><FormControl><ImageUploader fieldName="bannerURL" aspect={16/9} imageUrl={form.getValues("bannerURL") || ''} /></FormControl><FormMessage /></FormItem>
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
