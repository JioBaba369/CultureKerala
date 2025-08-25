import { Bookmark } from "lucide-react";

export default function SavedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg mt-8">
        <Bookmark className="mx-auto h-12 w-12" />
        <h1 className="mt-4 text-2xl font-headline font-semibold text-foreground">
          Your Saved Items
        </h1>
        <p className="mt-2 text-base">
          Items you save from the directory will appear here.
        </p>
      </div>
    </div>
  );
}
