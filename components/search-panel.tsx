"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { SearchLocation } from "@/lib/schema-types"
import { format, isAfter, isBefore } from "date-fns"

import { SearchParams } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { SearchIcon } from "@/components/icons/search"
import { SelectorIcon } from "@/components/icons/selector"
import { LocationOptions } from "@/components/location-options"

import {
  cn,
  constructUrlWithParams,
  fromDateParam,
  toDateParam,
} from "../lib/utils"

export function SearchPanel({ locations }: { locations: SearchLocation[] }) {
  const { push } = useRouter()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)
  const [location, setLocation] = useState("")

  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  /** Qué fecha pide el calendario. `null` = cerrado. */
  const [dateStep, setDateStep] = useState<"checkin" | "checkout" | null>(null)
  const datesRef = useRef<HTMLDivElement>(null)

  /**
   * Un solo calendario para las dos fechas: el primer clic es la recogida y el
   * calendario sigue abierto pidiendo la devolución; el segundo la fija y
   * cierra. Un día anterior o igual a la recogida empieza de nuevo por ella.
   */
  function pickDay(day: Date) {
    if (dateStep === "checkout" && checkInDate && isAfter(day, checkInDate)) {
      setCheckOutDate(day)
      setDateStep(null)
      return
    }

    setCheckInDate(day)
    if (checkOutDate && !isAfter(checkOutDate, day)) setCheckOutDate(undefined)
    setDateStep("checkout")
  }

  useEffect(() => {
    const locationParam = searchParams.get(SearchParams.LOCATION)
    const checkinParam = searchParams.get(SearchParams.CHECKIN)
    const checkoutParam = searchParams.get(SearchParams.CHECKOUT)

    if (locationParam) setLocation(locationParam)

    const checkInDate = fromDateParam(checkinParam)
    const checkOutDate = fromDateParam(checkoutParam)

    if (checkInDate && checkOutDate) {
      // Only set the dates if the check-in date is before the check-out date
      if (isBefore(checkInDate, checkOutDate)) {
        setCheckInDate(checkInDate)
        setCheckOutDate(checkOutDate)
      }
    } else {
      // Set individual dates if they exist
      if (checkInDate) setCheckInDate(checkInDate)
      if (checkOutDate) setCheckOutDate(checkOutDate)
    }

    return () => {
      setLocation("")
      setCheckInDate(undefined)
      setCheckOutDate(undefined)
    }
  }, [searchParams])

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!location && !checkInDate && !checkOutDate) {
      return
    }

    const newParams = new URLSearchParams(searchParams.toString())

    newParams.delete(SearchParams.LOCATION)
    newParams.delete(SearchParams.LAT)
    newParams.delete(SearchParams.LNG)
    newParams.delete(SearchParams.CHECKIN)
    newParams.delete(SearchParams.CHECKOUT)

    if (location) newParams.set(SearchParams.LOCATION, location)

    if (checkInDate) newParams.set(SearchParams.CHECKIN, toDateParam(checkInDate))
    if (checkOutDate)
      newParams.set(SearchParams.CHECKOUT, toDateParam(checkOutDate))

    push(constructUrlWithParams("/cars", newParams))
  }

  return (
    <form onSubmit={submitForm} className="w-full">
      <div className="whitespace-nowrap rounded-full bg-neutral-100 text-black shadow-none dark:bg-card dark:text-neutral-50">
        <div className="relative grid h-[var(--search-panel-height)] w-full grid-cols-1 items-center">
          <div className="grid h-full grid-cols-[33.333333%_33.333333%_33.333333%] items-center justify-center">
            <div className="relative h-full">
              <Separator
                orientation="vertical"
                className="absolute inset-y-0 right-0 m-auto h-6 shrink-0"
              />
              <div className="flex size-full items-center justify-center px-0">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      role="combobox"
                      aria-expanded={open}
                      className="size-full flex-col overflow-hidden rounded-full border-none px-5 py-0 focus-visible:z-10"
                    >
                      <div className="flex size-full items-center justify-between">
                        <div className="flex size-full flex-col items-start justify-center truncate">
                          <div className="text-body-sm font-bold">
                            Pick-up / Drop-off
                          </div>
                          {location ? (
                            <p className="truncate font-semibold text-neutral-800 dark:text-neutral-200">
                              {
                                locations.find((loc) => loc.value === location)
                                  ?.name
                              }
                            </p>
                          ) : (
                            <div className="text-neutral-500 dark:text-neutral-400">
                              Select location
                            </div>
                          )}
                        </div>
                        <SelectorIcon className="-mr-2 ml-2  size-5 shrink-0 opacity-50" />
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search location..." />
                      <CommandList>
                        <CommandEmpty>No location found.</CommandEmpty>
                        <LocationOptions
                          locations={locations}
                          selected={location}
                          onSelect={(value) => {
                            setLocation(value)
                            setOpen(false)
                          }}
                        />
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Popover
              open={dateStep !== null}
              onOpenChange={(open) => !open && setDateStep(null)}
            >
              <PopoverAnchor asChild>
                <div
                  ref={datesRef}
                  className="col-span-2 grid h-full grid-cols-2 items-center"
                >
                  <div className="relative h-full">
                    <Separator
                      orientation="vertical"
                      className="absolute inset-y-0 right-0 m-auto h-6 shrink-0"
                    />
                    <DateButton
                      label="Check in"
                      date={checkInDate}
                      active={dateStep === "checkin"}
                      onClick={() => setDateStep("checkin")}
                      className="px-5"
                    />
                  </div>
                  <div className="h-full">
                    <DateButton
                      label="Check out"
                      date={checkOutDate}
                      active={dateStep === "checkout"}
                      onClick={() =>
                        setDateStep(checkInDate ? "checkout" : "checkin")
                      }
                      className="pl-5 pr-16"
                    />
                  </div>
                </div>
              </PopoverAnchor>
              <PopoverContent
                className="w-auto p-0"
                // Los botones de fecha están fuera del calendario: pulsarlos
                // cambia de paso, no lo cierra.
                onInteractOutside={(e) => {
                  if (datesRef.current?.contains(e.target as Node))
                    e.preventDefault()
                }}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <p className="px-4 pt-4 text-sm font-semibold">
                  {dateStep === "checkout"
                    ? "Select your return date"
                    : "Select your pick-up date"}
                </p>
                <Calendar
                  mode="range"
                  numberOfMonths={2}
                  selected={{ from: checkInDate, to: checkOutDate }}
                  defaultMonth={checkInDate}
                  previewFrom={
                    dateStep === "checkout" ? checkInDate : undefined
                  }
                  onDayClick={(day, modifiers) => {
                    if (!modifiers.disabled) pickDay(day)
                  }}
                  disabled={(date) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return date < today
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="absolute right-2 z-20">
            <Button
              type="submit"
              className="flex size-[calc(var(--search-panel-height)_-_1.25rem)] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              <span className="sr-only">Search</span>
              <SearchIcon className="size-[calc((var(--search-panel-height)_-_1.25rem)/2.66)] shrink-0 [stroke-width:3px]" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

function DateButton({
  label,
  date,
  active,
  onClick,
  className,
}: {
  label: string
  date: Date | undefined
  active: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <div className="flex size-full items-center justify-center px-0">
      <Button
        type="button"
        variant="ghost"
        onClick={onClick}
        aria-expanded={active}
        className={cn(
          "size-full flex-col overflow-hidden rounded-full border-none py-0 focus-visible:z-10",
          active && "bg-neutral-100 dark:bg-neutral-800",
          className
        )}
      >
        <div className="flex size-full flex-col items-start justify-center truncate">
          <div className="text-body-sm font-bold">{label}</div>
          {date ? (
            <div className="font-semibold text-neutral-800 dark:text-neutral-200">
              {format(date, "LLL dd, y")}
            </div>
          ) : (
            <div className="truncate text-neutral-500 dark:text-neutral-400">
              Pick a date
            </div>
          )}
        </div>
      </Button>
    </div>
  )
}
