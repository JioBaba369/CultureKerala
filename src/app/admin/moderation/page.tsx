
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, CheckCircle, XCircle } from "lucide-react";
import { moderationItems, type ModerationItem } from "@/lib/data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type ModerationStatus = "Pending" | "Reported" | "Approved" | "Rejected";

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState<ModerationStatus>("Pending");

  const filteredItems = moderationItems.filter(item => {
    if (activeTab === "Reported") {
      return item.status === "Reported";
    }
    return item.status === activeTab;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Content Moderation</h1>
      <Card>
        <CardHeader>
          <CardTitle>Moderation Queue</CardTitle>
          <CardDescription>
            Review and approve or reject user-submitted content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ModerationStatus)}>
            <TabsList className="mb-4">
              <TabsTrigger value="Pending">Pending</TabsTrigger>
              <TabsTrigger value="Reported">Reported</TabsTrigger>
              <TabsTrigger value="Approved">Approved</TabsTrigger>
              <TabsTrigger value="Rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <ModerationTable items={filteredItems} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function ModerationTable({ items }: { items: ModerationItem[] }) {
  if (items.length === 0) {
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
          <TableHead>Submitted By</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={`${item.type}-${item.title}`}>
            <TableCell>{item.type}</TableCell>
            <TableCell>
              <div className="font-medium">{item.title}</div>
              {item.reason && <div className="text-xs text-muted-foreground">Reason: {item.reason}</div>}
            </TableCell>
            <TableCell>{item.user}</TableCell>
            <TableCell>{item.time}</TableCell>
            <TableCell>
              <Badge variant={item.status === "Pending" ? "secondary" : item.status === "Reported" ? "destructive" : "default"}>
                {item.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </DropdownMenuItem>
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
