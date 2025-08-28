
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Save, TicketPercent } from "lucide-react";
import { format, add } from "date-fns";
import { cn } from "@/lib/utils";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { ImageUploader } from "@/components/ui/image-uploader";
import type { Business } from "@/types";
import { useEffect, useState } from "react";

const dealFormSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(1000),
  businessId: z.string().min(1, "You must select a business."),
  status: z.enum(['draft','published', 'archived']).default('published'),
  startsAt: z.date(),
  endsAt: z.date(),
  images: z.array(z.string().url()).optional(),
  priceOriginal: z.coerce.number().optional(),
  priceDiscounted: z.coerce.number().optional(),
}).refine(data => data.endsAt > data.startsAt, {
    message: "End date must be after the start date.",
    path: ["endsAt"],
});

type DealFormValues = z.infer<typeof dealFormSchema>;

export default function CreateDealPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      startsAt: new Date(),
      endsAt: add(new Date(), { weeks: 1 }),
      images: [],
    },
  });

  useEffect(() => {
    if (!user) return;
    const fetchBusinesses = async () => {
        setLoading(true);
        try {
            const bizRef = collection(db, 'businesses');
            const q = query(bizRef, where('ownerId', '==', user.uid));
            const snapshot = await getDocs(q);
            setBusinesses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business)));
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch your businesses.'});
        } finally {
            setLoading(false);
        }
    };
    fetchBusinesses();
  }, [user, toast]);

  async function onSubmit(data: DealFormValues) {
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to create a deal."});
        return;
    }

    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const business = businesses.find(b => b.id === data.businessId);
    const cities = business?.cities || [];

    try {
      await addDoc(collection(db, "deals"), {
        ...data,
        slug: slug,
        cities: cities,
        startsAt: Timestamp.fromDate(data.startsAt),
        endsAt: Timestamp.fromDate(data.endsAt),
        createdBy: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      toast({ title: "Deal Created!", description: `The deal "${data.title}" has been successfully created.` });
      router.push('/admin/deals');
      router.refresh();

    } catch (error) {
      console.error("Error adding document: ", error);
      toast({ variant: "destructive", title: "Error", description: "There was a problem creating the deal." });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><TicketPercent /> Create Deal</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Deal</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Deal Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deal Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 20% Off Lunch" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="businessId"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a business" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {businesses.map(biz => <SelectItem key={biz.id} value={biz.id}>{biz.displayName}</SelectItem>)}
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
                                            <Textarea placeholder="Describe the deal..." {...field} rows={6} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="priceOriginal" render={({ field }) => (
                                <FormItem><FormLabel>Original Price (₹)</FormLabel><FormControl><Input type="number" placeholder="100.00" {...field} /></FormControl><FormMessage/></FormItem>
                            )} />
                            <FormField control={form.control} name="priceDiscounted" render={({ field }) => (
                                <FormItem><FormLabel>Discounted Price (₹)</FormLabel><FormControl><Input type="number" placeholder="80.00" {...field} /></FormControl><FormMessage/></FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Validity Dates</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormField
                                    control={form.control}
                                    name="startsAt"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                        <FormLabel>Start Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                variant={"outline"}
                                                className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                                                {field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="endsAt"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                        <FormLabel>End Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                variant={"outline"}
                                                className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                                                {field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1 space-y-8">
                     <Card>
                        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
                        <CardContent>
                             <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Visibility</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select><FormMessage/></FormItem>
                            )} />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Images</CardTitle></CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="images.0"
                                render={({ field }) => (
                                    <FormItem><FormLabel>Image</FormLabel><FormControl><ImageUploader fieldName="images.0" imageUrl={form.getValues("images.0")} /></FormControl><FormMessage /></FormItem>
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
