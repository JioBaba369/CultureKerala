
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function UsersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Manage Users</h1>
       <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View, edit, and manage user roles and permissions.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
