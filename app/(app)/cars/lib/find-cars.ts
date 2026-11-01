import "server-only"

import { getCars } from "@/db/queries/car-repository"
import { getLocations } from "@/db/queries/location-repository"
import { getRentalAvailability } from "@/lib/medusa/rental"

import { PICKUP_LOCATION, type SelectCar } from "@/lib/schema-types"
import { SearchParams } from "@/lib/types"
import { fromDateParam, slugify, toDateParam } from "@/lib/utils"

export type Trip = { total: number; days: number }

export interface AvailableCars {
  cars: SelectCar[]
  /** Total de las fechas buscadas, tal y como lo calcula el motor (impuestos y entrega incluidos). */
  trips: Map<SelectCar["id"], Trip>
  hasDateRange: boolean
}

/** Los coches que cumplen los filtros y, con fechas, están libres en ellas. Sin ordenar. */
export async function findAvailableCars(
  params: URLSearchParams
): Promise<AvailableCars> {
  const cars = await getCars()

  const location = params.get(SearchParams.LOCATION)
  const minPrice = params.get(SearchParams.MIN_PRICE)
  const maxPrice = params.get(SearchParams.MAX_PRICE)
  const bodyStyles = params.getAll(SearchParams.BODY_STYLE)
  const powertrain = params.get(SearchParams.POWERTRAIN)
  const transmissions = params.getAll(SearchParams.TRANSMISSION)
  const minSeats = params.get(SearchParams.MIN_SEATS)

  // Con una zona de entrega elegida, solo los coches que se entregan ahí. La
  // oficina no filtra: todos los coches salen de ella. Una zona que ya no existe
  // (enlace viejo) tampoco filtra, en vez de dejar el catálogo vacío.
  const deliveryZone =
    location && location !== PICKUP_LOCATION
      ? (await getLocations()).find((loc) => loc.value === location)
      : undefined
  const deliveredProductIds = deliveryZone?.productIds ?? null

  const filteredCars = cars.filter((car) => {
    return (
      (!deliveredProductIds ||
        (!!car.medusaProductId &&
          deliveredProductIds.includes(car.medusaProductId))) &&
      (!minPrice || Number(car.pricePerDay) >= Number(minPrice)) &&
      (!maxPrice || Number(car.pricePerDay) <= Number(maxPrice)) &&
      (!bodyStyles.length || bodyStyles.includes(slugify(car.bodyStyle))) &&
      (!powertrain || powertrain === car.powertrain) &&
      (!transmissions.length ||
        transmissions.includes(slugify(car.transmission))) &&
      (!minSeats || car.seats >= Number(minSeats))
    )
  })

  // When the user has picked a date range, drop cars that are affirmatively
  // unavailable for it. Availability is checked per car against Medusa; cars
  // without Medusa ids (mock data) can't be checked and are kept as-is. We
  // fail open when the check itself fails (network error, or the product
  // isn't configured as rentable) so a backend config issue never silently
  // hides inventory — only a genuine date conflict removes a car.
  // Siempre `yyyy-MM-dd`: con un timestamp ISO (enlaces viejos del buscador)
  // el backend falla y, como se falla en abierto, el coche salía disponible.
  const startDate = fromDateParam(params.get(SearchParams.CHECKIN))
  const endDate = fromDateParam(params.get(SearchParams.CHECKOUT))
  const hasDateRange = Boolean(startDate && endDate)
  const trips = new Map<SelectCar["id"], Trip>()
  if (!hasDateRange) return { cars: filteredCars, trips, hasDateRange }

  const checks = await Promise.all(
    filteredCars.map(async (car) => {
      if (!car.medusaProductId || !car.medusaVariantId) return true
      const result = await getRentalAvailability({
        productId: car.medusaProductId,
        variantId: car.medusaVariantId,
        startDate: toDateParam(startDate!),
        endDate: toDateParam(endDate!),
        startTime: params.get(SearchParams.CHECKIN_TIME) || "10:00",
        endTime: params.get(SearchParams.CHECKOUT_TIME) || "10:00",
        currencyCode: car.currency,
        deliveryZone: deliveryZone ? location : null,
      })
      if (result.checkFailed) return true
      if (result.price && result.breakdown) {
        trips.set(car.id, {
          total: result.price.amount,
          days: result.breakdown.rental_days,
        })
      }
      return result.available !== false
    })
  )

  return {
    cars: filteredCars.filter((_, i) => checks[i]),
    trips,
    hasDateRange,
  }
}

/** Los `searchParams` de una página, como `URLSearchParams`. */
export function toURLSearchParams(record: {
  [key: string]: string | string[] | undefined
}): URLSearchParams {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(record)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== undefined) params.append(key, item)
    }
  }
  return params
}
