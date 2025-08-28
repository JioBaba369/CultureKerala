
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Mic, MessageSquare, GraduationCap, PenTool, Hash, Feather, User, Users, ShoppingCart } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Learn Malayalam',
    description: 'Start your journey to learn the beautiful Malayalam language, from basic alphabet to conversational phrases.',
};

const learningLevels = [
  {
    level: "Level 1: Foundations",
    description: "Start with the absolute basics. These modules will help you read, write, and pronounce Malayalam letters and numbers.",
    modules: [
        {
            icon: <BookOpen className="h-8 w-8 text-primary" />,
            title: 'The Alphabet (അക്ഷരമാല)',
            description: 'Master the 51 foundational letters of the Malayalam script, including vowels and consonants.',
            href: '#',
            status: 'coming_soon',
        },
        {
            icon: <PenTool className="h-8 w-8 text-primary" />,
            title: 'Writing Vowel-Consonant combinations',
            description: 'Learn how consonants change shape when combined with vowels.',
            href: '#',
            status: 'coming_soon',
        },
        {
            icon: <Hash className="h-8 w-8 text-primary" />,
            title: 'Numbers & Counting (സംഖ്യകൾ)',
            description: 'Learn to count from 1 to 100 and understand the number system.',
            href: '#',
            status: 'coming_soon',
        },
    ]
  },
  {
    level: "Level 2: Basic Vocabulary & Phrases",
    description: "Build your vocabulary with essential words and phrases for everyday situations.",
    modules: [
       {
            icon: <Mic className="h-8 w-8 text-primary" />,
            title: 'Common Greetings (ആശംസകൾ)',
            description: 'Learn essential phrases for greetings and introductions in everyday conversation.',
            href: '#',
            status: 'coming_soon',
        },
        {
            icon: <User className="h-8 w-8 text-primary" />,
            title: 'Introducing Yourself',
            description: 'Practice simple sentences to talk about who you are, where you are from, and what you do.',
            href: '#',
            status: 'coming_soon',
        },
        {
            icon: <Users className="h-8 w-8 text-primary" />,
            title: 'Family & People (കുടുംബം)',
            description: 'Learn the words for family members and people around you.',
            href: '#',
            status: 'coming_soon',
        },
    ]
  },
  {
    level: "Level 3: Building Sentences",
    description: "Start forming your own sentences and engage in simple, practical conversations.",
    modules: [
         {
            icon: <MessageSquare className="h-8 w-8 text-primary" />,
            title: 'Asking Questions (ചോദ്യങ്ങൾ)',
            description: 'Learn how to ask simple questions like "What is your name?" and "Where are you from?".',
            href: '#',
            status: 'coming_soon',
        },
        {
            icon: <ShoppingCart className="h-8 w-8 text-primary" />,
            title: 'At the Market (ചന്തയിൽ)',
            description: 'Practice basic dialogues for shopping for vegetables and groceries.',
            href: '#',
            status: 'coming_soon',
        },
         {
            icon: <Feather className="h-8 w-8 text-primary" />,
            title: 'Simple Verbs & Actions',
            description: 'Learn to use common verbs like "to be," "to have," and "to go" in sentences.',
            href: '#',
            status: 'coming_soon',
        },
    ]
  }
];


export default function LearnPage() {
    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-12 md:py-20">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto">
                     <div className="mx-auto w-max mb-4">
                        <div className="rounded-full bg-primary/10 p-3 border border-primary/20">
                            <GraduationCap className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-primary">
                       Learn Malayalam
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground">
                       Start your journey to learn the beautiful Malayalam language, from basic alphabet to conversational phrases. Our structured modules will guide you every step of the way.
                    </p>
                </div>

                <div className="my-12 md:my-16 space-y-12">
                   {learningLevels.map(level => (
                       <div key={level.level}>
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-headline font-bold">{level.level}</h2>
                                <p className="text-muted-foreground mt-2">{level.description}</p>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {level.modules.map(module => (
                                    <Card key={module.title} className="flex flex-col">
                                        <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
                                            {module.icon}
                                            <CardTitle className="font-headline text-xl">{module.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="text-muted-foreground text-sm">{module.description}</p>
                                        </CardContent>
                                        <CardContent>
                                            <Button disabled className="w-full">
                                                Coming Soon
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                       </div>
                   ))}
                </div>

                 <div className="text-center bg-primary/10 py-16 rounded-xl border border-primary/20">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Ready to Begin?</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Dive into the first lesson and take your first step towards mastering Malayalam.
                    </p>
                    <div className="mt-8">
                        <Button size="lg" disabled>
                           Start with the Alphabet
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
