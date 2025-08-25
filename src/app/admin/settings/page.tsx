
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
import { siteConfig } from "@/config/site";
import { toast } from "@/hooks/use-toast";
import { Github, Save, Twitter } from "lucide-react";
import { ThemeCustomizer } from "./components/theme-customizer";

const settingsFormSchema = z.object({
  name: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }).max(50, {
    message: "Site name must not be longer than 50 characters.",
  }),
  description: z.string().max(250, {
    message: "Description must not be longer than 250 characters.",
  }).optional(),
  twitter: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  github: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      name: siteConfig.name,
      description: siteConfig.description,
      twitter: siteConfig.links.twitter,
      github: siteConfig.links.github,
    },
  });

  function onSubmit(data: SettingsFormValues) {
    // In a real app, you would update the site config here.
    // For now, we'll just log it and show a toast.
    console.log(data);
    toast({
      title: "Settings Saved!",
      description: "Your changes have been successfully saved.",
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-headline font-bold">Site Settings</h1>
            <Button type="submit" disabled={!form.formState.isDirty || !form.formState.isValid}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>
                    Update your site's public name and description.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input placeholder="DilSePass" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the name of your site. It will be displayed in the header and footer.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A brief description of your site."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                         <FormDescription>
                          A short description for SEO and social sharing.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>
                    Provide URLs to your social media profiles.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                         <FormControl>
                            <div className="relative">
                                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input placeholder="https://twitter.com/your-profile" {...field} className="pl-10" />
                            </div>
                        </FormControl>
                        <FormDescription>
                          Your official Twitter profile URL.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub</FormLabel>
                         <FormControl>
                            <div className="relative">
                                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input placeholder="https://github.com/your-org" {...field} className="pl-10" />
                            </div>
                        </FormControl>
                         <FormDescription>
                          Your organization or personal GitHub profile URL.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <ThemeCustomizer />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
