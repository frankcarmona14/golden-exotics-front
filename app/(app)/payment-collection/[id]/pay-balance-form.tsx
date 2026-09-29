"use client"

import { useEffect, useState } from "react"
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useTheme } from "next-themes"

import { startPaymentCollectionSession } from "@/lib/medusa/payment-collection"
import { Button } from "@/components/ui/button"
import { LoadingDots } from "@/components/loading-dots"

const stripePublishableKey =
  typeof process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === "string"
    ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    : ""
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null

function CardForm({
  clientSecret,
  amountLabel,
}: {
  clientSecret: string
  amountLabel: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handlePay = async () => {
    const card = elements?.getElement(CardElement)
    if (!stripe || !card) {
      setError("Payment form is not ready.")
      return
    }

    setLoading(true)
    setError(null)

    const { error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card } }
    )

    if (confirmError) {
      setError(confirmError.message ?? "Payment error.")
      setLoading(false)
      return
    }

    /**
     * No se avisa al backend desde aquí: el cobro lo registra el subscriber de
     * `payment.captured` cuando llega el webhook de Stripe. Si esta pestaña se
     * cierra justo después de pagar, el registro se hace igual.
     */
    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="mt-6 rounded-xl border border-green-500/30 bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950/20 dark:text-green-300">
        <p className="font-medium">Payment received</p>
        <p className="mt-1">
          Thank you — your payment of {amountLabel} went through. You can
          close this page.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                color: isDark ? "#fafafa" : "#0a0a0a",
                "::placeholder": { color: isDark ? "#737373" : "#a3a3a3" },
              },
              invalid: { color: "#ef4444", iconColor: "#ef4444" },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <Button
        className="w-full"
        onClick={handlePay}
        disabled={loading || !stripe}
      >
        {loading ? <LoadingDots variant="default" /> : `Pay ${amountLabel}`}
      </Button>

      <p className="text-center text-xs text-neutral-500">
        Secured by Stripe · 256-bit SSL encryption
      </p>
    </div>
  )
}

export function PayBalanceForm({
  paymentCollectionId,
  amountLabel,
}: {
  paymentCollectionId: string
  amountLabel: string
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    startPaymentCollectionSession(paymentCollectionId).then((result) => {
      if (cancelled) return
      if (!result.ok || !result.clientSecret) {
        setError(result.error ?? "Could not start the payment.")
        return
      }
      setClientSecret(result.clientSecret)
    })

    return () => {
      cancelled = true
    }
  }, [paymentCollectionId])

  if (error) {
    return (
      <div className="mt-6 rounded-xl border border-red-500/30 bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/20 dark:text-red-300">
        <p className="font-medium">We could not open the payment</p>
        <p className="mt-1">{error}</p>
      </div>
    )
  }

  if (!clientSecret || !stripePromise) {
    return (
      <div className="mt-6 flex justify-center py-6">
        <LoadingDots variant="default" />
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        locale: "en",
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#f8e33f",
            colorBackground: "transparent",
            borderRadius: "8px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          },
        },
      }}
    >
      <CardForm clientSecret={clientSecret} amountLabel={amountLabel} />
    </Elements>
  )
}
