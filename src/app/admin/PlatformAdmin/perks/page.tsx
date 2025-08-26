
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, PlusCircle, Trash, Edit, Award } from "lucide-react";
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
import type { Perk } from '@/types';
import { TableSkeleton } from '@/components/skeletons/table-skeleton';
import { Badge } from '@/components/ui/badge';

export default function AdminPerksPage() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPerks = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "perks"));
      const perksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Perk));
      setPerks(perksData);
    } catch (error) {
      console.error("Error fetching perks: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch perks.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerks();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteDoc(doc(db, "perks", id));
      toast({
        title: "Perk Deleted",
        description: `"${name}" has been successfully deleted.`,
      });
      fetchPerks(); // Refresh the list
    } catch (error) {
      console.error("Error deleting document: ", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem deleting the perk.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-headline font-bold flex items-center gap-3"><Award /> Manage Perks</h1>
        <Button asChild>
          <Link href="/admin/PlatformAdmin/perks/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Perk
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Perks</CardTitle>
          <CardDescription>
            Create, edit, and manage all perks for DilSePass Club members.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {loading ? (
            <TableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {perks.map(perk => (
                  <TableRow key={perk.id}>
                    <TableCell className="font-medium">{perk.title}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{perk.type.replace('_', ' ')}</Badge></TableCell>
                     <TableCell><Badge variant={perk.status === 'active' ? 'default' : 'secondary'}>{perk.status}</Badge></TableCell>
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
                              <Link href={`/admin/PlatformAdmin/perks/${perk.id}/edit`} className="flex items-center gap-2"><Edit />Edit</Link>
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
                              perk "{perk.title}" and remove its data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(perk.id, perk.title)}>
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
