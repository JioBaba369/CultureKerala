
'use client';

import { usePathname } from 'next/navigation';
import { Progress } from '../ui/progress';
import { useMemo } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { KeralaIcon } from '../ui/kerala-icon';

const steps = [
    { path: '/onboarding/welcome', progress: 0 },
    { path: '/onboarding/profile', progress: 33 },
    { path: '/onboarding/interests', progress: 66 },
];

export function OnboardingLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    const currentProgress = useMemo(() => {
        const currentStep = steps.find(step => step.path === pathname);
        return currentStep ? currentStep.progress : 0;
    }, [pathname]);

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
                <div className="container flex h-16 items-center justify-between">
                     <Link href="/" className="flex items-center gap-2" aria-label={siteConfig.name}>
                        <KeralaIcon className="h-6 w-6 text-primary" />
                        <span className="font-bold font-headline">
                            {siteConfig.name}
                        </span>
                    </Link>
                    <div className='w-full max-w-xs'>
                        <Progress value={currentProgress} />
                    </div>
                </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
