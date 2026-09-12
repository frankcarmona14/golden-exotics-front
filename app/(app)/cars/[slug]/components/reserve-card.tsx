"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { addDays, format, parseISO } from "date-fns"
import type { DateRange } from "react-day-picker"

import { DESKTOP_MEDIA_QUERY } from "@/lib/constants"
import { getRentalAvailability, getRentalBookedDates } from "@/lib/medusa/rental"
import type { BookedRange } from "@/lib/medusa/rental"
import type { SelectCar } from "@/lib/schema-types"
import { SearchParams } from "@/lib/types"
import type { RentalAvailabilityResponse } from "@/lib/types/rental"
import { cn, formatAmountForDisplay } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { LoadingDots } from "@/components/loading-dots"

interface ReserveCardProps {
  car: SelectCar
}

const DEFAULT_TIME = "10:00"
const today = new Date()
const todayStart = new Date(today)
todayStart.setHours(0, 0, 0, 0)

const TIME_SLOTS = Array.from({ length: 28 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2)
  const min = i % 2 === 0 ? "00" : "30"
  return `${String(hour).padStart(2, "0")}:${min}`
})

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={cn("size-3.5", className)}
    >
      <path
        fillRule="evenodd"
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25a.75.75 0 0 0-1.5 0v3.5c0 .414.336.75.75.75h2.5a.75.75 0 0 0 0-1.5H8.75v-2.75Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={cn("size-3.5", className)}
    >
      <path d="M5.75 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM5 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM7.25 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM7.25 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM10.25 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
      <path
        fillRule="evenodd"
        d="M5.75 1a.75.75 0 0 1 .75.75V3h3V1.75a.75.75 0 0 1 1.5 0V3h1.25A1.75 1.75 0 0 1 14 4.75v7.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-7.5A1.75 1.75 0 0 1 3.75 3H5V1.75A.75.75 0 0 1 5.75 1Zm-2 4.25a.25.25 0 0 1 .25-.25h8.5a.25.25 0 0 1 .25.25V6h-9v-.75Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function buildDateTime(date: Date, timeStr: string): Date {
  const [h = 0, m = 0] = timeStr.split(":").map(Number)
  const d = new Date(date)
  d.setHours(h, m, 0, 0)
  return d
}

function rentalDaysFromDateTime(
  start: Date,
  end: Date,
  startTime: string,
  endTime: string
): number {
  const startDt = buildDateTime(start, startTime)
  const endDt = buildDateTime(end, endTime)
  const ms = endDt.getTime() - startDt.getTime()
  if (ms <= 0) return 0
  return Math.ceil(ms / (24 * 60 * 60 * 1000))
}

function isTimeSlotPast(slot: string, date: Date | undefined): boolean {
  if (!date) return false
  const now = new Date()
  const todayStr = format(now, "yyyy-MM-dd")
  const dateStr = format(date, "yyyy-MM-dd")
  if (dateStr !== todayStr) return false
  // If selected date is today, disable slots that are in the past
  const [h, m] = slot.split(":").map(Number)
  const slotMinutes = h * 60 + m
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  return slotMinutes <= nowMinutes
}

/** Check if a time slot on a given date falls within any booked range.
 *  Booked ranges already include buffer hours in their end_date. */
function isTimeSlotBooked(
  slot: string,
  date: Date | undefined,
  bookedRanges: BookedRange[]
): boolean {
  if (!date) return false
  const [h, m] = slot.split(":").map(Number)
  const slotDt = new Date(date)
  slotDt.setHours(h, m, 0, 0)

  for (const range of bookedRanges) {
    const rangeStart = new Date(range.start_date)
    const rangeEnd = new Date(range.end_date)
    if (slotDt >= rangeStart && slotDt < rangeEnd) {
      return true
    }
  }
  return false
}

function TimeGrid({
  value,
  onChange,
  selectedDate,
  bookedRanges,
}: {
  value: string
  onChange: (time: string) => void
  selectedDate?: Date
  bookedRanges: BookedRange[]
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {TIME_SLOTS.map((slot) => {
        const isPast = isTimeSlotPast(slot, selectedDate)
        const isBooked = isTimeSlotBooked(slot, selectedDate, bookedRanges)
        const isDisabled = isPast || isBooked
        return (
          <button
            key={slot}
            type="button"
            onClick={() => !isDisabled && onChange(slot)}
            disabled={isDisabled}
            className={cn(
              "rounded-lg p-2 text-[13px] font-medium tabular-nums transition-all",
              isDisabled
                ? "cursor-not-allowed text-neutral-300 line-through dark:text-neutral-700"
                : slot === value
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            )}
          >
            {slot}
          </button>
        )
      })}
    </div>
  )
}

/** Expand booked ranges into a Set of "YYYY-MM-DD" strings for fast lookup.
 *  The last day is only blocked if the buffered end time falls at or after
 *  the last bookable slot (22:00), meaning no usable time slot remains. */
function buildBlockedDatesSet(ranges: BookedRange[]): Set<string> {
  const LAST_SLOT_END_HOUR = 22 // after 21:30 no slot is bookable
  const set = new Set<string>()
  for (const range of ranges) {
    const start = new Date(range.start_date)
    const end = new Date(range.end_date)
    const endHour = end.getHours()
    const endMin = end.getMinutes()

    const current = new Date(start)
    current.setHours(0, 0, 0, 0)

    const lastDay = new Date(end)
    lastDay.setHours(0, 0, 0, 0)

    while (current < lastDay) {
      set.add(format(current, "yyyy-MM-dd"))
      current.setDate(current.getDate() + 1)
    }

    // Block the last day only if no bookable time slot remains
    if (endHour >= LAST_SLOT_END_HOUR || (endHour === LAST_SLOT_END_HOUR - 1 && endMin > 30)) {
      set.add(format(lastDay, "yyyy-MM-dd"))
    }
  }
  return set
}

/* ------------------------------------------------------------------ */
/*  Mobile calendar classNames (full-width cells)                      */
/* ------------------------------------------------------------------ */

const mobileCalendarClassNames = {
  months: "flex flex-col w-full",
  month: "space-y-4 w-full",
  table: "w-full border-collapse",
  head_row: "flex w-full",
  head_cell:
    "text-neutral-500 dark:text-neutral-400 rounded-md flex-1 text-center font-normal text-sm",
  row: "flex w-full mt-2",
  cell: "flex-1 aspect-square text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-neutral-100/50 dark:[&:has([aria-selected].day-outside)]:bg-neutral-800/50 [&:has([aria-selected])]:bg-neutral-100 dark:[&:has([aria-selected])]:bg-neutral-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
  day: "h-full w-full rounded-md p-0 font-normal hover:bg-neutral-100 dark:hover:bg-neutral-800 aria-selected:opacity-100",
  day_range_end: "day-range-end",
  day_selected:
    "bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
  day_today:
    "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50",
  day_outside:
    "day-outside text-neutral-500 opacity-50 aria-selected:bg-neutral-100/50 aria-selected:text-neutral-500 aria-selected:opacity-30 dark:aria-selected:bg-neutral-800/50 dark:aria-selected:text-neutral-400",
  day_disabled: "text-neutral-500 opacity-50 dark:text-neutral-600",
  day_range_middle:
    "aria-selected:bg-neutral-100 aria-selected:text-neutral-900 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50",
  day_hidden: "invisible",
}

/* ------------------------------------------------------------------ */
/*  Responsive time picker                                             */
/* ------------------------------------------------------------------ */

interface TimePickerProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  trigger: React.ReactNode
  title: string
  value: string
  onChange: (t: string) => void
  isDesktop: boolean
  selectedDate?: Date
  bookedRanges: BookedRange[]
}

function TimePicker({
  open,
  onOpenChange,
  trigger,
  title,
  value,
  onChange,
  isDesktop,
  selectedDate,
  bookedRanges,
}: TimePickerProps) {
  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent className="w-[180px] p-3" side="left" sideOffset={12}>
          <TimeGrid value={value} onChange={onChange} selectedDate={selectedDate} bookedRanges={bookedRanges} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="pb-0">
          <DrawerTitle className="text-center text-base">{title}</DrawerTitle>
        </DrawerHeader>
        <div className="max-h-[60dvh] overflow-y-auto px-4 pb-4 pt-2">
          <TimeGrid
            value={value}
            selectedDate={selectedDate}
            bookedRanges={bookedRanges}
            onChange={(t) => {
              onChange(t)
              onOpenChange(false)
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

type DateStep = "checkin" | "checkout"

export function ReserveCard({ car }: ReserveCardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY)
  const checkoutBtnRef = useRef<HTMLButtonElement>(null)

  const [checkinDate, setCheckinDate] = useState<Date | undefined>(undefined)
  const [checkoutDate, setCheckoutDate] = useState<Date | undefined>(undefined)
  const [checkinTime, setCheckinTime] = useState(DEFAULT_TIME)
  const [checkoutTime, setCheckoutTime] = useState(DEFAULT_TIME)

  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [dateStep, setDateStep] = useState<DateStep>("checkin")
  const [checkinTimeOpen, setCheckinTimeOpen] = useState(false)
  const [checkoutTimeOpen, setCheckoutTimeOpen] = useState(false)

  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [isReserving, setIsReserving] = useState(false)
  const [availability, setAvailability] =
    useState<RentalAvailabilityResponse | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set())
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([])
  const fetchedMonths = useRef<Set<string>>(new Set())

  const rentalConfig = car.rentalConfiguration
  const isRentable = rentalConfig?.status === "active"

  // Fetch booked dates when calendar month changes or on mount
  const fetchBookedDates = useCallback(
    async (monthDate?: Date) => {
      if (!car.medusaProductId || !car.medusaVariantId) return

      // If monthDate is provided, fetch that specific month (for navigation)
      // Otherwise fetch all future dates (6 months, no month param)
      const monthStr = monthDate ? format(monthDate, "yyyy-MM") : undefined

      if (monthStr && fetchedMonths.current.has(monthStr)) return
      if (monthStr) fetchedMonths.current.add(monthStr)

      try {
        const ranges = await getRentalBookedDates({
          productId: car.medusaProductId,
          variantId: car.medusaVariantId,
          month: monthStr,
        })
        setBookedRanges((prev) => {
          const existingIds = new Set(prev.map((r) => `${r.start_date}-${r.end_date}`))
          const newRanges = ranges.filter((r) => !existingIds.has(`${r.start_date}-${r.end_date}`))
          return newRanges.length > 0 ? [...prev, ...newRanges] : prev
        })
        setBookedDates((prev) => {
          const next = new Set(prev)
          for (const dateStr of Array.from(buildBlockedDatesSet(ranges))) {
            next.add(dateStr)
          }
          return next
        })
      } catch {
        // Silently fail - calendar will just not show blocked dates
      }
    },
    [car.medusaProductId, car.medusaVariantId]
  )

  // Fetch on mount — load all future booked dates (6 months ahead)
  useEffect(() => {
    fetchBookedDates()
  }, [fetchBookedDates])

  useEffect(() => {
    const checkinParam = searchParams.get(SearchParams.CHECKIN)
    const checkoutParam = searchParams.get(SearchParams.CHECKOUT)
    const checkinTimeParam = searchParams.get(SearchParams.CHECKIN_TIME)
    const checkoutTimeParam = searchParams.get(SearchParams.CHECKOUT_TIME)

    const fromUrl = checkinParam ? parseISO(checkinParam) : undefined
    const toUrl = checkoutParam ? parseISO(checkoutParam) : undefined

    if (checkinTimeParam) setCheckinTime(checkinTimeParam)
    if (checkoutTimeParam) setCheckoutTime(checkoutTimeParam)
    if (fromUrl) setCheckinDate(fromUrl)
    if (toUrl) setCheckoutDate(toUrl)
    if (!checkinParam && !checkoutParam) {
      setCheckinDate(undefined)
      setCheckoutDate(undefined)
    }
  }, [searchParams])

  const checkAvailability = useCallback(
    async (from: Date, to: Date) => {
      if (!car.medusaProductId || !car.medusaVariantId || !isRentable) return

      setIsCheckingAvailability(true)
      setAvailability(null)
      setValidationError(null)

      try {
        const days = rentalDaysFromDateTime(from, to, checkinTime, checkoutTime)
        if (days <= 0) {
          setValidationError("Check-out must be after check-in (date and time)")
          return
        }

        if (rentalConfig && days < rentalConfig.min_rental_days) {
          setValidationError(
            `Minimum rental period is ${rentalConfig.min_rental_days} day${rentalConfig.min_rental_days > 1 ? "s" : ""}`
          )
          return
        }

        if (
          rentalConfig?.max_rental_days &&
          days > rentalConfig.max_rental_days
        ) {
          setValidationError(
            `Maximum rental period is ${rentalConfig.max_rental_days} day${rentalConfig.max_rental_days > 1 ? "s" : ""}`
          )
          return
        }

        const result = await getRentalAvailability({
          productId: car.medusaProductId,
          variantId: car.medusaVariantId,
          startDate: format(from, "yyyy-MM-dd"),
          endDate: format(to, "yyyy-MM-dd"),
          startTime: checkinTime,
          endTime: checkoutTime,
          currencyCode: car.currency,
        })

        setAvailability(result)

        if (!result.available) {
          setValidationError(
            result.message ?? "This car is not available for the selected dates"
          )
        }
      } catch {
        setValidationError("Failed to check availability")
      } finally {
        setIsCheckingAvailability(false)
      }
    },
    [car, isRentable, rentalConfig, checkinTime, checkoutTime]
  )

  useEffect(() => {
    if (checkinDate && checkoutDate && isRentable) {
      checkAvailability(checkinDate, checkoutDate)
    } else {
      setAvailability(null)
      setValidationError(null)
    }
  }, [checkinDate, checkoutDate, isRentable, checkAvailability])

  // Auto-correct selected time if it falls within a booked range
  useEffect(() => {
    if (checkinDate && isTimeSlotBooked(checkinTime, checkinDate, bookedRanges)) {
      const firstAvailable = TIME_SLOTS.find(
        (s) => !isTimeSlotPast(s, checkinDate) && !isTimeSlotBooked(s, checkinDate, bookedRanges)
      )
      if (firstAvailable) setCheckinTime(firstAvailable)
    }
  }, [checkinDate, bookedRanges, checkinTime])

  useEffect(() => {
    if (checkoutDate && isTimeSlotBooked(checkoutTime, checkoutDate, bookedRanges)) {
      const firstAvailable = TIME_SLOTS.find(
        (s) => !isTimeSlotPast(s, checkoutDate) && !isTimeSlotBooked(s, checkoutDate, bookedRanges)
      )
      if (firstAvailable) setCheckoutTime(firstAvailable)
    }
  }, [checkoutDate, bookedRanges, checkoutTime])

  const handleReserve = () => {
    if (!checkinDate || !checkoutDate) return
    if (isRentable && !availability?.available) return

    setIsReserving(true)
    const params = new URLSearchParams()
    params.set(SearchParams.CHECKIN, format(checkinDate, "yyyy-MM-dd"))
    params.set(SearchParams.CHECKOUT, format(checkoutDate, "yyyy-MM-dd"))
    params.set(SearchParams.CHECKIN_TIME, checkinTime)
    params.set(SearchParams.CHECKOUT_TIME, checkoutTime)

    router.push(`/reservation/cars/${car.slug}?${params.toString()}`)
  }

  /* ---- date range flow ---- */

  const openDatePicker = (step: DateStep) => {
    setDateStep(step)
    setDatePickerOpen(true)
  }

  const rangeValue: DateRange | undefined = checkinDate
    ? { from: checkinDate, to: checkoutDate ?? undefined }
    : undefined

  const handleRangeSelect = (
    range: DateRange | undefined,
    selectedDay: Date
  ) => {
    if (dateStep === "checkin") {
      setCheckinDate(selectedDay)
      if (checkoutDate && selectedDay >= checkoutDate) {
        setCheckoutDate(undefined)
      }
      setDateStep("checkout")
    } else {
      if (checkinDate && selectedDay > checkinDate) {
        setCheckoutDate(selectedDay)
        setDatePickerOpen(false)
      } else {
        setCheckinDate(selectedDay)
        setCheckoutDate(undefined)
      }
    }
  }

  const datePickerTitle =
    dateStep === "checkin" ? "Select check-in date" : "Select check-out date"

  const calendarDisabled = (d: Date) => {
    if (d < todayStart) return true
    if (dateStep === "checkout" && checkinDate) {
      if (format(d, "yyyy-MM-dd") <= format(checkinDate, "yyyy-MM-dd")) return true
    }
    // Check if date is booked
    if (bookedDates.has(format(d, "yyyy-MM-dd"))) return true
    return false
  }

  const calendarDefaultMonth =
    dateStep === "checkin"
      ? (checkinDate ?? addDays(today, 1))
      : (checkoutDate ?? checkinDate ?? addDays(today, 1))

  /* ---- computed values ---- */

  const pricePerDayNum = Number(car.pricePerDay)
  const hasValidPrice = !Number.isNaN(pricePerDayNum) && pricePerDayNum >= 0
  const days =
    checkinDate && checkoutDate
      ? rentalDaysFromDateTime(
          checkinDate,
          checkoutDate,
          checkinTime,
          checkoutTime
        )
      : 0

  // Use API price as source of truth, fallback to local calc only before API responds
  const totalAmount =
    availability?.price?.amount && availability.price.amount > 0
      ? availability.price.amount
      : days > 0 && hasValidPrice
        ? pricePerDayNum * days
        : hasValidPrice
          ? pricePerDayNum
          : 0

  const canReserve =
    checkinDate != null &&
    checkoutDate != null &&
    !isCheckingAvailability &&
    !validationError &&
    (!isRentable || availability?.available === true)

  const hasDates = checkinDate != null && checkoutDate != null && days > 0

  const statusMessage = useMemo(() => {
    if (isCheckingAvailability)
      return { type: "loading" as const, text: "Checking availability…" }
    if (validationError)
      return { type: "error" as const, text: validationError }
    if (availability?.available && !validationError)
      return { type: "success" as const, text: "Available for your dates" }
    return null
  }, [isCheckingAvailability, validationError, availability])

  /* ---- style helpers ---- */

  const dateBtnClass = (isActive: boolean) =>
    cn(
      "flex flex-1 flex-col items-start gap-0.5 rounded-lg border bg-white px-3 py-2.5 text-left shadow-sm transition-colors",
      "border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900",
      "hover:border-neutral-400 dark:hover:border-neutral-500",
      isActive &&
        "border-neutral-900 ring-1 ring-neutral-900 dark:border-neutral-400 dark:ring-neutral-400"
    )

  const timeBtnClass = (isOpen: boolean) =>
    cn(
      "flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2.5 text-left shadow-sm transition-colors",
      "border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900",
      "hover:border-neutral-400 dark:hover:border-neutral-500",
      isOpen &&
        "border-neutral-900 ring-1 ring-neutral-900 dark:border-neutral-400 dark:ring-neutral-400"
    )

  /* ---- step indicator inside calendar ---- */
  const stepIndicator = (
    <div className="flex items-center gap-2 px-3 pb-1 pt-2">
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors",
          dateStep === "checkin"
            ? "bg-primary text-primary-foreground"
            : "text-neutral-400 dark:text-neutral-500"
        )}
      >
        Check in
      </span>
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        className="size-3 text-neutral-300 dark:text-neutral-600"
      >
        <path
          fillRule="evenodd"
          d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
          clipRule="evenodd"
        />
      </svg>
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors",
          dateStep === "checkout"
            ? "bg-primary text-primary-foreground"
            : "text-neutral-400 dark:text-neutral-500"
        )}
      >
        Check out
      </span>
    </div>
  )

  /* ---- desktop calendar popover ---- */
  const desktopDatePicker = (
    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
      <PopoverAnchor asChild>
        <button
          type="button"
          className={dateBtnClass(datePickerOpen && dateStep === "checkin")}
          onClick={() => openDatePicker("checkin")}
        >
          <span className="flex items-center gap-1.5 text-[14px] font-medium leading-snug">
            <CalendarIcon className="shrink-0 text-neutral-400 dark:text-neutral-500" />
            {checkinDate ? format(checkinDate, "MMM d, yyyy") : "Add date"}
          </span>
        </button>
      </PopoverAnchor>
      <PopoverContent
        className="w-auto p-0"
        side="left"
        sideOffset={12}
        onInteractOutside={(e) => {
          if (
            checkoutBtnRef.current &&
            checkoutBtnRef.current.contains(e.target as Node)
          ) {
            e.preventDefault()
          }
        }}
      >
        {stepIndicator}
        <Calendar
          mode="range"
          selected={rangeValue}
          onSelect={handleRangeSelect as any}
          disabled={calendarDisabled}
          defaultMonth={calendarDefaultMonth}
          onMonthChange={fetchBookedDates}
          modifiers={{ booked: (d: Date) => bookedDates.has(format(d, "yyyy-MM-dd")) }}
          modifiersStyles={{ booked: { textDecoration: "line-through", opacity: 0.4 } }}
        />
      </PopoverContent>
    </Popover>
  )

  /* ---- mobile calendar drawer (rendered separately, controlled by state) ---- */
  const mobileDateDrawer = !isDesktop && (
    <Drawer open={datePickerOpen} onOpenChange={setDatePickerOpen}>
      <DrawerContent>
        <DrawerHeader className="pb-0">
          <DrawerTitle className="text-center text-base">
            {datePickerTitle}
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-2">
          {stepIndicator}
          <Calendar
            mode="range"
            selected={rangeValue}
            onSelect={handleRangeSelect as any}
            disabled={calendarDisabled}
            defaultMonth={calendarDefaultMonth}
            onMonthChange={fetchBookedDates}
            modifiers={{ booked: (d: Date) => bookedDates.has(format(d, "yyyy-MM-dd")) }}
            modifiersStyles={{ booked: { textDecoration: "line-through", opacity: 0.4 } }}
            className="mx-auto w-full p-3"
            classNames={mobileCalendarClassNames}
          />
        </div>
        <DrawerFooter className="border-t border-neutral-200 px-4 dark:border-neutral-800">
          <DrawerClose asChild>
            <Button variant="outline" size="lg" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )

  /* ---- check-in date button (desktop uses PopoverAnchor, mobile is plain) ---- */
  const checkinDateBtn = (
    <button
      type="button"
      className={dateBtnClass(datePickerOpen && dateStep === "checkin")}
      onClick={() => openDatePicker("checkin")}
    >
      <span className="flex items-center gap-1.5 text-[14px] font-medium leading-snug">
        <CalendarIcon className="shrink-0 text-neutral-400 dark:text-neutral-500" />
        {checkinDate ? format(checkinDate, "MMM d, yyyy") : "Add date"}
      </span>
    </button>
  )

  return (
    <div className="overflow-hidden rounded-xl border shadow-[0_6px_16px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
      <div className="p-6">
        {/* Price */}
        {hasValidPrice ? (
          <div className="mb-6">
            {hasDates ? (
              <>
                <span className="block text-[26px] font-semibold tabular-nums leading-tight tracking-tight">
                  {formatAmountForDisplay(totalAmount, car.currency)}
                </span>
                <span className="text-[14px] text-neutral-500 dark:text-neutral-400">
                  Total for {days} day{days > 1 ? "s" : ""}
                </span>
                {availability?.deposit && (
                  <span className="mt-1.5 block text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
                    {formatAmountForDisplay(availability.deposit.amount, car.currency)} deposit due at booking
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="block text-[26px] font-semibold tabular-nums leading-tight tracking-tight">
                  {formatAmountForDisplay(pricePerDayNum, car.currency)}
                </span>
                <span className="text-[14px] text-neutral-500 dark:text-neutral-400">
                  Per day
                </span>
              </>
            )}
          </div>
        ) : (
          <div className="mb-6">
            <span className="text-xl font-medium">Add dates for prices</span>
          </div>
        )}

        {/* Mobile date drawer (portal, no trigger) */}
        {mobileDateDrawer}

        {/* Check in section */}
        <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800/50">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Check in
          </p>
          <div className="flex items-stretch gap-2">
            {isDesktop ? desktopDatePicker : checkinDateBtn}
            <TimePicker
              open={checkinTimeOpen}
              onOpenChange={setCheckinTimeOpen}
              title="Pickup time"
              value={checkinTime}
              onChange={setCheckinTime}
              isDesktop={isDesktop}
              selectedDate={checkinDate}
              bookedRanges={bookedRanges}
              trigger={
                <button type="button" className={timeBtnClass(checkinTimeOpen)}>
                  <ClockIcon className="shrink-0 text-neutral-400 dark:text-neutral-500" />
                  <span className="text-[14px] font-medium tabular-nums">
                    {checkinTime}
                  </span>
                </button>
              }
            />
          </div>
        </div>

        {/* Check out section */}
        <div className="mt-2 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800/50">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Check out
          </p>
          <div className="flex items-stretch gap-2">
            <button
              ref={checkoutBtnRef}
              type="button"
              className={dateBtnClass(
                datePickerOpen && dateStep === "checkout"
              )}
              onClick={() => openDatePicker("checkout")}
            >
              <span className="flex items-center gap-1.5 text-[14px] font-medium leading-snug">
                <CalendarIcon className="shrink-0 text-neutral-400 dark:text-neutral-500" />
                {checkoutDate
                  ? format(checkoutDate, "MMM d, yyyy")
                  : "Add date"}
              </span>
            </button>
            <TimePicker
              open={checkoutTimeOpen}
              onOpenChange={setCheckoutTimeOpen}
              title="Return time"
              value={checkoutTime}
              onChange={setCheckoutTime}
              isDesktop={isDesktop}
              selectedDate={checkoutDate}
              bookedRanges={bookedRanges}
              trigger={
                <button
                  type="button"
                  className={timeBtnClass(checkoutTimeOpen)}
                >
                  <ClockIcon className="shrink-0 text-neutral-400 dark:text-neutral-500" />
                  <span className="text-[14px] font-medium tabular-nums">
                    {checkoutTime}
                  </span>
                </button>
              }
            />
          </div>
        </div>

        {/* Rental config hint */}
        {isRentable && rentalConfig && (
          <p className="mt-3 text-[12px] text-neutral-400 dark:text-neutral-500">
            Min {rentalConfig.min_rental_days} day
            {rentalConfig.min_rental_days > 1 ? "s" : ""}
            {rentalConfig.max_rental_days
              ? ` · Max ${rentalConfig.max_rental_days} days`
              : ""}
          </p>
        )}

        {/* Status messages */}
        {statusMessage && (
          <div
            className={cn(
              "mt-4 rounded-lg px-3.5 py-2.5 text-[13px] font-medium",
              statusMessage.type === "loading" &&
                "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
              statusMessage.type === "error" &&
                "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
              statusMessage.type === "success" &&
                "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
            )}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Reserve button */}
        <div className="pt-5">
          <Button
            size="lg"
            className="w-full text-[15px]"
            disabled={!canReserve || isReserving}
            onClick={handleReserve}
          >
            {isReserving ? (
              <LoadingDots variant="button" />
            ) : isCheckingAvailability ? (
              "Checking…"
            ) : canReserve ? (
              "Reserve"
            ) : (
              "Select dates"
            )}
          </Button>
        </div>

        {checkinDate != null && checkoutDate != null && canReserve && (
          <p className="pt-3 text-center text-[13px] text-neutral-500 dark:text-neutral-400">
            You won&apos;t be charged yet
          </p>
        )}
      </div>
    </div>
  )
}
