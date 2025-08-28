
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Sparkles, ArrowLeft } from "lucide-react";
import { doc, getDoc, updateDoc, Timestamp, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ImageUploader } from "@/components/ui/image-uploader";
import { useEffect, useState } from "react";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";
import type { Reward } from "@/types";
import Link from "next/link";

type PageProps = {
  params: { id: string };
};

const rewardFormSchema = z.object({
  title: z.string().min(2, "Name must be at least 2 characters.").max(100),
  description: z.string().max(1000).optional(),
  terms: z.string().max(2000).optional(),
  type: z.enum(['voucher', 'discount', 'ticket', 'merch', 'badge']),
  pointsCost: z.coerce.number().int().min(0),
  inventory: z.coerce.number().int().optional(),
  status: z.enum(['active', 'archived']),
  imageURL: z.string().url().min(1, "A representative image is required."),
  validFrom: z.date().optional(),
  validTo: z.date().optional(),
});

type RewardFormValues = z.infer<typeof rewardFormSchema>;

export default function EditRewardPage({ params }: PageProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const rewardId = params.id;
  const [loading, setLoading] = useState(true);

  const form = useForm<RewardFormValues>({
    resolver: zodResolver(rewardFormSchema),
  });

  useEffect(() => {
    if (rewardId) {
      const fetchReward = async () => {
        setLoading(true);
        try {
          const docRef = doc(db, "rewards", rewardId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as DocumentData as Reward;
            form.reset({
                ...data,
                validFrom: data.validFrom?.toDate(),
                validTo: data.validTo?.toDate(),
            });
          } else {
             toast({ variant: "destructive", title: "Not Found", description: "Reward not found." });
             router.push('/admin/PlatformAdmin/rewards');
          }
        } catch (error) {
           console.error("Error fetching document:", error)
           toast({ variant: "destructive", title: "Error", description: "Failed to fetch reward details." });
        } finally {
          setLoading(false);
        }
      }
      fetchReward();
    }
  }, [rewardId, form, router, toast]);

  async function onSubmit(data: RewardFormValues) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to update a reward.",
        });
        return;
    }

    try {
      const docRef = doc(db, "rewards", rewardId);
      await updateDoc(docRef, {
        ...data,
        inventory: data.inventory ?? null,
        validFrom: data.validFrom ? Timestamp.fromDate(data.validFrom) : null,
        validTo: data.validTo ? Timestamp.fromDate(data.validTo) : null,
        updatedAt: Timestamp.now(),
      });

      toast({
        title: "Reward Updated!",
        description: `The reward "${data.title}" has been successfully updated.`,
      });

      router.push('/admin/PlatformAdmin/rewards');
      router.refresh();

    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem updating the reward. Please try again.",
      });
    }
  }
  
  if (loading) {
    return <FormSkeleton />;
  }

  return (
     <div className="container mx-auto px-4 py-8">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/admin/PlatformAdmin/rewards"><ArrowLeft /> Back to Rewards</Link>
      </Button>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><Sparkles /> Edit Reward</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Changes</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reward Details</CardTitle>
                            <CardDescription>Update the information for this reward.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 20% off tickets" {...field} />
                                        </FormControl>
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
                                            <Textarea placeholder="A short description of the reward." {...field} rows={3} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="terms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Terms & Conditions</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Any terms, conditions, or instructions for redemption." {...field} rows={5} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="voucher">Voucher</SelectItem>
                                        <SelectItem value="discount">Discount</SelectItem>
                                        <SelectItem value="ticket">Ticket</SelectItem>
                                        <SelectItem value="merch">Merch</SelectItem>
                                        <SelectItem value="badge">Badge</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="pointsCost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Points Cost</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="200" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="inventory"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Inventory</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="100" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}/>
                                        </FormControl>
                                        <FormDescription>Leave blank for unlimited.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Validity</CardTitle></CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="validFrom"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Valid From (optional)</FormLabel>
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
                                name="validTo"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Valid To (optional)</FormLabel>
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
                                        <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        'Archived' rewards are not visible to users.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                                />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Reward Image</CardTitle>
                            <CardDescription>Upload a representative image.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <FormField
                                control={form.control}
                                name="imageURL"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <ImageUploader fieldName="imageURL" imageUrl={form.getValues("imageURL")} />
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
