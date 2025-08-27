
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Calendar, Building, TicketPercent, Film, ShieldAlert, Newspaper, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Report } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/firebase/auth";

const managementSections = [
    { title: "Events", icon: <Calendar />, description: "Create and manage events.", href: "/admin/events" },
    { title: "Communities", icon: <Users />, description: "Manage community pages.", href: "/admin/communities" },
    { title: "Businesses", icon: <Building />, description: "Manage business listings.", href: "/admin/businesses" },
    { title: "Deals", icon: <TicketPercent />, description: "Create and track deals.", href: "/admin/deals" },
    { title: "Movies", icon: <Film />, description: "Manage movie screenings.", href: "/admin/movies" },
];

export default function AdminPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const { appUser } = useAuth();

    const fetchDashboardData = async () => {
        try {
            const reportsQuery = query(collection(db, 'reports'), where('status', '==', 'pending'), limit(5));
            const reportsSnapshot = await getDocs(reportsQuery);
            setReports(reportsSnapshot.docs.map(d => ({id: d.id, ...d.data()} as Report)));
        } catch (error) {
            console.error("Error fetching reports: ", error);
            toast({ variant: "destructive", title: "Error", description: "Could not load dashboard data." });
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleReportAction = async (reportId: string, newStatus: 'approved' | 'rejected') => {
        try {
            await updateDoc(doc(db, 'reports', reportId), { status: newStatus });
            toast({ title: "Report updated", description: `The report has been ${newStatus}.` });
            fetchDashboardData(); // Refresh data
        } catch(e) {
            toast({ variant: 'destructive', title: "Error", description: "Could not update the report." });
        }
    }

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({length: 5}).map((_, i) => (
                        <Card key={i}><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-4 w-3/4" /></CardContent></Card>
                    ))}
                </div>
                 <Card>
                    <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
                    <CardContent><Skeleton className="h-32 w-full" /></CardContent>
                </Card>
            </div>
        )
    }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Welcome, {appUser?.displayName || 'Admin'}!</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {managementSections.map(section => (
          <Card key={section.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {section.icon}
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{section.description}</p>
                <Button asChild variant="outline" size="sm">
                    <Link href={section.href}>Manage <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>

       {appUser?.roles.admin && (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-headline font-semibold flex items-center gap-3"><ShieldAlert /> Moderation Queue</h2>
            <Button asChild variant="outline">
                <Link href="/admin/PlatformAdmin/moderation">View All Reports</Link>
            </Button>
            </div>
            <Card>
             <CardContent className="pt-6">
                {reports.length > 0 ? (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {reports.map(item => (
                            <TableRow key={item.id}>
                            <TableCell>{item.itemTitle}</TableCell>
                            <TableCell><Badge variant="outline">{item.itemType}</Badge></TableCell>
                            <TableCell className="truncate max-w-xs">{item.reason}</TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" variant="ghost" onClick={() => handleReportAction(item.id, 'approved')}>Approve</Button>
                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleReportAction(item.id, 'rejected')}>Reject</Button>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>The moderation queue is clear. Great job!</p>
                    </div>
                )}
             </CardContent>
            </Card>
        </div>
       )}
    </div>
  );
}
