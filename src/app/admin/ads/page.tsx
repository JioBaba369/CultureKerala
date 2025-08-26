
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, PlusCircle, Trash, Edit, Megaphone, Star, BadgeCent } from "lucide-react";
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
import type { Ad } from '@/types';
import { TableSkeleton } from '@/components/skeletons/table-skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAds = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "ads"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad));
      setAds(data);
    } catch (error) {
      console.error("Error fetching ads: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch ads.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteDoc(doc(db, "ads", id));
      toast({
        title: "Ad Deleted",
        description: `"${name}" has been successfully deleted.`,
      });
      fetchAds(); // Refresh the list
    } catch (error) {
      console.error("Error deleting document: ", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem deleting the ad.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-headline font-bold flex items-center gap-3"><Megaphone /> Manage Ads</h1>
        <Button asChild>
          <Link href="/admin/ads/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Ad
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Ads</CardTitle>
          <CardDescription>
            Create, edit, and manage all advertisements and promotions.
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
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.map(ad => (
                  <TableRow key={ad.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                        {ad.featured?.isFeatured && <Star className="h-4 w-4 text-amber-400 fill-current" />}
                        {ad.title}
                    </TableCell>
                    <TableCell><Badge variant={ad.status === 'running' ? 'default' : 'secondary'}>{ad.status}</Badge></TableCell>
                    <TableCell><Badge variant="outline">{ad.creative.type.replace('_', ' ')}</Badge></TableCell>
                    <TableCell>{ad.counts?.impressions || 0}</TableCell>
                    <TableCell>{ad.counts?.clicks || 0}</TableCell>
                    <TableCell>{format(ad.schedule.startAt.toDate(), 'PP')} - {format(ad.schedule.endAt.toDate(), 'PP')}</TableCell>
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
                              <Link href={`/admin/ads/${ad.id}/edit`} className="flex items-center gap-2"><Edit />Edit</Link>
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
                              ad "{ad.title}" and remove its data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(ad.id, ad.title)}>
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
