
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
                <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <KeralaIcon className="h-7 w-7 text-primary" />
                            <span className="font-headline font-semibold text-xl">{siteConfig.name}</span>
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                            {siteConfig.description}
                        </p>
                    </div>

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
                </div>

                <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                    </p>
                     {siteConfig.links && (
                        <div className="flex items-center gap-4">
                            {siteConfig.links.x && (
                                <Link href={siteConfig.links.x} target="_blank" rel="noreferrer" aria-label="X">
                                    <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                                </Link>
                            )}
                             {siteConfig.links.instagram && (
                                <Link href={siteConfig.links.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                                    <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                                </Link>
                            )}
                             {siteConfig.links.facebook && (
                                <Link href={siteConfig.links.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                                    <Facebook className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                                </Link>
                            )}
                             {siteConfig.links.linkedin && (
                                <Link href={siteConfig.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                    <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                                </Link>
                            )}
                            {siteConfig.links.github && (
                                <Link href={siteConfig.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                                    <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                                </Link>
                            )}
                        </div>
                     )}
                </div>
            </div>
        </footer>
    );
}
