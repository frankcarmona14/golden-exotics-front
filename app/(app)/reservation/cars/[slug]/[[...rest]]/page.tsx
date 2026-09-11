export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { getCarBySlug } from "@/db/queries/car-repository"
import { getCustomer } from "@/lib/medusa/customer"
import { getRentalAvailability } from "@/lib/medusa/rental"
import { differenceInDays, isValid } from "date-fns"

import { SearchParams } from "@/lib/types"
import { Separator } from "@/components/ui/separator"
import { ChevronLeftIcon } from "@/components/icons/chevron-left"

import { AuthSection } from "./components/auth-section"
import { BackButton } from "./components/back-button"
import { BookDetails } from "./components/book-details"
import { CarDetails } from "./components/car-details"
import { ConfirmRental } from "./components/confirm-rental"
import { GuestProvider } from "./components/guest-context"
import { PriceDetails } from "./components/price-details"

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
  }
}

export default async function CarReservationPage({
  params,
  searchParams,
}: CarReservationPageProps) {
  const {
    checkin,
    checkout,
    checkin_time: checkinTimeParam,
    checkout_time: checkoutTimeParam,
  } = searchParams
  const car = await getCarBySlug(params.slug)

  if (!car) {
    throw new Error("Car is missing")
  }

  if (!isValid(new Date(checkin)) || !isValid(new Date(checkout))) {
    throw new Error("Invalid dates")
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

  const days = useTimeBasedDays
    ? rentalDaysFromDateTimes(checkin, checkout, checkinTime, checkoutTime)
    : differenceInDays(checkoutDate, checkinDate)

  if (days <= 0) {
    throw new Error("Invalid date range selected")
  }

  const isRentable = car.rentalConfiguration?.status === "active"
  const customer = await getCustomer()
  const isLoggedIn = !!customer

  // Build current URL for redirect after login
  const checkoutParams = new URLSearchParams({
    checkin,
    checkout,
    checkin_time: checkinTime,
    checkout_time: checkoutTime,
  })
  const redirectTo = `/reservation/cars/${params.slug}?${checkoutParams}`

  let rentalAvailable = true
  let rentalTotalFromApi: number | null = null
  let depositAmount: number | null = null

  if (isRentable && car.medusaProductId && car.medusaVariantId) {
    const availability = await getRentalAvailability({
      productId: car.medusaProductId,
      variantId: car.medusaVariantId,
      startDate: checkin,
      endDate: checkout,
      startTime: checkinTime,
      endTime: checkoutTime,
      currencyCode: car.currency,
    })
    rentalAvailable = availability.available
    if (availability.price?.amount && availability.price.amount > 0) {
      rentalTotalFromApi = availability.price.amount
    }
    if (availability.deposit?.amount && availability.deposit.amount > 0) {
      depositAmount = availability.deposit.amount
    }
  }

  const subtotal =
    rentalTotalFromApi != null && rentalTotalFromApi > 0
      ? rentalTotalFromApi
      : Number(car.pricePerDay) * days
  const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE)
  const taxes =
    Number.isFinite(taxRate) && taxRate >= 0 ? subtotal * taxRate : 0
  const currency = car.currency

  return (
    <GuestProvider>
      {/* Phone and Tablets */}
      <div className="md:hidden">
        <div className="flex size-full flex-col">
          <header className="sticky top-[var(--site-header-height)] z-40 border-b border-black/10 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            <div className="px-5">
              <div className="relative flex h-[var(--site-header-height)] items-center">
                <BackButton className="z-40 -ml-2">
                  <ChevronLeftIcon className="size-5 shrink-0" />
                </BackButton>
                <div className="absolute inset-0 flex items-center justify-center self-center">
                  <h1 className="text-center text-base font-semibold">
                    Confirm and pay
                  </h1>
                </div>
              </div>
            </div>
          </header>
          <main>
            <div className="pb-10 pt-2">
              <div className="px-5 py-3">
                <CarDetails
                  car={car}
                  checkinDate={checkinDate}
                  checkoutDate={checkoutDate}
                  checkinTime={checkinTime}
                  checkoutTime={checkoutTime}
                />
              </div>
              <Separator className="my-3 h-[6px]" />
              <div className="px-5 py-3">
                <BookDetails
                  checkinDate={checkinDate}
                  checkoutDate={checkoutDate}
                  checkinTime={checkinTime}
                  checkoutTime={checkoutTime}
                />
              </div>
              <Separator className="my-3 h-[6px]" />
              <div className="px-5 py-3">
                <PriceDetails
                  days={days}
                  currency={currency}
                  subtotal={subtotal}
                  taxes={taxes}
                  deposit={depositAmount}
                />
              </div>

              {!rentalAvailable && (
                <>
                  <Separator className="my-3 h-[6px]" />
                  <div className="px-5 py-3">
                    <div className="rounded-lg border border-red-500/50 bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/20 dark:text-red-300">
                      <p className="font-medium">Not available</p>
                      <p className="mt-1">
                        This car is not available for the selected dates. Please
                        go back and choose different dates.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {rentalAvailable && (
                <>
                  <Separator className="my-3 h-[6px]" />
                  <div className="px-5 py-3">
                    <AuthSection
                      isLoggedIn={isLoggedIn}
                      customerName={customer?.first_name ? `${customer.first_name} ${customer.last_name ?? ""}`.trim() : null}
                      customerEmail={customer?.email}
                      redirectTo={redirectTo}
                    />
                  </div>
                  <Separator className="my-3 h-[6px]" />
                  <div className="px-5 py-3">
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
                        customerName={
                          customer?.first_name
                            ? `${customer.first_name} ${customer.last_name ?? ""}`.trim()
                            : null
                        }
                        deposit={depositAmount}
                        currency={currency}
                      />
                    ) : (
                      <p className="text-sm text-neutral-500">
                        This car cannot be reserved online (mock data).
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <main>
          <div className="px-5 py-16">
            <div className="mx-auto sm:max-w-[90%] sm:px-0 xl:max-w-6xl">
              <div className="flex items-center">
                <BackButton className="-ml-12 mr-2">
                  <ChevronLeftIcon className="size-5 shrink-0" />
                </BackButton>
                <h1 className="text-balance text-3xl font-semibold">
                  Confirm and pay
                </h1>
              </div>
              <div className="py-12">
                <div className="grid grid-cols-[minmax(400px,560px)_minmax(285px,465px)] items-start justify-between gap-x-14">
                  <div>
                    <BookDetails
                      checkinDate={checkinDate}
                      checkoutDate={checkoutDate}
                      checkinTime={checkinTime}
                      checkoutTime={checkoutTime}
                    />
                    <Separator className="my-7" />

                    {!rentalAvailable && (
                      <>
                        <div className="rounded-lg border border-red-500/50 bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/20 dark:text-red-300">
                          <p className="font-medium">Not available</p>
                          <p className="mt-1">
                            This car is not available for the selected dates.
                            Please go back and choose different dates.
                          </p>
                        </div>
                        <Separator className="my-7" />
                      </>
                    )}

                    {rentalAvailable && (
                      <>
                        <AuthSection
                          isLoggedIn={isLoggedIn}
                          customerName={customer?.first_name ? `${customer.first_name} ${customer.last_name ?? ""}`.trim() : null}
                          customerEmail={customer?.email}
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
                            customerName={
                              customer?.first_name
                                ? `${customer.first_name} ${customer.last_name ?? ""}`.trim()
                                : null
                            }
                            deposit={depositAmount}
                            currency={currency}
                          />
                        ) : (
                          <p className="text-sm text-neutral-500">
                            This car cannot be reserved online (mock data).
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <aside className="sticky top-[var(--site-header-height)] rounded-xl border dark:border-neutral-800">
                    <div className="p-6">
                      <CarDetails
                        car={car}
                        checkinDate={checkinDate}
                        checkoutDate={checkoutDate}
                        checkinTime={checkinTime}
                        checkoutTime={checkoutTime}
                      />
                      <Separator className="my-7" />
                      <div className="hidden md:block">
                        <PriceDetails
                          days={days}
                          currency={currency}
                          subtotal={subtotal}
                          taxes={taxes}
                          deposit={depositAmount}
                        />
                      </div>
                      {rentalAvailable && (
                        <div className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/20 dark:text-green-400">
                          Available for your dates
                        </div>
                      )}
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </GuestProvider>
  )
}
