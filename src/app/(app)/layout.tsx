
'use client';

import { GlobalSearch } from '@/components/ui/global-search';
import React from 'react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="flex flex-col min-h-screen">
      {children}
    </main>
  );
}
