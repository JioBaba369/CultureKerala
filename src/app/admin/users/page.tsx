
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { User } from 'firebase/auth';

// We'll define a simpler user type for display purposes
type AppUser = {
  uid: string;
  email: string | null;
  // In the future, we can add roles here
  // role: 'platformAdmin' | 'communityAdmin' | 'user';
};

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      // NOTE: Firestore SDK does not provide a direct way to list all auth users.
      // This is a placeholder for fetching users, which would typically be done 
      // from a 'users' collection in Firestore that mirrors Auth users.
      // For this example, we'll mock a fetch.
      try {
        // In a real app, you would fetch from a 'users' collection in Firestore
        // const querySnapshot = await getDocs(collection(db, "users"));
        // const usersData = querySnapshot.docs.map(doc => ({ ...doc.data() } as AppUser));
        
        // Mocked data for demonstration
        const mockUsers: AppUser[] = [
          { uid: '1', email: 'admin@example.com' },
          { uid: '2', email: 'user1@example.com' },
          { uid: '3', email: 'user2@example.com' },
        ];
        setUsers(mockUsers);

      } catch (error) {
        console.error("Error fetching users: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch users. Note: Listing all users requires a backend function.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Users</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage user roles and permissions. (Role management coming soon)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.uid}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.uid}</TableCell>
                    <TableCell>User</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
