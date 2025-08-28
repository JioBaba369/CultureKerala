
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
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
import { Save, ArrowLeft, Building, Trash } from "lucide-react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Business } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";
import { ImageUploader } from "@/components/ui/image-uploader";
import { useCountries } from "@/hooks/use-countries";
import type { PageProps } from "next";

const businessFormSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters.").max(100),
  description: z.string().max(2000).optional(),
  category: z.enum(["restaurant", "grocer", "services", "retail", "other"]),
  status: z.enum(['draft', 'published', 'archived']),
  isOnline: z.boolean().default(false),
  locations: z.array(z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State/Province is required"),
    country: z.string().min(1, "Country is required"),
  })),
  contact: z.object({
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
  }),
  logoURL: z.string().url().optional().or(z.literal('')),
  images: z.array(z.string().url()).optional(),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

export default function EditBusinessPage({ params }: PageProps<{ id: string }>) {
  const { toast } = useToast();
  const router = useRouter();
  const businessId = params.id;
  const [loading, setLoading] = useState(true);
  const { countries } = useCountries();

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "locations"
  });

  const isOnline = form.watch('isOnline');

  useEffect(() => {
    if (businessId) {
      const fetchBusiness = async () => {
        try {
          const docRef = doc(db, "businesses", businessId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Business;
            form.reset({
                ...data,
                images: data.images || []
            });
          } else {
             toast({ variant: "destructive", title: "Not Found", description: "Business not found." });
             router.push('/admin/businesses');
          }
        } catch (error) {
           console.error("Error fetching document:", error)
           toast({ variant: "destructive", title: "Error", description: "Failed to fetch business details." });
        } finally {
          setLoading(false);
        }
      }
      fetchBusiness();
    }
  }, [businessId, form, router, toast]);

  async function onSubmit(data: BusinessFormValues) {
    const slug = data.displayName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const cities = data.isOnline ? [] : [...new Set(data.locations.map(loc => loc.city))];

    try {
      const docRef = doc(db, "businesses", businessId);
      await updateDoc(docRef, {
        ...data,
        slug: slug,
        cities: cities,
        updatedAt: Timestamp.now(),
      });

      toast({
        title: "Business Updated!",
        description: `The business "${data.displayName}" has been successfully updated.`,
      });

      router.push('/admin/businesses');
      router.refresh();

    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem updating the business. Please try again.",
      });
    }
  }
  
  if (loading) {
    return <FormSkeleton />;
  }

  return (
     <div className="container mx-auto px-4 py-8">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/admin/businesses"><ArrowLeft /> Back to Businesses</Link>
      </Button>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><Building /> Edit Business</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Changes</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="displayName"
                                render={({ field }) => (
                                    <FormItem><FormLabel>Display Name</FormLabel><FormControl><Input placeholder="e.g., Kerala Kitchen" {...field} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe your business..." {...field} rows={6} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="restaurant">Restaurant</SelectItem><SelectItem value="grocer">Grocer</SelectItem><SelectItem value="services">Services</SelectItem><SelectItem value="retail">Retail</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage/></FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="contact.email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="contact@business.com" {...field} /></FormControl><FormMessage/></FormItem>
                            )} />
                             <FormField control={form.control} name="contact.phone" render={({ field }) => (
                                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+61..." {...field} /></FormControl><FormMessage/></FormItem>
                            )} />
                             <FormField control={form.control} name="contact.website" render={({ field }) => (
                                <FormItem className="md:col-span-2"><FormLabel>Website</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage/></FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Locations</CardTitle>
                            <CardDescription>Add one or more physical locations for your business.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="isOnline" render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><FormLabel>Online Business</FormLabel><FormDescription>This business operates online only.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                            )} />
                            
                            {!isOnline && (
                                <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <Card key={field.id} className="relative p-4 pt-6"><div className="grid grid-cols-2 gap-4"><FormField control={form.control} name={`locations.${index}.address`} render={({ field }) => <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>} /><FormField control={form.control} name={`locations.${index}.city`} render={({ field }) => <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>} /><FormField control={form.control} name={`locations.${index}.state`} render={({ field }) => <FormItem><FormLabel>State/Province</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>} /><FormField control={form.control} name={`locations.${index}.country`} render={({ field }) => <FormItem><FormLabel>Country</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger></FormControl><SelectContent>{countries.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage/></FormItem>} /></div><Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => remove(index)}><Trash className="h-4 w-4 text-destructive" /></Button></Card>
                                ))}
                                <Button type="button" variant="outline" onClick={() => append({ address: '', city: '', state: '', country: 'IN' })}>Add Location</Button>
                                </div>
                            )}
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
                             <FormField
                                control={form.control}
                                name="logoURL"
                                render={({ field }) => (
                                    <FormItem><FormControl><ImageUploader fieldName="logoURL" aspect={1} imageUrl={form.getValues("logoURL")} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Images</CardTitle></CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="images.0"
                                render={({ field }) => (
                                    <FormItem><FormLabel>Image 1</FormLabel><FormControl><ImageUploader fieldName="images.0" imageUrl={form.getValues("images.0")} /></FormControl><FormMessage /></FormItem>
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
