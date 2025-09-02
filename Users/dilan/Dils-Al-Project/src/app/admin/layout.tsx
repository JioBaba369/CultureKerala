
'use client';

import withAuth from '@/components/auth/withAuth';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';


function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <AdminDashboardLayout>
        {children}
      </AdminDashboardLayout>
  );
}

export default withAuth(AdminLayout);
