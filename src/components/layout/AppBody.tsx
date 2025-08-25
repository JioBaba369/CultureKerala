
'use client';

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

export function AppBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    return (
        <div className="relative flex min-h-screen flex-col bg-muted/40">
            {children}
        </div>
    )
  }

  return (
      <div className={cn("relative flex min-h-screen flex-col")}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
  );
}
