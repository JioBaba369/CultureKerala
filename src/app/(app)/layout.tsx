
import { GlobalSearch } from '@/components/ui/global-search';
import React from 'react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <div className="sticky top-[64px] z-40 w-full border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-3">
            <GlobalSearch />
        </div>
    </div>
    <main id="main" className="flex flex-col min-h-screen">
      {children}
    </main>
    </>
  );
}
