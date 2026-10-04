"use client"

import { useState, type ReactNode } from "react"
import Image from "next/image"
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import type { StripeElementsOptionsClientSecret } from "@stripe/stripe-js"
import { useRouter } from "next/navigation"

import { completeRentalCart } from "@/lib/medusa/rental"
import {
  CARD_ONLY_PAYMENT_ELEMENT_OPTIONS,
  NON_CARD_METHOD_MESSAGE,
  STRIPE_LOCALE,
  stripePromise,
  stripePublishableKey,
  usePaymentElementAppearance,
} from "@/lib/stripe/payment-element"
import { Button } from "@/components/ui/button"
import { LoadingDots } from "@/components/loading-dots"

import visaLogo from "@/components/icons/visa.svg"
import mcLogo from "@/components/icons/mc.svg"
import amexLogo from "@/components/icons/amex.svg"

interface StripePaymentFormProps {
  cartId: string
  /** Con Customer Session el Payment Element enseña la casilla de guardar. */
  canSaveCard: boolean
  /** Aviso legal del guardado de tarjeta, junto al botón de pagar (F0-7). */
  disclosure?: string | null
  customerEmail: string
  customerName?: string | null
  deposit?: number | null
  currency?: string
  /** Con entrega no hay recogida: el balance se cobra al entregar el coche. */
  isDelivered?: boolean
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
  cartId,
  canSaveCard,
  disclosure,
  customerEmail,
  customerName,
  deposit,
  currency,
  isDelivered = false,
  termsAccepted = true,
  onTermsMissing,
  beforeSubmit,
  onSuccess,
}: StripePaymentFormProps) {
  const hasDeposit = deposit != null && deposit > 0
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [complete, setComplete] = useState(false)
  /** Método elegido en el Payment Element ("card", …) y si es una tarjeta guardada. */
  const [methodType, setMethodType] = useState("card")
  const [usingSavedCard, setUsingSavedCard] = useState(false)

  /**
   * Adónde vuelve Stripe si el método exige salir de la página. Con tarjeta,
   * 3D Secure incluido, no se sale: Stripe abre su modal y `confirmPayment`
   * vuelve aquí. La página de vuelta completa el carrito igual que abajo.
   */
  function buildReturnUrl(): string {
    const params = new URLSearchParams({ cart_id: cartId })
    if (hasDeposit && currency) {
      params.set("deposit", String(deposit))
      params.set("currency", currency)
    }
    return `${window.location.origin}/reservation/payment-return?${params}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!termsAccepted) {
      onTermsMissing?.()
      return
    }
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

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: buildReturnUrl(),
        // Una tarjeta guardada ya trae sus datos de facturación: solo se mandan
        // con una tarjeta nueva, como hacía el CardElement.
        ...(usingSavedCard
          ? {}
          : {
              payment_method_data: {
                billing_details: {
                  email: customerEmail || undefined,
                  name: customerName || undefined,
                },
              },
            }),
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

        {/*
          Stripe Payment Element. Con Customer Session (cliente con sesión)
          enseña sus tarjetas guardadas y la casilla de guardar la nueva; los
          invitados ven solo el formulario de tarjeta.
        */}
        <div className="bg-white p-4 dark:bg-transparent">
          {!ready && (
            <div className="flex items-center justify-center py-4">
              <LoadingDots variant="default" />
            </div>
          )}
          <div className={ready ? "block" : "hidden"}>
            <PaymentElement
              options={{
                ...CARD_ONLY_PAYMENT_ELEMENT_OPTIONS,
                defaultValues: {
                  billingDetails: {
                    email: customerEmail || undefined,
                    name: customerName || undefined,
                  },
                },
              }}
              onReady={() => setReady(true)}
              onChange={(e) => {
                setComplete(e.complete)
                setMethodType(e.value.type)
                setUsingSavedCard(Boolean(e.value.payment_method))
                setError(null)
              }}
              onLoadError={(e) =>
                setError(e.error.message ?? "The payment form could not load.")
              }
            />
          </div>
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

      {/*
        Obligatorio cuando la tarjeta queda guardada: el backend manda el texto
        junto con `card_will_be_saved`. Cobrar el balance más tarde a una
        tarjeta sin haberlo advertido aquí es una disputa perdida.
      */}
      {disclosure && (
        <div className="space-y-1.5 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-[13px] leading-relaxed text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
          <p>{disclosure}</p>
          {canSaveCard && (
            <p>
              Your card stays on file for this booking&apos;s balance either
              way. Tick the save box above if you&apos;d like to reuse it on
              future bookings.
            </p>
          )}
        </div>
      )}

      {beforeSubmit}

      {/* Submit button */}
      <Button
        type="submit"
        size="lg"
        className="w-full rounded-xl bg-accent py-6 text-[15px] font-semibold text-accent-foreground shadow-[0_0_20px_rgba(248,227,63,0.2)] transition-all hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(248,227,63,0.3)] disabled:opacity-50 disabled:shadow-none"
        disabled={
          !stripe || !elements || !ready || loading || !complete || !termsAccepted
        }
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
          {isDelivered
            ? "The remaining balance will be charged when we deliver the car."
            : "The remaining balance will be charged at vehicle pickup."}
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
  /**
   * Customer Session de `rental-payment-session` (P1-6b). Solo llega para un
   * cliente con sesión; sin ella el Payment Element no enseña tarjetas
   * guardadas ni la casilla de guardar.
   */
  customerSessionClientSecret?: string | null
  /** Aviso legal del guardado de tarjeta (F0-7). */
  disclosure?: string | null
  cartId: string
  customerEmail: string
  customerName?: string | null
  deposit?: number | null
  currency?: string
  isDelivered?: boolean
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
  customerSessionClientSecret,
  disclosure,
  cartId,
  customerEmail,
  customerName,
  deposit,
  currency,
  isDelivered,
  termsAccepted,
  onTermsMissing,
  beforeSubmit,
  onSuccess,
}: StripePaymentProps) {
  const appearance = usePaymentElementAppearance()
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

  const options: StripeElementsOptionsClientSecret = {
    clientSecret,
    // Solo si viene: los invitados pagan con un Payment Element sin tarjetas guardadas.
    ...(customerSessionClientSecret ? { customerSessionClientSecret } : {}),
    locale: STRIPE_LOCALE,
    appearance,
  }

  return (
    /*
     * `key`: el `clientSecret` de Elements no se puede cambiar una vez montado.
     * Si el checkout se rehace (Retry), se monta un Elements nuevo.
     */
    <Elements key={clientSecret} stripe={stripePromise} options={options}>
      <StripePaymentForm
        cartId={cartId}
        canSaveCard={Boolean(customerSessionClientSecret)}
        disclosure={disclosure}
        customerEmail={customerEmail}
        customerName={customerName}
        deposit={deposit}
        currency={currency}
        isDelivered={isDelivered}
        termsAccepted={termsAccepted}
        onTermsMissing={onTermsMissing}
        beforeSubmit={beforeSubmit}
        onSuccess={onSuccess}
      />
    </Elements>
  )
}
