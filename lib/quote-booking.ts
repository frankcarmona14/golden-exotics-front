import "server-only"

import { getRentalQuoteItem } from "@/lib/medusa/rental"
import {
  quoteBookingHref,
  quoteItemBlocker,
  quoteItemToBreakdown,
  splitWallClock,
  type QuoteRef,
} from "@/lib/quotes"
import type {
  RentalPriceBreakdown,
  RentalQuote,
  RentalQuoteItem,
} from "@/lib/types/rental"

/**
 * A booking step opened from a quote (P1-1), resolved on the server.
 *
 * The URL only says WHICH quote (`quote` + `quote_item`). Everything else —
 * dates, extras, delivery zone, price — is read from the quote itself on every
 * step, so editing the URL can't change what is booked. The backend checks the
 * same thing again when the car goes into the cart.
 */
export type QuoteBooking =
  | { kind: "none" }
  | {
      kind: "unavailable"
      token: string
      message: string
    }
  | {
      kind: "redirect"
      href: string
    }
  | {
      kind: "ok"
      ref: QuoteRef
      quote: RentalQuote
      item: RentalQuoteItem
      checkin: string
      checkout: string
      checkinTime: string
      checkoutTime: string
      breakdown: RentalPriceBreakdown
      /** Pago a cuenta sin los cargos: lo que el flujo llama "depósito". */
      deposit: number | null
      dailyRate: { price: number; list: number }
      /** Params that carry the quote to the next step. */
      params: Record<string, string>
    }

export async function resolveQuoteBooking(
  slug: string,
  searchParams: { quote?: string; quote_item?: string }
): Promise<QuoteBooking> {
  const token = searchParams.quote
  const itemId = searchParams.quote_item

  if (!token && !itemId) {
    return { kind: "none" }
  }

  const found = await getRentalQuoteItem(token, itemId)

  if (!found) {
    return {
      kind: "unavailable",
      token: token ?? "",
      message: "We could not find this quote. Open the link we sent you again.",
    }
  }

  const { quote, item } = found
  const blocker = quoteItemBlocker(quote, item)

  if (blocker) {
    return { kind: "unavailable", token: quote.token, message: blocker }
  }

  // The link always points at the quoted car. If the slug in the URL is another
  // one, take the customer to the right car instead of booking the wrong one.
  if (item.handle !== slug) {
    return { kind: "redirect", href: quoteBookingHref(quote.token, item) }
  }

  const start = splitWallClock(item.rental_start_date)
  const end = splitWallClock(item.rental_end_date)
  const breakdown = quoteItemToBreakdown(item)
  const deposit = Math.round((item.upfront - breakdown.charges) * 100) / 100

  return {
    kind: "ok",
    ref: { token: quote.token, item_id: item.id },
    quote,
    item,
    checkin: start.date,
    checkout: end.date,
    checkinTime: start.time,
    checkoutTime: end.time,
    breakdown,
    deposit: deposit > 0 ? deposit : null,
    dailyRate: { price: item.daily_price, list: item.list_daily_price },
    params: { quote: quote.token, quote_item: item.id },
  }
}
