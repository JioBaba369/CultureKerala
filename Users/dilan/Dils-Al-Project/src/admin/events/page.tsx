
'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, PlusCircle, Edit, Trash, Calendar, Share2, ExternalLink } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Event as EventType } from '@/types';
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
import { TableSkeleton } from '@/components/skeletons/table-skeleton';
import { useAuth } from '@/lib/firebase/auth';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ShareDialog } from '@/components/ui/share-dialog';
import { EmptyState } from '@/components/cards/EmptyState';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, appUser } = useAuth();

  const fetchEvents = useCallback(async () => {
    if (!user || !appUser) return;
    setLoading(true);
    try {
      const eventsRef = collection(db, "events");
      let q;
      if (appUser.roles?.admin) {
        q = query(eventsRef);
      } else {
        q = query(eventsRef, where('createdBy', '==', user.uid));
      }
        
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventType));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch events.",
      });
    } finally {
      setLoading(false);
    }
  }, [user, appUser, toast]);

  useEffect(() => {
    if (user && appUser) {
      fetchEvents();
    }
  }, [user, appUser, fetchEvents]);

  const handleDelete = async (eventId: string, eventTitle: string) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      toast({
        title: "Event Deleted",
        description: `"${eventTitle}" has been successfully deleted.`,
      });
      fetchEvents(); // Refresh the list
    } catch (error) {
      console.error("Error deleting document: ", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem deleting the event.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-headline font-bold flex items-center gap-3"><Calendar /> Manage Events</h1>
        <Button asChild>
          <Link href="/admin/events/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Event
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Events</CardTitle>
          <CardDescription>
            Create, edit, and manage all events you've organized.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton numCols={4} />
          ) : events.length === 0 ? (
            <EmptyState 
                title="No Events Yet"
                description="Get started by creating your first event."
                link="/admin/events/new"
                linkText="Create Event"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map(event => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{format(event.startsAt.toDate(), "PPP")}</TableCell>
                    <TableCell><Badge variant={event.status === 'published' ? 'default' : 'secondary'} className='capitalize'>{event.status}</Badge></TableCell>
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
                              <Link href={`/admin/events/${event.id}/edit`} className="flex items-center gap-2 cursor-pointer"><Edit className="h-4 w-4" />Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/events/${event.slug}`} target="_blank" className="flex items-center gap-2 cursor-pointer"><ExternalLink className="h-4 w-4" /> View Public Page</Link>
                            </DropdownMenuItem>
                            <ShareDialog 
                                itemUrl={`/events/${event.slug}`}
                                title={event.title}
                                trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 cursor-pointer"><Share2 className="h-4 w-4" />Share</DropdownMenuItem>}
                              />
                            <DropdownMenuSeparator />
                             <AlertDialogTrigger asChild>
                               <DropdownMenuItem className="text-destructive flex items-center gap-2 cursor-pointer" onSelect={(e) => e.preventDefault()}><Trash className="h-4 w-4" />Delete</DropdownMenuItem>
                             </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                         <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the
                              event "{event.title}" and remove its data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(event.id, event.title)}>
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
