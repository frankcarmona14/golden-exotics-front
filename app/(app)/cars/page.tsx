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
import { CatalogToolbar } from "./components/catalog-toolbar"
import { pillClassName } from "./components/pill"
import {
  CatalogResults,
  CatalogTransitionProvider,
} from "./components/catalog-transition"
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
    <CatalogTransitionProvider>
      {/* No rule under the toolbar: it fades out instead, so it doesn't cut a
          straight edge through the background light. */}
      <div className="[--cars-toolbar-h:100px] md:[--cars-toolbar-h:125px]">
        <header className="sticky top-[var(--site-header-height)] z-40 h-[var(--cars-toolbar-h)] bg-white backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_calc(100%-28px),transparent)] dark:bg-background/80">
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
        {/* Al menos una pantalla de alto: con pocos coches, lo que va debajo
            (logos y pie) quedaba a la vista y saltaba al cambiar el esqueleto
            por el catálogo (CLS 0.26 en móvil). */}
        <main id="main-content" className="min-h-svh">
          <div className="mx-auto max-w-7xl px-5 pb-12 pt-4 sm:px-6">
            <Suspense fallback={<Skeleton className="my-2 h-10 w-full rounded-pill" />}>
              <CatalogToolbar
                filters={
                  <Filters
                    trigger={
                      <button type="button" className={pillClassName}>
                        <FiltersIcon className="size-4 shrink-0" />
                        Filters
                      </button>
                    }
                  />
                }
              />
            </Suspense>

            <div className="mt-4">
              <CatalogResults>
                <Suspense fallback={<CarCatalogSkeleton />}>
                  <CarCatalog searchParams={searchParams} />
                </Suspense>
              </CatalogResults>
            </div>
          </div>
        </main>
      </div>
    </CatalogTransitionProvider>
  )
}
