import Link from "next/link"

import { getMyReservations } from "@/lib/medusa/reservations"
import { Button } from "@/components/ui/button"
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

  if (!carrier) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          My documents
        </h1>
        <p className="mx-auto mt-2 max-w-md text-[15px] text-neutral-500 dark:text-neutral-400">
          Once you have a reservation, you&apos;ll be able to upload your
          driver&apos;s license, ID and insurance here — and they&apos;ll apply
          to every booking.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/cars">Explore cars</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/account">Back to account</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <RentalDocumentsClient mode="auth" orderId={carrier.orderId} variant="account" />
  )
}
