"use client"

import * as React from "react"
import { addDays, isAfter } from "date-fns"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { ChevronLeftIcon } from "../icons/chevron-left"
import { ChevronRightIcon } from "../icons/chevron-right"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /**
   * Con la primera fecha ya elegida, al pasar el ratón por un día posterior se
   * pinta en suave el rango que quedaría (Airbnb). `undefined` = sin vista previa.
   */
  previewFrom?: Date
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  previewFrom,
  modifiers,
  modifiersClassNames,
  onDayMouseEnter,
  onDayMouseLeave,
  ...props
}: CalendarProps) {
  const [hovered, setHovered] = React.useState<Date>()
  const preview =
    previewFrom && hovered && isAfter(hovered, previewFrom)
      ? { from: addDays(previewFrom, 1), to: hovered }
      : undefined

  return (
    <DayPicker
      modifiers={{
        ...modifiers,
        ...(preview && { preview, preview_end: preview.to }),
      }}
      modifiersClassNames={{
        preview: "!bg-primary/15 !text-foreground rounded-none",
        preview_end: "!bg-primary/40 rounded-md",
        ...modifiersClassNames,
      }}
      onDayMouseEnter={(day, dayModifiers, e) => {
        setHovered(dayModifiers.disabled ? undefined : day)
        onDayMouseEnter?.(day, dayModifiers, e)
      }}
      onDayMouseLeave={(day, dayModifiers, e) => {
        setHovered(undefined)
        onDayMouseLeave?.(day, dayModifiers, e)
      }}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-11 bg-transparent p-0 opacity-70 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-neutral-500 dark:text-neutral-400 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-neutral-100/50 dark:[&:has([aria-selected].day-outside)]:bg-neutral-800/50 [&:has([aria-selected])]:bg-neutral-100 dark:[&:has([aria-selected])]:bg-neutral-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal aria-selected:opacity-100"
        ),
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
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeftIcon className="size-4 shrink-0" />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRightIcon className="size-4 shrink-0" />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
