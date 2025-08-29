
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Phone, ArrowLeft } from "lucide-react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { EmergencyContact } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";
import { countriesData } from "@/lib/data/countries";
import { indiaStatesData } from "@/lib/data/india-states";

const emergencyContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
  phone: z.string().min(5, "A valid phone number is required."),
  category: z.enum(['police', 'ambulance', 'fire', 'consulate', 'other']),
  country: z.string().min(1, "Country is required."),
  state: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().max(500).optional(),
});

type EmergencyContactFormValues = z.infer<typeof emergencyContactFormSchema>;

export default function EditEmergencyContactPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const contactId = params.id;
  const [loading, setLoading] = useState(true);

  const form = useForm<EmergencyContactFormValues>({
    resolver: zodResolver(emergencyContactFormSchema),
  });

  const selectedCountry = form.watch("country");

  useEffect(() => {
    if (contactId) {
      const fetchContact = async () => {
        try {
          const docRef = doc(db, "emergency_contacts", contactId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as EmergencyContact;
            form.reset(data);
          } else {
             toast({ variant: "destructive", title: "Not Found", description: "Contact not found." });
             router.push('/admin/PlatformAdmin/emergency-contacts');
          }
        } catch (error) {
           console.error("Error fetching document:", error)
           toast({ variant: "destructive", title: "Error", description: "Failed to fetch contact details." });
        } finally {
          setLoading(false);
        }
      }
      fetchContact();
    }
  }, [contactId, form, router, toast]);

  async function onSubmit(data: EmergencyContactFormValues) {
    try {
      const docRef = doc(db, "emergency_contacts", contactId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });

      toast({
        title: "Contact Updated!",
        description: `The contact "${data.name}" has been successfully updated.`,
      });

      router.push('/admin/PlatformAdmin/emergency-contacts');
      router.refresh();

    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem updating the contact. Please try again.",
      });
    }
  }

  if (loading) {
    return <FormSkeleton />;
  }

  return (
     <div className="container mx-auto px-4 py-8">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/admin/PlatformAdmin/emergency-contacts"><ArrowLeft /> Back to Contacts</Link>
      </Button>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold flex items-center gap-2"><Phone /> Edit Emergency Contact</h1>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : <><Save /> Save Changes</>}
                </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Contact Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., National Police" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 100" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="police">Police</SelectItem>
                                    <SelectItem value="ambulance">Ambulance</SelectItem>
                                    <SelectItem value="fire">Fire</SelectItem>
                                    <SelectItem value="consulate">Consulate / Embassy</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Any important details or instructions..." {...field} rows={4} />
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
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a country" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {countriesData.map(country => (
                                                <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {selectedCountry === 'IN' && (
                             <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State (India)</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a state" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {indiaStatesData.map(state => (
                                                    <SelectItem key={state.code} value={state.code}>{state.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                         <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Kochi" {...field} />
                                    </FormControl>
                                    <FormDescription>Leave blank if this contact applies to the whole state/country.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            </div>
        </form>
      </FormProvider>
    </div>
  );
}
