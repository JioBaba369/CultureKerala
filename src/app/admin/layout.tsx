
'use client';

import {
  Bell,
  Home,
  Users,
  Calendar,
  Building,
  TicketPercent,
  Film,
  Settings,
  ShieldCheck,
  LayoutGrid,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { AppHeader } from '@/components/app-header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <Home /> },
    { href: '/admin/moderation', label: 'Moderation', icon: <ShieldCheck /> },
    { href: '/admin/events', label: 'Events', icon: <Calendar /> },
    { href: '/admin/communities', label: 'Communities', icon: <Users /> },
    { href: '/admin/businesses', label: 'Businesses', icon: <Building /> },
    { href: '/admin/deals', label: 'Deals', icon: <TicketPercent /> },
    { href: '/admin/movies', label: 'Movies', icon: <Film /> },
    { href: '/admin/users', label: 'Users', icon: <Users /> },
    { href: '/admin/settings', label: 'Site Settings', icon: <Settings /> },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="border-r">
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton href={item.href} isActive={pathname === item.href}>
                    {item.icon}
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1">
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
