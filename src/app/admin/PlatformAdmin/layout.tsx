
'use client';

import { useAuth } from '@/lib/firebase/auth';
import { EmptyState } from '@/components/cards/EmptyState';

export default function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (user?.email !== 'jiobaba369@gmail.com') {
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
