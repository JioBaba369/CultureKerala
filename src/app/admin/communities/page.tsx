
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function CommunitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Manage Communities</h1>
       <Card>
        <CardHeader>
          <CardTitle>All Communities</CardTitle>
          <CardDescription>
            Create, edit, and manage all communities.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
