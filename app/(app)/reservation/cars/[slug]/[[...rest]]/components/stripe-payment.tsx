"use client"

import { useState, type ReactNode } from "react"
import Image from "next/image"
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

import { completeRentalCart } from "@/lib/medusa/rental"
import { formatAmountForDisplay } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LoadingDots } from "@/components/loading-dots"

import visaLogo from "@/components/icons/visa.svg"
import mcLogo from "@/components/icons/mc.svg"
import amexLogo from "@/components/icons/amex.svg"

const stripePublishableKey =
  typeof process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === "string"
    ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    : ""
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

interface StripePaymentFormProps {
  clientSecret: string
  cartId: string
  customerEmail: string
  customerName?: string | null
  deposit?: number | null
  currency?: string
  termsAccepted?: boolean
  onTermsMissing?: () => void
  /** Content rendered right above the submit button (e.g. consent + legal notice). */
  beforeSubmit?: ReactNode
  onSuccess: (orderId: string) => void
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v4A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5v-4A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M8 1a.75.75 0 0 1 .544.235l5.25 5.5a.75.75 0 0 1-.07 1.085l-5.25 4.25a.75.75 0 0 1-.948 0l-5.25-4.25a.75.75 0 0 1-.07-1.085l5.25-5.5A.75.75 0 0 1 8 1Zm3.28 5.72a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-1.25-1.25a.75.75 0 1 1 1.06-1.06l.72.72 1.97-1.97a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function StripePaymentForm({
  clientSecret,
  cartId,
  customerEmail,
  customerName,
  deposit,
  currency,
  termsAccepted = true,
  onTermsMissing,
  beforeSubmit,
  onSuccess,
}: StripePaymentFormProps) {
  const hasDeposit = deposit != null && deposit > 0
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const { resolvedTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)

  const isDark = resolvedTheme === "dark"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!termsAccepted) {
      onTermsMissing?.()
      return
    }
    const card = elements?.getElement(CardElement)
    if (!stripe || !elements || !card || !clientSecret) {
      setError("Payment form is not ready.")
      return
    }

    setLoading(true)
    setError(null)

    const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          email: customerEmail || undefined,
          name: customerName || undefined,
        },
      },
    })

    if (confirmError) {
      setError(confirmError.message ?? "Payment error.")
      setLoading(false)
      return
    }

    const result = await completeRentalCart(cartId)
    if (!result.ok) {
      setError(result.error ?? "Could not complete reservation.")
      setLoading(false)
      return
    }

    const orderId = (result.order as { id?: string })?.id ?? ""
    onSuccess(orderId)
    const confirmParams = new URLSearchParams({
      rental_id: orderId,
      status: "success",
    })
    if (hasDeposit && currency) {
      confirmParams.set("deposit", String(deposit))
      confirmParams.set("currency", currency)
    }
    router.push(`/reservation/confirmation/result?${confirmParams}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Card input container */}
      <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm transition-all focus-within:border-neutral-300 focus-within:shadow-md dark:border-neutral-700 dark:bg-neutral-800/50 dark:shadow-none dark:focus-within:border-neutral-500 dark:focus-within:shadow-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200/80 bg-white px-4 py-3 dark:border-neutral-700/50 dark:bg-transparent">
          <div className="flex items-center gap-2">
            <LockIcon className="size-3.5 text-neutral-400 dark:text-neutral-500" />
            <span className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
              Card details
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Image src={visaLogo} alt="Visa" className="h-5 w-auto" />
            <Image src={mcLogo} alt="Mastercard" className="h-5 w-auto" />
            <Image src={amexLogo} alt="American Express" className="h-5 w-auto" />
          </div>
        </div>

        {/* Stripe CardElement */}
        <div className="bg-white px-4 py-4 dark:bg-transparent">
          {!stripe || !elements ? (
            <div className="flex items-center justify-center py-4">
              <LoadingDots variant="default" />
            </div>
          ) : (
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSmoothing: "antialiased",
                    color: isDark ? "#fafafa" : "#0a0a0a",
                    letterSpacing: "0.025em",
                    "::placeholder": { color: isDark ? "#737373" : "#a3a3a3" },
                  },
                  invalid: {
                    color: "#ef4444",
                    iconColor: "#ef4444",
                  },
                },
                hidePostalCode: true,
              }}
              onChange={(e) => {
                setCardComplete(e.complete)
                if (e.error) {
                  setError(e.error.message)
                } else {
                  setError(null)
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 dark:bg-red-950/20">
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className="mt-0.5 size-3.5 shrink-0 text-red-500"
          >
            <path
              fillRule="evenodd"
              d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-[13px] leading-snug text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      )}

      {beforeSubmit}

      {/* Submit button */}
      <Button
        type="submit"
        size="lg"
        className="w-full rounded-xl bg-accent py-6 text-[15px] font-semibold text-accent-foreground shadow-[0_0_20px_rgba(248,227,63,0.2)] transition-all hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(248,227,63,0.3)] disabled:opacity-50 disabled:shadow-none"
        disabled={!stripe || !elements || loading || !cardComplete || !termsAccepted}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <LoadingDots variant="button" />
            <span>Processing...</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <LockIcon className="size-4" />
            {hasDeposit && currency
              ? `Pay deposit`
              : "Pay and confirm"}
          </span>
        )}
      </Button>

      {/* Deposit note */}
      {hasDeposit && (
        <p className="text-center text-[13px] text-neutral-500 dark:text-neutral-400">
          The remaining balance will be charged at vehicle pickup.
        </p>
      )}

      {/* Security badge */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        <ShieldIcon className="size-3.5 text-green-600 dark:text-green-500" />
        <p className="text-[12px] text-neutral-400 dark:text-neutral-500">
          Secured by <span className="font-semibold text-neutral-500 dark:text-neutral-400">Stripe</span> &middot; 256-bit SSL encryption
        </p>
      </div>
    </form>
  )
}

interface StripePaymentProps {
  clientSecret: string
  cartId: string
  customerEmail: string
  customerName?: string | null
  deposit?: number | null
  currency?: string
  termsAccepted?: boolean
  onTermsMissing?: () => void
  /** Content rendered right above the submit button (e.g. consent + legal notice). */
  beforeSubmit?: ReactNode
  onSuccess: (orderId: string) => void
}

function looksLikeClientSecret(value: string): boolean {
  if (typeof value !== "string" || value.length < 10) return false
  if (value.startsWith("pi_") || value.startsWith("seti_")) return true
  if (value.includes("_secret_")) return true
  return value.length > 24
}

export function StripePayment({
  clientSecret,
  cartId,
  customerEmail,
  customerName,
  deposit,
  currency,
  termsAccepted,
  onTermsMissing,
  beforeSubmit,
  onSuccess,
}: StripePaymentProps) {
  const hasKey = Boolean(stripePublishableKey && stripePublishableKey.startsWith("pk_"))
  const hasSecret = Boolean(clientSecret && looksLikeClientSecret(clientSecret))

  if (!hasKey) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 p-4 dark:bg-amber-950/10">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          Stripe not configured
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-amber-700 dark:text-amber-300">
          Add <code className="rounded bg-amber-200/50 px-1.5 py-0.5 text-[12px] dark:bg-amber-800/30">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to your .env file and restart the server.
        </p>
      </div>
    )
  }

  if (!hasSecret) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 p-4 dark:bg-amber-950/10">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          Payment session unavailable
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-amber-700 dark:text-amber-300">
          The backend did not return a valid client_secret. Check Stripe configuration in Medusa (region and STRIPE_API_KEY).
        </p>
      </div>
    )
  }

  if (!stripePromise) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 p-4 dark:bg-amber-950/10">
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Failed to load Stripe. Check NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
        </p>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        /**
         * Sin esto, Stripe usa el idioma del navegador y el formulario sale en
         * castellano dentro de una tienda en inglés: "Número de tarjeta" debajo
         * de "Card details". El día que la tienda hable varios idiomas, esto
         * pasa a salir del idioma de la página, no de una constante.
         */
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
      <StripePaymentForm
        clientSecret={clientSecret}
        cartId={cartId}
        customerEmail={customerEmail}
        customerName={customerName}
        deposit={deposit}
        currency={currency}
        termsAccepted={termsAccepted}
        onTermsMissing={onTermsMissing}
        beforeSubmit={beforeSubmit}
        onSuccess={onSuccess}
      />
    </Elements>
  )
}
