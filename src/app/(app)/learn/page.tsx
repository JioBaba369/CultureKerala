
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, Mic, MessageSquare, GraduationCap, PenTool, Hash, Feather, User, Users, ShoppingCart } from 'lucide-react';
import type { Metadata } from 'next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const metadata: Metadata = {
    title: 'Learn Malayalam',
    description: 'The Complete Guide to Learning Malayalam: Foundations, Fluency, and Cultural Immersion',
};

const vowelData = [
    { sound: '/a/', independent: 'അ', dependent: '(none)', romanization: 'a', example: 'about' },
    { sound: '/aː/', independent: 'ആ', dependent: 'ാ', romanization: 'aa', example: 'father' },
    { sound: '/i/', independent: 'ഇ', dependent: 'ി', romanization: 'i', example: 'bit' },
    { sound: '/iː/', independent: 'ഈ', dependent: 'ീ', romanization: 'ee', example: 'meet' },
    { sound: '/u/', independent: 'ഉ', dependent: 'ു', romanization: 'u', example: 'put' },
    { sound: '/uː/', independent: 'ഊ', dependent: 'ൂ', romanization: 'oo', example: 'boot' },
    { sound: '/rɨ/', independent: 'ഋ', dependent: 'ൃ', romanization: 'ri', example: 'rich' },
    { sound: '/e/', independent: 'എ', dependent: 'െ', romanization: 'e', example: 'get' },
    { sound: '/eː/', independent: 'ഏ', dependent: 'േ', romanization: 'ae', example: 'ate' },
    { sound: '/ai/', independent: 'ഐ', dependent: 'ൈ', romanization: 'ai', example: 'aisle' },
    { sound: '/o/', independent: 'ഒ', dependent: 'ൊ', romanization: 'o', example: 'pot' },
    { sound: '/oː/', independent: 'ഓ', dependent: 'ോ', romanization: 'oo', example: 'boat' },
    { sound: '/au/', independent: 'ഔ', dependent: 'ൗ', romanization: 'au', example: 'cow' },
    { sound: 'Nasal', independent: 'അം', dependent: 'ം', romanization: 'am', example: 'Nasal sound, adds \'m\'' },
    { sound: 'Aspirated', independent: 'അഃ', dependent: 'ഃ', romanization: 'ah', example: 'Aspirated sound at word end' },
];

const phraseData = [
    { category: 'Greetings', phrase: 'നമസ്കാരം', transliteration: 'Namaskaram', usage: 'Universal formal greeting' },
    { category: 'Greetings', phrase: 'സുഖമാണോ?', transliteration: 'Sukhamaano?', usage: 'How are you?' },
    { category: 'Greetings', phrase: 'എനിക്ക് സുഖമാണ്', transliteration: 'Enikku sukhamaanu', usage: 'I am fine' },
    { category: 'Greetings', phrase: 'നന്ദി', transliteration: 'Nandi', usage: 'Thank you' },
    { category: 'Greetings', phrase: 'വീണ്ടും കാണാം', transliteration: 'Veendum kaanaam', usage: 'See you again' },
    { category: 'Travel & Navigation', phrase: 'എവിടെ?', transliteration: 'Evide?', usage: 'Where? (universal question word)' },
    { category: 'Travel & Navigation', phrase: 'ബസ് സ്റ്റോപ്പ് എവിടെ?', transliteration: 'Bus stop evide?', usage: 'Where is the bus stop?' },
    { category: 'Travel & Navigation', phrase: 'എനിക്ക് വെള്ളം വേണം', transliteration: 'Enikku vellam venam', usage: 'I need water' },
    { category: 'Travel & Navigation', phrase: 'ടോയ്‌ലെറ്റ് എവിടെ?', transliteration: 'Toilet evide?', usage: 'Where is the toilet?' },
    { category: 'Travel & Navigation', phrase: 'അവിടെ എങ്ങനെ പോകാം?', transliteration: 'Avide engane pokam?', usage: 'How do I get there?' },
    { category: 'Shopping', phrase: 'എത്ര?', transliteration: 'Ethra?', usage: 'How much?' },
    { category: 'Shopping', phrase: 'ഇതിന്റെ വില എത്ര?', transliteration: 'Ithinte vila ethra?', usage: 'How much does this cost?' },
    { category: 'Shopping', phrase: 'വില കുറയ്ക്കാമോ?', transliteration: 'Vila kuraykkamo?', usage: 'Can you reduce the price?' },
    { category: 'Communication Barriers', phrase: 'എനിക്ക് മലയാളം അറിയില്ല', transliteration: 'Enikku Malayalam ariyilla', usage: 'I\'don\'t know Malayalam' },
    { category: 'Communication Barriers', phrase: 'ദയവായി പതുക്കെ പറയൂ', transliteration: 'Dayavayi pathukke parayoo', usage: 'Please speak slowly' },
    { category: 'Communication Barriers', phrase: 'എനിക്ക് മനസ്സിലായില്ല', transliteration: 'Enikku manassilayilla', usage: 'I didn\'t understand' },
];

const numberData = [
    { num: 1, word: 'Onnu' }, { num: 2, word: 'Randu' }, { num: 3, word: 'Moonnu' }, { num: 4, word: 'Naalu' }, { num: 5, word: 'Anju' },
    { num: 6, word: 'Aaru' }, { num: 7, word: 'Ezhu' }, { num: 8, word: 'Ettu' }, { num: 9, word: 'Onpathu' }, { num: 10, word: 'Pathu' },
    { num: 11, word: 'Pathinonnu' }, { num: 12, word: 'Panthrandu' }, { num: 13, word: 'Pathimoonnu' }, { num: 14, word: 'Pathinaalu' }, { num: 15, word: 'Pathinanju' },
    { num: 16, word: 'Pathinaaru' }, { num: 17, word: 'Pathinezhu' }, { num: 18, word: 'Pathinettu' }, { num: 19, word: 'Pathonpathu' }, { num: 20, word: 'Irupathu' },
    { num: 30, word: 'Muppathu' }, { num: 40, word: 'Naalppathu' }, { num: 50, word: 'Anpathu' }, { num: 60, word: 'Arupathu' }, { num: 70, word: 'Ezhupathu' },
    { num: 80, word: 'Enpathu' }, { num: 90, word: 'Thonnooru' }, { num: 100, word: 'Nooru' },
];

export default function LearnPage() {
    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto text-center">
                     <div className="mx-auto w-max mb-4">
                        <div className="rounded-full bg-primary/10 p-3 border border-primary/20">
                            <GraduationCap className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-primary">
                       A Journey into God's Own Language
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground">
                        Malayalam is a classical Dravidian language spoken by approximately 45 million people. While it holds a reputation for being a challenging language to master due to its extensive script and unique phonetic sounds, its rich history and expressive nature make it a rewarding pursuit.
                    </p>
                </div>

                <div className="my-12 md:my-16 space-y-12 max-w-5xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className='font-headline text-3xl'>Part 1: Foundational Literacy</CardTitle>
                            <CardDescription>Before spoken fluency can be attained, a firm grasp of the foundational elements is essential. Malayalam's writing system is intricate, yet logical, and understanding its structure is the first step toward true literacy.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-8">
                             <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className='text-2xl font-headline'>The Malayalam Script (അക്ഷരമാല): A Deep Dive</AccordionTrigger>
                                    <AccordionContent className='prose max-w-none text-base'>
                                        The Malayalam script, or Malayāḷa lipi, is a descendant of the ancient Brahmi script and is classified as an alphasyllabary or abugida. This structure is a crucial distinction from a traditional alphabet like English. In an alphasyllabary, each consonant letter inherently carries a short vowel sound, typically the /a/ sound. For example, the consonant ക is not a simple /k/ but rather represents the full syllable /ka/. This inherent vowel is the primary reason that consonant-vowel combinations are central to learning the script. To create a pure consonant sound without the inherent vowel, a special diacritic called virama or chandrakkala (്) is used.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className='text-2xl font-headline'>Vowels (സ്വരങ്ങൾ): The Core Sounds</AccordionTrigger>
                                    <AccordionContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Vowel Sound</TableHead>
                                                    <TableHead>Independent Letter</TableHead>
                                                    <TableHead>Dependent Sign</TableHead>
                                                    <TableHead>Romanization</TableHead>
                                                    <TableHead>English Equivalent</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {vowelData.map((vowel, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{vowel.sound}</TableCell>
                                                        <TableCell className='text-xl'>{vowel.independent}</TableCell>
                                                        <TableCell className='text-xl'>{vowel.dependent}</TableCell>
                                                        <TableCell>{vowel.romanization}</TableCell>
                                                        <TableCell>as in "{vowel.example}"</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </AccordionContent>
                                </AccordionItem>
                                 <AccordionItem value="item-3">
                                    <AccordionTrigger className='text-2xl font-headline'>Numbers & Counting (സംഖ്യകൾ)</AccordionTrigger>
                                    <AccordionContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                     <TableHead>Number</TableHead>
                                                     <TableHead>Malayalam Word (Transliteration)</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                               {numberData.map((n) => (
                                                   <TableRow key={n.num}>
                                                        <TableCell>{n.num}</TableCell>
                                                        <TableCell>{n.word}</TableCell>
                                                   </TableRow>
                                               ))}
                                            </TableBody>
                                        </Table>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className='font-headline text-3xl'>Part 2: Conversational Mastery</CardTitle>
                            <CardDescription>Mastering a set of essential phrases is key to navigating everyday interactions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Malayalam Phrase</TableHead>
                                        <TableHead>Transliteration</TableHead>
                                        <TableHead>Usage</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {phraseData.map((phrase, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{phrase.category}</TableCell>
                                            <TableCell className='text-lg'>{phrase.phrase}</TableCell>
                                            <TableCell>{phrase.transliteration}</TableCell>
                                            <TableCell>{phrase.usage}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                 <div className="text-center bg-primary/10 py-16 rounded-xl border border-primary/20 max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Ready to Dive Deeper?</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        While this guide provides a strong foundation, true fluency comes from practice. Explore community-recommended apps and connect with native speakers.
                    </p>
                    <div className="mt-8">
                        <Button size="lg" asChild>
                           <Link href="/communities">Find a Community</Link>
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
