
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
import { Save, UploadCloud } from "lucide-react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCountries } from "@/hooks/use-countries";
import { useEffect } from "react";

const communityFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100, "Name must not be longer than 100 characters."),
  description: z.string().max(1000, "Description must not be longer than 1000 characters.").optional(),
  type: z.enum(['cultural', 'student', 'religious', 'professional', 'regional', 'other']),
  region: z.object({
    city: z.string().min(1, "City is required."),
    state: z.string().optional(),
    country: z.string().min(1, "Country is required."),
  }),
  contact: z.object({
      website: z.string().url().optional().or(z.literal('')),
      email: z.string().email().optional().or(z.literal('')),
  }).optional(),
  socials: z.object({
      facebook: z.string().url().optional().or(z.literal('')),
      instagram: z.string().url().optional().or(z.literal('')),
      x: z.string().url().optional().or(z.literal('')),
      youtube: z.string().url().optional().or(z.literal('')),
      whatsapp: z.string().optional(),
      telegram: z.string().optional(),
  }).optional(),
  status: z.enum(['draft', 'published']),
  logoURL: z.any().optional(),
});

type CommunityFormValues = z.infer<typeof communityFormSchema>;


export default function CreateCommunityPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, appUser } = useAuth();
  const { countries } = useCountries();

  useEffect(() => {
    if (!appUser?.roles.admin && !appUser?.roles.organizer) {
        toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "You do not have permission to create a community.",
        });
        router.push('/admin');
    }
  }, [appUser, router, toast]);

  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "other",
      region: {
        city: "",
        state: "",
        country: "IN", // Default to India
      },
      status: 'published',
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
        name: data.name,
        slug: slug,
        description: data.description || "",
        type: data.type,
        region: data.region,
        contact: data.contact,
        socials: data.socials,
        logoURL: "https://placehold.co/600x400.png",
        roles: {
            owners: [user.uid],
        },
        verified: false,
        status: data.status,
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold">Create Community</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Community</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Community Details</CardTitle>
                            <CardDescription>Fill in the core information for your new community.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Community Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Bangalore Techies" {...field} />
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a community type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="cultural">Cultural</SelectItem>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="religious">Religious</SelectItem>
                                        <SelectItem value="professional">Professional</SelectItem>
                                        <SelectItem value="regional">Regional</SelectItem>
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
                                            <Textarea placeholder="A detailed description of the community..." {...field} rows={6} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Region</CardTitle>
                            <CardDescription>Where is this community based?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                              <FormField
                                control={form.control}
                                name="region.country"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {countries.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="region.state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State / Province</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Karnataka" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="region.city"
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
                     <Card>
                        <CardHeader>
                            <CardTitle>Contact & Socials</CardTitle>
                            <CardDescription>How can people get in touch or follow the community?</CardDescription>
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
                             <FormField control={form.control} name="socials.facebook" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Facebook</FormLabel>
                                    <FormControl><Input placeholder="https://facebook.com/..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                             )} />
                            <FormField control={form.control} name="socials.instagram" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instagram</FormLabel>
                                    <FormControl><Input placeholder="https://instagram.com/..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                             )} />
                              <FormField control={form.control} name="socials.x" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>X (Twitter)</FormLabel>
                                    <FormControl><Input placeholder="https://x.com/..." {...field} /></FormControl>
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
                            <CardTitle>Logo / Image</CardTitle>
                            <CardDescription>Upload a high-quality logo or image for the community.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <FormField
                                control={form.control}
                                name="logoURL"
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

    