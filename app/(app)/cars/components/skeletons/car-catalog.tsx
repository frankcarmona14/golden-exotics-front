import { Skeleton } from "@/components/ui/skeleton"

import { CarCardSkeleton } from "./car-card"

export function CarCatalogSkeleton() {
  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-14" />
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <CarCardSkeleton key={i} />
        ))}
      </div>
    </>
  )
}
