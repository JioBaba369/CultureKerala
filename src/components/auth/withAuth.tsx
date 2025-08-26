
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuSkeleton, SidebarProvider } from '../ui/sidebar';
import { Heart } from 'lucide-react';
import Link from 'next/link';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/auth/login');
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return (
        <SidebarProvider>
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
                    <SidebarMenuSkeleton showIcon />
                    <SidebarMenuSkeleton showIcon />
                    <SidebarMenuSkeleton showIcon />
                    <SidebarMenuSkeleton showIcon />
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <div className="flex-1 p-8">
                <Skeleton className="h-full w-full" />
            </div>
            </div>
        </SidebarProvider>
      );
    }

    return (
        <SidebarProvider>
            <WrappedComponent {...props} />
        </SidebarProvider>
    );
  };

  return Wrapper;
};

export default withAuth;
