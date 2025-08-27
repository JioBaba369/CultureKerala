
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
import { CalendarIcon, Save, ArrowLeft, Trash, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { doc, getDoc, updateDoc, Timestamp, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import type { Event as EventType, TicketTier, Community } from "@/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { nanoid } from "nanoid";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";
import { useAuth } from "@/lib/firebase/auth";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/ui/image-uploader";

const ticketTierSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  quantityTotal: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  quantityAvailable: z.coerce.number().int(),
  description: z.string().optional(),
});


const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(120, "Title must not be longer than 120 characters."),
  communityId: z.string().optional(),
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
    externalUrl: z.string().url().optional().or(z.literal('')),
    tiers: z.array(ticketTierSchema).optional(),
  }),
  status: z.enum(['draft','published', 'archived']),
  visibility: z.enum(['public', 'unlisted']),
  coverURL: z.string().url("A cover image is required.").min(1, "A cover image is required."),
}).refine(data => data.endsAt > data.startsAt, {
    message: "End date must be after the start date.",
    path: ["endsAt"],
});

type EventFormValues = z.infer<typeof eventFormSchema>;

type Props = {
    params: {
        id: string;
    };
};

export default function EditEventPage({ params }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const eventId = params.id;
  const { user, appUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState<Community[]>([]);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
        ticketing: {
            tiers: []
        }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ticketing.tiers",
  });

  const isOnline = form.watch("isOnline");
  const ticketType = form.watch("ticketing.type");

  useEffect(() => {
    if (!user || !appUser) return;
    
    if (!appUser.roles.admin && !appUser.roles.organizer) {
        toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "You do not have permission to edit this event.",
        });
        router.push('/admin');
        return;
    }

    const fetchCommunities = async () => {
        const communitiesRef = collection(db, 'communities');
        const q = appUser.roles.admin 
            ? communitiesRef 
            : query(communitiesRef, where('roles.owners', 'array-contains', user.uid));
        
        const snapshot = await getDocs(q);
        setCommunities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Community)));
    }

    const fetchEvent = async () => {
        try {
          const docRef = doc(db, "events", eventId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as EventType;
            // Convert Firestore Timestamps to JS Dates for the form
            const formData = {
                ...data,
                startsAt: data.startsAt.toDate(),
                endsAt: data.endsAt.toDate(),
                ticketing: {
                    ...data.ticketing,
                    tiers: data.ticketing?.tiers || []
                }
            };
            form.reset(formData);
          } else {
             toast({ variant: "destructive", title: "Not Found", description: "Event not found." });
             router.push('/admin/events');
          }
        } catch (error) {
           console.error("Error fetching document:", error)
           toast({ variant: "destructive", title: "Error", description: "Failed to fetch event details." });
        } finally {
          setLoading(false);
        }
    }

    Promise.all([fetchCommunities(), fetchEvent()]);
  }, [eventId, form, router, toast, user, appUser]);

  async function onSubmit(data: EventFormValues) {
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
      const docRef = doc(db, "events", eventId);
      await updateDoc(docRef, {
        ...data,
        slug: slug,
        startsAt: Timestamp.fromDate(data.startsAt),
        endsAt: Timestamp.fromDate(data.endsAt),
        venue: data.isOnline ? null : data.venue,
        meetingLink: data.isOnline ? data.meetingLink : null,
        communityId: data.communityId === 'none' ? null : data.communityId,
        ticketing: {
            ...data.ticketing,
            provider: data.ticketing.type === 'paid' ? 'stripe' : null,
            externalUrl: data.ticketing.type === 'external' ? data.ticketing.externalUrl : null,
        },
        updatedAt: Timestamp.now(),
      });

      toast({
        title: "Event Updated!",
        description: `The event "${data.title}" has been successfully updated.`,
      });

      router.push('/admin/events');
      router.refresh();

    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem updating the event. Please try again.",
      });
    }
  }

  if (loading) {
    return <FormSkeleton />;
  }
  
  const addTicketTier = () => {
    append({
        id: nanoid(),
        name: "General Admission",
        price: 0,
        quantityTotal: 100,
        quantityAvailable: 100,
        description: "",
    })
  }

  return (
     <div className="container mx-auto px-4 py-8">
       <Button variant="outline" asChild className="mb-4">
        <Link href="/admin/events"><ArrowLeft /> Back to Events</Link>
      </Button>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold">Edit Event</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Changes</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Details</CardTitle>
                            <CardDescription>Update the main information for your event.</CardDescription>
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
                                name="communityId"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Community</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a community (optional)" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">No community affiliation</SelectItem>
                                        {communities.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormDescription>Link this event to a community you own.</FormDescription>
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
                                    <Select onValueChange={field.onChange} value={field.value}>
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
                             {ticketType === 'external' && (
                                <FormField
                                    control={form.control}
                                    name="ticketing.externalUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>External URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com/tickets" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                             {ticketType === 'paid' && (
                                <div className="space-y-4">
                                    <Label>Ticket Tiers</Label>
                                    {fields.map((field, index) => (
                                    <Card key={field.id} className="relative p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`ticketing.tiers.${index}.name`}
                                            render={({ field }) => <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>}
                                        />
                                         <FormField
                                            control={form.control}
                                            name={`ticketing.tiers.${index}.price`}
                                            render={({ field }) => <FormItem><FormLabel>Price (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>}
                                        />
                                         <FormField
                                            control={form.control}
                                            name={`ticketing.tiers.${index}.quantityTotal`}
                                            render={({ field }) => <FormItem><FormLabel>Total Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`ticketing.tiers.${index}.description`}
                                            render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>}
                                        />
                                        </div>
                                         <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                                            <Trash className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </Card>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={addTicketTier}><PlusCircle /> Add Tier</Button>
                                </div>
                             )}
                        </CardContent>
                    </Card>

                </div>
                <div className="md:col-span-1 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Status & Visibility</CardTitle>
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
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        'Draft' items are not visible to the public. 'Archived' items are hidden from all views.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Visibility</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select visibility" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="unlisted">Unlisted</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        'Unlisted' events are only accessible via a direct link.
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
                                            <ImageUploader fieldName="coverURL" imageUrl={form.getValues("coverURL")} />
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
      </FormProvider>
    </div>
  );
}
