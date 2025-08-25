
import { siteConfig } from "@/config/site";
import { Flame } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t">
            <div className="container py-8">
                <div className="flex flex-col items-center justify-center gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Flame className="h-6 w-6 text-primary" />
                        <span className="font-headline font-semibold text-lg">{siteConfig.name}</span>
                    </Link>
                    <p className="text-center text-sm leading-loose text-muted-foreground">
                        Built by your friendly neighborhood AI.
                    </p>
                </div>
            </div>
        </footer>
    );
}
