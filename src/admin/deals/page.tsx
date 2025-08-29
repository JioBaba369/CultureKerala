'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, PlusCircle, Trash, Edit, TicketPercent } from "lucide-react";
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
import type { Deal, Business } from '@/types';
import { TableSkeleton } from '@/components/skeletons/table-skeleton';
import { useAuth } from '@/lib/firebase/auth';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { EmptyState } from '@/components/cards/EmptyState';

type DealWithBusiness = Deal & { businessName?: string };

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<DealWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, appUser } = useAuth();

  const fetchDeals = async () => {
    if (!user || !appUser) return;
    setLoading(true);
    try {
      const dealsRef = collection(db, "deals");
      const q = appUser.roles?.admin 
        ? dealsRef
        : query(dealsRef, where('createdBy', '==', user.uid));
        
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deal));

      const businessIds = [...new Set(data.map(deal => deal.businessId).filter(Boolean))];
      const businesses: Record<string, string> = {};
      if (businessIds.length > 0) {
        const businessQuery = query(collection(db, 'businesses'), where('__name__', 'in', businessIds));
        const businessSnapshot = await getDocs(businessQuery);
        businessSnapshot.forEach(doc => {
            businesses[doc.id] = (doc.data() as Business).displayName;
        });
      }

      const dealsWithBusinessData = data.map(deal => ({
          ...deal,
          businessName: businesses[deal.businessId] || 'N/A',
      }));

      setDeals(dealsWithBusinessData);
    } catch (error) {
      console.error("Error fetching deals: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch deals.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && appUser) {
        fetchDeals();
    }
  }, [user, appUser]);

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteDoc(doc(db, "deals", id));
      toast({
        title: "Deal Deleted",
        description: `"${name}" has been successfully deleted.`,
      });
      fetchDeals(); // Refresh the list
    } catch (error) {
      console.error("Error deleting document: ", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem deleting the deal.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-headline font-bold flex items-center gap-3"><TicketPercent /> Manage Deals</h1>
        <Button asChild>
          <Link href="/admin/deals/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Deal
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Deals</CardTitle>
          <CardDescription>
            Create, edit, and manage all your deals.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {loading ? (
            <TableSkeleton numCols={5}/>
          ) : deals.length === 0 ? (
            <EmptyState 
                title="No Deals Yet"
                description="Get started by creating your first deal."
                link="/admin/deals/new"
                linkText="Create Deal"
            />
           ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map(deal => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.title}</TableCell>
                    <TableCell>{deal.businessName}</TableCell>
                    <TableCell><Badge variant={deal.status === 'published' ? 'default' : 'secondary'} className='capitalize'>{deal.status}</Badge></TableCell>
                    <TableCell>{format(deal.endsAt.toDate(), "PPP")}</TableCell>
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
                              <Link href={`/admin/deals/${deal.id}/edit`} className="flex items-center gap-2 cursor-pointer"><Edit />Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                             <AlertDialogTrigger asChild>
                               <DropdownMenuItem className="text-destructive flex items-center gap-2 cursor-pointer" onSelect={(e) => e.preventDefault()}><Trash />Delete</DropdownMenuItem>
                             </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                         <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the
                              deal "{deal.title}" and remove its data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(deal.id, deal.title)}>
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
