
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MoviesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Manage Movies</h1>
       <Card>
        <CardHeader>
          <CardTitle>All Movies</CardTitle>
          <CardDescription>
            Create, edit, and manage all movie listings and screenings.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
