
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { SidebarMenuSkeleton } from '../ui/sidebar';
import { Loader2 } from 'lucide-react';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const { user, appUser, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (loading) return;

      if (!user) {
        router.push(`/auth/login?redirect=${pathname}`);
        return;
      }
      
      const isAdminRoute = pathname.startsWith('/admin/');
      if (isAdminRoute && !appUser?.roles?.admin) {
        router.push('/my/dashboard');
      }

    }, [user, appUser, loading, router, pathname]);

    if (loading || !user) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };

  Wrapper.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return Wrapper;
};

export default withAuth;
