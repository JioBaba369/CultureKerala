import { Shield } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
       <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg mt-8">
        <Shield className="mx-auto h-12 w-12" />
        <h1 className="mt-4 text-2xl font-headline font-semibold text-foreground">
          Admin Panel
        </h1>
        <p className="mt-2 text-base">
          This is where content moderation and user management would take place.
        </p>
      </div>
    </div>
  );
}
