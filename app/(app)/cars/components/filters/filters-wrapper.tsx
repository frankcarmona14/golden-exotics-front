import { ReactNode } from "react"
import { getCars } from "@/db/queries/car-repository"

import { FiltersButton } from "./filters-button"
import { FiltersSidebar } from "./filters-sidebar"

interface FiltersProps {
  trigger?: ReactNode
  /** "modal" (default) renders the trigger + modal; "sidebar" renders an inline rail. */
  variant?: "modal" | "sidebar"
}

export default async function Filters({
  trigger,
  variant = "modal",
}: FiltersProps) {
  const cars = await getCars()

  const { MIN_PRICE, MAX_PRICE } = cars.reduce(
    (acc, car) => {
      acc.MIN_PRICE = Math.min(acc.MIN_PRICE, Number(car.pricePerDay))
      acc.MAX_PRICE = Math.max(acc.MAX_PRICE, Number(car.pricePerDay))
      return acc
    },
    { MIN_PRICE: Infinity, MAX_PRICE: -Infinity }
  )

  if (variant === "sidebar") {
    return (
      <FiltersSidebar
        initialMinPrice={Math.round(MIN_PRICE)}
        initialMaxPrice={Math.round(MAX_PRICE)}
      />
    )
  }

  return (
    <FiltersButton
      initialMinPrice={Math.round(MIN_PRICE)}
      initialMaxPrice={Math.round(MAX_PRICE)}
      trigger={trigger}
    />
  )
}
