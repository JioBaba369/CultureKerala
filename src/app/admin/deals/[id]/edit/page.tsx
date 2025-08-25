
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
import { Save, ArrowLeft, CalendarIcon } from "lucide-react";
import { doc, getDoc, updateDoc, Timestamp, collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { Deal, Business } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";


const dealFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters.").max(100),
  businessId: z.string().min(1, "Business is required."),
  description: z.string().max(1000).optional(),
  startsAt: z.date({ required_error: "A start date is required." }),
  endsAt: z.date({ required_error: "An end date is required." }),
  mode: z.enum(['in_store', 'online', 'both']),
  couponCode: z.string().optional(),
  status: z.enum(['draft', 'published', 'expired']),
}).refine(data => data.endsAt > data.startsAt, {
    message: "End date must be after the start date.",
    path: ["endsAt"],
});

type DealFormValues = z.infer<typeof dealFormSchema>;


export default function EditDealPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const dealId = params.id;
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
  });

   useEffect(() => {
    const fetchBusinesses = async () => {
        // In a real app, this might be filtered by owner
        const q = query(collection(db, 'businesses'));
        const querySnapshot = await getDocs(q);
        setBusinesses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business)));
    };
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (dealId) {
      const fetchDeal = async () => {
        try {
          const docRef = doc(db, "deals", dealId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Deal;
            form.reset({
                ...data,
                startsAt: data.startsAt.toDate(),
                endsAt: data.endsAt.toDate(),
            });
          } else {
             toast({ variant: "destructive", title: "Not Found", description: "Deal not found." });
             router.push('/admin/deals');
          }
        } catch (error) {
           console.error("Error fetching document:", error)
           toast({ variant: "destructive", title: "Error", description: "Failed to fetch deal details." });
        } finally {
          setLoading(false);
        }
      }
      fetchDeal();
    }
  }, [dealId, form, router, toast]);

  async function onSubmit(data: DealFormValues) {
    try {
      const docRef = doc(db, "deals", dealId);
      await updateDoc(docRef, {
        ...data,
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
        description: "There was a problem updating the deal. Please try again.",
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
        <Link href="/admin/deals"><ArrowLeft /> Back to Deals</Link>
      </Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold">Edit Deal</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Changes</>}
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
                                        {businesses.map(b => <SelectItem key={b.id} value={b.id}>{b.displayName}</SelectItem>)}
                                    </SelectContent>
                                    </Select>
                                    <FormDescription>The deal will be associated with this business.</FormDescription>
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
                                            <Textarea placeholder="A detailed description..." {...field} rows={4} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Validity</CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-4">
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
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
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
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
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
                        <CardHeader>
                            <CardTitle>Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="mode"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Redemption Mode</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="in_store">In-Store</SelectItem>
                                    <SelectItem value="online">Online</SelectItem>
                                    <SelectItem value="both">Both</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="couponCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Coupon Code (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., LUNCH20" {...field} />
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
