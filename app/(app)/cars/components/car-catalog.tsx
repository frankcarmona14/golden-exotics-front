import { getCars } from "@/db/queries/car-repository"
import { getRentalAvailability } from "@/lib/medusa/rental"

import { SearchParams } from "@/lib/types"
import { slugify } from "@/lib/utils"

import { CarCard } from "./car-card"
import { CatalogSort } from "./catalog-sort"

interface CarCatalogProps {
  searchParams: {
    [SearchParams.MIN_PRICE]?: string
    [SearchParams.MAX_PRICE]?: string
    [SearchParams.BODY_STYLE]?: string[]
    [SearchParams.POWERTRAIN]?: string
    [SearchParams.TRANSMISSION]?: string[]
    [SearchParams.MIN_SEATS]?: string
    [SearchParams.CHECKIN]?: string
    [SearchParams.CHECKOUT]?: string
    [SearchParams.CHECKIN_TIME]?: string
    [SearchParams.CHECKOUT_TIME]?: string
    [SearchParams.SORT]?: string
  }
}

export default async function CarCatalog({ searchParams }: CarCatalogProps) {
  const cars = await getCars()

  const {
    [SearchParams.MIN_PRICE]: minPrice,
    [SearchParams.MAX_PRICE]: maxPrice,
    [SearchParams.BODY_STYLE]: bodyStyles,
    [SearchParams.POWERTRAIN]: powertrain,
    [SearchParams.TRANSMISSION]: transmissions,
    [SearchParams.MIN_SEATS]: minSeats,
    [SearchParams.CHECKIN]: checkin,
    [SearchParams.CHECKOUT]: checkout,
    [SearchParams.CHECKIN_TIME]: checkinTime,
    [SearchParams.CHECKOUT_TIME]: checkoutTime,
    [SearchParams.SORT]: sort,
  } = searchParams

  const filteredCars = cars.filter((car) => {
    return (
      (!minPrice || Number(car.pricePerDay) >= Number(minPrice)) &&
      (!maxPrice || Number(car.pricePerDay) <= Number(maxPrice)) &&
      (!bodyStyles || bodyStyles.includes(slugify(car.bodyStyle))) &&
      (!powertrain || powertrain === car.powertrain) &&
      (!transmissions || transmissions.includes(slugify(car.transmission))) &&
      (!minSeats || car.seats >= Number(minSeats))
    )
  })

  // When the user has picked a date range, drop cars that are affirmatively
  // unavailable for it. Availability is checked per car against Medusa; cars
  // without Medusa ids (mock data) can't be checked and are kept as-is. We
  // fail open when the check itself fails (network error, or the product
  // isn't configured as rentable) so a backend config issue never silently
  // hides inventory — only a genuine date conflict removes a car.
  const hasDateRange = Boolean(checkin && checkout)
  let availableCars = filteredCars
  if (hasDateRange) {
    const checks = await Promise.all(
      filteredCars.map(async (car) => {
        if (!car.medusaProductId || !car.medusaVariantId) return true
        const result = await getRentalAvailability({
          productId: car.medusaProductId,
          variantId: car.medusaVariantId,
          startDate: checkin as string,
          endDate: checkout as string,
          startTime: checkinTime || "10:00",
          endTime: checkoutTime || "10:00",
          currencyCode: car.currency,
        })
        if (result.checkFailed) return true
        return result.available !== false
      })
    )
    availableCars = filteredCars.filter((_, i) => checks[i])
  }

  const sortedCars = [...availableCars].sort((a, b) => {
    if (sort === "price-asc") return Number(a.pricePerDay) - Number(b.pricePerDay)
    if (sort === "price-desc") return Number(b.pricePerDay) - Number(a.pricePerDay)
    if (sort === "name") return a.name.localeCompare(b.name)
    return 0
  })

  if (!sortedCars.length)
    return (
      <div className="col-span-full text-balance">
        <h1 className="text-xl font-semibold">No exact matches</h1>
        <p className="mt-3 text-muted-foreground">
          {hasDateRange
            ? "No cars are available for the selected dates. Try different dates or adjust your filters."
            : "Try changing or removing some of your filters."}
        </p>
      </div>
    )

  const countLabel =
    sortedCars.length === 1 ? "1 car" : `${sortedCars.length} cars`

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Available cars
          </h1>
          <p className="mt-1 text-[14px] text-muted-foreground">{countLabel}</p>
        </div>
        <CatalogSort />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {sortedCars.map((car, index) => (
          <CarCard key={car.id} car={car} priority={index < 2} />
        ))}
      </div>
    </>
  )
}
