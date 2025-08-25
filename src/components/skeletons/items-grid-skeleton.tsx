import { Skeleton } from "@/components/ui/skeleton";

export function ItemsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
         <div key={i} className="flex flex-col overflow-hidden h-full rounded-lg border bg-card">
            <div className="aspect-video relative">
                <Skeleton className="h-full w-full" />
            </div>
            <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-1" />
            </div>
            <div className="flex justify-between items-center p-6 pt-4 mt-auto">
                <Skeleton className="h-6 w-16" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>
        </div>
      ))}
    </div>
  )
}
