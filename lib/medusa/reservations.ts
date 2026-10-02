"use server"

import { getAuthToken } from "./customer"
import { getOrderRentals } from "./rental"
import { sdk } from "./sdk"

/**
 * A customer reservation as shown across the account dashboard. Combines the
 * Medusa order (reference, total, currency, booking date) with the rental
 * record (car, dates, rental status) fetched via `/store/orders/:id/rentals`.
 */
export interface Reservation {
  orderId: string
  displayId: number | null
  createdAt: string | null
  total: number | null
  currency: string | null
  carName: string
  variantTitle: string | null
  thumbnail: string | null
  startDate: string | null
  endDate: string | null
  days: number | null
  /**
   * Rental status (P1-2): awaiting_documents | documents_in_review | approved |
   * change_requested | handed_off | returned | cancelled
   */
  status: string
}

interface StoreOrderLite {
  id: string
  display_id?: number
  created_at?: string
  total?: number
  currency_code?: string
}

/**
 * Lists the authenticated customer's reservations, most recent first.
 *
 * There is no single backend endpoint that returns rentals for a customer, so
 * we list their orders via the SDK and enrich each one with its rental record
 * in parallel. Orders without a rental record are dropped.
 */
export async function getMyReservations(): Promise<Reservation[]> {
  const token = await getAuthToken()
  if (!token) return []

  let orders: StoreOrderLite[] = []
  try {
    const res = (await sdk.store.order.list(
      { limit: 100 },
      { authorization: `Bearer ${token}` }
    )) as { orders?: StoreOrderLite[] }
    orders = res.orders ?? []
  } catch {
    return []
  }

  const reservations = await Promise.all(
    orders.map(async (order): Promise<Reservation | null> => {
      const rentals = await getOrderRentals(order.id)
      const rental = rentals[0]
      if (!rental) return null

      return {
        orderId: order.id,
        displayId: order.display_id ?? null,
        createdAt: order.created_at ?? null,
        total: typeof order.total === "number" ? order.total : null,
        currency: order.currency_code ?? null,
        carName:
          rental.product_variant?.product?.title ??
          rental.product_variant?.title ??
          "Your rental",
        variantTitle: rental.product_variant?.title ?? null,
        thumbnail: rental.product_variant?.product?.thumbnail ?? null,
        startDate: rental.rental_start_date ?? null,
        endDate: rental.rental_end_date ?? null,
        days: rental.rental_days ?? null,
        status: rental.status ?? "awaiting_documents",
      }
    })
  )

  return reservations
    .filter((r): r is Reservation => r !== null)
    .sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return tb - ta
    })
}
