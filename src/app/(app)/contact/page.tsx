'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(1000),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;


export default function ContactPage() {
    const { toast } = useToast();

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    function onSubmit(data: ContactFormValues) {
        console.log("Contact form submitted:", data);
        toast({
            title: "Message Sent!",
            description: "Thank you for contacting us. We will get back to you shortly.",
        });
        form.reset();
    }

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-primary">
                        Get in Touch
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                        We're here to help and answer any question you might have. We look forward to hearing from you!
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto mt-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Send us a Message</CardTitle>
                            <CardDescription>Fill out the form and we'll get back to you as soon as possible.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Your Name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="your.email@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="What is your message about?" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Message</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Your message here..." {...field} rows={6} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                        <Send className="mr-2 h-4 w-4" />
                                        {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col justify-center space-y-6">
                        <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
                            <Mail className="h-8 w-8 text-primary mt-1" />
                            <div>
                                <h3 className="text-xl font-headline font-semibold">Email Us</h3>
                                <p className="text-muted-foreground">For general inquiries, partnership opportunities, or support.</p>
                                <a href="mailto:support@dilsepass.com" className="text-primary font-medium hover:underline mt-2 inline-block">
                                    support@dilsepass.com
                                </a>
                            </div>
                        </div>
                         <div className="p-6 bg-card rounded-lg border">
                             <h3 className="text-xl font-headline font-semibold">Our Office</h3>
                              <p className="text-muted-foreground">
                                123 Community Lane<br />
                                Bangalore, KA 560001<br />
                                India
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}