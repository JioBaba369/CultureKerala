
'use client';

import { Footer } from "./Footer";
import { Header } from "./Header";

export function AppBody({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <Header />
            {children}
            <Footer />
        </div>
    )
}
