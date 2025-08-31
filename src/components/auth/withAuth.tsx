'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuSkeleton, SidebarProvider } from '../ui/sidebar';
import Link from 'next/link';
import { KeralaIcon } from '../ui/kerala-icon';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      // Redirect to login only after authentication state is resolved and no user is found.
      if (!loading && !user) {
        router.push(`/auth/login?redirect=${pathname}`);
      }
    }, [user, loading, router, pathname]);

    if (loading) {
      return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-muted/40">
            <Sidebar className="border-r">
                <SidebarContent>
                <SidebarHeader>
                        <Link href="/" className="flex items-center gap-2">
                            <KeralaIcon className="h-6 w-6 text-primary" />
                            <span className="font-headline font-semibold text-lg">Culture Kerala</span>
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
               <main id="main" className="h-full w-full bg-background p-8 rounded-lg shadow-sm">
                  <SidebarMenuSkeleton />
               </main>
            </div>
            </div>
        </SidebarProvider>
      );
    }
    
    // Once loading is complete, if there's no user, the effect will handle the redirect.
    // So we just return null here to prevent rendering the wrapped component prematurely.
    if (!user) {
      return null;
    }

    // If there is a user, render the wrapped component.
    return <WrappedComponent {...props} />;
  };

  Wrapper.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return Wrapper;
};

export default withAuth;