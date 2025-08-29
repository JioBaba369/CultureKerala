
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { EmergencyContact } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Phone, LifeBuoy } from 'lucide-react';
import { getFlagEmoji } from '@/lib/data/country-flags';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { countriesData } from '@/lib/data/countries';
import { indiaStatesData } from '@/lib/data/india-states';

async function getEmergencyContacts() {
    const contactsRef = collection(db, "emergency_contacts");
    const q = query(contactsRef, orderBy("country"), orderBy("state"), orderBy("city"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as EmergencyContact);
}

const getCountryName = (code: string) => {
    return countriesData.find(c => c.code === code)?.name || code;
}

const getStateName = (code: string) => {
    return indiaStatesData.find(s => s.code === code)?.name || code;
}

export default async function EmergencyContactsPage() {
    const contacts = await getEmergencyContacts();

    const groupedContacts = contacts.reduce((acc, contact) => {
        const countryName = getCountryName(contact.country);
        if (!acc[countryName]) {
            acc[countryName] = {};
        }
        const stateName = contact.state ? (contact.country === 'IN' ? getStateName(contact.state) : contact.state) : 'General';
        if (!acc[countryName][stateName]) {
            acc[countryName][stateName] = [];
        }
        acc[countryName][stateName].push(contact);
        return acc;
    }, {} as Record<string, Record<string, EmergencyContact[]>>);

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-3xl mx-auto text-center">
                     <div className="mx-auto w-max mb-4">
                        <div className="rounded-full bg-primary/10 p-3 border border-primary/20">
                            <LifeBuoy className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-primary">
                        Emergency Contacts
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                        Important contact numbers for emergency services in various regions. Please verify these numbers with local authorities as they can change.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto mt-12 space-y-4">
                   {Object.entries(groupedContacts).map(([country, states]) => (
                        <Card key={country}>
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl flex items-center gap-3">
                                    <span className='text-3xl'>{getFlagEmoji(contacts.find(c => getCountryName(c.country) === country)!.country)}</span> {country}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full" defaultValue={Object.keys(states)[0]}>
                                    {Object.entries(states).map(([state, contactList]) => (
                                        <AccordionItem key={state} value={state}>
                                            <AccordionTrigger className="text-xl font-headline">
                                                {state === 'General' ? 'Nation-wide' : state}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Service</TableHead>
                                                            <TableHead>Number</TableHead>
                                                            <TableHead>Location</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {contactList.map(c => (
                                                            <TableRow key={c.phone + c.name}>
                                                                <TableCell className="font-medium flex items-center gap-2">
                                                                     <Badge variant="outline" className="capitalize">{c.category}</Badge>
                                                                    <span>{c.name}</span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <a href={`tel:${c.phone}`} className="font-mono text-lg font-semibold text-primary hover:underline">{c.phone}</a>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {c.city || 'All'}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                   ))}
                </div>
            </div>
        </div>
    );
}
