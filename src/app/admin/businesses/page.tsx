
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function BusinessesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Manage Businesses</h1>
       <Card>
        <CardHeader>
          <CardTitle>All Businesses</CardTitle>
          <CardDescription>
            Create, edit, and manage all business listings.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
