
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Building, TicketPercent, Film, ShieldAlert, Clock, CheckCircle, ArrowUp, MoreVertical, BadgeHelp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const statCards = [
  { title: "Total Users", value: "+2,350", change: "+180.1%", icon: <Users /> },
  { title: "Active Events", value: "+573", change: "+201 since last hour", icon: <Calendar /> },
  { title: "Listed Businesses", value: "89", change: "+12 this week", icon: <Building /> },
  { title: "Active Deals", value: "124", change: "+3 since yesterday", icon: <TicketPercent /> },
  { title: "Movies Screened", value: "42", change: "", icon: <Film /> },
  { title: "Pending Approvals", value: "12", change: "3 urgent", icon: <ShieldAlert />, urgent: true },
];

const moderationItems = [
  { type: "Business", title: "Mumbai Delights", user: "user@example.com", time: "36m ago", status: "Pending" },
  { type: "Event", title: "Late Night Party", user: "reporter@example.com", time: "2h ago", status: "Reported", reason: "Spam" },
  { type: "Community", title: "Delhi Bikers Group", user: "newuser@example.com", time: "1d ago", status: "Pending" },
  { type: "Deal", title: "Free Coffee", user: "bizowner@example.com", time: "2d ago", status: "Pending" },
];

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map(card => (
          <Card key={card.title} className={card.urgent ? "border-destructive/50" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={card.urgent ? "text-destructive" : "text-muted-foreground"}>{card.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {card.change && <ArrowUp className="h-3 w-3 text-green-500" />} {card.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-headline font-semibold mb-4">Moderation Queue</h2>
        <Card>
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
              {moderationItems.map(item => (
                <TableRow key={item.title}>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <div className="font-medium">{item.title}</div>
                    {item.reason && <div className="text-xs text-muted-foreground">Reason: {item.reason}</div>}
                  </TableCell>
                  <TableCell>{item.user}</TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Pending" ? "secondary" : "destructive"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Approve</DropdownMenuItem>
                        <DropdownMenuItem>Reject</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
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
