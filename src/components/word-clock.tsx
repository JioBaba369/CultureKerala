
'use client';

import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

export function WordClock() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        // Set initial time on client to avoid hydration mismatch
        setTime(new Date()); 
        
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000); // Update every second

        return () => {
            clearInterval(timerId); // Cleanup on unmount
        };
    }, []);

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const istTimeOptions: Intl.DateTimeFormatOptions = {
        ...timeOptions,
        timeZone: 'Asia/Kolkata',
    };
    
    const istDateOptions: Intl.DateTimeFormatOptions = {
        ...dateOptions,
        timeZone: 'Asia/Kolkata',
    };
    
    const renderClock = (label: string, date: Date | null, timeOpts: Intl.DateTimeFormatOptions, dateOpts: Intl.DateTimeFormatOptions) => (
        <Card className="flex-1 p-6 text-center bg-background/50">
            <h3 className="text-lg font-headline text-muted-foreground">{label}</h3>
            {date ? (
                <>
                    <p className="text-5xl font-bold font-mono tracking-tight text-primary">{date.toLocaleTimeString('en-US', timeOpts)}</p>
                    <p className="text-sm text-muted-foreground">{date.toLocaleDateString('en-US', dateOpts)}</p>
                </>
            ) : (
                 <div className="space-y-2 mt-1">
                    <Skeleton className="h-12 w-48 mx-auto" />
                    <Skeleton className="h-4 w-56 mx-auto" />
                </div>
            )}
        </Card>
    );

    return (
        <div className="bg-background py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Current Time</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Connecting you with Kerala, one second at a time.
                    </p>
                </div>
                 <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
                    {renderClock("Local Time", time, timeOptions, dateOptions)}
                    {renderClock("Indian Time", time, istTimeOptions, istDateOptions)}
                </div>
            </div>
        </div>
    );
}

