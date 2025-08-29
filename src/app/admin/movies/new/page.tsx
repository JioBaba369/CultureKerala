
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
import { CalendarIcon, Save, Film, Trash, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { ImageUploader } from "@/components/ui/image-uploader";


const screeningSchema = z.object({
    startsAt: z.date(),
    city: z.string().min(1, "City is required."),
    cinemaName: z.string().min(1, "Cinema name is required."),
    bookingUrl: z.string().url("Must be a valid URL."),
});

const movieFormSchema = z.object({
  title: z.string().min(3).max(120),
  overview: z.string().min(10).max(2000),
  status: z.enum(['upcoming', 'now_showing', 'archived']).default('now_showing'),
  releaseDate: z.date(),
  posterURL: z.string().url().optional().or(z.literal('')),
  backdropURL: z.string().url().optional().or(z.literal('')),
  genres: z.string().min(1, "At least one genre is required."),
  languages: z.string().min(1, "At least one language is required."),
  screenings: z.array(screeningSchema).optional(),
});

type MovieFormValues = z.infer<typeof movieFormSchema>;

export default function CreateMoviePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {
      releaseDate: new Date(),
    },
  });

   const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "screenings"
  });

  async function onSubmit(data: MovieFormValues) {
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to create a movie."});
        return;
    }

    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
      await addDoc(collection(db, "movies"), {
        ...data,
        slug: slug,
        releaseDate: Timestamp.fromDate(data.releaseDate),
        genres: data.genres.split(',').map(s => s.trim()),
        languages: data.languages.split(',').map(s => s.trim()),
        screenings: data.screenings?.map(s => ({...s, startsAt: Timestamp.fromDate(s.startsAt)})),
        createdBy: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      toast({ title: "Movie Created!", description: `The movie "${data.title}" has been successfully created.` });
      router.push('/admin/movies');
      router.refresh();

    } catch (error) {
      console.error("Error adding document: ", error);
      toast({ variant: "destructive", title: "Error", description: "There was a problem creating the movie." });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><Film /> Create Movie</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Movie</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Movie Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Manichitrathazhu" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="overview" render={({ field }) => (<FormItem><FormLabel>Overview</FormLabel><FormControl><Textarea placeholder="A brief synopsis of the movie..." {...field} rows={6} /></FormControl><FormMessage /></FormItem>)} />
                             <div className="grid sm:grid-cols-2 gap-4">
                               <FormField control={form.control} name="genres" render={({ field }) => (<FormItem><FormLabel>Genres</FormLabel><FormControl><Input placeholder="Drama, Thriller" {...field} /></FormControl><FormDescription>Comma-separated.</FormDescription><FormMessage /></FormItem>)} />
                               <FormField control={form.control} name="languages" render={({ field }) => (<FormItem><FormLabel>Languages</FormLabel><FormControl><Input placeholder="Malayalam, English" {...field} /></FormControl><FormDescription>Comma-separated.</FormDescription><FormMessage /></FormItem>)} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Screenings</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {fields.map((field, index) => (
                                <Card key={field.id} className="relative p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name={`screenings.${index}.cinemaName`} render={({ field }) => <FormItem><FormLabel>Cinema</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>} />
                                        <FormField control={form.control} name={`screenings.${index}.city`} render={({ field }) => <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>} />
                                        <FormField control={form.control} name={`screenings.${index}.startsAt`} render={({ field }) => (
                                            <FormItem className="flex flex-col"><FormLabel>Screening Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name={`screenings.${index}.bookingUrl`} render={({ field }) => <FormItem><FormLabel>Booking URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>} />
                                    </div>
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}><Trash className="h-4 w-4 text-destructive" /></Button>
                                </Card>
                            ))}
                            <Button type="button" variant="outline" onClick={() => append({ cinemaName: '', city: '', startsAt: new Date(), bookingUrl: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add Screening</Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1 space-y-8">
                     <Card>
                        <CardHeader><CardTitle>Status & Release</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="upcoming">Upcoming</SelectItem><SelectItem value="now_showing">Now Showing</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select><FormMessage/></FormItem>
                            )} />
                             <FormField control={form.control} name="releaseDate" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Release Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Poster (Portrait)</CardTitle></CardHeader>
                        <CardContent>
                            <FormField control={form.control} name="posterURL" render={({ field }) => (
                                <FormItem><FormControl><ImageUploader fieldName="posterURL" aspect={2/3} imageUrl={form.getValues("posterURL")} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Backdrop (Landscape)</CardTitle></CardHeader>
                        <CardContent>
                            <FormField control={form.control} name="backdropURL" render={({ field }) => (
                                <FormItem><FormControl><ImageUploader fieldName="backdropURL" aspect={16/9} imageUrl={form.getValues("backdropURL")} /></FormControl><FormMessage /></FormItem>
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
