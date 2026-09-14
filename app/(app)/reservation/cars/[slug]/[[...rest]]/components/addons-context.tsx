"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react"

import { getRentalAvailability } from "@/lib/medusa/rental"
import type {
  RentalAddon,
  RentalAddonSelection,
  RentalPriceBreakdown,
} from "@/lib/types/rental"

/**
 * Extras elegidos y el precio que resultan.
 *
 * Vive en un contexto porque los dos consumidores están en columnas distintas
 * de la página —el selector en el cuerpo, el desglose en la barra lateral— y
 * tienen que ver exactamente lo mismo.
 *
 * REGLA: el precio no se calcula aquí. Cada cambio de selección vuelve a pedir
 * la cotización al backend, que es la única fuente de verdad del precio. Sumar
 * los extras en el navegador sería una segunda cuenta que puede divergir de la
 * que se cobra.
 */
interface AddonsContextValue {
  available: RentalAddon[]
  /** Cantidad elegida por código. Sin entrada = no contratado. */
  quantities: Record<string, number>
  setQuantity: (code: string, quantity: number) => void
  selection: RentalAddonSelection[]
  breakdown: RentalPriceBreakdown | null
  deposit: number | null
  /** Cotizando de nuevo tras un cambio: el precio en pantalla está desfasado. */
  isQuoting: boolean
}

const AddonsContext = createContext<AddonsContextValue>({
  available: [],
  quantities: {},
  setQuantity: () => {},
  selection: [],
  breakdown: null,
  deposit: null,
  isQuoting: false,
})

export interface AddonsProviderProps {
  children: ReactNode
  available: RentalAddon[]
  /** Cotización inicial, la que el servidor ya calculó al pintar la página. */
  initialBreakdown: RentalPriceBreakdown | null
  initialDeposit: number | null
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

export function AddonsProvider({
  children,
  available,
  initialBreakdown,
  initialDeposit,
  quoteArgs,
}: AddonsProviderProps) {
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
        // unidades" son lo mismo para el cliente, y una sola forma de decirlo
        // evita mandar ruido al backend.
        delete next[code]
      }

      setQuantities(next)

      const selection = Object.entries(next).map(([addonCode, addonQuantity]) => ({
        code: addonCode,
        quantity: addonQuantity,
      }))

      startQuoting(async () => {
        const quote = await getRentalAvailability({ ...quoteArgs, addons: selection })

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

  const selection = useMemo(
    () =>
      Object.entries(quantities).map(([code, quantity]) => ({
        code,
        quantity,
      })),
    [quantities]
  )

  return (
    <AddonsContext.Provider
      value={{
        available,
        quantities,
        setQuantity,
        selection,
        breakdown,
        deposit,
        isQuoting,
      }}
    >
      {children}
    </AddonsContext.Provider>
  )
}

export function useAddons() {
  return useContext(AddonsContext)
}
