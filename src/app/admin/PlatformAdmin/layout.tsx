
'use client';

import { useAuth } from '@/lib/firebase/auth';
import { EmptyState } from '@/components/cards/EmptyState';
import { SidebarMenuSkeleton } from '@/components/ui/sidebar';

export default function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { appUser, loading } = useAuth();

  if (loading) {
    return (
       <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <SidebarMenuSkeleton showIcon />
          <SidebarMenuSkeleton showIcon />
          <SidebarMenuSkeleton showIcon />
        </div>
      </div>
    )
  }

  if (!appUser?.roles?.admin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Permission Denied"
          description="You do not have permission to access this page."
          link="/admin"
          linkText="Back to Dashboard"
        />
      </div>
    );
  }

  return <>{children}</>;
}
