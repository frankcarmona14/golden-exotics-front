"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { constructUrlWithParams } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { FiltersContent } from "./filters-content"
import {
  applyFiltersToParams,
  countActiveFilters,
  initializeFiltersFromParams,
} from "./lib/filters"
import { SelectedFilters } from "./types"

interface FiltersSidebarProps {
  initialMinPrice: number
  initialMaxPrice: number
}

/**
 * Inline filters rail for desktop (≥ md). Reuses the same FiltersContent and
 * URL helpers as the mobile modal (FiltersButton), but renders persistently on
 * the left of the results.
 */
export function FiltersSidebar({
  initialMinPrice,
  initialMaxPrice,
}: FiltersSidebarProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

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

  const handleApply = useCallback(() => {
    const newParams = new URLSearchParams(searchParams.toString())
    applyFiltersToParams(
      newParams,
      selectedFilters,
      initialMinPrice,
      initialMaxPrice
    )
    router.push(constructUrlWithParams("/cars", newParams))
  }, [searchParams, selectedFilters, initialMinPrice, initialMaxPrice, router])

  return (
    <div className="flex max-h-[calc(100dvh-var(--site-header-height)-var(--cars-toolbar-h)-3rem)] flex-col overflow-hidden rounded-card border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/60">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
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

      {/* Apply */}
      <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
        <Button onClick={handleApply} size="lg" className="w-full text-body">
          Show cars
        </Button>
      </div>
    </div>
  )
}
