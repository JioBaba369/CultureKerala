
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Manage Events</h1>
       <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>
            Create, edit, and manage all events in the directory.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
