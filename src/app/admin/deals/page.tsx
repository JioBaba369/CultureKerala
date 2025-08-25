
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DealsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Manage Deals</h1>
       <Card>
        <CardHeader>
          <CardTitle>All Deals</CardTitle>
          <CardDescription>
            Create, edit, and manage all deals.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
