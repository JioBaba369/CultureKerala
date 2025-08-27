
import React from 'react';
import { cn } from '@/lib/utils';

export function KeralaIcon({ className, ...props }: React.ComponentProps<'svg'>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-6 w-6", className)}
            {...props}
        >
            <title>Culture Kerala Icon</title>
            <path d="M12 2v20" />
            <path d="M6 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2" />
            <path d="M18 12h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
            <path d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 3.58 2.5 6.5 5.5 7.5" />
            <path d="M12 2a7.5 7.5 0 0 1 7.5 7.5c0 3.58-2.5 6.5-5.5 7.5" />
        </svg>
    );
}
