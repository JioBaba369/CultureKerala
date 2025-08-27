
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, PlusCircle, Edit, Trash, Calendar } from "lucide-react";
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

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchEvents = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, "events"), where('organizers', 'array-contains', user.uid));
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
  };

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

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
        <h1 className="text-3xl font-headline font-bold flex items-center gap-3"><Calendar /> Manage Your Events</h1>
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
            <TableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map(event => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.isOnline ? 'Online' : event.venue?.address}</TableCell>
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
                              <Link href={`/admin/events/${event.id}/edit`} className="flex items-center gap-2"><Edit />Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/events/${event.slug}`} target="_blank" className="flex items-center gap-2">View Public Page</Link>
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
