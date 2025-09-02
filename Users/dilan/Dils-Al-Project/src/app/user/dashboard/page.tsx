'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Calendar, Building, TicketPercent, ShieldAlert, ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth";

const managementSections = [
    { title: "My Dashboard", icon: <LayoutDashboard />, description: "View your created content.", href: "/user/dashboard" },
    { title: "My Events", icon: <Calendar />, description: "Create and manage events.", href: "/user/events" },
    { title: "My Communities", icon: <Users />, description: "Manage your community pages.", href: "/user/communities" },
    { title: "My Businesses", icon: <Building />, description: "Manage your business listings.", href: "/user/businesses" },
    { title: "My Deals", icon: <TicketPercent />, description: "Create and track special deals.", href: "/user/deals" },
];

export default function UserDashboardPage() {
    const { appUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Welcome, {appUser?.displayName?.split(' ')[0] || 'User'}!</h1>
      
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

       {appUser?.roles?.admin && (
        <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldAlert /> Admin Access</CardTitle>
                <CardDescription>You have admin privileges. Access the full Platform Admin dashboard to manage all site content and settings.</CardDescription>
            </CardHeader>
             <CardContent>
                 <Button asChild>
                    <Link href="/admin/PlatformAdmin/users">Go to Platform Admin</Link>
                </Button>
            </CardContent>
        </Card>
       )}
    </div>
  );
}
