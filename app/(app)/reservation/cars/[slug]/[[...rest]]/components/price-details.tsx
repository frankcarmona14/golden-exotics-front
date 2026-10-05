import type {
  RentalLateReturnPolicy,
  RentalMileageTerms,
  RentalPriceBreakdown,
} from "@/lib/types/rental"
import { formatAmountForDisplay } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

/**
 * Desglose del precio.
 *
 * Pinta lo que devuelve el motor de precios del backend, línea a línea, sin
 * sumar nada por su cuenta. Antes calculaba los impuestos aquí con
 * `NEXT_PUBLIC_TAX_RATE`, una segunda fuente de verdad para un número que el
 * backend ya conoce: el importe que se enseñaba y el que se cobraba podían no
 * ser el mismo.
 *
 * Sin estado propio: recibe el desglose. Así sirve igual al checkout, que lo
 * trae ya cotizado del servidor, y a la pantalla de extras, donde cambia con
 * cada clic.
 */
export function PriceDetails({
  days,
  currency,
  breakdown,
  deposit,
  fallbackSubtotal,
  isQuoting = false,
  mileage = null,
  lateReturn = null,
  title = "Your total",
  dailyRate = null,
}: {
  days: number
  currency: string
  breakdown: RentalPriceBreakdown | null
  deposit: number | null
  /** Precio del coche cuando la cotización no llegó. Ver la página. */
  fallbackSubtotal: number
  /** Recotizando: lo que hay en pantalla es el precio anterior. */
  isQuoting?: boolean
  /** Condiciones de millas (P0-2). `null` = ilimitadas, no se enseña nada. */
  mileage?: RentalMileageTerms | null
  /** Condiciones de devolución tardía (P1-6). `null` = no se cobra. */
  lateReturn?: RentalLateReturnPolicy | null
  /** Heading. `null` hides it (the quote page puts its own above). */
  title?: string | null
  /**
   * Precio por día de un presupuesto (P1-1): el negociado, con el de catálogo
   * tachado cuando es más bajo. `null` fuera de presupuestos.
   */
  dailyRate?: { price: number; list: number } | null
}) {
  const lines = breakdown?.lines ?? []
  const subtotal = breakdown?.subtotal ?? fallbackSubtotal
  const taxes = breakdown?.tax_total ?? 0
  const total = breakdown?.total ?? fallbackSubtotal
  /**
   * Lo que se cobra ahora es el pago a cuenta MÁS los extras y su impuesto, no
   * el depósito a secas: es lo que hace el reparto del cobro, así que es lo que
   * cobrará Stripe. Enseñar solo el depósito prometería de menos.
   */
  const dueNow = breakdown?.upfront ?? deposit ?? 0
  const balance = breakdown?.balance_due ?? 0
  const splitsPayment = balance > 0
  /**
   * Con entrega, el resto no se cobra "en la recogida": el cliente no pasa por
   * la oficina. Se cobra al entregarle el coche (P0-3).
   */
  const isDelivered = lines.some((line) => line.type === "delivery")

  return (
    <>
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      <div
        className={title ? "pt-5" : undefined}
        // Mientras se recotiza, lo que hay en pantalla es el precio anterior.
        // Atenuarlo lo dice sin vaciar la cifra, que parecería un alquiler
        // gratis durante un instante.
        aria-busy={isQuoting}
      >
        <div
          className={`grid grid-cols-1 gap-3 tabular-nums transition-opacity ${
            isQuoting ? "opacity-50" : ""
          }`}
        >
          {lines.length > 0 ? (
            lines.map((line) => (
              <div
                key={line.code}
                className="flex flex-row items-center justify-between text-body"
              >
                <span>
                  {line.type === "base"
                    ? `${days} ${days === 1 ? "day" : "days"}`
                    : line.type === "adjustment"
                      ? `${line.label} · ${line.quantity} ${line.quantity === 1 ? "day" : "days"}`
                      : line.quantity > 1
                        ? `${line.label} × ${line.quantity}`
                        : line.label}
                  {line.type === "base" && dailyRate && (
                    <DailyRate
                      rate={dailyRate}
                      currency={currency}
                      className="ml-1.5 text-body-sm text-neutral-500 dark:text-neutral-400"
                    />
                  )}
                </span>
                {line.type === "adjustment" ? (
                  <span
                    className={
                      line.amount < 0
                        ? "text-green-700 dark:text-green-400"
                        : undefined
                    }
                  >
                    {formatSignedAmount(line.amount, currency)}
                  </span>
                ) : (
                  <span>{formatAmountForDisplay(line.amount, currency)}</span>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-row items-center justify-between text-body">
              <span>
                {days} {days === 1 ? "day" : "days"}
              </span>
              <span>{formatAmountForDisplay(subtotal, currency)}</span>
            </div>
          )}

          {taxes > 0 && (
            <div className="flex flex-row items-center justify-between text-body">
              <span>Taxes</span>
              <span>{formatAmountForDisplay(taxes, currency)}</span>
            </div>
          )}

          <Separator className="my-3" />
          <div className="flex flex-row items-center justify-between text-body">
            <span>Rental total ({currency.toUpperCase()})</span>
            <span>{formatAmountForDisplay(total, currency)}</span>
          </div>

          {splitsPayment ? (
            <>
              <Separator className="my-3" />
              <div className="flex flex-row items-center justify-between">
                <strong>Due now</strong>
                <strong>{formatAmountForDisplay(dueNow, currency)}</strong>
              </div>
              <div className="flex flex-row items-center justify-between text-body">
                <span>{isDelivered ? "Due at delivery" : "Due at pickup"}</span>
                <span>{formatAmountForDisplay(balance, currency)}</span>
              </div>
              <p className="text-body-sm text-neutral-500 dark:text-neutral-400">
                Your deposit, extras, delivery, fees and taxes are charged when
                you book.{" "}
                {isDelivered
                  ? "The rest is charged when we deliver the car."
                  : "The rest is charged at vehicle pickup."}
              </p>
            </>
          ) : (
            <div className="flex flex-row items-center justify-between">
              <strong>Due now ({currency.toUpperCase()})</strong>
              <strong>{formatAmountForDisplay(total, currency)}</strong>
            </div>
          )}

          {mileage && <MileageTerms mileage={mileage} currency={currency} />}
          {lateReturn && (
            <LateReturnTerms policy={lateReturn} currency={currency} />
          )}
        </div>
      </div>
    </>
  )
}

/**
 * Importe de un ajuste por regla de fecha (P0-5), con su signo: "+$200" o
 * "−$200", con el signo menos de verdad (U+2212) y no el guion de `Intl`.
 */
function formatSignedAmount(amount: number, currency: string): string {
  const abs = formatAmountForDisplay(Math.abs(amount), currency)
  if (amount < 0) return `−${abs}`
  if (amount > 0) return `+${abs}`
  return abs
}

/**
 * Precio por día de un presupuesto: "× $700/day", con el de catálogo tachado
 * cuando el negociado es más bajo. Así el cliente ve el descuento que se le
 * hizo sin tener que hacer la cuenta.
 */
export function DailyRate({
  rate,
  currency,
  className,
}: {
  rate: { price: number; list: number }
  currency: string
  className?: string
}) {
  const discounted = rate.list > rate.price
  return (
    <span className={className}>
      {discounted && (
        <>
          <span className="sr-only">Catalog price </span>
          <s className="mr-1">{formatAmountForDisplay(rate.list, currency)}</s>
          <span className="sr-only">, your price </span>
        </>
      )}
      {formatAmountForDisplay(rate.price, currency)}/day
    </span>
  )
}

/**
 * Millas incluidas y precio de las de más (P0-2).
 *
 * Fuera del total a propósito: no se sabe cuánto se va a conducir. Pero va en
 * el desglose y no en la letra pequeña porque la tarjeta queda guardada para
 * cobrarlas, y cobrar algo que el cliente no vio antes de pagar es una disputa
 * perdida.
 */
function MileageTerms({
  mileage,
  currency,
}: {
  mileage: RentalMileageTerms
  currency: string
}) {
  if (mileage.included_miles === null) {
    return (
      <p className="text-body-sm text-neutral-500 dark:text-neutral-400">
        Unlimited miles.
      </p>
    )
  }

  const rates = mileage.tiers.map((tier, index) => {
    const rate = `${formatAmountForDisplay(tier.unit_amount, currency)}/mile`
    if (tier.to !== null) {
      return `${rate} for the next ${tier.to - tier.from}`
    }
    return index === 0 ? rate : `${rate} after that`
  })

  return (
    <div className="rounded-tight border border-border p-3 text-body-sm">
      <p className="font-medium">
        {mileage.included_miles.toLocaleString("en-US")} miles included
      </p>
      <p className="text-neutral-500 dark:text-neutral-400">
        Extra miles: {rates.join(", ")}
        {mileage.tax_rate ? `, plus ${mileage.tax_rate}% tax` : ""}. Charged
        after you return the car.
      </p>
    </div>
  )
}

/**
 * Devolución tardía (P1-6). Mismo motivo que las millas para ir en el desglose:
 * se cobra después a la tarjeta guardada, así que tiene que verse antes.
 */
function LateReturnTerms({
  policy,
  currency,
}: {
  policy: RentalLateReturnPolicy
  currency: string
}) {
  return (
    <div className="rounded-tight border border-border p-3 text-body-sm">
      <p className="font-medium">Late returns</p>
      <p className="text-neutral-500 dark:text-neutral-400">
        {policy.grace_minutes} minutes of grace. After that,{" "}
        {formatAmountForDisplay(policy.hourly_rate, currency)} per hour, or the
        full daily rate from {policy.full_day_after_hours}{" "}
        {policy.full_day_after_hours === 1 ? "hour" : "hours"} late. Charged
        after you return the car.
      </p>
    </div>
  )
}
