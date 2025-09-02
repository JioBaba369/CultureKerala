
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
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
import { Save, Building, Trash, Facebook, Instagram, X, Linkedin } from "lucide-react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/ui/image-uploader";
import { useCountries } from "@/hooks/use-countries";
import { nanoid } from "nanoid";
import { businessFormSchema, BusinessFormValues } from "@/lib/schemas/business-schema";

export default function CreateBusinessPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, appUser } = useAuth();
  const { countries } = useCountries();

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      displayName: "",
      description: "",
      category: "other",
      status: 'published',
      isOnline: false,
      locations: [],
      images: [],
      socials: {
        facebook: '',
        instagram: '',
        x: '',
        linkedin: ''
      },
      contact: {
        email: '',
        phone: '',
        website: ''
      }
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "locations"
  });

  const isOnline = form.watch('isOnline');

  async function onSubmit(data: BusinessFormValues) {
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to create a business."});
        return;
    }

    const slug = data.displayName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') + '-' + nanoid(5);
    const cities = data.isOnline ? [] : [...new Set(data.locations?.map(loc => loc.city))];

    try {
      await addDoc(collection(db, "businesses"), {
        ...data,
        slug: slug,
        ownerId: user.uid,
        cities: cities,
        locations: data.isOnline ? [] : data.locations,
        verified: data.verified || false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      toast({ title: "Business Created!", description: `The business "${data.displayName}" has been successfully created.` });
      router.push('/admin/businesses');
      router.refresh();

    } catch (error) {
      console.error("Error adding document: ", error);
      toast({ variant: "destructive", title: "Error", description: "There was a problem creating the business. Please try again." });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><Building /> Create Business</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Business</>}
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
                                <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="restaurant">Restaurant</SelectItem><SelectItem value="grocer">Grocer</SelectItem><SelectItem value="services">Services</SelectItem><SelectItem value="retail">Retail</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage/></FormItem>
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
                                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+91..." {...field} /></FormControl><FormMessage/></FormItem>
                            )} />
                             <FormField control={form.control} name="contact.website" render={({ field }) => (
                                <FormItem className="md:col-span-2"><FormLabel>Website</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage/></FormItem>
                            )} />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Social Media</CardTitle>
                            <CardDescription>Links to your business's social media pages.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="socials.facebook" render={({ field }) => (
                                <FormItem><div className="relative"><Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="Facebook URL" {...field} className="pl-10"/></FormControl></div><FormMessage/></FormItem>
                            )} />
                             <FormField control={form.control} name="socials.instagram" render={({ field }) => (
                                <FormItem><div className="relative"><Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="Instagram URL" {...field} className="pl-10"/></FormControl></div><FormMessage/></FormItem>
                            )} />
                            <FormField control={form.control} name="socials.x" render={({ field }) => (
                                <FormItem><div className="relative"><X className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="X (Twitter) URL" {...field} className="pl-10"/></FormControl></div><FormMessage/></FormItem>
                            )} />
                             <FormField control={form.control} name="socials.linkedin" render={({ field }) => (
                                <FormItem><div className="relative"><Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><FormControl><Input placeholder="LinkedIn URL" {...field} className="pl-10"/></FormControl></div><FormMessage/></FormItem>
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
                                    <Card key={field.id} className="relative p-4 pt-6"><div className="grid grid-cols-2 gap-4"><FormField control={form.control} name={`locations.${index}.address`} render={({ field }) => <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>} /><FormField control={form.control} name={`locations.${index}.city`} render={({ field }) => <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>} /><FormField control={form.control} name={`locations.${index}.state`} render={({ field }) => <FormItem><FormLabel>State/Province</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>} /><FormField control={form.control} name={`locations.${index}.country`} render={({ field }) => <FormItem><FormLabel>Country</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger></FormControl><SelectContent>{countries.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage/></FormItem>} /></div><Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => remove(index)}><Trash className="h-4 w-4 text-destructive" /></Button></Card>
                                ))}
                                <Button type="button" variant="outline" onClick={() => append({ address: '', city: '', state: '', country: 'IN' })}>Add Location</Button>
                                </div>
                            )}
                            <FormMessage>{form.formState.errors.locations?.message}</FormMessage>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1 space-y-8">
                     <Card>
                        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Visibility</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select><FormMessage/></FormItem>
                            )} />
                             {appUser?.roles?.admin && (
                                 <FormField control={form.control} name="verified" render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4"><div className="space-y-0.5"><FormLabel>Verified</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                                )} />
                             )}
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

    