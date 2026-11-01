import type { SelectCar } from "@/lib/schema-types"
import { SearchParams } from "@/lib/types"

import { findAvailableCars, toURLSearchParams } from "../lib/find-cars"
import { CarCard } from "./car-card"

interface CarCatalogProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function CarCatalog({ searchParams }: CarCatalogProps) {
  const params = toURLSearchParams(searchParams)
  const { cars, trips, hasDateRange } = await findAvailableCars(params)
  const sort = params.get(SearchParams.SORT)

  const sortedCars = [...cars].sort((a, b) => {
    if (sort === "price-asc") return Number(a.pricePerDay) - Number(b.pricePerDay)
    if (sort === "price-desc") return Number(b.pricePerDay) - Number(a.pricePerDay)
    if (sort === "name") return a.name.localeCompare(b.name)
    return Number(isTopPick(b)) - Number(isTopPick(a))
  })

  if (!sortedCars.length)
    return (
      <div className="col-span-full text-balance">
        <h1 className="text-heading-sm">No exact matches</h1>
        <p className="mt-3 text-body text-muted-foreground">
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
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-heading-sm sm:text-heading">Available cars</h1>
        {/* Los filtros se aplican al momento: esto le dice al lector de
            pantalla qué ha cambiado sin que tenga que buscarlo. */}
        <p aria-live="polite" className="text-body-sm text-muted-foreground">
          {countLabel}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {sortedCars.map((car, index) => (
          <CarCard
            key={car.id}
            car={car}
            priority={index < 3}
            trip={trips.get(car.id)}
            topPick={isTopPick(car)}
          />
        ))}
      </div>
    </>
  )
}

/** `metadata.topPick` del producto en Medusa. Desde el admin llega como texto. */
function isTopPick(car: SelectCar): boolean {
  const flag = car.metadata?.topPick
  return flag === true || flag === "true"
}
