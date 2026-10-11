"use client"

import type {
  RentalLateReturnPolicy,
  RentalMileageTerms,
  RentalPriceBreakdown,
  RentalPriceLine,
} from "@/lib/types/rental"
import { formatAmountForDisplay } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

/** What each kind of line is, in a sentence the renter understands. */
function explain(line: RentalPriceLine, days: number): string {
  switch (line.type) {
    case "base":
      return `The car's daily rate for your ${days} ${days === 1 ? "day" : "days"}.`
    case "adjustment":
      return line.amount < 0
        ? "A discount that applies to some of your dates."
        : "A price change for some of your dates, such as weekends or holidays."
    case "delivery":
      return "We bring the car to your address and pick it up there."
    case "mileage":
      return "Extra miles added to your plan."
    default:
      return line.mandatory
        ? "A fee charged on every rental, not an extra you chose."
        : "An extra you added to your reservation."
  }
}

function lineTitle(line: RentalPriceLine, days: number): string {
  if (line.type === "base") return `Rental · ${days} ${days === 1 ? "day" : "days"}`
  return line.quantity > 1 ? `${line.label} × ${line.quantity}` : line.label
}

/**
 * "What am I paying for?" (P1-12): the same breakdown the price box shows, but
 * explained line by line, plus what's charged today, what's charged later and
 * what could be charged after the trip. Like the fare breakdown in ride apps.
 *
 * It only explains numbers the backend's pricing engine already returned; it
 * never adds anything up itself.
 */
export function PriceBreakdownDialog({
  breakdown,
  currency,
  mileage = null,
  lateReturn = null,
}: {
  breakdown: RentalPriceBreakdown
  currency: string
  mileage?: RentalMileageTerms | null
  lateReturn?: RentalLateReturnPolicy | null
}) {
  const days = breakdown.rental_days
  const money = (amount: number) => formatAmountForDisplay(amount, currency)
  const isDelivered = breakdown.lines.some((line) => line.type === "delivery")
  const splits = breakdown.balance_due > 0
  const extraMiles = mileage && mileage.included_miles !== null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-body-sm font-medium text-neutral-600 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50"
        >
          What am I paying for?
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your price, explained</DialogTitle>
          <DialogDescription>
            Everything in your total, and when each part is charged.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-4 tabular-nums">
          {breakdown.lines.map((line) => (
            <li key={line.code}>
              <div className="flex items-baseline justify-between gap-4 text-body-sm font-medium">
                <span>{lineTitle(line, days)}</span>
                <span>{money(line.amount)}</span>
              </div>
              <p className="mt-0.5 text-caption text-neutral-500 dark:text-neutral-400">
                {explain(line, days)}
              </p>
            </li>
          ))}
          {breakdown.tax_total > 0 && (
            <li>
              <div className="flex items-baseline justify-between gap-4 text-body-sm font-medium">
                <span>Taxes</span>
                <span>{money(breakdown.tax_total)}</span>
              </div>
              <p className="mt-0.5 text-caption text-neutral-500 dark:text-neutral-400">
                Sales tax on the items it applies to.
              </p>
            </li>
          )}
          <li className="flex items-baseline justify-between gap-4 border-t border-border pt-3 text-body font-semibold">
            <span>Total</span>
            <span>{money(breakdown.total)}</span>
          </li>
        </ul>

        <div className="space-y-3 rounded-card bg-muted p-4 text-body-sm">
          <p className="font-semibold">When you pay</p>
          {splits ? (
            <>
              <div className="flex items-baseline justify-between gap-4">
                <span>Today</span>
                <span className="font-medium">{money(breakdown.upfront)}</span>
              </div>
              <p className="-mt-2 text-caption text-neutral-500 dark:text-neutral-400">
                A deposit toward the rental, plus extras, delivery, fees and taxes.
              </p>
              <div className="flex items-baseline justify-between gap-4">
                <span>{isDelivered ? "When we deliver the car" : "At pick-up"}</span>
                <span className="font-medium">{money(breakdown.balance_due)}</span>
              </div>
              <p className="-mt-2 text-caption text-neutral-500 dark:text-neutral-400">
                The rest of the rental, charged to the card you pay with today.
              </p>
            </>
          ) : (
            <div className="flex items-baseline justify-between gap-4">
              <span>Today, in full</span>
              <span className="font-medium">{money(breakdown.total)}</span>
            </div>
          )}
        </div>

        {(extraMiles || lateReturn) && (
          <div className="space-y-1.5 text-body-sm">
            <p className="font-semibold">Only if it happens, after the trip</p>
            <ul className="list-disc space-y-1 pl-5 text-neutral-600 dark:text-neutral-300">
              {extraMiles && (
                <li>
                  Miles over the {mileage!.included_miles!.toLocaleString("en-US")} included.
                </li>
              )}
              {lateReturn && <li>Returning the car late, after {lateReturn.grace_minutes} minutes of grace.</li>}
            </ul>
            <p className="text-caption text-neutral-500 dark:text-neutral-400">
              The rates are in your price summary. We charge them to your card after you return the car.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
