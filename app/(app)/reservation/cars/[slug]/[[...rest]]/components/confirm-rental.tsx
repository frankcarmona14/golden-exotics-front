"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { prepareRentalCheckout, completeRentalCart } from "@/lib/medusa/rental"

import { Button } from "@/components/ui/button"
import { LoadingDots } from "@/components/loading-dots"

import { CancellationPolicy } from "./cancellation-policy"
import { LegalNotice } from "./legal-notice"
import { LicenseConfirmation } from "./license-confirmation"
import { StripePayment } from "./stripe-payment"
import { useAddons } from "./addons-context"
import { useGuest } from "./guest-context"

interface ConfirmRentalProps {
  productId: string
  variantId: string
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  rentalDays?: number
  isLoggedIn: boolean
  customerEmail?: string | null
  customerName?: string | null
  deposit?: number | null
  currency?: string
}

export function ConfirmRental({
  productId,
  variantId,
  startDate,
  endDate,
  startTime,
  endTime,
  rentalDays,
  isLoggedIn,
  customerEmail,
  customerName,
  deposit,
  currency,
}: ConfirmRentalProps) {
  const router = useRouter()
  const { guest } = useGuest()
  const { selection } = useAddons()
  const [error, setError] = useState<string | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const [acceptedDriverLicense, setAcceptedDriverLicense] = useState(false)
  const [showTermsError, setShowTermsError] = useState(false)

  // Only the driver license/insurance self-declaration is an explicit
  // checkbox. Acceptance of Terms, Privacy and Cancellation policies is
  // implicit on confirming the reservation (same pattern as Sixt/Hertz),
  // and is communicated via the legal notice above the submit button.
  const termsAccepted = acceptedDriverLicense

  const isIdentified = isLoggedIn || !!guest
  const effectiveEmail = customerEmail ?? guest?.email ?? ""
  const effectiveName =
    customerName ??
    (guest ? `${guest.first_name} ${guest.last_name}`.trim() : null)

  const [checkoutState, setCheckoutState] = useState<{
    status: "idle" | "loading" | "ready" | "error"
    cartId?: string
    clientSecret?: string
    paymentProviderId?: string
    /** Aviso legal del guardado de tarjeta. Ver `rental-payment-session` (F0-7). */
    disclosure?: string | null
  }>(() => ({
    // Start in "loading" when the user is already logged in on first mount,
    // so the overlay renders synchronously on the first paint (no flash of
    // partial content before the prepare() effect kicks in).
    status: isLoggedIn ? "loading" : "idle",
  }))
  /**
   * Con qué selección de extras se preparó el carrito actual.
   *
   * `null` = todavía no se ha preparado ninguno.
   */
  const preparedForRef = useRef<string | null>(null)

  const rentalInput = {
    product_id: productId,
    variant_id: variantId,
    start_date: startDate,
    end_date: endDate,
    ...(startTime && endTime && { start_time: startTime, end_time: endTime }),
    ...(rentalDays != null && rentalDays > 0 && { rental_days: rentalDays }),
    // Solo códigos y cantidades. El precio lo resuelve el backend contra su
    // base de datos; desde aquí no viaja ninguno.
    ...(selection.length ? { addons: selection } : {}),
  }

  /**
   * Huella de los extras elegidos.
   *
   * El carrito se prepara una sola vez, así que si el cliente cambia de extras
   * después habría que cobrar un carrito que ya no corresponde a lo que ve en
   * pantalla. Comparar la huella permite rehacerlo cuando cambia de verdad, sin
   * rehacerlo en cada render.
   */
  const selectionKey = selection
    .map((addon) => `${addon.code}:${addon.quantity ?? 1}`)
    .sort()
    .join(",")

  const prepare = useCallback(() => {
    setCheckoutState({ status: "loading" })
    setError(null)

    prepareRentalCheckout(rentalInput, guest ?? undefined).then((result) => {
      if (!result.ok) {
        setError(result.error ?? "Something went wrong. Please try again.")
        setCheckoutState({ status: "error" })
        return
      }
      if (!result.cartId) {
        setError("Could not create checkout.")
        setCheckoutState({ status: "error" })
        return
      }
      setCheckoutState({
        status: "ready",
        cartId: result.cartId,
        clientSecret: result.clientSecret,
        paymentProviderId: result.paymentProviderId,
        disclosure: result.cardWillBeSaved ? result.disclosure : null,
      })
    })
  // `selectionKey` es obligatorio aquí: sin él, `prepare` queda capturado con el
  // `rentalInput` del render anterior y al cambiar de extras se prepararía el
  // carrito con la selección vieja.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    productId,
    variantId,
    startDate,
    endDate,
    startTime,
    endTime,
    rentalDays,
    guest,
    selectionKey,
  ])

  useEffect(() => {
    if (!isIdentified) {
      preparedForRef.current = null
      setCheckoutState((prev) =>
        prev.status === "idle" ? prev : { status: "idle" }
      )
      return
    }
    // Se rehace el carrito cuando cambian los extras: si no, se cobraría uno
    // que ya no coincide con el desglose que el cliente tiene delante.
    // `prepareRentalCheckout` abandona el carrito anterior antes de crear el
    // nuevo, así que el coche no se queda retenido dos veces.
    if (preparedForRef.current === selectionKey) return
    preparedForRef.current = selectionKey
    prepare()
  }, [isIdentified, prepare, selectionKey])

  const handleConfirmWithoutStripe = async () => {
    if (!checkoutState.cartId) return
    if (!termsAccepted) {
      setShowTermsError(true)
      return
    }
    setShowTermsError(false)
    setError(null)
    setIsCompleting(true)
    const completeResult = await completeRentalCart(checkoutState.cartId)
    setIsCompleting(false)
    if (!completeResult.ok) {
      setError(completeResult.error ?? "Could not complete reservation.")
      return
    }
    const orderId = (completeResult.order as { id?: string })?.id ?? ""
    const confirmParams = new URLSearchParams({
      rental_id: orderId,
      status: "success",
    })
    if (deposit && deposit > 0 && currency) {
      confirmParams.set("deposit", String(deposit))
      confirmParams.set("currency", currency)
    }
    router.push(`/reservation/confirmation/result?${confirmParams}`)
  }

  const isStripe =
    checkoutState.clientSecret &&
    checkoutState.paymentProviderId?.toLowerCase().includes("stripe")

  // Full-page loading overlay while preparing payment.
  // Also covers the "idle → loading" render gap when isIdentified flips true
  // (e.g. a guest has just submitted their details), so no content flashes
  // before the useEffect runs prepare().
  const isPreparingCheckout =
    isIdentified &&
    (checkoutState.status === "loading" || checkoutState.status === "idle")

  if (isPreparingCheckout) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-md duration-200 animate-in fade-in dark:bg-neutral-950/70">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-neutral-200/80 bg-white p-12 shadow-2xl duration-300 animate-in fade-in zoom-in-95 dark:border-neutral-800 dark:bg-neutral-900 sm:px-16 sm:py-14 lg:px-20 lg:py-16">
          {/* Animated icon */}
          <div className="flex size-16 items-center justify-center rounded-2xl bg-accent/10 sm:size-20 lg:size-24">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-7 text-accent sm:size-8 lg:size-10">
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5V6h14V4.5A1.5 1.5 0 0 0 13.5 3h-11ZM15 7H1v4.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V7ZM3 10.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm5.75-.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-neutral-900 dark:text-neutral-50 sm:text-lg lg:text-xl">
              Preparing your checkout
            </p>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 sm:text-[15px]">
              Setting up secure payment...
            </p>
          </div>
          <div className="pt-1">
            <LoadingDots variant="default" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <CancellationPolicy checkinDate={startDate} />

      {!isIdentified && (
        <p className="mt-6 text-center text-sm text-neutral-500">
          Please log in or continue as guest above to confirm your reservation
        </p>
      )}

      {isIdentified && checkoutState.status === "error" && error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/20 dark:text-red-300">
          <p className="font-medium">Error preparing payment</p>
          <p className="mt-1">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              preparedForRef.current = selectionKey
              prepare()
            }}
          >
            Retry
          </Button>
        </div>
      )}

      {isIdentified && checkoutState.status === "ready" && checkoutState.cartId && (
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-accent/10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3.5 text-accent">
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5V6h14V4.5A1.5 1.5 0 0 0 13.5 3h-11ZM15 7H1v4.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V7ZM3 10.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm5.75-.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z" />
              </svg>
            </div>
            <h3 className="text-[15px] font-semibold tracking-tight">
              Payment method
            </h3>
          </div>

          {/*
            Obligatorio cuando la tarjeta queda guardada: el backend manda el
            texto junto con `card_will_be_saved`. Cobrar el balance más tarde a
            una tarjeta sin haberlo advertido aquí es una disputa perdida.
          */}
          {checkoutState.disclosure && (
            <p className="mb-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-[13px] leading-relaxed text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              {checkoutState.disclosure}
            </p>
          )}

          {(() => {
            // Consent block shown right above the pay/confirm button in both
            // Stripe and non-Stripe flows: explicit license self-declaration
            // + implicit terms acceptance via the legal notice.
            const consent = (
              <div className="space-y-4">
                <LicenseConfirmation
                  checked={acceptedDriverLicense}
                  onCheckedChange={(checked) => {
                    setAcceptedDriverLicense(checked)
                    if (checked) setShowTermsError(false)
                  }}
                  showError={showTermsError}
                />
                <LegalNotice />
              </div>
            )

            return isStripe ? (
              <StripePayment
                clientSecret={checkoutState.clientSecret!}
                cartId={checkoutState.cartId}
                customerEmail={effectiveEmail}
                customerName={effectiveName}
                deposit={deposit}
                currency={currency}
                termsAccepted={termsAccepted}
                onTermsMissing={() => setShowTermsError(true)}
                beforeSubmit={consent}
                onSuccess={() => {}}
              />
            ) : (
              <>
                <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                  No card required. Confirm your reservation below.
                </p>
                <div className="mb-4">{consent}</div>
                <Button
                  size="lg"
                  className="w-full text-[15px]"
                  disabled={isCompleting || !termsAccepted}
                  onClick={handleConfirmWithoutStripe}
                >
                  {isCompleting ? (
                    <LoadingDots variant="button" />
                  ) : (
                    "Confirm reservation"
                  )}
                </Button>
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}
