import { Suspense } from "react"
import type { Metadata } from "next"

import { buildPageMetadata } from "@/lib/seo/metadata"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FiltersIcon } from "@/components/icons/filters"
import { MobileSearchWrapper } from "@/components/mobile-search-wrapper"
import { SearchPanelWrapper } from "@/components/search-panel-wrapper"
import { SearchPanelSkeleton } from "@/components/skeletons/search-panel"

import CarCatalog from "./components/car-catalog"
import Filters from "./components/filters/filters-wrapper"
import { CarCatalogSkeleton } from "./components/skeletons/car-catalog"

// El canonical es /cars sin parámetros: cada combinación de filtros, fechas u
// orden es la misma página para Google y no debe competir con ella.
export const metadata: Metadata = buildPageMetadata({
  title: "Exotic & Luxury Car Rentals in Miami",
  description:
    "Browse our fleet of exotic and luxury cars for rent in Miami. Compare daily prices, seats and specs, check availability for your dates and book online.",
  path: "/cars",
})

export default async function CarsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="[--cars-toolbar-h:100px] md:[--cars-toolbar-h:125px]">
      <header className="sticky top-[var(--site-header-height)] z-40 h-[var(--cars-toolbar-h)] border-b border-black/10 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        {/* Phone and Tablets */}
        <div className="h-full md:hidden">
          <div className="h-full px-5 sm:px-6">
            <div className="grid h-full grid-cols-[1fr_40px] items-center justify-center gap-x-3">
              <Suspense
                fallback={<Skeleton className="h-14 w-full rounded-full" />}
              >
                <MobileSearchWrapper />
              </Suspense>
              <Suspense
                fallback={<Skeleton className="size-10 rounded-full" />}
              >
                <Filters
                  trigger={
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      aria-label="Open filters"
                    >
                      <FiltersIcon className="size-5 shrink-0" />
                    </Button>
                  }
                />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden h-full md:block">
          <div className="mx-auto flex size-full items-center px-6">
            <div className="flex size-full items-center justify-between gap-x-6 lg:grid lg:grid-cols-[auto_minmax(800px,860px)_auto]">
              <div className="hidden w-[110px] lg:block"></div>
              <div className="flex w-full items-center justify-center [--search-panel-height:64px] xl:[--search-panel-height:68px]">
                <Suspense fallback={<SearchPanelSkeleton />}>
                  <SearchPanelWrapper />
                </Suspense>
              </div>
              {/* Filters live in the left rail on desktop — keep a spacer to
                  preserve the centered search panel. */}
              <div className="hidden w-[110px] lg:block" />
            </div>
          </div>
        </div>
      </header>
      <main id="main-content">
        <div className="mx-auto flex max-w-7xl gap-6 px-5 pb-12 pt-8 sm:px-6 lg:gap-8">
          {/* Filters rail — desktop only (≥ md). Mobile uses the modal above. */}
          <aside className="hidden w-[300px] shrink-0 md:block">
            <div className="sticky top-[calc(var(--site-header-height)+var(--cars-toolbar-h)+1.5rem)]">
              <Suspense
                fallback={
                  <Skeleton className="h-[640px] w-full rounded-2xl" />
                }
              >
                <Filters variant="sidebar" />
              </Suspense>
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 lg:gap-5">
              <Suspense fallback={<CarCatalogSkeleton />}>
                <CarCatalog searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
