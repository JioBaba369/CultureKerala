
'use client';

import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { getFlagEmoji } from '@/lib/data/country-flags';
import { countryTimezones } from '@/lib/data/country-timezones';

// Create a more efficient timezone-to-country-code map
const timezoneToCountryCode = countryTimezones.reduce<Record<string, string>>((acc, ctz) => {
    ctz.timezones.forEach(tz => {
        if (!acc[tz]) {
            acc[tz] = ctz.iso_3166_1;
        }
    });
    return acc;
}, {});

function useTimeAndCountry() {
    const [time, setTime] = useState<Date | null>(null);
    const [localCountryCode, setLocalCountryCode] = useState<string | null>(null);

    useEffect(() => {
        setTime(new Date());

        if (typeof Intl !== 'undefined') {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const countryCode = timezoneToCountryCode[userTimezone];
            if (countryCode) {
                setLocalCountryCode(countryCode);
            }
        }

        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    return { time, localCountryCode };
}

export function WordClock() {
    const { time, localCountryCode } = useTimeAndCountry();

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
    
    const renderClock = (label: string, date: Date | null, timeOpts: Intl.DateTimeFormatOptions, dateOpts: Intl.DateTimeFormatOptions, countryCode: string | null) => (
        <Card className="flex-1 p-6 text-center bg-background/50">
            <h3 className="text-lg font-headline text-muted-foreground flex items-center justify-center gap-2">
                {countryCode && <span className="text-2xl">{getFlagEmoji(countryCode)}</span>}
                {label}
            </h3>
            {date ? (
                <>
                    <p className="text-5xl font-bold font-mono tracking-tight text-primary" aria-live="polite">{date.toLocaleTimeString(undefined, timeOpts)}</p>
                    <p className="text-sm text-muted-foreground">{date.toLocaleDateString(undefined, dateOpts)}</p>
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
                    {renderClock("Local Time", time, timeOptions, dateOptions, localCountryCode)}
                    {renderClock("Indian Time", time, istTimeOptions, istDateOptions, "IN")}
                </div>
            </div>
        </div>
    );
}
