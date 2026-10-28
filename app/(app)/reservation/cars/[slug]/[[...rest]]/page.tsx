export const dynamic = "force-dynamic"

import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getCarBySlug } from "@/db/queries/car-repository"
import { getCustomer } from "@/lib/medusa/customer"
import { getGuestNotes, getRentalAvailability } from "@/lib/medusa/rental"
import { isDateRuleMinimum } from "@/lib/medusa/rental-errors"
import { DELIVERY_REQUESTED } from "@/lib/medusa/delivery"
import { getDeliveryRequest } from "@/lib/medusa/rental-delivery"
import { differenceInDays, isValid } from "date-fns"

import { SearchParams } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeftIcon } from "@/components/icons/chevron-left"

import { parseAddonSelection } from "@/lib/medusa/addons"
import { resolveQuoteBooking } from "@/lib/quote-booking"
import type {
  RentalLateReturnPolicy,
  RentalMileageTerms,
  RentalPriceBreakdown,
} from "@/lib/types/rental"

import { AuthSection } from "./components/auth-section"
import { BackButton } from "./components/back-button"
import { BookDetails } from "./components/book-details"
import { CarDetails } from "./components/car-details"
import { ConfirmRental } from "./components/confirm-rental"
import { GuestNotes } from "@/components/guest-notes"
import { GuestProvider } from "./components/guest-context"
import { PriceDetails } from "./components/price-details"
import { QuoteLockedNote, QuoteUnavailable } from "./components/quote-notice"

export const metadata: Metadata = {
  title: "Confirm and pay",
}

function buildDateTimeFromDateAndTime(dateStr: string, timeStr: string): Date {
  const [h = 0, m = 0] = timeStr.split(":").map(Number)
  const d = new Date(dateStr)
  d.setHours(h, m, 0, 0)
  return d
}

function rentalDaysFromDateTimes(
  checkin: string,
  checkout: string,
  checkinTime: string,
  checkoutTime: string
): number {
  const start = buildDateTimeFromDateAndTime(checkin, checkinTime)
  const end = buildDateTimeFromDateAndTime(checkout, checkoutTime)
  const ms = end.getTime() - start.getTime()
  if (ms <= 0) return 0
  return Math.ceil(ms / (24 * 60 * 60 * 1000))
}

interface CarReservationPageProps {
  params: { slug: string }
  searchParams: {
    [SearchParams.CHECKIN]: string
    [SearchParams.CHECKOUT]: string
    [SearchParams.CHECKIN_TIME]?: string
    [SearchParams.CHECKOUT_TIME]?: string
    /** Extras elegidos en el paso anterior, como `codigo:cantidad` por comas. */
    addons?: string
    /** Zona de entrega elegida en el paso anterior (P0-3). La dirección, en cookie. */
    delivery?: string
    /** Presupuesto del que sale la reserva (P1-1). Ver `lib/quote-booking.ts`. */
    quote?: string
    quote_item?: string
  }
}

export default async function CarReservationPage({
  params,
  searchParams,
}: CarReservationPageProps) {
  /**
   * Desde un presupuesto (P1-1) fechas, extras, zona y precio salen del
   * presupuesto, releído aquí en el servidor; de la URL solo sale cuál es.
   */
  const quoted = await resolveQuoteBooking(params.slug, searchParams)

  if (quoted.kind === "unavailable") {
    return <QuoteUnavailable token={quoted.token} message={quoted.message} />
  }
  if (quoted.kind === "redirect") {
    redirect(quoted.href)
  }
  const fromQuote = quoted.kind === "ok" ? quoted : null

  const {
    checkin,
    checkout,
    checkin_time: checkinTimeParam,
    checkout_time: checkoutTimeParam,
    addons: addonsParam,
    delivery: deliveryZone,
  } = fromQuote
    ? {
        checkin: fromQuote.checkin,
        checkout: fromQuote.checkout,
        checkin_time: fromQuote.checkinTime,
        checkout_time: fromQuote.checkoutTime,
        addons: undefined,
        delivery: fromQuote.item.delivery_zone ?? undefined,
      }
    : searchParams
  const car = await getCarBySlug(params.slug)

  if (!car) {
    throw new Error("Car is missing")
  }

  if (
    !checkin ||
    !checkout ||
    !isValid(new Date(checkin)) ||
    !isValid(new Date(checkout))
  ) {
    return (
      <main id="main-content" className="mx-auto w-full max-w-2xl px-5 py-20">
        <h1 className="text-heading-sm">
          Choose your dates
        </h1>
        <p className="mt-3 text-body leading-relaxed text-muted-foreground">
          This reservation is missing a check-in or check-out date. Pick your
          trip dates on the car page to continue.
        </p>
        <Button className="mt-8" asChild>
          <Link href={`/cars/${params.slug}`}>Back to {car.name}</Link>
        </Button>
      </main>
    )
  }

  const checkinDate = new Date(checkin)
  const checkoutDate = new Date(checkout)

  const checkinTime = checkinTimeParam ?? "10:00"
  const checkoutTime = checkoutTimeParam ?? "10:00"
  const useTimeBasedDays =
    checkinTimeParam != null &&
    checkoutTimeParam != null &&
    /^\d{1,2}:\d{2}$/.test(checkinTimeParam) &&
    /^\d{1,2}:\d{2}$/.test(checkoutTimeParam)

  // Con presupuesto, los días son los que se cotizaron.
  const days = fromQuote
    ? fromQuote.item.rental_days
    : useTimeBasedDays
      ? rentalDaysFromDateTimes(checkin, checkout, checkinTime, checkoutTime)
      : differenceInDays(checkoutDate, checkinDate)

  if (days <= 0) {
    return (
      <main id="main-content" className="mx-auto w-full max-w-2xl px-5 py-20">
        <h1 className="text-heading-sm">
          Invalid date range
        </h1>
        <p className="mt-3 text-body leading-relaxed text-muted-foreground">
          Check-out must be after check-in. Pick a new date range to continue.
        </p>
        <Button className="mt-8" asChild>
          <Link href={`/cars/${params.slug}`}>Back to {car.name}</Link>
        </Button>
      </main>
    )
  }

  const isRentable = car.rentalConfiguration?.status === "active"
  const customer = await getCustomer()
  const isLoggedIn = !!customer

  const checkoutParams = new URLSearchParams({
    checkin,
    checkout,
    checkin_time: checkinTime,
    checkout_time: checkoutTime,
    ...(fromQuote?.params ?? {}),
  })
  const redirectTo = `/reservation/cars/${params.slug}?${checkoutParams}`

  /**
   * Extras ya elegidos en el paso anterior.
   *
   * Aquí la selección está **cerrada**: se cotiza y se cobra con ella, pero no
   * se puede cambiar. Cambiarla en esta pantalla obligaría a rehacer el carrito,
   * y rehacer el carrito suelta el hold del coche que se está pagando.
   */
  const selectedAddons = fromQuote
    ? fromQuote.item.addons
    : parseAddonSelection(addonsParam)

  /**
   * Entrega elegida en el paso anterior (P0-3). La zona viene en la URL; la
   * dirección, en una cookie del servidor (`rental-delivery.ts`).
   *
   * Sin dirección —caducó la cookie, o se abrió el enlace en otro navegador—
   * se vuelve al paso de extras en vez de cobrar una entrega que no se puede
   * hacer.
   */
  const deliveryRequested = deliveryZone === DELIVERY_REQUESTED && !fromQuote
  const pricedZone = deliveryRequested ? undefined : deliveryZone
  const savedDelivery =
    pricedZone || deliveryRequested ? await getDeliveryRequest() : null

  if ((pricedZone && !savedDelivery?.address) || (deliveryRequested && !savedDelivery)) {
    const back = new URLSearchParams(checkoutParams)
    if (addonsParam) back.set("addons", addonsParam)
    if (fromQuote && pricedZone) back.set("delivery", pricedZone)
    if (deliveryRequested) back.set("delivery", DELIVERY_REQUESTED)
    redirect(`/reservation/cars/${params.slug}/extras?${back}`)
  }

  let rentalAvailable = true
  /** Mínimo de una regla por fecha (P0-5): explica el "no disponible". */
  let unavailableReason: string | null = null
  let rentalTotalFromApi: number | null = null
  let depositAmount: number | null = null
  let breakdown: RentalPriceBreakdown | null = null
  let mileage: RentalMileageTerms | null = null
  let lateReturn: RentalLateReturnPolicy | null = null

  if (isRentable && car.medusaProductId && car.medusaVariantId) {
    const availability = await getRentalAvailability({
      productId: car.medusaProductId,
      variantId: car.medusaVariantId,
      startDate: checkin,
      endDate: checkout,
      startTime: checkinTime,
      endTime: checkoutTime,
      currencyCode: car.currency,
      addons: selectedAddons,
      deliveryZone: pricedZone,
    })

    rentalAvailable = availability.available
    if (!availability.available && isDateRuleMinimum(availability.message)) {
      unavailableReason = availability.message ?? null
    }
    breakdown = availability.breakdown ?? null
    mileage = availability.mileage ?? null
    lateReturn = availability.late_return ?? null
    if (availability.price?.amount && availability.price.amount > 0) {
      rentalTotalFromApi = availability.price.amount
    }
    if (availability.deposit?.amount && availability.deposit.amount > 0) {
      depositAmount = availability.deposit.amount
    }
  }

  /**
   * La disponibilidad no sabe de presupuestos: cotiza a precio de catálogo. Con
   * presupuesto se enseña su precio, que es el que cobrará el backend.
   */
  if (fromQuote) {
    rentalTotalFromApi = fromQuote.item.total
    depositAmount = fromQuote.deposit ?? depositAmount
    breakdown = fromQuote.breakdown
  }

  /**
   * Precio de reserva por si la cotización no llegó (coche sin configurar,
   * backend caído). No es el precio bueno: el bueno lo calcula el motor del
   * backend y viaja en `breakdown`.
   *
   * Los impuestos ya NO se calculan aquí. Antes salían de
   * `NEXT_PUBLIC_TAX_RATE`, una segunda fuente de verdad para un número que el
   * backend ya conoce — y que además se sumaba sobre un total que ya lo incluía.
   */
  const fallbackSubtotal =
    rentalTotalFromApi != null && rentalTotalFromApi > 0
      ? rentalTotalFromApi
      : Number(car.pricePerDay) * days
  const currency = car.currency
  const customerName = customer?.first_name
    ? `${customer.first_name} ${customer.last_name ?? ""}`.trim()
    : null

  // Lo que el operador quiere que se lea antes de pagar (P1-5).
  const guestNotes = car.medusaProductId
    ? await getGuestNotes(car.medusaProductId)
    : []

  return (
    <GuestProvider>
      <main id="main-content">
        <div className="px-5 pb-16 md:py-16">
          <div className="mx-auto max-w-none sm:max-w-[90%] sm:px-0 xl:max-w-6xl">
            <header className="sticky top-[var(--site-header-height)] z-40 -mx-5 mb-2 border-b border-black/10 bg-white px-5 backdrop-blur-md dark:border-border dark:bg-background/80 md:static md:z-auto md:mx-0 md:mb-12 md:border-0 md:bg-transparent md:px-0 md:dark:bg-transparent">
              <div className="relative flex h-[var(--site-header-height)] items-center md:h-auto">
                <BackButton className="z-40 -ml-2 md:-ml-12 md:mr-2">
                  <ChevronLeftIcon className="size-5 shrink-0" />
                </BackButton>
                <h1 className="absolute inset-0 flex items-center justify-center text-base font-semibold md:static md:justify-start md:text-heading">
                  Confirm and pay
                </h1>
              </div>
            </header>

            {fromQuote && (
              <QuoteLockedNote
                token={fromQuote.ref.token}
                className="mb-6 md:mb-10"
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,560px)_minmax(260px,465px)] md:items-start md:justify-between md:gap-x-14">
              <aside className="md:sticky md:top-[calc(var(--site-header-height)+1.5rem)] md:col-start-2 md:row-span-2 md:rounded-card md:border md:border-border">
                <div className="py-3 md:p-6">
                  <CarDetails
                    car={car}
                    checkinDate={checkinDate}
                    checkoutDate={checkoutDate}
                    checkinTime={checkinTime}
                    checkoutTime={checkoutTime}
                  />
                  <Separator className="my-6 md:my-7" />
                  <PriceDetails
                    days={days}
                    currency={currency}
                    breakdown={breakdown}
                    deposit={depositAmount}
                    fallbackSubtotal={fallbackSubtotal}
                    mileage={mileage}
                    lateReturn={lateReturn}
                    dailyRate={fromQuote?.dailyRate ?? null}
                  />
                  {rentalAvailable && (
                    <div
                      role="status"
                      className="mt-5 hidden rounded-tight bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/20 dark:text-green-400 md:block"
                    >
                      Available for your dates
                    </div>
                  )}
                </div>
              </aside>

              <Separator className="md:hidden" />

              <section className="py-3 md:col-start-1 md:row-start-1 md:py-0">
                <BookDetails
                  checkinDate={checkinDate}
                  checkoutDate={checkoutDate}
                  checkinTime={checkinTime}
                  checkoutTime={checkoutTime}
                  feePending={deliveryRequested}
                  delivery={
                    deliveryRequested
                      ? {
                          address: savedDelivery?.address ?? null,
                          description: savedDelivery?.description ?? null,
                        }
                      : savedDelivery?.address
                        ? { address: savedDelivery.address, description: null }
                        : null
                  }
                />
              </section>

              <section className="md:col-start-1 md:row-start-2">
                <Separator className="my-3 md:my-7" />

                {!rentalAvailable && (
                  <div
                    role="alert"
                    className="rounded-tight border border-red-500/50 bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/20 dark:text-red-300"
                  >
                    <p className="font-medium">Not available</p>
                    <p className="mt-1">
                      {unavailableReason ? (
                        <>
                          {unavailableReason} Please go back and choose
                          different dates.
                        </>
                      ) : (
                        <>
                          This car is not available for the selected dates.
                          Please go back and choose different dates.
                        </>
                      )}
                    </p>
                  </div>
                )}

                {rentalAvailable && (
                  <>
                    <GuestNotes notes={guestNotes} className="mb-7" />
                    <AuthSection
                      isLoggedIn={isLoggedIn}
                      customerName={customerName}
                      customerEmail={customer?.email}
                      customerPhone={customer?.phone}
                      redirectTo={redirectTo}
                    />
                    <Separator className="my-7" />
                    {car.medusaProductId && car.medusaVariantId ? (
                      <ConfirmRental
                        productId={car.medusaProductId}
                        variantId={car.medusaVariantId}
                        startDate={checkin}
                        endDate={checkout}
                        startTime={checkinTime}
                        endTime={checkoutTime}
                        rentalDays={days}
                        isLoggedIn={isLoggedIn}
                        customerEmail={customer?.email}
                        customerName={customerName}
                        customerPhone={customer?.phone}
                        deposit={depositAmount}
                        currency={currency}
                        addons={selectedAddons}
                        deliveryZone={
                          deliveryRequested ? DELIVERY_REQUESTED : pricedZone ?? null
                        }
                        quote={fromQuote?.ref ?? null}
                      />
                    ) : (
                      <p className="text-sm text-neutral-500">
                        This car cannot be reserved online (mock data).
                      </p>
                    )}
                  </>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
    </GuestProvider>
  )
}
