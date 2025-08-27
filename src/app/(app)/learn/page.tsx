
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Mic, MessageSquare, GraduationCap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Learn Malayalam',
    description: 'Start your journey to learn the beautiful Malayalam language, from basic alphabet to conversational phrases.',
};

const learningModules = [
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: 'The Alphabet (അക്ഷരമാല)',
    description: 'Master the 51 letters of the Malayalam script.',
    href: '#',
    status: 'coming_soon',
  },
  {
    icon: <Mic className="h-8 w-8 text-primary" />,
    title: 'Common Phrases',
    description: 'Learn essential phrases for everyday conversation.',
    href: '#',
    status: 'coming_soon',
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: 'Basic Conversation',
    description: 'Practice simple dialogues and improve your speaking.',
    href: '#',
    status: 'coming_soon',
  },
   {
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
    title: 'Numbers & Counting',
    description: 'Learn to count and use numbers in Malayalam.',
    href: '#',
    status: 'coming_soon',
  },
];

export default function LearnPage() {
    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-12 md:py-20">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-primary">
                       Embrace Your Roots, Learn Malayalam
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground">
                        Our interactive lessons make learning Malayalam simple and fun, whether you're a beginner or looking to refresh your skills.
                    </p>
                </div>

                <div className="my-12 md:my-16 relative aspect-video max-w-5xl mx-auto">
                     <Image 
                        src="https://picsum.photos/1200/600"
                        alt="A person writing in a notebook"
                        fill
                        className="rounded-xl object-cover shadow-lg"
                        data-ai-hint="learning language"
                    />
                </div>
                
                {/* Modules Section */}
                <section className="space-y-8 mb-16">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-headline font-bold">Learning Modules</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                           Start with the basics and build your way up to fluency.
                        </p>
                    </div>
                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {learningModules.map((mod) => (
                             <Card key={mod.title} className="flex flex-col text-center items-center p-6 hover:shadow-lg transition-shadow">
                                <div className="p-4 bg-primary/10 rounded-full mb-4">
                                    {mod.icon}
                                </div>
                                <h3 className="font-headline text-xl font-semibold">{mod.title}</h3>
                                <p className="text-muted-foreground mt-2 flex-grow">{mod.description}</p>
                                <Button variant="outline" className="mt-6" disabled={mod.status === 'coming_soon'}>
                                    {mod.status === 'coming_soon' ? 'Coming Soon' : 'Start Learning'}
                                </Button>
                            </Card>
                        ))}
                    </div>
                </section>


                {/* Why Learn Section */}
                <section className="bg-card border rounded-xl p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <h2 className="font-headline text-3xl font-bold">The Beauty of Malayalam</h2>
                             <p className="text-muted-foreground">
                                Malayalam is a classical Dravidian language with a rich literary history. Its unique, rounded script is a beautiful art form in itself. Learning the language opens a door to a world of poetry, literature, and cinema celebrated across the globe.
                            </p>
                             <p className="text-muted-foreground">
                                By learning, you're not just acquiring a new skill; you're connecting with the culture, history, and heart of Kerala.
                            </p>
                             <Button asChild size="lg" className="mt-4">
                                <Link href="#">Start Your Journey</Link>
                            </Button>
                        </div>
                         <div className="relative aspect-square">
                            <Image src="https://picsum.photos/600/600" alt="Ancient Malayalam Manuscript" fill className="object-cover rounded-xl" data-ai-hint="malayalam script" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
