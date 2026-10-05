export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getPaymentCollection } from "@/lib/medusa/payment-collection"
import { NOINDEX_METADATA } from "@/lib/seo/metadata"
import { formatAmountForDisplay } from "@/lib/utils"

import { PayBalanceForm } from "./pay-balance-form"

export const metadata: Metadata = {
  ...NOINDEX_METADATA,
  title: "Pay your reservation",
}

/**
 * The same page takes the rest of the rental and the extra miles (P0-2). The
 * heading has to say which: a customer asked to "pay your balance" twice for
 * the same trip would think they are being charged twice.
 */
const HEADINGS = {
  balance: { due: "Pay your balance", paid: "This balance is already paid" },
  mileage: {
    due: "Pay for your extra miles",
    paid: "Your extra miles are already paid",
  },
  late_return: {
    due: "Pay for your late return",
    paid: "Your late return is already paid",
  },
} as const

function formatRentalDate(value: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function PaymentCollectionPage({
  params,
}: {
  params: { id: string }
}) {
  const data = await getPaymentCollection(params.id)

  if (!data) {
    notFound()
  }

  const { payment_collection: collection, rental } = data
  const amount = formatAmountForDisplay(
    collection.amount,
    collection.currency_code
  )
  const from = formatRentalDate(rental.starts_at)
  const to = formatRentalDate(rental.ends_at)
  const heading = HEADINGS[collection.purpose ?? "balance"]

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-12">
      <h1 className="text-heading-sm">
        {collection.paid ? heading.paid : heading.due}
      </h1>

      <div className="mt-6 rounded-card border border-neutral-200 p-4 dark:border-neutral-800">
        {rental.vehicle && (
          <p className="text-body font-medium">{rental.vehicle}</p>
        )}
        {from && to && (
          <p className="mt-1 text-sm text-neutral-500">
            {from} – {to}
          </p>
        )}
        {rental.order_display_id && (
          <p className="mt-1 text-sm text-neutral-500">
            Reservation #{rental.order_display_id}
          </p>
        )}

        <div className="mt-4 flex items-baseline justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <span className="text-sm text-neutral-500">
            {collection.paid ? "Amount paid" : "Amount due"}
          </span>
          <span className="text-xl font-semibold">{amount}</span>
        </div>
      </div>

      {collection.paid ? (
        <p className="mt-6 text-sm text-neutral-500">
          Nothing left to pay. If you think this is wrong, reply to the message
          you received with this link and we&apos;ll check it.
        </p>
      ) : (
        <PayBalanceForm
          paymentCollectionId={collection.id}
          amountLabel={amount}
        />
      )}
    </div>
  )
}
