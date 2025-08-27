
'use client';

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ThemeProvider } from "@/app/components/theme-provider";

export function AppBody({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    const isAuthPage = pathname.startsWith('/auth');

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="relative flex min-h-screen flex-col bg-background">
                {!isAdminPage && !isAuthPage && <Header />}
                <main className="flex-1">{children}</main>
                {!isAdminPage && !isAuthPage && <Footer />}
            </div>
        </ThemeProvider>
    )
}
