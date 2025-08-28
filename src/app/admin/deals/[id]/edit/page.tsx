
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { CalendarIcon, Save, ArrowLeft, TicketPercent } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { doc, getDoc, updateDoc, Timestamp, collection, getDocs, query, where, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import type { Deal, Business } from "@/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";
import { useAuth } from "@/lib/firebase/auth";
import { ImageUploader } from "@/components/ui/image-uploader";

const dealFormSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(1000),
  businessId: z.string().min(1, "You must select a business."),
  status: z.enum(['draft','published', 'archived']),
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


type PageProps = {
  params: Promise<{ id: string }>;
};

export default function EditDealPage({ params }: PageProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [dealId, setDealId] = useState<string>('');

  useEffect(() => {
    params.then(({ id }) => setDealId(id));
  }, [params]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
  });

   useEffect(() => {
    if (!user || !dealId) return;

    const fetchPrereqs = async () => {
        try {
            const bizRef = collection(db, 'businesses');
            const q = query(bizRef, where('ownerId', '==', user.uid));
            const bizSnapshot = await getDocs(q);
            setBusinesses(bizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business)));

            const dealRef = doc(db, "deals", dealId);
            const dealSnap = await getDoc(dealRef);
            if (dealSnap.exists()) {
                const data = dealSnap.data() as DocumentData as Deal;
                form.reset({
                    ...data,
                    startsAt: data.startsAt.toDate(),
                    endsAt: data.endsAt.toDate(),
                    images: data.images || []
                });
            } else {
                toast({ variant: "destructive", title: "Not Found", description: "Deal not found." });
                router.push('/admin/deals');
            }
        } catch (error) {
           console.error("Error fetching data:", error)
           toast({ variant: "destructive", title: "Error", description: "Failed to fetch deal details." });
        } finally {
            setLoading(false);
        }
    }
    
    fetchPrereqs();
  }, [dealId, form, router, toast, user]);


  async function onSubmit(data: DealFormValues) {
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const business = businesses.find(b => b.id === data.businessId);
    const cities = business?.cities || [];

    try {
      const docRef = doc(db, "deals", dealId);
      await updateDoc(docRef, {
        ...data,
        slug: slug,
        cities: cities,
        startsAt: Timestamp.fromDate(data.startsAt),
        endsAt: Timestamp.fromDate(data.endsAt),
        updatedAt: Timestamp.now(),
      });

      toast({
        title: "Deal Updated!",
        description: `The deal "${data.title}" has been successfully updated.`,
      });

      router.push('/admin/deals');
      router.refresh();

    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem updating the deal.",
      });
    }
  }

  if (loading) {
    return <FormSkeleton />;
  }

  return (
     <div className="container mx-auto px-4 py-8">
       <Button variant="outline" asChild className="mb-4">
        <Link href="/admin/deals"><ArrowLeft /> Back to Deals</Link>
      </Button>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><TicketPercent /> Edit Deal</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
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
                                    <Select onValueChange={field.onChange} value={field.value}>
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
                                <FormItem><FormLabel>Visibility</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select><FormMessage/></FormItem>
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
