"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { SelectCar } from "@/lib/schema-types"

import { SearchParams } from "@/lib/types"
import { constructUrlWithParams, formatAmountForDisplay } from "@/lib/utils"
import CldImage from "@/components/cld-image"
import { AutomaticGearboxIcon } from "@/components/icons/automatic-gearbox"
import { BatteryAutomotiveIcon } from "@/components/icons/battery-automotive"
import { CheckIcon } from "@/components/icons/check"
import { FilledStarIcon } from "@/components/icons/filled-star"
import { ManualGearboxIcon } from "@/components/icons/manual-gearbox"

interface CarCardProps {
  car: SelectCar
  priority?: boolean
  /** Lo que cuestan las fechas buscadas según el motor. Sin fechas, nada. */
  trip?: { total: number; days: number }
  topPick?: boolean
}

function SeatIcon(props: React.HTMLAttributes<SVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
      <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    </svg>
  )
}

function humanize(value: string): string {
  const text = value.replace(/-/g, " ")
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function CarCard({
  car,
  priority = false,
  trip,
  topPick = false,
}: CarCardProps) {
  const searchParams = useSearchParams()

  if (!car) return null

  const params = new URLSearchParams(searchParams.toString())
  const location = searchParams.get(SearchParams.LOCATION)
  const checkin = searchParams.get(SearchParams.CHECKIN)
  const checkout = searchParams.get(SearchParams.CHECKOUT)
  if (location) params.set(SearchParams.LOCATION, location)
  if (checkin) params.set(SearchParams.CHECKIN, checkin)
  if (checkout) params.set(SearchParams.CHECKOUT, checkout)
  const href = constructUrlWithParams(`/cars/${car.slug}`, params)

  const hasRating = Number(car.rating) > 0
  const isManual = car.transmission.toLowerCase() === "manual"
  const isElectrified = ["electric", "hybrid"].includes(
    car.powertrain.toLowerCase()
  )
  const GearboxIcon = isManual ? ManualGearboxIcon : AutomaticGearboxIcon

  return (
    <Link
      href={href}
      className="group block rounded-card outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <article>
        <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-muted">
          <CldImage
            src={car.imageUrl}
            alt={car.name}
            fill
            className="object-cover transition-transform duration-500 ease-smooth motion-safe:group-hover:scale-[1.03]"
            sizes="(max-width: 550px) 100vw, (max-width: 1128px) 50vw, 400px"
            priority={priority}
          />
          {topPick && (
            <span className="absolute left-3 top-3 rounded-pill bg-accent px-3 py-1.5 text-caption font-semibold text-accent-foreground shadow-[0_4px_12px_-2px_rgba(0,0,0,0.25)]">
              Top pick
            </span>
          )}
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-subheading font-semibold">
              {car.name}
            </h3>
            <ul className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-body-sm text-muted-foreground">
              {hasRating && (
                <li className="flex items-center gap-1 text-foreground">
                  <FilledStarIcon
                    aria-hidden
                    className="size-3.5 shrink-0 text-accent-text"
                  />
                  <span className="tabular-nums">{car.rating}</span>
                </li>
              )}
              <li className="flex items-center gap-1.5">
                <SeatIcon aria-hidden className="size-4 shrink-0" />
                <span className="tabular-nums">{car.seats}</span>
                <span className="sr-only">seats</span>
              </li>
              <li className="flex items-center gap-1.5">
                <GearboxIcon aria-hidden className="size-4 shrink-0" />
                {isManual ? "Manual" : "Automatic"}
              </li>
              {isElectrified && (
                <li className="flex items-center gap-1.5">
                  <BatteryAutomotiveIcon
                    aria-hidden
                    className="size-4 shrink-0"
                  />
                  {humanize(car.powertrain)}
                </li>
              )}
            </ul>
            {car.unlimitedMileage && (
              <p className="mt-1.5 flex items-center gap-1.5 text-body-sm text-muted-foreground">
                <CheckIcon
                  aria-hidden
                  className="size-4 shrink-0 text-green-600 dark:text-green-500"
                />
                Unlimited mileage
              </p>
            )}
          </div>

          <div className="shrink-0 text-right tabular-nums">
            <p className="font-display">
              <span className="text-subheading font-semibold">
                {formatAmountForDisplay(Number(car.pricePerDay), car.currency)}
              </span>
              <span className="ml-0.5 text-body-sm text-muted-foreground">
                /day
              </span>
            </p>
            {trip && (
              <p className="mt-2 text-body-sm text-muted-foreground">
                {formatAmountForDisplay(trip.total, car.currency)} for{" "}
                {trip.days} {trip.days === 1 ? "day" : "days"}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
