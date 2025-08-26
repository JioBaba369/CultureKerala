
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Target, Users } from 'lucide-react';
import { siteConfig } from '@/config/site';

const teamMembers = [
  {
    name: 'Anika Sharma',
    role: 'Founder & CEO',
    avatar: 'https://placehold.co/100x100.png',
    bio: 'Anika is passionate about building vibrant communities and connecting people through shared experiences.',
  },
  {
    name: 'Rohan Mehta',
    role: 'Lead Developer',
    avatar: 'https://placehold.co/100x100.png',
    bio: 'Rohan architects the technology that powers DilSePass, ensuring a seamless user experience.',
  },
  {
    name: 'Priya Singh',
    role: 'Community Manager',
    avatar: 'https://placehold.co/100x100.png',
    bio: 'Priya works with event organizers and businesses to bring the best of the diaspora to the platform.',
  },
];


export default function AboutPage() {
    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-12 md:py-20">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-primary">
                        Connecting the Diaspora, One Heart at a Time.
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground">
                        DilSePass is more than a platform; it's a movement. We are dedicated to bridging distances and fostering a sense of belonging by being the definitive guide to the vibrant heart of the South Asian diaspora.
                    </p>
                </div>

                <div className="my-12 md:my-16 relative aspect-video max-w-5xl mx-auto">
                     <Image 
                        src="https://placehold.co/1200x600.png"
                        alt="Taj Mahal"
                        fill
                        className="rounded-xl object-cover shadow-lg"
                        data-ai-hint="taj mahal"
                    />
                </div>
                

                {/* Mission and Vision Section */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto my-16">
                    <div className="flex flex-col items-center text-center md:items-start md:text-left p-8 bg-card rounded-lg border">
                        <div className="p-3 bg-primary/10 rounded-full mb-4 border border-primary/20">
                            <Target className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-headline font-semibold">Our Mission</h2>
                        <p className="mt-2 text-muted-foreground text-base">
                           {siteConfig.mission}
                        </p>
                    </div>
                     <div className="flex flex-col items-center text-center md:items-start md:text-left p-8 bg-card rounded-lg border">
                        <div className="p-3 bg-primary/10 rounded-full mb-4 border border-primary/20">
                           <Heart className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-headline font-semibold">Our Vision</h2>
                        <p className="mt-2 text-muted-foreground text-base">
                            {siteConfig.vision}
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <div className="my-16 md:my-24">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-headline font-bold">Meet the Team</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                           The passionate individuals dedicated to bringing our vision to life.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {teamMembers.map((member) => (
                            <div key={member.name} className="flex flex-col items-center text-center p-6 bg-card rounded-lg border">
                                <Avatar className="w-24 h-24 mb-4">
                                    <AvatarImage src={`https://placehold.co/100x100.png?text=${member.name.charAt(0)}`} alt={member.name} data-ai-hint="professional headshot" />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-headline font-semibold">{member.name}</h3>
                                <p className="text-primary font-medium">{member.role}</p>
                                <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>

                 {/* Join Us Section */}
                <div className="text-center bg-primary/10 py-16 rounded-xl border border-primary/20">
                     <Users className="mx-auto h-12 w-12 text-primary mb-4" />
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Join Our Community</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Ready to dive in? Explore what's happening near you, or get in touch to partner with us.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Button asChild size="lg">
                            <Link href="/explore">Explore Now</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/contact">Contact Us</Link>
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
