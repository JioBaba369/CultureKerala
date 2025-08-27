
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
  Heart,
  LogOut,
  ExternalLink,
  DollarSign,
  Award,
  Sparkles,
  Megaphone,
  UserCog,
  UserCircle,
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
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import withAuth from '@/components/auth/withAuth';
import { useAuth } from '@/lib/firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, appUser, loading, logout } = useAuth();
  const isPlatformAdmin = user?.email === 'jiobaba369@gmail.com';

  const managementNav = [
    { href: '/admin/events', label: 'Events', icon: <Calendar /> },
    { href: '/admin/communities', label: 'Communities', icon: <Users /> },
    { href: '/admin/businesses', label: 'Businesses', icon: <Building /> },
    { href: '/admin/deals', label: 'Deals', icon: <TicketPercent /> },
    { href: '/admin/movies', label: 'Movies', icon: <Film /> },
  ]

  const platformNav = [
      { href: '/admin/PlatformAdmin/users', label: 'Users', icon: <Users /> },
      { href: '/admin/PlatformAdmin/moderation', label: 'Moderation', icon: <ShieldCheck /> },
      { href: '/admin/PlatformAdmin/sales', label: 'Sales', icon: <DollarSign /> },
      { href: '/admin/PlatformAdmin/ads', label: 'Ads', icon: <Megaphone /> },
      { href: '/admin/PlatformAdmin/rewards', label: 'Rewards', icon: <Sparkles /> },
      { href: '/admin/PlatformAdmin/perks', label: 'Perks', icon: <Award /> },
      { href: '/admin/PlatformAdmin/settings', label: 'Site Settings', icon: <Settings /> },
  ]


  return (
    <div className="flex min-h-screen bg-muted/40">
        <Sidebar className="border-r">
          <SidebarContent>
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-primary" />
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
                 {loading ? (
                    <>
                      <SidebarMenuSkeleton showIcon />
                      <SidebarMenuSkeleton showIcon />
                      <SidebarMenuSkeleton showIcon />
                    </>
                 ) : (
                    isPlatformAdmin && platformNav.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href}>
                            <SidebarMenuButton isActive={pathname.startsWith(item.href)}>
                                {item.icon}
                                {item.label}
                            </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))
                 )}
              </SidebarGroup>
            </SidebarMenu>
          </SidebarContent>
           <SidebarFooter>
               <Button variant="outline" asChild className="w-full">
                <Link href="/"><ExternalLink className="mr-2 h-4 w-4" /> View Site</Link>
               </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={appUser?.photoURL || undefined} alt={appUser?.displayName || 'User'} />
                            <AvatarFallback>{appUser?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                         <div className='flex flex-col items-start'>
                           <span className='text-sm font-medium leading-none'>{appUser?.displayName}</span>
                            <span className="text-xs leading-none text-muted-foreground truncate">
                                {user?.email}
                            </span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{appUser?.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                    </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/admin/account"><UserCog className="mr-2 h-4 w-4" />My Account</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href={`/profile/${appUser?.username}`} target="_blank"><ExternalLink className="mr-2 h-4 w-4" /> View Public Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}><LogOut className="mr-2 h-4 w-4"/>Log out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
           </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
  );
}

export default withAuth(AdminLayout);
