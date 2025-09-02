
'use client';

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ThemeProvider } from "@/components/theme-provider";
import { Ribbon } from "./Ribbon";
import { useAuth } from '@/lib/firebase/auth';
import { cn } from "@/lib/utils";

export function AppBody({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { appUser } = useAuth();

    const isAuthPage = pathname.startsWith('/auth');
    const isAdminOrUserPage = pathname.startsWith('/admin') || pathname.startsWith('/user');
    const isPublicPage = !isAdminOrUserPage && !isAuthPage;
    
    const getBorderClass = () => {
        if (!appUser || isPublicPage || isAuthPage) return "";
        if (appUser.roles?.admin) return "role-border-admin";
        if (appUser.roles?.organizer) return "role-border-organizer";
        return "role-border-user";
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className={cn("relative flex min-h-screen flex-col bg-background transition-all", getBorderClass())}>
                {isPublicPage && <Ribbon />}
                {isPublicPage && <Header />}
                <main className="flex-1">{children}</main>
                {isPublicPage && <Footer />}
            </div>
        </ThemeProvider>
    )
}
