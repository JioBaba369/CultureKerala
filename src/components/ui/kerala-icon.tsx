
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
            {/* Abstract palm leaf */}
            <path d="M12 2a9.96 9.96 0 0 0-7 5" />
            <path d="M12 2a9.96 9.96 0 0 1 7 5" />
            <path d="M12 2v20" />
            <path d="M5 7c0 5 7 6 7 13" />
            <path d="M19 7c0 5-7 6-7 13" />
             {/* Nilavilakku (lamp) flame */}
            <path d="M9 22h6" />
        </svg>
    );
}
