'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Report } from "@/types";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

type ModerationStatus = "pending" | "approved" | "rejected";
const TABS: ModerationStatus[] = ["pending", "approved", "rejected"];

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState<ModerationStatus>("pending");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Content Moderation</h1>
      
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ModerationStatus)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              {TABS.map((tab) => (
                <TabsTrigger key={tab} value={tab} className="capitalize">{tab}</TabsTrigger>
              ))}
            </TabsList>

           {TABS.map((tab) => (
             <TabsContent key={tab} value={tab}>
                <Card>
                    <CardHeader>
                        <CardTitle className="capitalize">{tab} Reports</CardTitle>
                        <CardDescription>
                            Review and manage content reports that are currently {tab}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ModerationTable status={tab} />
                    </CardContent>
                </Card>
             </TabsContent>
            ))}
        </Tabs>
    </div>
  );
}

function ModerationTable({ status }: { status: ModerationStatus }) {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchReports = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'reports'), where('status', '==', status));
            const snapshot = await getDocs(q);
            setReports(snapshot.docs.map(d => ({id: d.id, ...d.data()} as Report)));
        } catch (e) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch reports.' });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchReports();
    }, [status]);


     const handleReportAction = async (reportId: string, newStatus: 'approved' | 'rejected') => {
        try {
            await updateDoc(doc(db, 'reports', reportId), { status: newStatus });
            toast({ title: "Report updated", description: `The report has been ${newStatus}.` });
            fetchReports(); // Refresh data
        } catch(e) {
            toast({ variant: 'destructive', title: "Error", description: "Could not update the report." });
        }
    }


  if (loading) {
    return <TableSkeleton numCols={6} />
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
        <h3 className="font-headline text-2xl">No items in this queue</h3>
        <p>All clear for now!</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
          {status === 'pending' && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
                <Badge variant="outline">{item.itemType}</Badge>
            </TableCell>
            <TableCell>
              <div className="font-medium">{item.itemTitle}</div>
            </TableCell>
            <TableCell>{item.reason}</TableCell>
            <TableCell>{formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true })}</TableCell>
            <TableCell>
              <Badge variant={item.status === "pending" ? "secondary" : item.status === "approved" ? "default" : "destructive"} className="capitalize">
                {item.status}
              </Badge>
            </TableCell>
            {status === 'pending' && (
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                         <DropdownMenuItem onClick={() => handleReportAction(item.id, 'approved')}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Approve Content
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReportAction(item.id, 'rejected')} className="text-destructive">
                            <XCircle className="mr-2 h-4 w-4" /> Reject Content
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
