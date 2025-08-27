
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Building, TicketPercent, Film, ShieldAlert, ArrowUp, MoreVertical, CheckCircle, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { User, Event, Business, Deal, Movie, Report } from "@/types";
import { useToast } from "@/hooks/use-toast";

const statCards = [
  { title: "Total Users", icon: <Users />, collectionName: 'users' },
  { title: "Active Events", icon: <Calendar />, collectionName: 'events' },
  { title: "Listed Businesses", icon: <Building />, collectionName: 'businesses' },
  { title: "Active Deals", icon: <TicketPercent />, collectionName: 'deals' },
  { title: "Movies Screened", icon: <Film />, collectionName: 'movies' },
];

export default function AdminPage() {
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchCounts = async () => {
        const countsData: Record<string, number> = {};
        for (const card of statCards) {
            const q = query(collection(db, card.collectionName));
            const snapshot = await getDocs(q);
            countsData[card.collectionName] = snapshot.size;
        }
        const reportsQuery = query(collection(db, 'reports'), where('status', '==', 'pending'), limit(5));
        const reportsSnapshot = await getDocs(reportsQuery);
        setReports(reportsSnapshot.docs.map(d => ({id: d.id, ...d.data()} as Report)))
        countsData['reports'] = reportsSnapshot.size;
        setCounts(countsData);
        setLoading(false);
    }
    useEffect(() => {
        fetchCounts();
    }, []);

    const handleReportAction = async (reportId: string, newStatus: 'approved' | 'rejected') => {
        try {
            await updateDoc(doc(db, 'reports', reportId), { status: newStatus });
            toast({ title: "Report updated", description: `The report has been ${newStatus}.` });
            fetchCounts(); // Refresh data
        } catch(e) {
            toast({ variant: 'destructive', title: "Error", description: "Could not update the report." });
        }
    }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map(card => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className="text-muted-foreground">{card.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : counts[card.collectionName]}</div>
            </CardContent>
          </Card>
        ))}
         <Link href="/admin/PlatformAdmin/moderation" className="block">
          <Card className="border-destructive/50 hover:bg-destructive/5 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Moderation Queue</CardTitle>
                <div className="text-destructive"><ShieldAlert /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : counts['reports']}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  items require attention
                </p>
              </CardContent>
          </Card>
         </Link>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-headline font-semibold">Recent Reports</h2>
          <Button asChild variant="outline">
            <Link href="/admin/PlatformAdmin/moderation">View All</Link>
          </Button>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.itemType}</TableCell>
                  <TableCell>
                    <div className="font-medium">{item.itemTitle}</div>
                  </TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>
                    <Badge variant={"secondary"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleReportAction(item.id, 'approved')}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReportAction(item.id, 'rejected')} className="text-destructive">
                            <XCircle className="mr-2 h-4 w-4" /> Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
