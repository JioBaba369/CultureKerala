
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";

export default function ContactPage() {
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
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Anika Sharma" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="anika@example.com" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" placeholder="Question about an event" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" placeholder="Your message..." rows={5} />
                                </div>
                                <Button type="submit" className="w-full">
                                    <Send className="mr-2" /> Send Message
                                </Button>
                            </form>
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
