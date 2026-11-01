import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { MobileSearchWrapper } from "@/components/mobile-search-wrapper"
import { SearchPanelWrapper } from "@/components/search-panel-wrapper"
import { SearchPanelSkeleton } from "@/components/skeletons/search-panel"

/** Para quien ya sabe dónde y cuándo: va directo a los coches libres esas fechas. */
export function HomeSearch() {
  return (
    <section
      aria-labelledby="home-search-title"
      className="mx-auto max-w-none px-5 sm:max-w-[90%] sm:px-0"
    >
      <div className="mx-auto max-w-[860px] text-center">
        <h2
          id="home-search-title"
          className="text-balance text-heading-sm sm:text-heading"
        >
          Find a car for your dates
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-body text-muted-foreground">
          We deliver anywhere from Miami Beach to Palm Beach, and you&apos;ll
          only see cars that are free on your dates.
        </p>

        <div className="mt-8 md:hidden">
          <Suspense fallback={<Skeleton className="h-14 w-full rounded-full" />}>
            <MobileSearchWrapper />
          </Suspense>
        </div>
        <div className="mt-8 hidden text-left md:block">
          <Suspense fallback={<SearchPanelSkeleton />}>
            <SearchPanelWrapper />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
