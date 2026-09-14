"use client"

import { formatAmountForDisplay } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

import { useAddons } from "./addons-context"

/**
 * Selección de extras.
 *
 * Cada extra es un contador, no una casilla: los hay que se contratan por
 * unidades (dos sillitas) y con una casilla habría que añadir otro control en
 * cuanto aparezca el primero que se pide por pares.
 */
export function AddonsSection({ currency }: { currency: string }) {
  const { available, quantities, setQuantity, isQuoting } = useAddons()

  if (!available.length) {
    return null
  }

  return (
    <section aria-labelledby="addons-heading">
      <h2 id="addons-heading" className="text-xl font-semibold">
        Add extras
      </h2>
      <p className="mt-1 text-[15px] text-neutral-500 dark:text-neutral-400">
        Optional. Charged with your deposit when you book.
      </p>

      <ul className="mt-5 grid grid-cols-1 gap-4">
        {available.map((addon) => {
          const quantity = quantities[addon.code] ?? 0

          return (
            <li
              key={addon.code}
              className="flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-[15px] font-medium">{addon.name}</p>
                {addon.description && (
                  <p className="mt-0.5 text-[13px] text-neutral-500 dark:text-neutral-400">
                    {addon.description}
                  </p>
                )}
                <p className="mt-0.5 text-[13px] tabular-nums text-neutral-500 dark:text-neutral-400">
                  {formatAmountForDisplay(addon.price, currency)}
                  {addon.charge_type === "per_day" ? " per day" : " once"}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  aria-label={`Remove one ${addon.name}`}
                  // Deshabilitado mientras se recotiza: dos clics seguidos
                  // dejarían el precio en pantalla contando una cotización que
                  // ya no es la última en volver.
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

      <Separator className="my-7" />
    </section>
  )
}
