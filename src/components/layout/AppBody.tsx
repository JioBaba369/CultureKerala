
'use client';

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function AppBody({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');

    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            {!isAdminPage && <Header />}
            {children}
            {!isAdminPage && <Footer />}
        </div>
    )
}
