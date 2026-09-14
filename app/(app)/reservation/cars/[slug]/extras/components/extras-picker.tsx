"use client"

import { useCallback, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { getRentalAvailability } from "@/lib/medusa/rental"
import { serializeAddonSelection } from "@/lib/medusa/addons"
import type {
  RentalAddon,
  RentalPriceBreakdown,
} from "@/lib/types/rental"
import { formatAmountForDisplay } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { PriceDetails } from "../../[[...rest]]/components/price-details"

export interface ExtrasPickerProps {
  days: number
  currency: string
  checkoutHref: string
  initialBreakdown: RentalPriceBreakdown | null
  initialDeposit: number | null
  available: RentalAddon[]
  quoteArgs: {
    productId: string
    variantId: string
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    currencyCode?: string
  }
}

/**
 * Selección de extras, antes del checkout.
 *
 * Va en su propio paso y no en la pantalla de pago por dos motivos. El primero
 * es de dinero: preparar el checkout **suelta y vuelve a coger el hold del
 * coche**, así que cambiar de extras junto al formulario de pago dejaba el
 * vehículo libre unos instantes en cada clic — el vehículo que el cliente está
 * a punto de pagar. Aquí todavía no hay carrito, así que no hay nada que soltar.
 *
 * El segundo es de atención: la pantalla de pago ya pide identificación, carnet
 * y tarjeta. Decidir extras al lado de un campo de tarjeta es donde se abandona.
 *
 * REGLA: el precio no se calcula aquí. Cada cambio recotiza contra el backend,
 * que es la única fuente de verdad del precio; sumar los extras en el navegador
 * sería una segunda cuenta que puede divergir de la que se cobra.
 */
export function ExtrasPicker({
  days,
  currency,
  checkoutHref,
  initialBreakdown,
  initialDeposit,
  available,
  quoteArgs,
}: ExtrasPickerProps) {
  const router = useRouter()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [breakdown, setBreakdown] = useState(initialBreakdown)
  const [deposit, setDeposit] = useState(initialDeposit)
  const [isQuoting, startQuoting] = useTransition()

  const setQuantity = useCallback(
    (code: string, quantity: number) => {
      const next = { ...quantities }

      if (quantity > 0) {
        next[code] = quantity
      } else {
        // Se borra la clave en vez de dejarla a 0: "no contratado" y "cero
        // unidades" son lo mismo, y una sola forma de decirlo evita mandar ruido.
        delete next[code]
      }

      setQuantities(next)

      const selection = Object.entries(next).map(([addonCode, addonQuantity]) => ({
        code: addonCode,
        quantity: addonQuantity,
      }))

      startQuoting(async () => {
        const quote = await getRentalAvailability({
          ...quoteArgs,
          addons: selection,
        })

        // Una cotización fallida deja el precio anterior en pantalla en vez de
        // vaciarlo: un desglose en blanco parece un alquiler gratis.
        if (quote.breakdown) {
          setBreakdown(quote.breakdown)
          setDeposit(quote.deposit?.amount ?? null)
        }
      })
    },
    [quantities, quoteArgs]
  )

  const selection = Object.entries(quantities).map(([code, quantity]) => ({
    code,
    quantity,
  }))

  const goToCheckout = () => {
    const encoded = serializeAddonSelection(selection)
    router.push(
      encoded ? `${checkoutHref}&addons=${encodeURIComponent(encoded)}` : checkoutHref
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,560px)_minmax(260px,465px)] md:items-start md:justify-between md:gap-x-14">
      <section className="md:col-start-1">
        <h2 className="text-xl font-semibold">Add extras</h2>
        <p className="mt-1 text-[15px] text-neutral-500 dark:text-neutral-400">
          Optional. Charged with your deposit when you book.
        </p>

        <ul className="mt-6 grid grid-cols-1 gap-5">
          {available.map((addon) => {
            const quantity = quantities[addon.code] ?? 0

            return (
              <li
                key={addon.code}
                className="flex items-start justify-between gap-4 border-b border-border pb-5 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-[15px] font-medium">{addon.name}</p>
                  {addon.description && (
                    <p className="mt-0.5 text-[13px] text-neutral-500 dark:text-neutral-400">
                      {addon.description}
                    </p>
                  )}
                  <p className="mt-1 text-[13px] tabular-nums text-neutral-500 dark:text-neutral-400">
                    {formatAmountForDisplay(addon.price, currency)}
                    {addon.charge_type === "per_day" ? " per day" : " once"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    aria-label={`Remove one ${addon.name}`}
                    // Deshabilitado mientras se recotiza: dos clics seguidos
                    // dejarían en pantalla el resultado de una cotización que ya
                    // no es la última en volver.
                    disabled={quantity === 0 || isQuoting}
                    onClick={() => setQuantity(addon.code, quantity - 1)}
                    className="flex size-8 items-center justify-center rounded-full border border-neutral-300 text-lg leading-none disabled:opacity-40 dark:border-neutral-700"
                  >
                    −
                  </button>
                  <span
                    aria-live="polite"
                    className="w-4 text-center text-[15px] tabular-nums"
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Add one ${addon.name}`}
                    disabled={isQuoting}
                    onClick={() => setQuantity(addon.code, quantity + 1)}
                    className="flex size-8 items-center justify-center rounded-full border border-neutral-300 text-lg leading-none disabled:opacity-40 dark:border-neutral-700"
                  >
                    +
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="mt-8 flex items-center gap-4">
          <Button onClick={goToCheckout} disabled={isQuoting}>
            Continue
          </Button>
          {selection.length > 0 && (
            <button
              type="button"
              // "Saltar" solo aparece si hay algo que saltarse. Con la lista a
              // cero, "Continue" ya es saltar.
              onClick={() => router.push(checkoutHref)}
              className="text-[15px] underline underline-offset-4"
            >
              Continue without extras
            </button>
          )}
        </div>
      </section>

      <aside className="mt-10 md:col-start-2 md:row-start-1 md:mt-0 md:rounded-xl md:border md:border-border">
        <div className="md:p-6">
          <PriceDetails
            days={days}
            currency={currency}
            breakdown={breakdown}
            deposit={deposit}
            fallbackSubtotal={breakdown?.total ?? 0}
            isQuoting={isQuoting}
          />
        </div>
      </aside>
    </div>
  )
}
