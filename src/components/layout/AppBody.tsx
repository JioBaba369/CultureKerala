
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

  return (
      <div className={cn("relative flex min-h-screen flex-col", { 'bg-card': isAdminPage })}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
  );
}
