
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
  Flame,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CircleUser } from 'lucide-react';


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
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-2">
                    <Flame className="h-6 w-6 text-primary" />
                    <span className="font-headline font-semibold text-lg">DilSePass</span>
                </Link>
            </SidebarHeader>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton isActive={pathname === item.href}>
                      {item.icon}
                      {item.label}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
           <SidebarFooter>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                        <CircleUser className="h-5 w-5" />
                        <div className='flex flex-col items-start'>
                           <span className='text-sm font-medium'>Account</span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        user@example.com
                    </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href="/">View Site</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
           </SidebarFooter>
        </Sidebar>
        <div className="flex-1 bg-background">
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
