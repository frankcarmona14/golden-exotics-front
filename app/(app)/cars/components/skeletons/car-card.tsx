import { Skeleton } from "@/components/ui/skeleton"

export function CarCardSkeleton() {
  return (
    <article className="flex gap-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:gap-6 sm:p-5">
      <div className="aspect-[4/3] w-32 shrink-0 sm:w-48 lg:w-56">
        <Skeleton className="size-full rounded-xl" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="mt-2 h-3.5 w-3/5" />
        <Skeleton className="mt-2 h-3 w-1/3" />
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
      </div>
    </article>
  )
}
