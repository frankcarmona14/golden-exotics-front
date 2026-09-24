"use client"

import { useCallback, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { serializeAddonSelection } from "@/lib/medusa/addons"
import { validateDeliveryAddress } from "@/lib/medusa/delivery"
import { getRentalAvailability } from "@/lib/medusa/rental"
import { saveDeliveryAddress } from "@/lib/medusa/rental-delivery"
import type {
  DeliveryAddress,
  RentalAddon,
  RentalDeliveryZone,
  RentalPriceBreakdown,
} from "@/lib/types/rental"
import { formatAmountForDisplay } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { PriceDetails } from "../../[[...rest]]/components/price-details"

export interface ExtrasPickerProps {
  days: number
  currency: string
  checkoutHref: string
  initialBreakdown: RentalPriceBreakdown | null
  initialDeposit: number | null
  available: RentalAddon[]
  /** Zonas de entrega del coche (P0-3). Vacía = solo recogida en la oficina. */
  deliveryZones: RentalDeliveryZone[]
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
  deliveryZones,
  quoteArgs,
}: ExtrasPickerProps) {
  const router = useRouter()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  /** Zona elegida, o `null` para recoger en la oficina (lo de por defecto). */
  const [zoneCode, setZoneCode] = useState<string | null>(null)
  const [address, setAddress] = useState<Partial<DeliveryAddress>>({})
  const [addressError, setAddressError] = useState<string | null>(null)
  const [breakdown, setBreakdown] = useState(initialBreakdown)
  const [deposit, setDeposit] = useState(initialDeposit)
  const [isQuoting, startQuoting] = useTransition()
  const [isSaving, setIsSaving] = useState(false)

  /** Recotiza con la selección completa: extras y entrega van en la misma cuenta. */
  const requote = useCallback(
    (nextQuantities: Record<string, number>, nextZone: string | null) => {
      startQuoting(async () => {
        const quote = await getRentalAvailability({
          ...quoteArgs,
          addons: toSelection(nextQuantities),
          deliveryZone: nextZone,
        })

        // Una cotización fallida deja el precio anterior en pantalla en vez de
        // vaciarlo: un desglose en blanco parece un alquiler gratis.
        if (quote.breakdown) {
          setBreakdown(quote.breakdown)
          setDeposit(quote.deposit?.amount ?? null)
        }
      })
    },
    [quoteArgs]
  )

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
      requote(next, zoneCode)
    },
    [quantities, zoneCode, requote]
  )

  const chooseZone = (code: string | null) => {
    if (code === zoneCode) return
    setZoneCode(code)
    setAddressError(null)
    requote(quantities, code)
  }

  const selection = toSelection(quantities)

  /**
   * Al checkout. La zona va en la URL, como los extras; la dirección no —es un
   * dato personal— y se guarda antes en una cookie del servidor
   * (`rental-delivery.ts`). Si no vale, no se avanza: una entrega sin dirección
   * no se puede hacer.
   */
  const goToCheckout = async (withAddons: boolean) => {
    const params = new URLSearchParams()

    if (withAddons) {
      const encoded = serializeAddonSelection(selection)
      if (encoded) params.set("addons", encoded)
    }

    if (zoneCode) {
      const checked = validateDeliveryAddress(address)
      if (!checked.ok) {
        setAddressError(checked.error)
        return
      }

      setIsSaving(true)
      const saved = await saveDeliveryAddress(checked.address)
      setIsSaving(false)

      if (!saved.ok) {
        setAddressError(saved.error ?? "Could not save the address. Try again.")
        return
      }

      params.set("delivery", zoneCode)
    }

    const extra = params.toString()
    router.push(extra ? `${checkoutHref}&${extra}` : checkoutHref)
  }

  const isBusy = isQuoting || isSaving

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,560px)_minmax(260px,465px)] md:items-start md:justify-between md:gap-x-14">
      <section className="md:col-start-1">
        {deliveryZones.length > 0 && (
          <DeliveryPicker
            zones={deliveryZones}
            currency={currency}
            zoneCode={zoneCode}
            onZoneChange={chooseZone}
            address={address}
            onAddressChange={(next) => {
              setAddress(next)
              setAddressError(null)
            }}
            error={addressError}
            disabled={isBusy}
          />
        )}

        {available.length > 0 && (
          <div className={deliveryZones.length > 0 ? "mt-12" : undefined}>
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
                        disabled={quantity === 0 || isBusy}
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
                        disabled={isBusy}
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
          </div>
        )}

        <div className="mt-8 flex items-center gap-4">
          <Button onClick={() => goToCheckout(true)} disabled={isBusy}>
            Continue
          </Button>
          {selection.length > 0 && (
            <button
              type="button"
              // "Saltar" solo aparece si hay algo que saltarse. Con la lista a
              // cero, "Continue" ya es saltar. Salta los extras, no la entrega:
              // esa se elige arriba, y perderla aquí sería una sorpresa.
              disabled={isBusy}
              onClick={() => goToCheckout(false)}
              className="text-[15px] underline underline-offset-4 disabled:opacity-40"
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

function toSelection(quantities: Record<string, number>) {
  return Object.entries(quantities).map(([code, quantity]) => ({
    code,
    quantity,
  }))
}

/**
 * Recogida en la oficina o entrega en una zona (P0-3).
 *
 * Radios y no un desplegable: son pocas opciones, cada una con su precio, y el
 * cliente tiene que ver que recoger es gratis sin abrir nada. La dirección solo
 * aparece al elegir zona, porque es entonces cuando hace falta.
 */
function DeliveryPicker({
  zones,
  currency,
  zoneCode,
  onZoneChange,
  address,
  onAddressChange,
  error,
  disabled,
}: {
  zones: RentalDeliveryZone[]
  currency: string
  zoneCode: string | null
  onZoneChange: (code: string | null) => void
  address: Partial<DeliveryAddress>
  onAddressChange: (next: Partial<DeliveryAddress>) => void
  error: string | null
  disabled: boolean
}) {
  const options: {
    code: string | null
    name: string
    description: string | null
    price: number
  }[] = [
    {
      code: null,
      name: "Pick up at our location",
      description: "Collect and return the car at our office.",
      price: 0,
    },
    ...zones,
  ]

  const field = (key: keyof DeliveryAddress) => ({
    id: `delivery-${key}`,
    value: address[key] ?? "",
    disabled,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onAddressChange({ ...address, [key]: e.target.value }),
  })

  return (
    <div>
      <h2 className="text-xl font-semibold">Delivery or pickup</h2>
      <p className="mt-1 text-[15px] text-neutral-500 dark:text-neutral-400">
        We can bring the car to you. Delivery is charged when you book and
        covers drop-off and collection at the same address.
      </p>

      <fieldset className="mt-6 grid grid-cols-1 gap-3" disabled={disabled}>
        <legend className="sr-only">Delivery or pickup</legend>
        {options.map((option) => {
          const checked = option.code === zoneCode

          return (
            <label
              key={option.code ?? "pickup"}
              className={`flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4 transition-colors ${
                checked
                  ? "border-neutral-900 dark:border-neutral-100"
                  : "border-border hover:border-neutral-400"
              }`}
            >
              <span className="flex items-start gap-3">
                <input
                  type="radio"
                  name="delivery-zone"
                  className="mt-1 accent-neutral-900 dark:accent-neutral-100"
                  checked={checked}
                  onChange={() => onZoneChange(option.code)}
                />
                <span className="min-w-0">
                  <span className="block text-[15px] font-medium">
                    {option.name}
                  </span>
                  {option.description && (
                    <span className="mt-0.5 block text-[13px] text-neutral-500 dark:text-neutral-400">
                      {option.description}
                    </span>
                  )}
                </span>
              </span>
              <span className="shrink-0 text-[15px] tabular-nums">
                {option.price > 0
                  ? formatAmountForDisplay(option.price, currency)
                  : "Free"}
              </span>
            </label>
          )
        })}
      </fieldset>

      {zoneCode && (
        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="delivery-address_1">Street address</Label>
            <Input
              {...field("address_1")}
              autoComplete="address-line1"
              placeholder="1111 Lincoln Rd"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="delivery-address_2">
              Apartment, suite, hotel{" "}
              <span className="font-normal text-neutral-500">(optional)</span>
            </Label>
            <Input {...field("address_2")} autoComplete="address-line2" />
          </div>
          <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4">
            <div className="grid gap-2">
              <Label htmlFor="delivery-city">City</Label>
              <Input
                {...field("city")}
                autoComplete="address-level2"
                placeholder="Miami Beach"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="delivery-postal_code">ZIP code</Label>
              <Input
                {...field("postal_code")}
                autoComplete="postal-code"
                inputMode="numeric"
                placeholder="33139"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="delivery-notes">
              Notes for the driver{" "}
              <span className="font-normal text-neutral-500">(optional)</span>
            </Label>
            <Input
              {...field("notes")}
              placeholder="Gate code, valet, where to meet you"
            />
          </div>
          {error && (
            <p
              role="alert"
              className="text-[13px] text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
