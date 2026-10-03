import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { format } from "date-fns"

import { getAuthToken } from "@/lib/medusa/customer"
import { getGuestNotes, getOrderRentals } from "@/lib/medusa/rental"
import { GuestNotes } from "@/components/guest-notes"
import { ReservationStatusBadge } from "@/components/account/reservation-status-badge"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), "MMM d, yyyy")
  } catch {
    return dateStr
  }
}

export default async function ReservationDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const token = await getAuthToken()
  if (!token) {
    redirect(
      `/sign-in?redirectTo=${encodeURIComponent(
        `/account/reservations/${params.id}`,
      )}`,
    )
  }

  const rentals = await getOrderRentals(params.id)
  if (rentals.length === 0) {
    notFound()
  }

  const r = rentals[0]
  // La página del viaje enseña las notas del operador (P1-5).
  const productId = r.product_variant?.product?.id ?? null
  const guestNotes = productId ? await getGuestNotes(productId) : []
  const carName = r.product_variant?.product?.title ?? "Your rental"
  const variantName = r.product_variant?.title
  const start = formatDate(r.rental_start_date)
  const end = formatDate(r.rental_end_date)

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        Your booking
      </h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Order reference · {params.id}
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/60">
        <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          {carName}
        </h2>
        {variantName && variantName !== carName && (
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
            {variantName}
          </p>
        )}
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
          {start} → {end}
          {r.rental_days != null && (
            <span className="text-neutral-500"> · {r.rental_days} day(s)</span>
          )}
        </p>
        {r.delivery ? (
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Delivery{r.delivery.zone_label ? ` (${r.delivery.zone_label})` : ""}
            {r.delivery.address && (
              <span className="text-neutral-500">
                {" "}
                ·{" "}
                {[r.delivery.address.address_1, r.delivery.address.address_2]
                  .filter(Boolean)
                  .join(", ")}
                , {r.delivery.address.city} {r.delivery.address.postal_code}
              </span>
            )}
          </p>
        ) : (
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Pickup at our location
          </p>
        )}
        {r.status && (
          <ReservationStatusBadge status={r.status} className="mt-3" />
        )}
      </div>

      <GuestNotes notes={guestNotes} className="mt-6" />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button asChild>
          <Link href={`/account/reservations/${params.id}/documents`}>
            Upload documents
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link
            href={`/reservation/confirmation/result?rental_id=${encodeURIComponent(
              params.id,
            )}&status=success`}
          >
            View confirmation
          </Link>
        </Button>
      </div>
    </div>
  )
}
