
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Learn</h1>
        <p className="text-muted-foreground mt-2">
          Bite-size Malayalam lessons, culture bites, and more.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Our interactive learning module is under construction. Stay tuned for exciting lessons on Malayalam language, culture, and arts!</p>
        </CardContent>
      </Card>
    </div>
  );
}
