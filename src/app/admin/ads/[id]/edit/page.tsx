
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
import { useToast } from "@/hooks/use-toast";
import { Save, Megaphone, CalendarIcon, ArrowLeft } from "lucide-react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import type { Ad } from "@/types";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";

const adFormSchema = z.object({
  title: z.string().min(2).max(100),
  status: z.enum(['draft', 'approved', 'running', 'paused', 'archived']),
  advertiserType: z.enum(['house', 'business', 'community', 'external']),
  
  creative: z.object({
    type: z.enum(['native_entity', 'image', 'html', 'video']),
    imageURL: z.string().url().optional().or(z.literal('')),
    cta: z.object({
      label: z.string().min(1),
      url: z.string().url().optional().or(z.literal('')),
    }),
  }),
  
  placements: z.string().min(1, "At least one placement is required"),
  
  target: z.object({
    cities: z.string().optional(),
    categories: z.string().optional(),
    clubOnly: z.boolean().default(false),
  }),

  schedule: z.object({
    startAt: z.date(),
    endAt: z.date(),
  }),

  priority: z.coerce.number().min(1).max(10),
  featured: z.object({
    isFeatured: z.boolean().default(false),
  })
}).refine(data => data.schedule.endAt > data.schedule.startAt, {
    message: "End date must be after the start date.",
    path: ["schedule.endAt"],
});

type AdFormValues = z.infer<typeof adFormSchema>;

type Props = {
    params: { id: string };
};

export default function EditAdPage({ params }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const adId = params.id;
  const [loading, setLoading] = useState(true);

  const form = useForm<AdFormValues>({
    resolver: zodResolver(adFormSchema),
  });

  useEffect(() => {
    if (adId) {
      const fetchAd = async () => {
        setLoading(true);
        try {
          const docRef = doc(db, "ads", adId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Ad;
            form.reset({
                ...data,
                placements: data.placements.join(', '),
                target: {
                    ...data.target,
                    cities: data.target.cities?.join(', '),
                    categories: data.target.categories?.join(', '),
                    clubOnly: data.target?.clubOnly || false,
                },
                schedule: {
                    startAt: data.schedule.startAt.toDate(),
                    endAt: data.schedule.endAt.toDate(),
                },
                featured: {
                  isFeatured: data.featured?.isFeatured || false,
                }
            });
          } else {
             toast({ variant: "destructive", title: "Not Found", description: "Ad not found." });
             router.push('/admin/ads');
          }
        } catch (error) {
           console.error("Error fetching document:", error)
           toast({ variant: "destructive", title: "Error", description: "Failed to fetch ad details." });
        } finally {
          setLoading(false);
        }
      }
      fetchAd();
    }
  }, [adId, form, router, toast]);

  async function onSubmit(data: AdFormValues) {
    try {
      const docRef = doc(db, "ads", adId);
      await updateDoc(docRef, {
        ...data,
        placements: data.placements.split(',').map(s => s.trim()),
        target: {
            ...data.target,
            cities: data.target.cities?.split(',').map(s => s.trim()),
            categories: data.target.categories?.split(',').map(s => s.trim()),
        },
        schedule: {
            startAt: Timestamp.fromDate(data.schedule.startAt),
            endAt: Timestamp.fromDate(data.schedule.endAt),
        },
        updatedAt: Timestamp.now(),
      });

      toast({ title: "Ad Updated!", description: `The ad "${data.title}" has been updated.` });
      router.push('/admin/ads');
      router.refresh();

    } catch (error) {
      console.error("Error updating document: ", error);
      toast({ variant: "destructive", title: "Error", description: "There was a problem updating the ad." });
    }
  }

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
       <Button variant="outline" asChild className="mb-4">
        <Link href="/admin/ads"><ArrowLeft /> Back to Ads</Link>
      </Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><Megaphone /> Edit Ad</h1>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Changes</>}
            </Button>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Core Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Ad Title</FormLabel><FormControl><Input placeholder="e.g., Early Bird Diwali Tickets" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="running">Running</SelectItem><SelectItem value="paused">Paused</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select><FormMessage/></FormItem>
                  )} />
                  <FormField control={form.control} name="advertiserType" render={({ field }) => (
                    <FormItem><FormLabel>Advertiser Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="house">House</SelectItem><SelectItem value="business">Business</SelectItem><SelectItem value="community">Community</SelectItem><SelectItem value="external">External</SelectItem></SelectContent></Select><FormMessage/></FormItem>
                  )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Creative</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <FormField control={form.control} name="creative.type" render={({ field }) => (
                        <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="native_entity">Native Entity</SelectItem><SelectItem value="image">Image</SelectItem></SelectContent></Select><FormMessage/></FormItem>
                    )} />
                    <FormField control={form.control} name="creative.imageURL" render={({ field }) => (
                        <FormItem><FormLabel>Image URL (for non-native)</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="creative.cta.label" render={({ field }) => (
                        <FormItem><FormLabel>CTA Label</FormLabel><FormControl><Input placeholder="Learn More" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Targeting & Placement</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                   <FormField control={form.control} name="placements" render={({ field }) => (
                        <FormItem><FormLabel>Placements</FormLabel><FormControl><Input placeholder="e.g., home_feed, events_list_inline" {...field} /></FormControl><FormDescription>Comma-separated list of placement keys.</FormDescription><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="target.cities" render={({ field }) => (
                        <FormItem><FormLabel>Target Cities</FormLabel><FormControl><Input placeholder="e.g., sydney, melbourne" {...field} /></FormControl><FormDescription>Comma-separated list. Leave blank for all.</FormDescription><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="target.categories" render={({ field }) => (
                        <FormItem><FormLabel>Target Categories</FormLabel><FormControl><Input placeholder="e.g., festival, food" {...field} /></FormControl><FormDescription>Comma-separated list. Leave blank for all.</FormDescription><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="target.clubOnly" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><FormLabel>Club Members Only</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )} />
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1 space-y-8">
                <Card>
                    <CardHeader><CardTitle>Schedule & Priority</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="schedule.startAt" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="schedule.endAt" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="priority" render={({ field }) => (
                            <FormItem><FormLabel>Priority (1-10)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="featured.isFeatured" render={({ field }) => (
                           <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><FormLabel>Featured</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                        )} />
                    </CardContent>
                </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
