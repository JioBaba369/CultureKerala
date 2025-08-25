
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
import { CalendarIcon, Save, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/firebase/auth";

const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(120, "Title must not be longer than 120 characters."),
  summary: z.string().max(240, "Summary must not be longer than 240 characters.").optional(),
  startsAt: z.date({ required_error: "A start date is required." }),
  endsAt: z.date({ required_error: "An end date is required." }),
  timezone: z.string().min(1, "Timezone is required."),
  isOnline: z.boolean().default(false),
  venue: z.object({
      name: z.string().optional(),
      address: z.string().optional(),
  }).optional(),
  meetingLink: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
  ticketing: z.object({
    type: z.enum(['free','paid','external']),
    priceMin: z.coerce.number().optional(),
  }),
  status: z.enum(['draft','published']),
  coverURL: z.any().optional(), // For file uploads
}).refine(data => data.endsAt > data.startsAt, {
    message: "End date must be after the start date.",
    path: ["endsAt"],
});

type EventFormValues = z.infer<typeof eventFormSchema>;


export default function CreateEventPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      summary: "",
      timezone: "Australia/Sydney",
      isOnline: false,
      ticketing: {
          type: 'free',
      },
      status: 'published',
    },
  });

  const isOnline = form.watch("isOnline");
  const ticketType = form.watch("ticketing.type");

  async function onSubmit(data: EventFormValues) {
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in."});
        return;
    }

    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const locationString = data.isOnline ? "Online" : `${data.venue?.name}, ${data.venue?.address}`;

    try {
      await addDoc(collection(db, "events"), {
        // Identity
        title: data.title,
        slug: slug,
        summary: data.summary || "",
        coverURL: "https://placehold.co/1200x600.png",
        
        // Timing
        startsAt: Timestamp.fromDate(data.startsAt),
        endsAt: Timestamp.fromDate(data.endsAt),
        timezone: data.timezone,
        
        // Location
        isOnline: data.isOnline,
        venue: data.isOnline ? null : data.venue,
        meetingLink: data.isOnline ? data.meetingLink : null,
        
        // Ticketing
        ticketing: {
            type: data.ticketing.type,
            provider: data.ticketing.type === 'paid' ? 'stripe' : null,
            priceMin: data.ticketing.priceMin || 0,
        },
        
        // Relationships
        organizers: [user.uid],
        
        // Moderation & Status
        status: data.status,
        verified: false, // Default to not verified
        visibility: 'public',
        
        // System
        createdBy: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),

        // For compatibility with old structure
        category: "Event",
        description: data.summary,
        location: locationString,
        date: Timestamp.fromDate(data.startsAt),
        image: "https://placehold.co/600x400.png",
      });

      toast({
        title: "Event Created!",
        description: `The event "${data.title}" has been successfully created.`,
      });

      router.push('/admin/events');
      router.refresh();

    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem creating the event. Please try again.",
      });
    }
  }

  return (
     <div className="container mx-auto px-4 py-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold">Create Event</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Event</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Details</CardTitle>
                            <CardDescription>Fill in the main information for your event.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Diwali Gala 2025" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="summary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Summary</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="A brief summary (160-240 characters) for previews and SEO..." {...field} rows={3} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Date & Time</CardTitle>
                             <CardDescription>When is this event taking place?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
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
                            </div>
                             <FormField
                                control={form.control}
                                name="timezone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Timezone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Australia/Sydney" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Location</CardTitle>
                             <CardDescription>Where is the event?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="isOnline"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        This is an online event
                                      </FormLabel>
                                      <FormDescription>
                                        The event will be hosted virtually.
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              {isOnline ? (
                                <FormField
                                    control={form.control}
                                    name="meetingLink"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meeting Link</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://zoom.us/j/12345" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                              ) : (
                                  <div className="space-y-4">
                                     <FormField
                                        control={form.control}
                                        name="venue.name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Venue Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Olympic Park" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="venue.address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Venue Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Sydney Olympic Park" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                  </div>
                              )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ticketing</CardTitle>
                             <CardDescription>How will attendees RSVP or get tickets?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                              <FormField
                                control={form.control}
                                name="ticketing.type"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ticket Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select ticket type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="free">Free RSVP</SelectItem>
                                            <SelectItem value="paid">Paid Ticket</SelectItem>
                                            <SelectItem value="external">External Link</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            {ticketType === 'paid' && (
                                <FormField
                                    control={form.control}
                                    name="ticketing.priceMin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price (starts at)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="e.g., 1500" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
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
                            <CardTitle>Cover Image</CardTitle>
                            <CardDescription>Upload a high-quality image for your event.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <FormField
                                control={form.control}
                                name="coverURL"
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
