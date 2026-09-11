"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { completeRentalCart } from "@/lib/medusa/rental"
import { LoadingDots } from "@/components/loading-dots"

function PaymentReturnContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  const cartId = searchParams.get("cart_id")
  const redirectStatus = searchParams.get("redirect_status")

  useEffect(() => {
    if (!cartId) {
      setError("Missing cart information.")
      return
    }

    if (redirectStatus !== "succeeded" && redirectStatus !== "processing") {
      setError("Payment was not completed.")
      return
    }

    let cancelled = false

    completeRentalCart(cartId).then((result) => {
      if (cancelled) return
      if (!result.ok) {
        setError(result.error ?? "Could not complete reservation.")
        return
      }
      const orderId = (result.order as { id?: string })?.id ?? ""
      router.replace(
        `/reservation/confirmation/result?rental_id=${orderId}&status=success`
      )
    })

    return () => {
      cancelled = true
    }
  }, [cartId, redirectStatus, router])

  if (error) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center px-5">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            type="button"
            className="mt-4 text-sm underline"
            onClick={() => router.push("/cars")}
          >
            Back to cars
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-[40vh] items-center justify-center px-5">
      <div className="flex flex-col items-center gap-3">
        <LoadingDots variant="default" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Completing your reservation…
        </p>
      </div>
    </main>
  )
}

export default function PaymentReturnPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[40vh] items-center justify-center px-5">
          <LoadingDots variant="default" />
        </main>
      }
    >
      <PaymentReturnContent />
    </Suspense>
  )
}
