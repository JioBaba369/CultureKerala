
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
  LogOut,
  ExternalLink,
  DollarSign,
  Award,
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
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CircleUser } from 'lucide-react';
import withAuth from '@/components/auth/withAuth';
import { useAuth } from '@/lib/firebase/auth';


function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const managementNav = [
    { href: '/admin/events', label: 'Events', icon: <Calendar /> },
    { href: '/admin/communities', label: 'Communities', icon: <Users /> },
    { href: '/admin/businesses', label: 'Businesses', icon: <Building /> },
    { href: '/admin/deals', label: 'Deals', icon: <TicketPercent /> },
    { href: '/admin/movies', label: 'Movies', icon: <Film /> },
    { href: '/admin/sales', label: 'Sales', icon: <DollarSign /> },
    { href: '/admin/perks', label: 'Perks', icon: <Award /> },
  ]

  const platformNav = [
      { href: '/admin/users', label: 'Users', icon: <Users /> },
      { href: '/admin/moderation', label: 'Moderation', icon: <ShieldCheck /> },
      { href: '/admin/settings', label: 'Site Settings', icon: <Settings /> },
  ]


  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar className="border-r">
          <SidebarContent>
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-2">
                    <Flame className="h-6 w-6 text-primary" />
                    <span className="font-headline font-semibold text-lg">DilSePass</span>
                </Link>
            </SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <Link href={'/admin'}>
                    <SidebarMenuButton isActive={pathname === '/admin'}>
                      <Home />
                      Dashboard
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              <SidebarGroup>
                <SidebarGroupLabel>Management</SidebarGroupLabel>
                  {managementNav.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <Link href={item.href}>
                        <SidebarMenuButton isActive={pathname.startsWith(item.href)}>
                          {item.icon}
                          {item.label}
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
              </SidebarGroup>
               <SidebarGroup>
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                 {platformNav.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                      <SidebarMenuButton isActive={pathname.startsWith(item.href)}>
                        {item.icon}
                        {item.label}
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarGroup>
            </SidebarMenu>
          </SidebarContent>
           <SidebarFooter>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                        <CircleUser className="h-5 w-5" />
                         <div className='flex flex-col items-start'>
                           <span className='text-sm font-medium leading-none'>Account</span>
                            <span className="text-xs leading-none text-muted-foreground truncate">
                                {user?.email}
                            </span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                    </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/" target="_blank"><ExternalLink /> View Site</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}><LogOut />Log out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
           </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default withAuth(AdminLayout);
