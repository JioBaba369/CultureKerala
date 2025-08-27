
import React from 'react';
import { cn } from '@/lib/utils';

export function KeralaIcon({ className, ...props }: React.ComponentProps<'svg'>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-6 w-6", className)}
            {...props}
        >
            <title>Culture Kerala Icon</title>
            <path d="M2 22l8-8" />
            <path d="M11.5 2.5c-2.5.5 -5 2.5 -5 2.5s2 2.5 2.5 5" />
            <path d="M12 12c-2 2 -4.5 3.5 -4.5 3.5s1.5 -2.5 3.5 -4.5" />
            <path d="M17.5 7.5c2 0 4 1.5 4 1.5s-2 1.5 -4 1.5" />
            <path d="M22 2c-1 3.5 -3 5.5 -3 5.5s-2-2-5.5-3" />
        </svg>
    );
}
