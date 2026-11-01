"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { constructUrlWithParams } from "@/lib/utils"

import { useCatalogTransition } from "../catalog-transition"
import { FiltersContent } from "./filters-content"
import {
  applyFiltersToParams,
  countActiveFilters,
  initializeFiltersFromParams,
  paramsKey,
} from "./lib/filters"
import { SelectedFilters } from "./types"

interface FiltersSidebarProps {
  initialMinPrice: number
  initialMaxPrice: number
}

/**
 * Inline filters rail for desktop (≥ md). Reuses the same FiltersContent and
 * URL helpers as the mobile modal (FiltersButton), but renders persistently on
 * the left of the results and applies every change as it happens, with no
 * "Show cars" step. The price range already debounces before it reports a
 * change, so dragging the slider doesn't fire one navigation per pixel.
 */
export function FiltersSidebar({
  initialMinPrice,
  initialMaxPrice,
}: FiltersSidebarProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { startTransition } = useCatalogTransition()

  const initialFilters = useMemo(
    () =>
      initializeFiltersFromParams(searchParams, initialMinPrice, initialMaxPrice),
    [searchParams, initialMinPrice, initialMaxPrice]
  )

  const [selectedFilters, setSelectedFilters] =
    useState<SelectedFilters>(initialFilters)

  const totalSelectedFilters = useMemo(
    () => countActiveFilters(searchParams, initialMinPrice, initialMaxPrice),
    [searchParams, initialMinPrice, initialMaxPrice]
  )

  // URLs this rail asked for that haven't landed yet. When one lands it's our
  // own echo and the state is already ahead of it (the renter may have ticked
  // another box meanwhile), so it must not overwrite the state. Any other URL
  // change (search panel, back button) is the new truth.
  const pendingRef = useRef(new Set<string>())
  const searchParamsRef = useRef(searchParams)
  searchParamsRef.current = searchParams

  useEffect(() => {
    if (pendingRef.current.delete(paramsKey(searchParams))) return
    pendingRef.current.clear()
    setSelectedFilters(initialFilters)
    // Only when the URL changes; initialFilters is derived from it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters])

  useEffect(() => {
    const current = searchParamsRef.current
    const next = new URLSearchParams(current.toString())
    applyFiltersToParams(next, selectedFilters, initialMinPrice, initialMaxPrice)
    if (paramsKey(next) === paramsKey(current)) return

    pendingRef.current.add(paramsKey(next))
    // replace, not push: a filter tweak isn't a page the back button should
    // walk through one checkbox at a time. scroll: false keeps the renter
    // where they are in the results.
    startTransition(() => {
      router.replace(constructUrlWithParams("/cars", next), { scroll: false })
    })
  }, [selectedFilters, initialMinPrice, initialMaxPrice, router, startTransition])

  const handleReset = useCallback(() => {
    setSelectedFilters({
      minPrice: initialMinPrice,
      maxPrice: initialMaxPrice,
      bodyStyles: [],
      powertrain: undefined,
      seats: undefined,
      transmissions: [],
    })
  }, [initialMinPrice, initialMaxPrice])

  return (
    <div className="flex max-h-[calc(100dvh-var(--site-header-height)-var(--cars-toolbar-h)-3rem)] flex-col overflow-hidden rounded-card bg-neutral-50 dark:bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pb-1 pt-5">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold tracking-tight">Filters</h2>
          {totalSelectedFilters > 0 && (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-caption font-bold tabular-nums text-accent-foreground">
              {totalSelectedFilters}
            </span>
          )}
        </div>
        {totalSelectedFilters > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="text-body-sm font-medium text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Scrollable sections */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <FiltersContent
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          initialMinPrice={initialMinPrice}
          initialMaxPrice={initialMaxPrice}
        />
      </div>
    </div>
  )
}
