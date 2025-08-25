
'use client';

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ThemeWrapper } from "@/app/components/theme-provider";
import { useSiteConfig } from "@/hooks/use-site-config";

export function AppBody({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    const isAuthPage = pathname.startsWith('/auth');
    useSiteConfig();

    return (
        <ThemeWrapper>
            <div className="relative flex min-h-screen flex-col bg-background">
                {!isAdminPage && !isAuthPage && <Header />}
                {children}
                {!isAdminPage && !isAuthPage && <Footer />}
            </div>
        </ThemeWrapper>
    )
}
