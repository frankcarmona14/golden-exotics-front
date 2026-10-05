import Link from "next/link"

import { getMyReservations } from "@/lib/medusa/reservations"
import { Button } from "@/components/ui/button"
import { AccountShell } from "@/components/account/account-shell"
import { ReservationCard } from "@/components/account/reservation-card"

export const dynamic = "force-dynamic"

export default async function ReservationsPage() {
  const reservations = await getMyReservations()

  return (
    <AccountShell>
      <header className="mb-8">
        <p className="text-caption font-semibold uppercase tracking-[0.2em] text-subtle">
          Bookings
        </p>
        <h1 className="mt-1 text-heading-sm sm:text-heading">
          My reservations
        </h1>
        <p className="mt-1.5 text-body text-neutral-500 dark:text-neutral-400">
          {reservations.length > 0
            ? `${reservations.length} ${
                reservations.length === 1 ? "reservation" : "reservations"
              } on your account.`
            : "Your reservations will appear here."}
        </p>
      </header>

      {reservations.length > 0 ? (
        <div className="space-y-3">
          {reservations.map((r) => (
            <ReservationCard key={r.orderId} reservation={r} />
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-dashed border-neutral-300 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900/40">
          <p className="text-body font-medium text-neutral-900 dark:text-neutral-100">
            No reservations yet
          </p>
          <p className="mx-auto mt-1 max-w-sm text-body-sm text-neutral-500 dark:text-neutral-400">
            Once you book a car, you&apos;ll be able to track its status and
            documents right here.
          </p>
          <Button asChild className="mt-5">
            <Link href="/cars">Explore cars</Link>
          </Button>
        </div>
      )}
    </AccountShell>
  )
}
