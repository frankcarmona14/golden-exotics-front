import Link from "next/link"

import { getMyReservations } from "@/lib/medusa/reservations"
import { Button } from "@/components/ui/button"
import { AccountShell } from "@/components/account/account-shell"
import RentalDocumentsClient from "@/components/rental-documents/client"

export const dynamic = "force-dynamic"

export default async function AccountDocumentsPage() {
  const reservations = await getMyReservations()

  // Documents are stored per-customer and shared across reservations, but the
  // API is order-scoped. Use one reservation as the carrier context (prefer
  // one that still needs documents); an upload there transitions all rentals.
  const carrier =
    reservations.find((r) => r.status === "awaiting_documents") ??
    reservations.find((r) => r.status === "documents_in_review") ??
    reservations[0]

  return (
    <AccountShell>
      <header className="mb-8">
        <p className="text-caption font-semibold uppercase tracking-[0.2em] text-subtle">
          Account
        </p>
        <h1 className="mt-1 text-heading-sm sm:text-heading">
          Documents
        </h1>
        <p className="mt-1.5 text-body text-neutral-500 dark:text-neutral-400">
          Upload your driver&apos;s license, ID and insurance once — they
          apply to all your reservations.
        </p>
      </header>

      {carrier ? (
        <RentalDocumentsClient
          mode="auth"
          orderId={carrier.orderId}
          variant="account"
        />
      ) : (
        <div className="rounded-card border border-dashed border-neutral-300 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900/40">
          <p className="text-body font-medium text-neutral-900 dark:text-neutral-100">
            No documents yet
          </p>
          <p className="mx-auto mt-1 max-w-sm text-body-sm text-neutral-500 dark:text-neutral-400">
            Once you have a reservation, you&apos;ll be able to upload your
            documents here.
          </p>
          <Button asChild className="mt-5">
            <Link href="/cars">Explore cars</Link>
          </Button>
        </div>
      )}
    </AccountShell>
  )
}
