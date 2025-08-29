
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, PlusCircle, Trash, Edit, Phone } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { EmergencyContact } from '@/types';
import { TableSkeleton } from '@/components/skeletons/table-skeleton';
import { Badge } from '@/components/ui/badge';

export default function AdminEmergencyContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "emergency_contacts"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmergencyContact));
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch emergency contacts.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteDoc(doc(db, "emergency_contacts", id));
      toast({
        title: "Contact Deleted",
        description: `"${name}" has been successfully deleted.`,
      });
      fetchContacts(); // Refresh the list
    } catch (error) {
      console.error("Error deleting document: ", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem deleting the contact.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-headline font-bold flex items-center gap-3"><Phone /> Manage Emergency Contacts</h1>
        <Button asChild>
          <Link href="/admin/PlatformAdmin/emergency-contacts/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Contact
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Contacts</CardTitle>
          <CardDescription>
            Create, edit, and manage all emergency contact numbers.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {loading ? (
            <TableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map(contact => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                        {contact.name}
                    </TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{contact.category.replace('_', ' ')}</Badge></TableCell>
                    <TableCell>{contact.city ? `${contact.city}, ` : ''}{contact.state ? `${contact.state}, ` : ''}{contact.country}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell className="text-right">
                       <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/PlatformAdmin/emergency-contacts/${contact.id}/edit`} className="flex items-center gap-2"><Edit />Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                             <AlertDialogTrigger asChild>
                               <DropdownMenuItem className="text-destructive flex items-center gap-2" onSelect={(e) => e.preventDefault()}><Trash />Delete</DropdownMenuItem>
                             </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                         <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the
                              contact "{contact.name}" and remove its data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(contact.id, contact.name)}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
