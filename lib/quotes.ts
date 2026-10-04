import { format } from "date-fns"

import type {
  RentalPriceBreakdown,
  RentalPriceLine,
  RentalQuote,
  RentalQuoteItem,
} from "@/lib/types/rental"

/**
 * Pure helpers for quotes (P1-1). They live outside `lib/medusa/rental.ts`
 * because that one is a `"use server"` module: everything it exports has to be
 * a server action, and these are also needed by client components.
 */

/** URL params that carry a quote through the booking flow. */
export const QUOTE_PARAM = "quote"
export const QUOTE_ITEM_PARAM = "quote_item"

/** A quote reference as the add-to-cart body expects it. */
export interface QuoteRef {
  token: string
  item_id: string
}

/**
 * Splits a wall-clock string (`2027-05-10T10:00:00`) into the `date` and `time`
 * the booking flow carries in its URL. Plain string slicing: no `Date`, so no
 * time zone can move the day or the hour.
 */
export function splitWallClock(value: string): { date: string; time: string } {
  const [date = "", time = ""] = value.split("T")
  return { date, time: time.slice(0, 5) || "10:00" }
}

/**
 * Formats a wall-clock string for display. A string without a zone is parsed
 * by `Date` as local time and formatted back in local time, so the hour shown
 * is the one written, the same way the reservation pages show rental dates.
 */
export function formatWallClock(
  value: string,
  pattern = "EEE, MMM d, yyyy 'at' h:mm a"
): string {
  try {
    return format(new Date(value), pattern)
  } catch {
    return value
  }
}

/**
 * The pricing engine line type, from the code it gives each line. Quote lines
 * only carry the code.
 */
function lineType(code: string): RentalPriceLine["type"] {
  if (code === "rental_base") return "base"
  // Date rules (P0-5): `rule_<id>`, a discount or surcharge on the base.
  if (code.startsWith("rule_")) return "adjustment"
  if (code.startsWith("delivery_")) return "delivery"
  if (code.startsWith("addon_")) return "addon"
  if (code.startsWith("mileage")) return "mileage"
  if (code.startsWith("state_fee")) return "state_fee"
  // Unknown code: painted as a plain extra, and counted as a charge like the
  // backend counts every line that is not the rental itself.
  return "addon"
}

const round = (n: number) => Math.round(n * 100) / 100

/**
 * A quoted item as the breakdown `PriceDetails` already knows how to paint.
 *
 * The quote stores its lines before tax and its totals after tax, so the tax is
 * the difference. It is not a second price calculation: every figure comes from
 * the quote as the backend priced it, and the total is the one it will charge.
 */
export function quoteItemToBreakdown(
  item: RentalQuoteItem
): RentalPriceBreakdown {
  const lines: RentalPriceLine[] = item.lines.map((line) => ({
    ...line,
    type: lineType(line.code),
  }))
  const subtotal = round(lines.reduce((sum, line) => sum + line.amount, 0))
  // The rental itself: the base and its date-rule adjustments, which go to the
  // balance with it. Everything else is a charge, paid upfront.
  const base = lines
    .filter((line) => line.type === "base" || line.type === "adjustment")
    .reduce((sum, line) => sum + line.amount, 0)

  return {
    rental_days: item.rental_days,
    lines,
    subtotal,
    tax_total: Math.max(0, round(item.total - subtotal)),
    total: item.total,
    charges: round(item.total - base),
    upfront: item.upfront,
    balance_due: item.balance_due,
  }
}

/** Why a quote item can't be booked, or `null` if it can. */
export function quoteItemBlocker(
  quote: Pick<RentalQuote, "status">,
  item: Pick<RentalQuoteItem, "booked" | "handle">
): string | null {
  if (quote.status === "expired") {
    return "This quote has expired. Ask us for a new one."
  }
  if (quote.status === "cancelled") return "This quote was cancelled."
  if (item.booked) return "This vehicle from the quote is already booked."
  if (quote.status !== "sent") return "This quote can no longer be booked."
  if (!item.handle) return "This vehicle is no longer available online."
  return null
}

/**
 * First step of the booking flow for a quoted car: the dates in the same params
 * the flow already uses, the delivery zone (so the back button knows there is
 * an address step) and the quote reference. The server re-reads the quote on
 * every step; these params only say which one.
 */
export function quoteBookingHref(
  token: string,
  item: Pick<
    RentalQuoteItem,
    "id" | "handle" | "rental_start_date" | "rental_end_date" | "delivery_zone"
  >
): string {
  const start = splitWallClock(item.rental_start_date)
  const end = splitWallClock(item.rental_end_date)
  const params = new URLSearchParams({
    checkin: start.date,
    checkout: end.date,
    checkin_time: start.time,
    checkout_time: end.time,
    [QUOTE_PARAM]: token,
    [QUOTE_ITEM_PARAM]: item.id,
  })
  if (item.delivery_zone) params.set("delivery", item.delivery_zone)
  return `/reservation/cars/${item.handle}/extras?${params}`
}
