
import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function KeralaIcon({ className, ...props }: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) {
    return (
        <Image
            src="https://firebasestorage.googleapis.com/v0/b/culturekerala.firebasestorage.app/o/logo-1024.png?alt=media&token=0852933f-55fb-444b-825d-6713400d428d"
            alt="Culture Kerala Logo"
            width={32}
            height={32}
            className={cn("h-8 w-8", className)}
            {...props}
        />
    );
}
