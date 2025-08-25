'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Ticket } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Booking } from '@/types';
import { format } from 'date-fns';
import { TableSkeleton } from '@/components/skeletons/table-skeleton';


export default function SalesPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings: ", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch sales data.",
            });
        } finally {
            setLoading(false);
        }
    };
    fetchBookings();
  }, [toast]);
  
  const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
  const totalTicketsSold = bookings.reduce((acc, booking) => acc + booking.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-headline font-bold mb-8">Sales & Revenue</h1>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">₹{loading ? <Skeleton className='h-8 w-24 inline-block' /> : totalRevenue.toLocaleString()}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{loading ? <Skeleton className='h-8 w-16 inline-block' /> : `+${totalTicketsSold.toLocaleString()}`}</div>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Booking History</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <TableSkeleton numCols={5} />
                ) : (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className='text-center'>Quantity</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {bookings.map(booking => (
                            <TableRow key={booking.id}>
                                <TableCell className="font-medium">{booking.eventTitle}</TableCell>
                                <TableCell>{format(booking.createdAt.toDate(), 'PPP p')}</TableCell>
                                <TableCell>{booking.userId.substring(0,12)}...</TableCell>
                                <TableCell className="text-center">{booking.quantity}</TableCell>
                                <TableCell className="text-right">₹{booking.totalPrice.toLocaleString()}</TableCell>
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
