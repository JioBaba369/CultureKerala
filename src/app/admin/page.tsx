
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Building, TicketPercent, Film, ShieldAlert, Clock, CheckCircle } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Items waiting for review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-headline font-semibold mb-4">Moderation Queue</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                <div className="space-y-1">
                  <p className="font-medium">New Business: "Mumbai Delights"</p>
                  <p className="text-sm text-muted-foreground">Submitted by user@example.com</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> 36m ago</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Approve</Button>
                    <Button variant="destructive" size="sm">Reject</Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                <div className="space-y-1">
                  <p className="font-medium">Reported Event: "Late Night Party"</p>
                  <p className="text-sm text-muted-foreground">Reason: Spam</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> 2h ago</span>
                   <div className="flex gap-2">
                    <Button size="sm">Review</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
