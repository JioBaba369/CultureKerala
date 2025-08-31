
import { Button } from '@/components/ui/button';
import { ServerCrash } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center bg-background p-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full border border-dashed border-muted-foreground/50 p-4">
            <ServerCrash className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          404 - Page Not Found
        </h1>
        <p className="max-w-md text-muted-foreground">
          Oops! The page you are looking for does not exist. It might have been moved, deleted, or you may have mistyped the URL.
        </p>
        <Button asChild size="lg">
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
}
