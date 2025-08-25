
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ModerationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Content Moderation</h1>
      <Card>
        <CardHeader>
          <CardTitle>Moderation Queue</CardTitle>
          <CardDescription>
            Review and approve/reject user-submitted content.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
