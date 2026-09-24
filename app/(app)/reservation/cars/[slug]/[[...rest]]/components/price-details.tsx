import { formatAmountForDisplay } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import type { RentalPriceBreakdown } from "@/lib/types/rental"

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
}: {
  days: number
  currency: string
  breakdown: RentalPriceBreakdown | null
  deposit: number | null
  /** Precio del coche cuando la cotización no llegó. Ver la página. */
  fallbackSubtotal: number
  /** Recotizando: lo que hay en pantalla es el precio anterior. */
  isQuoting?: boolean
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

  return (
    <>
      <h2 className="text-xl font-semibold">Your total</h2>
      <div
        className="pt-5"
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
                className="flex flex-row items-center justify-between text-[15px]"
              >
                <span>
                  {line.type === "base"
                    ? `${days} ${days === 1 ? "day" : "days"}`
                    : line.quantity > 1
                      ? `${line.label} × ${line.quantity}`
                      : line.label}
                </span>
                <span>{formatAmountForDisplay(line.amount, currency)}</span>
              </div>
            ))
          ) : (
            <div className="flex flex-row items-center justify-between text-[15px]">
              <span>
                {days} {days === 1 ? "day" : "days"}
              </span>
              <span>{formatAmountForDisplay(subtotal, currency)}</span>
            </div>
          )}

          {taxes > 0 && (
            <div className="flex flex-row items-center justify-between text-[15px]">
              <span>Taxes</span>
              <span>{formatAmountForDisplay(taxes, currency)}</span>
            </div>
          )}

          <Separator className="my-3" />
          <div className="flex flex-row items-center justify-between text-[15px]">
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
              <div className="flex flex-row items-center justify-between text-[15px]">
                <span>Due at pickup</span>
                <span>{formatAmountForDisplay(balance, currency)}</span>
              </div>
              <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                Your deposit, extras, delivery, fees and taxes are charged when
                you book.
                The rest is charged at vehicle pickup.
              </p>
            </>
          ) : (
            <div className="flex flex-row items-center justify-between">
              <strong>Due now ({currency.toUpperCase()})</strong>
              <strong>{formatAmountForDisplay(total, currency)}</strong>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
