import { Skeleton } from "@/components/ui/skeleton"

export function CarCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/3] w-full rounded-card" />
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="mt-3 h-4 w-3/5" />
    </div>
  )
}
