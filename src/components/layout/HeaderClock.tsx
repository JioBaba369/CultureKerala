
'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';
import { getFlagEmoji } from '@/lib/data/country-flags';
import { countryTimezones } from '@/lib/data/country-timezones';

export function HeaderClock() {
    const [time, setTime] = useState<Date | null>(null);
    const [localCountryCode, setLocalCountryCode] = useState<string | null>(null);

    useEffect(() => {
        setTime(new Date());
        
        if (typeof Intl !== 'undefined') {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const country = countryTimezones.find(ctz => ctz.timezones.includes(userTimezone));
            if (country) {
                setLocalCountryCode(country.iso_3166_1);
            }
        }
        
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000); 

        return () => {
            clearInterval(timerId);
        };
    }, []);

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };

    const istTimeOptions: Intl.DateTimeFormatOptions = {
        ...timeOptions,
        timeZone: 'Asia/Kolkata',
    };

    const renderClock = (label: string, date: Date | null, timeOpts: Intl.DateTimeFormatOptions, countryCode: string | null) => (
        <div className="flex items-center gap-2">
            {countryCode && <span className="text-lg">{getFlagEmoji(countryCode)}</span>}
             <div className="flex flex-col text-xs text-left">
                <span className='font-medium text-muted-foreground'>{label}</span>
                {date ? (
                    <span className="font-mono font-semibold text-foreground">{date.toLocaleTimeString(undefined, timeOpts)}</span>
                ) : (
                    <Skeleton className="h-4 w-16" />
                )}
            </div>
        </div>
    );

    if (!time || !localCountryCode) {
        return (
             <div className="flex items-center gap-4">
                {renderClock("Local Time", null, timeOptions, null)}
                {renderClock("India Time", null, istTimeOptions, "IN")}
            </div>
        );
    }
    
    // Don't show local time if it's the same as India time
    if (localCountryCode === 'IN') {
        return (
             <div className="flex items-center gap-4">
                 {renderClock("India Time", time, istTimeOptions, "IN")}
             </div>
        )
    }

    return (
        <div className="flex items-center gap-4">
            {renderClock("Local Time", time, timeOptions, localCountryCode)}
            {renderClock("India Time", time, istTimeOptions, "IN")}
        </div>
    );
}
