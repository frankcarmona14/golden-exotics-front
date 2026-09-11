import Link from "next/link"

import { getCustomer } from "@/lib/medusa/customer"
import { getMyReservations } from "@/lib/medusa/reservations"
import { Button } from "@/components/ui/button"
import { AccountShell } from "@/components/account/account-shell"
import { ReservationCard } from "@/components/account/reservation-card"

export const dynamic = "force-dynamic"

function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: number | string
  hint?: string
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/60">
      <p className="text-[12px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight">
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-[12px] text-neutral-400 dark:text-neutral-500">
          {hint}
        </p>
      )}
    </div>
  )
}

export default async function AccountOverviewPage() {
  const [customer, reservations] = await Promise.all([
    getCustomer(),
    getMyReservations(),
  ])

  const now = Date.now()
  const isFuture = (d: string | null) =>
    d ? new Date(d).getTime() > now : false

  const activeCount = reservations.filter((r) => r.status === "active").length
  const upcoming = reservations
    .filter((r) => r.status !== "cancelled" && isFuture(r.startDate))
    .sort(
      (a, b) =>
        new Date(a.startDate ?? 0).getTime() -
        new Date(b.startDate ?? 0).getTime()
    )
  const nextReservation = upcoming[0] ?? null
  const needsDocuments = reservations.filter(
    (r) => r.status === "awaiting_documents"
  ).length

  const recent = reservations.slice(0, 3)
  const firstName = customer?.first_name?.trim()

  return (
    <AccountShell>
      <header className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
          Overview
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        </h1>
        <p className="mt-1.5 text-[15px] text-neutral-500 dark:text-neutral-400">
          Manage your reservations and account details.
        </p>
      </header>

      {/* Documents reminder */}
      {needsDocuments > 0 && (
        <Link
          href="/account/documents"
          className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-amber-300/70 bg-amber-50 px-5 py-4 transition-colors duration-150 ease-out hover:bg-amber-100/70 dark:border-amber-800/50 dark:bg-amber-950/20 dark:hover:bg-amber-950/30"
        >
          <div>
            <p className="text-[14px] font-semibold text-amber-900 dark:text-amber-200">
              {needsDocuments === 1
                ? "1 reservation needs your documents"
                : `${needsDocuments} reservations need your documents`}
            </p>
            <p className="mt-0.5 text-[13px] text-amber-700 dark:text-amber-300/80">
              Upload your license, ID and insurance once — they apply to all
              bookings.
            </p>
          </div>
          <span className="shrink-0 text-[13px] font-semibold text-amber-800 dark:text-amber-300">
            Upload →
          </span>
        </Link>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Reservations" value={reservations.length} />
        <StatCard label="Active" value={activeCount} />
        <StatCard
          label="Upcoming"
          value={upcoming.length}
          hint={needsDocuments > 0 ? `${needsDocuments} need documents` : undefined}
        />
      </div>

      {/* Next reservation */}
      {nextReservation && (
        <section className="mt-10">
          <h2 className="mb-3 text-[15px] font-semibold tracking-tight">
            Your next trip
          </h2>
          <ReservationCard reservation={nextReservation} />
        </section>
      )}

      {/* Recent reservations */}
      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight">
            Recent reservations
          </h2>
          {reservations.length > 0 && (
            <Link
              href="/account/reservations"
              className="text-[13px] font-medium text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              View all
            </Link>
          )}
        </div>

        {recent.length > 0 ? (
          <div className="space-y-3">
            {recent.map((r) => (
              <ReservationCard key={r.orderId} reservation={r} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center dark:border-neutral-700 dark:bg-neutral-900/40">
            <p className="text-[15px] font-medium text-neutral-900 dark:text-neutral-100">
              No reservations yet
            </p>
            <p className="mx-auto mt-1 max-w-sm text-[13px] text-neutral-500 dark:text-neutral-400">
              Browse our fleet and book your first car — it&apos;ll show up here.
            </p>
            <Button asChild className="mt-5">
              <Link href="/cars">Explore cars</Link>
            </Button>
          </div>
        )}
      </section>
    </AccountShell>
  )
}
