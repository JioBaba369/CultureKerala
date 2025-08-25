
'use client';

import { Flame, Twitter, Github } from "lucide-react";
import Link from "next/link";
import { navigationConfig } from "@/config/navigation";
import { useConfig } from "@/hooks/use-config";
import { useEffect, useState } from "react";

export function Footer() {
    const footerNav = navigationConfig.footerNav || [];
    const [config] = useConfig();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [])
    
    if (!mounted) {
        return null;
    }

    return (
        <footer className="border-t bg-background">
            <div className="container py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Flame className="h-7 w-7 text-primary" />
                            <span className="font-headline font-semibold text-xl">{config.name}</span>
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground">
                            {config.description}
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
                        &copy; {new Date().getFullYear()} {config.name}. All rights reserved.
                    </p>
                     {config.links && (
                        <div className="flex items-center gap-4">
                            <Link href={config.links.twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
                                <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                            </Link>
                            <Link href={config.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                                <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                            </Link>
                        </div>
                     )}
                </div>
            </div>
        </footer>
    );
}
