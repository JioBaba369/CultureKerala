'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { User as AppUser } from '@/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { MoreVertical, Edit } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TableSkeleton } from '@/components/skeletons/table-skeleton';

function RoleManagementDialog({ user, onRoleChange, children }: { user: AppUser, onRoleChange: (roles: AppUser['roles']) => void, children: React.ReactNode }) {
    const [roles, setRoles] = useState(user.roles);
    const [isOpen, setIsOpen] = useState(false);

    const handleRoleChange = (role: keyof AppUser['roles'], value: boolean) => {
        setRoles(prev => ({ ...prev, [role]: value }));
    };

    const handleSave = () => {
        onRoleChange(roles);
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setIsOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Roles
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Roles for {user.displayName}</DialogTitle>
                    <DialogDescription>
                        Assign or revoke roles for this user. Changes will take effect immediately.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="admin-role" className="font-medium">Admin</Label>
                        <Switch id="admin-role" checked={roles.admin} onCheckedChange={(val) => handleRoleChange('admin', val)} />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="moderator-role" className="font-medium">Moderator</Label>
                        <Switch id="moderator-role" checked={roles.moderator} onCheckedChange={(val) => handleRoleChange('moderator', val)} />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="organizer-role" className="font-medium">Organizer</Label>
                        <Switch id="organizer-role" checked={roles.organizer} onCheckedChange={(val) => handleRoleChange('organizer', val)} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppUser));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users from Firestore.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [toast]);

  const handleRoleChange = async (userId: string, newRoles: AppUser['roles']) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { roles: newRoles });
        toast({
            title: "Roles Updated",
            description: "User roles have been successfully updated.",
        });
        fetchUsers(); // Refresh data
    } catch (error) {
         console.error("Error updating roles: ", error);
         toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update user roles.",
        });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Users</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage user roles and permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton numCols={5} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.uid}>
                    <TableCell className="font-medium">{user.displayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.createdAt ? format(user.createdAt.toDate(), 'PPP') : 'N/A'}</TableCell>
                    <TableCell className='space-x-1'>
                      {user.roles.admin && <Badge variant={'default'}>Admin</Badge>}
                      {user.roles.moderator && <Badge variant={'secondary'}>Moderator</Badge>}
                      {user.roles.organizer && <Badge variant={'outline'}>Organizer</Badge>}
                      {!user.roles.admin && !user.roles.moderator && !user.roles.organizer && <Badge variant={'outline'}>User</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                       <RoleManagementDialog user={user} onRoleChange={(newRoles) => handleRoleChange(user.id, newRoles)}>
                         <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                         </Button>
                       </RoleManagementDialog>
                    </TableCell>
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
