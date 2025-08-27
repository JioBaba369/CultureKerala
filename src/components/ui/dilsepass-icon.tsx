
import React from 'react';
import { cn } from '@/lib/utils';

export function DilSePassIcon({ className, ...props }: React.ComponentProps<'svg'>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-6 w-6", className)}
            {...props}
        >
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="90">🐘</text>
        </svg>
    );
}
