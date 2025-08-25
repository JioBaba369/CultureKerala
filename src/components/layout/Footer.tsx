
import { siteConfig } from "@/config/site";
import { Flame, Twitter, Github } from "lucide-react";
import Link from "next/link";
import { navigationConfig } from "@/config/navigation";

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Flame className="h-7 w-7 text-primary" />
                            <span className="font-headline font-semibold text-xl">{siteConfig.name}</span>
                        </Link>
                        <p className="mt-4 max-w-sm text-muted-foreground mx-auto md:mx-0">
                            The Heartbeat of Our Community. Discover local events, connect with community groups, support businesses, and find deals all in one place.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-headline font-medium mb-4">Categories</h4>
                        <ul className="space-y-2">
                           {navigationConfig.mainNav.map((item) => (
                               <li key={item.href}>
                                   <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                       {item.title}
                                   </Link>
                               </li>
                           ))}
                        </ul>
                    </div>

                     <div>
                        <h4 className="font-headline font-medium mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-headline font-medium mb-4">Legal</h4>
                        <ul className="space-y-2">
                             <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                    </p>
                     <div className="flex items-center gap-4">
                        <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
                            <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                        </Link>
                        <Link href={siteConfig.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                            <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
