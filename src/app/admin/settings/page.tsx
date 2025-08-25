
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Site Settings</h1>
       <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Configure global site settings and parameters.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
