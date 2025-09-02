
'use client';

import {
  Bell,
  Users,
  Calendar,
  Building,
  TicketPercent,
  Film,
  Settings,
  ShieldCheck,
  LayoutGrid,
  LogOut,
  ExternalLink,
  DollarSign,
  Award,
  Sparkles,
  Megaphone,
  UserCircle,
  Newspaper,
  Bookmark,
  Phone,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { siteConfig } from '@/config/site';
import { KeralaIcon } from '../ui/kerala-icon';
import { GlobalSearch } from '../ui/global-search';


export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, appUser, loading, logout } = useAuth();

  const managementNav = [
    { href: '/user/dashboard', label: 'Dashboard', icon: <LayoutGrid /> },
    { href: '/user/events', label: 'Events', icon: <Calendar /> },
    { href: '/user/communities', label: 'Communities', icon: <Users /> },
    { href: '/user/businesses', label: 'Businesses', icon: <Building /> },
    { href: '/user/deals', label: 'Deals', icon: <TicketPercent /> },
];

  const platformNav = [
      { href: '/admin/PlatformAdmin/users', label: 'Users', icon: <Users /> },
      { href: '/admin/PlatformAdmin/moderation', label: 'Moderation', icon: <ShieldCheck /> },
      { href: '/admin/PlatformAdmin/sales', label: 'Sales', icon: <DollarSign /> },
      { href: '/admin/PlatformAdmin/movies', label: 'Movies', icon: <Film /> },
      { href: '/admin/PlatformAdmin/ads', label: 'Ads', icon: <Megaphone /> },
      { href: '/admin/PlatformAdmin/classifieds', label: 'Classifieds', icon: <Newspaper /> },
      { href: '/admin/PlatformAdmin/emergency-contacts', label: 'Emergency Contacts', icon: <Phone /> },
      { href: '/admin/PlatformAdmin/rewards', label: 'Rewards', icon: <Sparkles /> },
      { href: '/admin/PlatformAdmin/perks', label: 'Perks', icon: <Award /> },
      { href: '/admin/PlatformAdmin/settings', label: 'Site Settings', icon: <Settings /> },
  ]


  return (
    <SidebarProvider>
        <div className="flex min-h-screen bg-muted/40">
            <Sidebar className="border-r">
            <SidebarContent>
                <SidebarHeader>
                    <Link href="/" className="flex items-center gap-2">
                        <KeralaIcon className="h-6 w-6 text-primary" />
                        <span className="font-headline font-semibold text-lg">{siteConfig.name}</span>
                    </Link>
                </SidebarHeader>
                <SidebarMenu>
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
                {appUser?.roles?.admin && (
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
                )}
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
                            <div className='flex flex-col items-start text-left'>
                            <span className='text-sm font-medium leading-none'>{appUser?.displayName}</span>
                                <span className="text-xs leading-none text-muted-foreground truncate max-w-[120px]">
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
                            @{appUser?.username}
                        </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/user/account"><UserCircle className="mr-2 h-4 w-4" />My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/user/saved"><Bookmark className="mr-2 h-4 w-4" />Saved Items</Link>
                    </DropdownMenuItem>
                    {appUser?.username && (
                        <DropdownMenuItem asChild>
                            <Link href={`/profile/${appUser.username}`} target="_blank"><ExternalLink className="mr-2 h-4 w-4" /> View Public Profile</Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/user/dashboard"><LayoutGrid className="mr-2 h-4 w-4" />Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}><LogOut className="mr-2 h-4 w-4"/>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
            </Sidebar>
            <div className="flex-1">
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 md:hidden">
                    <SidebarTrigger />
                    <GlobalSearch className="w-full" />
                </header>
                <SidebarInset>
                    {children}
                </SidebarInset>
            </div>
        </div>
    </SidebarProvider>
  );
}
