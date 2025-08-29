
'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { EmergencyContact } from '@/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LifeBuoy } from 'lucide-react';

import { getFlagEmoji } from '@/lib/data/country-flags';
import { countriesData } from '@/lib/data/countries';
import { indiaStatesData } from '@/lib/data/india-states';

const getCountryName = (code: string) =>
  countriesData.find(c => c.code === code)?.name || code;

const getStateName = (code: string) =>
  indiaStatesData.find(s => s.code === code)?.name || code;

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        // Note: multiple orderBy is fine; ensure those fields exist on docs.
        const q = query(
          collection(db, 'emergency_contacts'),
          orderBy('country'),
          orderBy('state'),
          orderBy('city')
        );
        const snap = await getDocs(q);
        setContacts(snap.docs.map(d => d.data() as EmergencyContact));
      } catch (e) {
        console.error(e);
        setError('Could not load emergency contacts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const grouped = useMemo(() => {
    const acc: Record<string, Record<string, EmergencyContact[]>> = {};
    for (const c of contacts) {
      const countryName = getCountryName(c.country);
      const stateName = c.state
        ? (c.country === 'IN' ? getStateName(c.state) : c.state)
        : 'General';
      acc[countryName] ??= {};
      acc[countryName][stateName] ??= [];
      acc[countryName][stateName].push(c);
    }
    return acc;
  }, [contacts]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20">
        <p className="text-muted-foreground">Loading emergency contacts…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

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
          {Object.entries(grouped).map(([countryName, states]) => {
            const first = contacts.find(c => getCountryName(c.country) === countryName);
            const flag = first ? getFlagEmoji(first.country) : '🏳️';
            const stateEntries = Object.entries(states);
            const defaultKey = stateEntries[0]?.[0];

            return (
              <Card key={countryName}>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-3">
                    <span className="text-3xl">{flag}</span> {countryName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue={defaultKey}
                  >
                    {stateEntries.map(([state, contactList]) => (
                      <AccordionItem
                        key={`${countryName}-${state}`}
                        value={state}
                      >
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
                                <TableRow
                                  key={`${c.country}-${c.state ?? 'general'}-${c.city ?? 'all'}-${c.category}-${c.name}-${c.phone}`}
                                >
                                  <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="capitalize">
                                        {c.category}
                                      </Badge>
                                      <span>{c.name}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {c.phone ? (
                                      <a
                                        href={`tel:${c.phone}`}
                                        className="font-mono text-lg font-semibold text-primary hover:underline"
                                      >
                                        {c.phone}
                                      </a>
                                    ) : (
                                      <span className="text-muted-foreground">—</span>
                                    )}
                                  </TableCell>
                                  <TableCell>{c.city || 'All'}</TableCell>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
