
'use client';

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ThemeProvider } from "@/components/theme-provider";
import { Ribbon } from "./Ribbon";

export function AppBody({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin') || pathname.startsWith('/user');
    const isAuthPage = pathname.startsWith('/auth');
    const isOnboardingPage = pathname.startsWith('/onboarding');

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="relative flex min-h-screen flex-col bg-background">
                {!isAdminPage && !isAuthPage && !isOnboardingPage && <Ribbon />}
                {!isAdminPage && !isAuthPage && !isOnboardingPage && <Header />}
                <main className="flex-1">{children}</main>
                {!isAdminPage && !isAuthPage && !isOnboardingPage && <Footer />}
            </div>
        </ThemeProvider>
    )
}
