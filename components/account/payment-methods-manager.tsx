"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"

import {
  createMyCardSetupIntent,
  listMyPaymentMethods,
  removeMyPaymentMethod,
  setMyDefaultPaymentMethod,
  type SavedPaymentMethod,
} from "@/lib/medusa/payment-methods"
import {
  STRIPE_LOCALE,
  stripePromise,
  PAYMENT_ELEMENT_FONTS,
  usePaymentElementAppearance,
} from "@/lib/stripe/payment-element"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoadingDots } from "@/components/loading-dots"

import visaLogo from "@/components/icons/visa.svg"
import mcLogo from "@/components/icons/mc.svg"
import amexLogo from "@/components/icons/amex.svg"

const BRAND_LABELS: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  diners: "Diners Club",
  jcb: "JCB",
  unionpay: "UnionPay",
  cartes_bancaires: "Cartes Bancaires",
}

const BRAND_LOGOS: Record<string, typeof visaLogo> = {
  visa: visaLogo,
  mastercard: mcLogo,
  amex: amexLogo,
}

function brandLabel(brand: string): string {
  return BRAND_LABELS[brand] ?? (brand ? brand[0].toUpperCase() + brand.slice(1) : "Card")
}

function CardGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5V6h14V4.5A1.5 1.5 0 0 0 13.5 3h-11ZM15 7H1v4.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V7ZM3 10.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm5.75-.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z" />
    </svg>
  )
}

function BrandMark({ brand }: { brand: string }) {
  const logo = BRAND_LOGOS[brand]
  return (
    <div className="flex h-9 w-12 shrink-0 items-center justify-center rounded-tight border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {logo ? (
        <Image src={logo} alt={brandLabel(brand)} className="h-6 w-auto" />
      ) : (
        <CardGlyph className="size-5 text-neutral-400" />
      )}
    </div>
  )
}

function Notice({
  tone,
  children,
}: {
  tone: "error" | "success"
  children: React.ReactNode
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={
        tone === "error"
          ? "rounded-tight border border-red-200 bg-red-50 px-4 py-3 text-body-sm text-red-600 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400"
          : "rounded-tight border border-green-200 bg-green-50 px-4 py-3 text-body-sm text-green-700 dark:border-green-800/50 dark:bg-green-950/30 dark:text-green-400"
      }
    >
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Añadir tarjeta                                                             */
/* -------------------------------------------------------------------------- */

function AddCardForm({
  onAdded,
  onCancel,
}: {
  onAdded: () => void
  onCancel: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [ready, setReady] = useState(false)
  const [complete, setComplete] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setSaving(true)
    setError(null)

    /**
     * `allow_redisplay: "always"`: el cliente la añade para usarla, así que se
     * le ofrece al reservar. Con tarjeta no se sale de la página; si algún
     * método lo exigiera, Stripe vuelve aquí con `redirect_status`.
     */
    const { error: confirmError } = await stripe.confirmSetup({
      elements,
      redirect: "if_required",
      confirmParams: {
        payment_method_data: { allow_redisplay: "always" },
        return_url: `${window.location.origin}/account/payment-methods`,
      },
    })

    if (confirmError) {
      setError(confirmError.message ?? "We couldn't save this card.")
      setSaving(false)
      return
    }

    setSaving(false)
    onAdded()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!ready && (
        <div className="flex justify-center py-6">
          <LoadingDots variant="default" />
        </div>
      )}
      <div className={ready ? "block" : "hidden"}>
        <PaymentElement
          options={{
            layout: "tabs",
            wallets: { applePay: "never", googlePay: "never" },
          }}
          onReady={() => setReady(true)}
          onChange={(e) => {
            setComplete(e.complete)
            setError(null)
          }}
          onLoadError={(e) =>
            setError(e.error.message ?? "The card form could not load.")
          }
        />
      </div>

      {error && <Notice tone="error">{error}</Notice>}

      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          disabled={!stripe || !ready || !complete || saving}
        >
          {saving ? <LoadingDots variant="button" /> : "Save card"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

function AddCardPanel({
  onAdded,
  onCancel,
}: {
  onAdded: () => void
  onCancel: () => void
}) {
  const appearance = usePaymentElementAppearance()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    createMyCardSetupIntent().then((res) => {
      if (cancelled) return
      if (!res.ok) {
        setError(res.error)
        return
      }
      setClientSecret(res.data.clientSecret)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="rounded-card border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/60 sm:p-6">
      <h2 className="mb-4 text-body font-semibold tracking-tight">
        Add a card
      </h2>
      {error ? (
        <div className="space-y-3">
          <Notice tone="error">{error}</Notice>
          <Button variant="outline" onClick={onCancel}>
            Close
          </Button>
        </div>
      ) : !stripePromise ? (
        <Notice tone="error">Card payments aren&apos;t available right now.</Notice>
      ) : !clientSecret ? (
        <div className="flex justify-center py-6">
          <LoadingDots variant="default" />
        </div>
      ) : (
        <Elements
          key={clientSecret}
          stripe={stripePromise}
          options={{
            clientSecret,
            locale: STRIPE_LOCALE,
            appearance,
            fonts: PAYMENT_ELEMENT_FONTS,
          }}
        >
          <AddCardForm onAdded={onAdded} onCancel={onCancel} />
        </Elements>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Lista                                                                      */
/* -------------------------------------------------------------------------- */

function CardRow({
  card,
  busy,
  onMakeDefault,
  onRemove,
}: {
  card: SavedPaymentMethod
  busy: boolean
  onMakeDefault: () => void
  onRemove: () => void
}) {
  const expiry = `${String(card.exp_month).padStart(2, "0")}/${String(card.exp_year).slice(-2)}`

  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <BrandMark brand={card.brand} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-body font-medium text-neutral-900 dark:text-neutral-50">
              {brandLabel(card.brand)}{" "}
              <span className="tabular-nums tracking-wider">
                ···· {card.last4}
              </span>
            </p>
            {card.is_default && (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-caption font-semibold text-accent-text">
                Default
              </span>
            )}
          </div>
          <p className="mt-0.5 text-body-sm text-neutral-500 dark:text-neutral-400">
            Expires {expiry}
            {card.in_use && (
              <>
                {" · "}
                <span className="text-neutral-700 dark:text-neutral-300">
                  Used for an upcoming rental
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        {!card.is_default && (
          <Button
            variant="outline"
            size="sm"
            onClick={onMakeDefault}
            disabled={busy}
          >
            Make default
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
          onClick={onRemove}
          disabled={busy}
        >
          Remove
        </Button>
      </div>
    </li>
  )
}

export function PaymentMethodsManager({
  initialCards,
  initialError,
}: {
  initialCards: SavedPaymentMethod[]
  initialError?: string | null
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [cards, setCards] = useState(initialCards)
  const [error, setError] = useState<string | null>(initialError ?? null)
  const [success, setSuccess] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [toRemove, setToRemove] = useState<SavedPaymentMethod | null>(null)
  const [removeError, setRemoveError] = useState<string | null>(null)
  const [removing, setRemoving] = useState(false)

  const reload = useCallback(async () => {
    const res = await listMyPaymentMethods()
    if (res.ok) {
      setCards(res.data)
    } else {
      setError(res.error)
    }
  }, [])

  // Vuelta de Stripe tras un alta que salió de la página.
  const redirectStatus = searchParams.get("redirect_status")
  useEffect(() => {
    if (!redirectStatus) return
    if (redirectStatus === "succeeded") {
      setSuccess("Your card has been added.")
      reload()
    } else {
      setError("We couldn't save this card. Please try again.")
    }
    router.replace(pathname)
  }, [redirectStatus, pathname, reload, router])

  async function handleMakeDefault(card: SavedPaymentMethod) {
    setBusyId(card.id)
    setError(null)
    setSuccess(null)
    const res = await setMyDefaultPaymentMethod(card.id)
    if (!res.ok) {
      setError(res.error)
    } else {
      await reload()
      setSuccess(`${brandLabel(card.brand)} ···· ${card.last4} is now your default card.`)
    }
    setBusyId(null)
  }

  async function handleConfirmRemove() {
    if (!toRemove) return
    setRemoving(true)
    setRemoveError(null)
    const res = await removeMyPaymentMethod(toRemove.id)
    setRemoving(false)
    if (!res.ok) {
      // El mensaje del backend explica por qué no se puede: se enseña tal cual.
      setRemoveError(res.error)
      return
    }
    setSuccess(`${brandLabel(toRemove.brand)} ···· ${toRemove.last4} has been removed.`)
    setToRemove(null)
    await reload()
  }

  return (
    <div className="space-y-6">
      {error && <Notice tone="error">{error}</Notice>}
      {success && <Notice tone="success">{success}</Notice>}

      {cards.length > 0 ? (
        <ul className="divide-y divide-neutral-200 overflow-hidden rounded-card border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/60">
          {cards.map((card) => (
            <CardRow
              key={card.id}
              card={card}
              busy={busyId !== null || removing}
              onMakeDefault={() => handleMakeDefault(card)}
              onRemove={() => {
                setRemoveError(null)
                setSuccess(null)
                setToRemove(card)
              }}
            />
          ))}
        </ul>
      ) : (
        <div className="rounded-card border border-dashed border-neutral-300 bg-white p-10 text-center dark:border-neutral-700 dark:bg-neutral-900/40">
          <p className="text-body font-medium text-neutral-900 dark:text-neutral-100">
            No saved cards
          </p>
          <p className="mx-auto mt-1 max-w-sm text-body-sm text-neutral-500 dark:text-neutral-400">
            Cards you save when you book, or add here, will show up in this
            list.
          </p>
        </div>
      )}

      <p className="text-body-sm text-neutral-500 dark:text-neutral-400">
        Cards can&apos;t be edited. To update one, add the new card and then
        remove the old one.
      </p>

      {adding ? (
        <AddCardPanel
          onCancel={() => setAdding(false)}
          onAdded={async () => {
            setAdding(false)
            setError(null)
            setSuccess("Your card has been added.")
            await reload()
          }}
        />
      ) : (
        <Button
          onClick={() => {
            setError(null)
            setSuccess(null)
            setAdding(true)
          }}
        >
          Add card
        </Button>
      )}

      <Dialog
        open={toRemove !== null}
        onOpenChange={(open) => {
          if (!open && !removing) {
            setToRemove(null)
            setRemoveError(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove this card?</DialogTitle>
            <DialogDescription>
              {toRemove
                ? `${brandLabel(toRemove.brand)} ···· ${toRemove.last4} will be removed from your account.`
                : null}
            </DialogDescription>
          </DialogHeader>
          {removeError && <Notice tone="error">{removeError}</Notice>}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setToRemove(null)
                setRemoveError(null)
              }}
              disabled={removing}
            >
              Keep card
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRemove}
              disabled={removing}
            >
              {removing ? <LoadingDots variant="button" /> : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
