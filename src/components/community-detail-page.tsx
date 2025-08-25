
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Mail, MapPin, Users, Phone, Facebook, Instagram, Twitter, Youtube, ExternalLink } from 'lucide-react';
import type { Community } from '@/types';
import { Button } from './ui/button';
import { InfoList, InfoListItem } from './ui/info-list';
import Link from 'next/link';

const communityTypeLabels: Record<Community['type'], string> = {
    cultural: 'Cultural',
    student: 'Student',
    religious: 'Religious',
    professional: 'Professional',
    regional: 'Regional',
    other: 'Other'
}

export function CommunityDetailPage({ community }: { community: Community }) {
    const SocialIcons = {
        facebook: <Facebook />,
        instagram: <Instagram />,
        x: <Twitter />,
        youtube: <Youtube />,
    }

  return (
    <div className="bg-muted/40">
        <div className="w-full h-64 bg-card relative">
            {community.bannerURL ? (
                 <Image
                    src={community.bannerURL}
                    alt={`${community.name} banner`}
                    fill
                    className="object-cover"
                    data-ai-hint="community banner"
                />
            ) : (
                <div className="bg-gradient-to-r from-primary/20 to-secondary/20 h-full w-full"></div>
            )}
        </div>
        <div className="container mx-auto px-4 py-8 md:py-12 -mt-24">
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 lg:col-span-3">
                    <Card>
                        <CardHeader className="flex flex-row items-start gap-4">
                            <div className="w-24 h-24 rounded-lg bg-card border-2 border-primary/20 relative flex-shrink-0 -mt-12">
                                <Image
                                    src={community.logoURL || "https://placehold.co/200x200.png"}
                                    alt={`${community.name} logo`}
                                    fill
                                    className="object-cover rounded-md"
                                    data-ai-hint="community logo"
                                />
                            </div>
                            <div>
                                <CardTitle className="font-headline text-4xl leading-tight">{community.name}</CardTitle>
                                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                    <MapPin className="h-4 w-4" /> {community.region.city}, {community.region.country}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-lg max-w-none">
                                <h3>About this Community</h3>
                                <p>{community.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                 {/* Sticky Sidebar */}
                <div className="md:col-span-1 lg:col-span-1">
                    <div className="sticky top-20 space-y-6">
                        <Card>
                             <CardHeader>
                                <Button className="w-full" size="lg">
                                    <Users className="mr-2 h-5 w-5" /> Join Community
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <InfoList>
                                     <InfoListItem label="Type">
                                        <Badge variant="secondary">{communityTypeLabels[community.type]}</Badge>
                                    </InfoListItem>
                                    {community.contact?.website && (
                                        <InfoListItem label="Website">
                                           <a href={community.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                                                <Globe className="h-4 w-4" /> Visit <ExternalLink className='h-3 w-3' />
                                            </a>
                                        </InfoListItem>
                                    )}
                                     {community.contact?.email && (
                                        <InfoListItem label="Email">
                                           <a href={`mailto:${community.contact.email}`} className="flex items-center gap-2 text-primary hover:underline">
                                                <Mail className="h-4 w-4" /> Email Us
                                            </a>
                                        </InfoListItem>
                                    )}
                                    {community.contact?.phone && (
                                        <InfoListItem label="Phone">
                                           <a href={`tel:${community.contact.phone}`} className="flex items-center gap-2 text-primary hover:underline">
                                                <Phone className="h-4 w-4" /> Call Us
                                            </a>
                                        </InfoListItem>
                                    )}
                                </InfoList>
                                
                                {community.socials && Object.values(community.socials).some(s => s) && (
                                    <>
                                        <hr className="my-4" />
                                        <div className="flex justify-center gap-2">
                                            {Object.entries(community.socials).map(([key, value]) => {
                                                if (value) {
                                                    return (
                                                        <Button asChild variant="ghost" size="icon" key={key}>
                                                            <Link href={value} target="_blank" rel="noopener noreferrer">
                                                                {SocialIcons[key as keyof typeof SocialIcons]}
                                                            </Link>
                                                        </Button>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
