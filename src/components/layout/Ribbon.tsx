
'use client';

import { X, PartyPopper } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';

export function Ribbon() {
    const [isOpen, setIsOpen] = useLocalStorage('ribbon-is-open-v1', true);

    if (!isOpen) {
        return null;
    }

    return (
        <div className={cn(
            "relative text-primary-foreground",
            "bg-gradient-to-r from-primary via-blue-500 to-green-500"
        )}>
            <div className="container mx-auto px-4 py-2 text-sm text-center">
                <p className="flex items-center justify-center gap-2">
                    <PartyPopper className="h-5 w-5" />
                    <span className="font-semibold">New!</span>
                    <span>Check out our brand new Perks program for exclusive member benefits.</span>
                    <Link href="/perks" className="ml-2 font-bold underline hover:text-white/80 transition-colors">
                        Explore Perks
                    </Link>
                </p>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-4 -translate-y-1/2 h-7 w-7 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
                aria-label="Dismiss ribbon"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}
