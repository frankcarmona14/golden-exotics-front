import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getCarBySlug } from "@/db/queries/car-repository"
import { isValid } from "date-fns"

import { parseAddonSelection } from "@/lib/medusa/addons"
import {
  getDeliveryZones,
  getRentalAddons,
  getRentalAvailability,
} from "@/lib/medusa/rental"
import { getDeliveryAddress } from "@/lib/medusa/rental-delivery"
import { SearchParams } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "@/components/icons/chevron-left"

import { BackButton } from "../[[...rest]]/components/back-button"
import { ExtrasPicker } from "./components/extras-picker"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Add extras",
}

function rentalDaysFromDateTimes(
  checkin: string,
  checkout: string,
  checkinTime: string,
  checkoutTime: string
): number {
  const build = (dateStr: string, timeStr: string) => {
    const [h = 0, m = 0] = timeStr.split(":").map(Number)
    const d = new Date(dateStr)
    d.setHours(h, m, 0, 0)
    return d
  }

  const ms =
    build(checkout, checkoutTime).getTime() -
    build(checkin, checkinTime).getTime()

  return ms <= 0 ? 0 : Math.ceil(ms / (24 * 60 * 60 * 1000))
}

interface ExtrasPageProps {
  params: { slug: string }
  searchParams: {
    [SearchParams.CHECKIN]: string
    [SearchParams.CHECKOUT]: string
    [SearchParams.CHECKIN_TIME]?: string
    [SearchParams.CHECKOUT_TIME]?: string
    /**
     * Selección previa, al volver del pago (botón atrás o dirección caducada).
     * El selector la lleva siempre en la URL para que volver no la borre.
     */
    addons?: string
    delivery?: string
  }
}

/**
 * Paso de extras, entre la ficha del coche y el checkout.
 *
 * Existe aquí y no dentro del checkout porque preparar el checkout **suelta y
 * vuelve a coger el hold del coche**: cambiar de extras junto al formulario de
 * pago dejaba el vehículo libre unos instantes en cada clic. En este punto
 * todavía no hay carrito, así que la selección se cierra antes de que exista
 * nada que soltar.
 *
 * Aquí se elige también la entrega (P0-3): cambia el precio igual que un extra,
 * así que tiene que estar cerrada antes de que exista el carrito.
 *
 * Si el coche no tiene extras **ni** zonas de entrega, esta pantalla no
 * aparece: redirige al checkout.
 * La decisión se toma en el servidor, que es donde están los datos — la ficha
 * del coche no sabe si hay extras y no debería tener que averiguarlo.
 */
export default async function CarExtrasPage({
  params,
  searchParams,
}: ExtrasPageProps) {
  const {
    checkin,
    checkout,
    checkin_time: checkinTimeParam,
    checkout_time: checkoutTimeParam,
    addons: addonsParam,
    delivery: deliveryParam,
  } = searchParams

  const car = await getCarBySlug(params.slug)

  if (!car) {
    throw new Error("Car is missing")
  }

  const checkoutParams = new URLSearchParams({
    checkin: checkin ?? "",
    checkout: checkout ?? "",
    ...(checkinTimeParam ? { checkin_time: checkinTimeParam } : {}),
    ...(checkoutTimeParam ? { checkout_time: checkoutTimeParam } : {}),
  })
  const checkoutHref = `/reservation/cars/${params.slug}?${checkoutParams}`

  // Sin fechas válidas no hay nada que cotizar. El checkout ya tiene su propio
  // mensaje para ese caso, así que se delega en él en vez de duplicarlo.
  if (
    !checkin ||
    !checkout ||
    !isValid(new Date(checkin)) ||
    !isValid(new Date(checkout))
  ) {
    redirect(checkoutHref)
  }

  const checkinTime = checkinTimeParam ?? "10:00"
  const checkoutTime = checkoutTimeParam ?? "10:00"
  const days = rentalDaysFromDateTimes(
    checkin,
    checkout,
    checkinTime,
    checkoutTime
  )

  const isRentable = car.rentalConfiguration?.status === "active"

  if (
    !isRentable ||
    !car.medusaProductId ||
    !car.medusaVariantId ||
    days <= 0
  ) {
    redirect(checkoutHref)
  }

  const [addons, deliveryZones] = await Promise.all([
    getRentalAddons(car.medusaProductId),
    getDeliveryZones(car.medusaProductId),
  ])

  /**
   * Lo que el cliente ya había elegido, filtrado contra lo que existe hoy: un
   * extra o una zona que se desactivó mientras tanto se cae de la selección en
   * vez de hacer fallar la cotización.
   */
  const initialAddons = parseAddonSelection(addonsParam).filter((selected) =>
    addons.some((addon) => addon.code === selected.code)
  )
  const initialZone = deliveryZones.some((zone) => zone.code === deliveryParam)
    ? deliveryParam!
    : null
  const initialAddress = initialZone ? await getDeliveryAddress() : null

  const availability = await getRentalAvailability({
    productId: car.medusaProductId,
    variantId: car.medusaVariantId,
    startDate: checkin,
    endDate: checkout,
    startTime: checkinTime,
    endTime: checkoutTime,
    currencyCode: car.currency,
    addons: initialAddons,
    deliveryZone: initialZone,
  })

  // Nada que elegir, ninguna pantalla que enseñar.
  if ((!addons.length && !deliveryZones.length) || !availability.available) {
    redirect(checkoutHref)
  }

  return (
    <main id="main-content">
      <div className="px-5 pb-16 md:py-16">
        <div className="mx-auto max-w-none sm:max-w-[90%] sm:px-0 xl:max-w-6xl">
          <header className="sticky top-[var(--site-header-height)] z-40 -mx-5 mb-2 border-b border-black/10 bg-white px-5 dark:border-neutral-800 dark:bg-neutral-950 md:static md:z-auto md:mx-0 md:mb-12 md:border-0 md:bg-transparent md:px-0 md:dark:bg-transparent">
            <div className="relative flex h-[var(--site-header-height)] items-center md:h-auto">
              <BackButton className="z-40 -ml-2 md:-ml-12 md:mr-2">
                <ChevronLeftIcon className="size-5 shrink-0" />
              </BackButton>
              <h1 className="absolute inset-0 flex items-center justify-center text-base font-semibold md:static md:justify-start md:text-3xl">
                {addons.length ? "Add extras" : "Delivery or pickup"}
              </h1>
            </div>
          </header>

          <ExtrasPicker
            days={days}
            currency={car.currency}
            checkoutHref={checkoutHref}
            initialBreakdown={availability.breakdown ?? null}
            initialDeposit={availability.deposit?.amount ?? null}
            available={addons}
            deliveryZones={deliveryZones}
            initialAddons={initialAddons}
            initialZone={initialZone}
            initialAddress={initialAddress}
            quoteArgs={{
              productId: car.medusaProductId,
              variantId: car.medusaVariantId,
              startDate: checkin,
              endDate: checkout,
              startTime: checkinTime,
              endTime: checkoutTime,
              currencyCode: car.currency,
            }}
          />

          <p className="mt-10 text-[13px] text-neutral-500 dark:text-neutral-400">
            Changed your mind about the dates?{" "}
            <Link
              href={`/cars/${params.slug}`}
              className="underline underline-offset-4"
            >
              Back to {car.name}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
