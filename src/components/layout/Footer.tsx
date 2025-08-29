
'use client';

import { Github, X, Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { navigationConfig } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { KeralaIcon } from "../ui/kerala-icon";
import { FaWhatsapp } from 'react-icons/fa';

export function Footer() {
    const footerNav = navigationConfig.footerNav || [];
    
    return (
        <footer className="border-t bg-background">
            <div className="container py-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Left Column: Branding */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <KeralaIcon className="h-7 w-7 text-primary" />
                            <span className="font-headline font-semibold text-xl">{siteConfig.name}</span>
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                            {siteConfig.description}
                        </p>
                    </div>

                    {/* Right Column: Nav Links */}
                    <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {footerNav.map((section) => (
                            <div key={section.title}>
                                <h4 className="font-headline font-medium mb-4">{section.title}</h4>
                                <ul className="space-y-2">
                                {section.items.map((item) => (
                                    <li key={item.href}>
                                        <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        ))}
                         <div>
                            <h4 className="font-headline font-medium mb-4">Connect</h4>
                             <ul className="space-y-2">
                                {siteConfig.links?.x && (
                                    <li><Link href={siteConfig.links.x} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"><X className="h-4 w-4" /> X / Twitter</Link></li>
                                )}
                                {siteConfig.links?.instagram && (
                                    <li><Link href={siteConfig.links.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"><Instagram className="h-4 w-4" /> Instagram</Link></li>
                                )}
                                {siteConfig.links?.facebook && (
                                    <li><Link href={siteConfig.links.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"><Facebook className="h-4 w-4" /> Facebook</Link></li>
                                )}
                                {siteConfig.links?.linkedin && (
                                     <li><Link href={siteConfig.links.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="h-4 w-4" /> LinkedIn</Link></li>
                                )}
                                {siteConfig.links?.github && (
                                     <li><Link href={siteConfig.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"><Github className="h-4 w-4" /> GitHub</Link></li>
                                )}
                                {siteConfig.links?.whatsapp && (
                                    <li><Link href={siteConfig.links.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"><FaWhatsapp className="h-4 w-4" /> WhatsApp</Link></li>
                                )}
                             </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t">
                    <p className="text-sm text-muted-foreground text-center">
                        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
