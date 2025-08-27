
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
            <path d="M12 2c-3.7-.8-5.3 2-5 5 .3 3.4 2.8 5 4.8 5 2.1 0 4.8-1.5 5.2-5 .2-3.8-1.6-5.8-5-5z" />
            <path d="M12 2v20" />
            <path d="M22 12c-3.4.3-5 2.8-5 4.8 0 2.1 1.5 4.8 5 5.2 3.8.2 5.8-1.6 5-5 -.8-3.7-2-5.3-5-5z" transform="rotate(180 17 17)"/>
        </svg>
    );
}
