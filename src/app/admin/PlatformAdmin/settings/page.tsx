
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
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
import { Github, Save, X, Facebook, Instagram, Linkedin, Palette } from "lucide-react";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useEffect } from "react";
import { SiteConfig, themeSchema } from "@/config/site";
import { themes } from "@/config/theme";
import { ColorPicker } from "@/components/ui/color-picker";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useTheme } from "next-themes";


export default function SettingsPage() {
  const [config, setConfig] = useSiteConfig();
  const { setTheme: setMode } = useTheme();

  const form = useForm<SiteConfig>({
    resolver: zodResolver(themeSchema),
    defaultValues: config,
  });

  useEffect(() => {
    form.reset(config);
  }, [config, form]);


  function onSubmit(data: SiteConfig) {
    setConfig(data);
    setMode(data.theme);
    toast({
      title: "Settings Saved!",
      description: "Your changes have been successfully saved.",
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-headline font-bold">Site Settings</h1>
            <Button type="submit">
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
            <div className="lg:col-span-1 space-y-8">
               <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Palette/> Theme</CardTitle>
                    <CardDescription>Customize the look and feel of your site.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Theme</FormLabel>
                                <Select onValueChange={(value) => {
                                    field.onChange(value);
                                    const selectedTheme = themes.find((t) => t.name === value);
                                    if (selectedTheme) {
                                        form.setValue('colors.light.primary', selectedTheme.cssVars.light.primary);
                                        form.setValue('colors.light.background', selectedTheme.cssVars.light.background);
                                        form.setValue('colors.light.accent', selectedTheme.cssVars.light.accent);
                                        form.setValue('colors.dark.primary', selectedTheme.cssVars.dark.primary);
                                        form.setValue('colors.dark.background', selectedTheme.cssVars.dark.background);
                                        form.setValue('colors.dark.accent', selectedTheme.cssVars.dark.accent);
                                    }
                                }}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {themes.map((theme) => (
                                            <SelectItem key={theme.name} value={theme.name}>
                                                {theme.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm">Light Mode</h4>
                        <FormField
                            control={form.control}
                            name="colors.light.primary"
                            render={({ field }) => (
                                <FormItem><FormLabel>Primary</FormLabel><ColorPicker color={field.value} setColor={field.onChange} /></FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="colors.light.background"
                            render={({ field }) => (
                                <FormItem><FormLabel>Background</FormLabel><ColorPicker color={field.value} setColor={field.onChange} /></FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="colors.light.accent"
                            render={({ field }) => (
                                <FormItem><FormLabel>Accent</FormLabel><ColorPicker color={field.value} setColor={field.onChange} /></FormItem>
                            )}
                        />
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-medium text-sm">Dark Mode</h4>
                        <FormField
                            control={form.control}
                            name="colors.dark.primary"
                            render={({ field }) => (
                                <FormItem><FormLabel>Primary</FormLabel><ColorPicker color={field.value} setColor={field.onChange} /></FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="colors.dark.background"
                            render={({ field }) => (
                                <FormItem><FormLabel>Background</FormLabel><ColorPicker color={field.value} setColor={field.onChange} /></FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="colors.dark.accent"
                            render={({ field }) => (
                                <FormItem><FormLabel>Accent</FormLabel><ColorPicker color={field.value} setColor={field.onChange} /></FormItem>
                            )}
                        />
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

    