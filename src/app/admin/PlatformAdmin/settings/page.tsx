
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
import { toast } from "@/hooks/use-toast";
import { Github, Save, X, Facebook, Instagram, Linkedin } from "lucide-react";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useEffect } from "react";

const settingsFormSchema = z.object({
  name: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }).max(50, {
    message: "Site name must not be longer than 50 characters.",
  }),
  description: z.string().max(250, {
    message: "Description must not be longer than 250 characters.",
  }).optional(),
  links: z.object({
    x: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    github: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    facebook: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    instagram: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    linkedin: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  }),
  mission: z.string().max(500).optional(),
  vision: z.string().max(500).optional(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const [config, setConfig] = useSiteConfig();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      name: config.name || "",
      description: config.description || "",
      links: {
        x: config.links?.x || "",
        github: config.links?.github || "",
        facebook: config.links?.facebook || "",
        instagram: config.links?.instagram || "",
        linkedin: config.links?.linkedin || "",
      },
      mission: config.mission || "",
      vision: config.vision || "",
    },
  });

  useEffect(() => {
    if (config) {
        form.reset({
            name: config.name,
            description: config.description,
            links: {
                x: config.links?.x || "",
                github: config.links?.github || "",
                facebook: config.links?.facebook || "",
                instagram: config.links?.instagram || "",
                linkedin: config.links?.linkedin || "",
            },
            mission: config.mission,
            vision: config.vision,
        });
    }
  }, [config, form]);


  function onSubmit(data: SettingsFormValues) {
    setConfig({
        ...config,
        ...data,
    });
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
            <Button type="submit">
              <Save /> Save Changes
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
                            rows={3}
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
                    <CardTitle>Mission & Vision</CardTitle>
                    <CardDescription>Update your site's mission and vision statements.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <FormField
                    control={form.control}
                    name="mission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mission</FormLabel>
                        <FormControl>
                           <Textarea placeholder="Your mission statement..." {...field} rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="vision"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vision</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your vision statement..." {...field} rows={4} />
                        </FormControl>
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
                    name="links.x"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X</FormLabel>
                         <FormControl>
                            <div className="relative flex items-center">
                                <X className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="https://x.com/your-profile" {...field} className="pl-9" />
                            </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="links.github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub</FormLabel>
                         <FormControl>
                            <div className="relative flex items-center">
                                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="https://github.com/your-org" {...field} className="pl-9" />
                            </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="links.facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                         <FormControl>
                            <div className="relative flex items-center">
                                <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="https://facebook.com/your-profile" {...field} className="pl-9" />
                            </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="links.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                         <FormControl>
                            <div className="relative flex items-center">
                                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="https://instagram.com/your-profile" {...field} className="pl-9" />
                            </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="links.linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                         <FormControl>
                            <div className="relative flex items-center">
                                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="https://linkedin.com/in/your-profile" {...field} className="pl-9" />
                            </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              {/* Future sidebar content can go here */}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
