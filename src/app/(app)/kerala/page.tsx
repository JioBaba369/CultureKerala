
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Droplets, Utensils, Mountain, Sun, Waves, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
    title: 'About Kerala',
    description: 'Explore the rich culture, vibrant landscapes, and unique heritage of Kerala, God\'s Own Country.',
};


const keralaFacts = [
    {
        icon: <Leaf className="h-8 w-8 text-green-600" />,
        title: 'God\'s Own Country',
        description: 'Famous for its lush greenery, tranquil backwaters, and stunning natural beauty.'
    },
    {
        icon: <Droplets className="h-8 w-8 text-blue-500" />,
        title: 'Land of Backwaters',
        description: 'A vast network of interconnected canals, rivers, lakes, and inlets.'
    },
    {
        icon: <Utensils className="h-8 w-8 text-amber-600" />,
        title: 'Spice Garden of India',
        description: 'Historically known for its trade in spices like pepper, cardamom, and cloves.'
    },
    {
        icon: <Zap className="h-8 w-8 text-yellow-500" />,
        title: 'Highest Literacy Rate',
        description: 'Kerala consistently has one of the highest literacy rates in India.'
    }
]

export default function KeralaPage() {
    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-12 md:py-20">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-primary">
                        Discover Kerala
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground">
                        Welcome to "God's Own Country," a land of vibrant culture, breathtaking landscapes, and rich heritage. Explore the soul of Kerala, from its serene backwaters to its colorful festivals.
                    </p>
                </div>

                <div className="my-12 md:my-16 relative aspect-video max-w-5xl mx-auto">
                     <Image 
                        src="https://picsum.photos/1200/600"
                        alt="Kerala Backwaters"
                        fill
                        className="rounded-xl object-cover shadow-lg"
                        data-ai-hint="kerala backwaters"
                    />
                </div>

                <Card className="max-w-5xl mx-auto mb-16">
                    <CardContent className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {keralaFacts.map(fact => (
                            <div key={fact.title} className="flex flex-col items-center text-center">
                                {fact.icon}
                                <h3 className="mt-4 font-headline font-semibold text-lg">{fact.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{fact.description}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                
                {/* Geography Section */}
                <section className="space-y-8 mb-16">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-headline font-bold">The Landscape</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                           A diverse geography stretching from the high Western Ghats to the Arabian Sea coast.
                        </p>
                    </div>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="overflow-hidden">
                            <CardHeader className="p-0">
                                <Image src="https://picsum.photos/600/400" alt="Munnar Tea Plantations" width={600} height={400} className="w-full h-auto" data-ai-hint="tea plantation" />
                            </CardHeader>
                            <CardContent className="p-6">
                                <Mountain className="h-8 w-8 text-primary mb-2" />
                                <h3 className="font-headline text-2xl font-semibold">The Highlands</h3>
                                <p className="text-muted-foreground mt-2">Home to the Western Ghats, this region is famous for its tea and coffee plantations, rolling hills, and rich biodiversity. Hill stations like Munnar and Wayanad offer cool climates and stunning vistas.</p>
                            </CardContent>
                        </Card>
                         <Card className="overflow-hidden">
                            <CardHeader className="p-0">
                                <Image src="https://picsum.photos/600/400" alt="Kerala Backwaters" width={600} height={400} className="w-full h-auto" data-ai-hint="kerala backwaters" />
                            </CardHeader>
                            <CardContent className="p-6">
                                <Waves className="h-8 w-8 text-primary mb-2" />
                                <h3 className="font-headline text-2xl font-semibold">The Backwaters</h3>
                                <p className="text-muted-foreground mt-2">A unique ecosystem of lakes, canals, and estuaries, the backwaters are the heart of Kerala's tourism. Houseboat cruises through places like Alleppey and Kumarakom offer a tranquil experience.</p>
                            </CardContent>
                        </Card>
                         <Card className="overflow-hidden lg:col-span-1 md:col-span-2">
                             <CardHeader className="p-0">
                                <Image src="https://picsum.photos/600/400" alt="Kovalam Beach" width={600} height={400} className="w-full h-auto" data-ai-hint="kerala beach" />
                            </CardHeader>
                            <CardContent className="p-6">
                                <Sun className="h-8 w-8 text-primary mb-2" />
                                <h3 className="font-headline text-2xl font-semibold">The Coastline</h3>
                                <p className="text-muted-foreground mt-2">Kerala has a 600km long coastline along the Arabian Sea, dotted with beautiful beaches like Varkala, Kovalam, and Marari, known for golden sands and swaying palm trees.</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Culture Section */}
                <section className="space-y-8">
                     <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-headline font-bold">Vibrant Culture & Arts</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                           A rich tapestry of performing arts, colorful festivals, and unique traditions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="relative aspect-square">
                            <Image src="https://picsum.photos/600/600" alt="Kathakali Performance" fill className="object-cover rounded-xl" data-ai-hint="kathakali dancer" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-headline text-3xl font-semibold">Performing Arts</h3>
                            <p className="text-muted-foreground">Kerala is renowned for its classical art forms. <strong>Kathakali</strong>, a classical dance-drama, is famous for its elaborate makeup and costumes. <strong>Mohiniyattam</strong> is a graceful, feminine dance, while <strong>Theyyam</strong> is a vibrant and intense ritualistic art form.</p>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-headline text-xl">Festivals</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">Festivals are an integral part of Kerala's culture. <strong>Onam</strong>, the harvest festival, is the most important, celebrated with flower carpets (Pookalam) and grand feasts (Onam Sadya). <strong>Thrissur Pooram</strong> is one of the most spectacular temple festivals, famous for its grand elephant procession.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
