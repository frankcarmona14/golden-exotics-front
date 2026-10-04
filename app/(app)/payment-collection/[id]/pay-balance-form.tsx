"use client"

import { useEffect, useState } from "react"
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"

import { startPaymentCollectionSession } from "@/lib/medusa/payment-collection"
import {
  CARD_ONLY_PAYMENT_ELEMENT_OPTIONS,
  NON_CARD_METHOD_MESSAGE,
  STRIPE_LOCALE,
  stripePromise,
  usePaymentElementAppearance,
} from "@/lib/stripe/payment-element"
import { Button } from "@/components/ui/button"
import { LoadingDots } from "@/components/loading-dots"

/**
 * Lo que deja Stripe en la URL al volver de un método que sale de la página.
 * Con tarjeta no se sale (3D Secure va en un modal), pero si pasa, la vuelta
 * cae aquí mismo y no hay que abrir otra sesión de pago.
 */
function readRedirectStatus(): string | null {
  if (typeof window === "undefined") return null
  return new URLSearchParams(window.location.search).get("redirect_status")
}

function PaymentReceived({ amountLabel }: { amountLabel: string }) {
  return (
    <div className="mt-6 rounded-xl border border-green-500/30 bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950/20 dark:text-green-300">
      <p className="font-medium">Payment received</p>
      <p className="mt-1">
        Thank you — your payment of {amountLabel} went through. You can close
        this page.
      </p>
    </div>
  )
}

function CardForm({ amountLabel }: { amountLabel: string }) {
  const stripe = useStripe()
  const elements = useElements()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)
  const [methodType, setMethodType] = useState("card")

  const handlePay = async () => {
    if (!stripe || !elements) {
      setError("Payment form is not ready.")
      return
    }
    if (methodType !== "card") {
      setError(NON_CARD_METHOD_MESSAGE)
      return
    }

    setLoading(true)
    setError(null)

    const returnUrl = `${window.location.origin}${window.location.pathname}`
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: { return_url: returnUrl },
    })

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
    return <PaymentReceived amountLabel={amountLabel} />
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        {!ready && (
          <div className="flex justify-center py-4">
            <LoadingDots variant="default" />
          </div>
        )}
        <div className={ready ? "block" : "hidden"}>
          <PaymentElement
            options={CARD_ONLY_PAYMENT_ELEMENT_OPTIONS}
            onReady={() => setReady(true)}
            onChange={(e) => {
              setMethodType(e.value.type)
              setError(null)
            }}
            onLoadError={(e) =>
              setError(e.error.message ?? "The payment form could not load.")
            }
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <Button
        className="w-full"
        onClick={handlePay}
        disabled={loading || !stripe || !ready}
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
  const appearance = usePaymentElementAppearance()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [returnedPaid, setReturnedPaid] = useState(false)

  useEffect(() => {
    const status = readRedirectStatus()
    if (status === "succeeded" || status === "processing") {
      setReturnedPaid(true)
      return
    }

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

  if (returnedPaid) {
    return <PaymentReceived amountLabel={amountLabel} />
  }

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
      key={clientSecret}
      stripe={stripePromise}
      options={{ clientSecret, locale: STRIPE_LOCALE, appearance }}
    >
      <CardForm amountLabel={amountLabel} />
    </Elements>
  )
}
