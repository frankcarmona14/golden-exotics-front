"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { SelectLocation } from "@/lib/schema-types"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { SearchParams } from "@/lib/types"
import { cn, constructUrlWithParams } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { ResponsiveModal } from "@/components/responsive-modal"
import { CheckIcon } from "@/components/icons/check"
import { SearchIcon } from "@/components/icons/search"

/**
 * Compact mobile search. The desktop SearchPanel is a wide 3-column form that
 * doesn't fit on small screens, so here the toolbar shows a summary pill that
 * opens a modal/drawer with location + date-range pickers. The submit logic
 * mirrors SearchPanel so mobile and desktop produce identical URLs.
 */
export function MobileSearch({ locations }: { locations: SelectLocation[] }) {
  const { push } = useRouter()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)
  const [location, setLocation] = useState("")
  const [range, setRange] = useState<DateRange | undefined>()

  // Keep the pickers in sync with the URL (so the pill reflects an active search
  // and reopening the modal shows the current selection).
  useEffect(() => {
    const locationParam = searchParams.get(SearchParams.LOCATION)
    const checkinParam = searchParams.get(SearchParams.CHECKIN)
    const checkoutParam = searchParams.get(SearchParams.CHECKOUT)

    setLocation(locationParam ?? "")

    const from = checkinParam ? new Date(checkinParam) : undefined
    const to = checkoutParam ? new Date(checkoutParam) : undefined
    setRange(from || to ? { from, to } : undefined)
  }, [searchParams])

  const selectedLocationName = locations.find((l) => l.slug === location)?.name

  const dateLabel =
    range?.from && range?.to
      ? `${format(range.from, "LLL d")} – ${format(range.to, "LLL d")}`
      : range?.from
        ? format(range.from, "LLL d")
        : "Add dates"

  const hasSelection = Boolean(location || range?.from)

  function handleSearch() {
    const newParams = new URLSearchParams(searchParams.toString())

    newParams.delete(SearchParams.LOCATION)
    newParams.delete(SearchParams.LAT)
    newParams.delete(SearchParams.LNG)
    newParams.delete(SearchParams.CHECKIN)
    newParams.delete(SearchParams.CHECKOUT)

    if (location) {
      newParams.set(SearchParams.LOCATION, location)
      const currentLocation = locations.find((loc) => loc.slug === location)
      if (currentLocation) {
        newParams.set(SearchParams.LAT, currentLocation.latitude.toString())
        newParams.set(SearchParams.LNG, currentLocation.longitude.toString())
      }
    }

    if (range?.from) newParams.set(SearchParams.CHECKIN, range.from.toISOString())
    if (range?.to) newParams.set(SearchParams.CHECKOUT, range.to.toISOString())

    setOpen(false)
    push(constructUrlWithParams("/cars", newParams))
  }

  function handleClear() {
    setLocation("")
    setRange(undefined)
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      title="Search"
      description="Choose a location and dates to find available cars."
      trigger={
        <button
          type="button"
          className="flex h-14 w-full items-center gap-3 rounded-full border border-black/10 bg-white px-5 text-left shadow-lg transition-shadow hover:shadow dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none"
        >
          <SearchIcon className="size-5 shrink-0 [stroke-width:2.5px]" />
          <span className="flex min-w-0 flex-1 items-center gap-2.5">
            <span className="truncate text-[14px] font-semibold text-neutral-900 dark:text-neutral-50">
              {selectedLocationName ?? "Anywhere"}
            </span>
            <span
              aria-hidden
              className="h-5 w-px shrink-0 bg-neutral-200 dark:bg-neutral-700"
            />
            <span
              className={cn(
                "shrink-0 whitespace-nowrap text-[13px] font-medium",
                range?.from
                  ? "text-neutral-700 dark:text-neutral-200"
                  : "text-neutral-500 dark:text-neutral-400"
              )}
            >
              {dateLabel}
            </span>
          </span>
        </button>
      }
      footer={
        <div className="flex w-full items-center justify-between gap-x-2 px-6">
          <Button
            variant="ghost"
            className="-ml-2.5 px-2.5 text-[15px]"
            onClick={handleClear}
            disabled={!hasSelection}
          >
            Clear
          </Button>
          <Button size="lg" className="gap-2 text-[15px]" onClick={handleSearch}>
            <SearchIcon className="size-4 shrink-0 [stroke-width:3px]" />
            Search cars
          </Button>
        </div>
      }
    >
      <div className="space-y-6 px-5 py-5">
        {/* Location */}
        <div>
          <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Pick-up / Drop-off
          </h3>
          <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
            <Command>
              <CommandInput placeholder="Search location..." />
              <CommandList className="max-h-44">
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup>
                  {locations.map((loc) => (
                    <CommandItem
                      key={loc.id}
                      value={loc.slug}
                      onSelect={(currentValue) =>
                        setLocation(
                          currentValue === location ? "" : currentValue
                        )
                      }
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 size-4 shrink-0",
                          location === loc.slug ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {loc.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>

        {/* Dates */}
        <div>
          <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Dates
          </h3>
          <div className="flex justify-center rounded-xl border border-neutral-200 dark:border-neutral-800">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={1}
              disabled={(date) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                return date < today
              }}
            />
          </div>
        </div>
      </div>
    </ResponsiveModal>
  )
}
