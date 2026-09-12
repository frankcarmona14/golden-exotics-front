"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { SelectCar } from "@/lib/schema-types"

import { SearchParams } from "@/lib/types"
import { cn, constructUrlWithParams, formatAmountForDisplay } from "@/lib/utils"
import CldImage from "@/components/cld-image"
import { FilledStarIcon } from "@/components/icons/filled-star"

interface CarCardProps {
  car: SelectCar
  priority?: boolean
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        d="M13.78 4.22a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l2.47 2.47 5.97-5.97a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function CarCard({ car, priority = false }: CarCardProps) {
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

  const isRentable = car.rentalConfiguration?.status === "active"
  const hasRating = Number(car.rating) > 0

  const specs = [car.bodyStyle, car.transmission, `${car.seats} seats`, car.powertrain]

  return (
    <Link href={href} className="group block outline-none">
      <article className="relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 transition-[border-color,transform] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-neutral-300 group-focus-visible:ring-2 group-focus-visible:ring-ring dark:group-hover:border-neutral-700 dark:group-hover:shadow-[0_16px_40px_-18px_rgba(0,0,0,0.5)] sm:gap-5 sm:p-5">
        {/* Image */}
        <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-40">
          <CldImage
            src={car.imageUrl}
            alt={car.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-hover:will-change-transform"
            sizes="(max-width: 640px) 128px, 160px"
            priority={priority}
          />
          {isRentable && (
            <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground shadow-sm">
              Available
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate text-base font-semibold leading-tight tracking-tight sm:text-[17px]">
              {car.name}
            </h3>
            {hasRating && (
              <div className="flex shrink-0 items-center gap-1 text-[13px] tabular-nums">
                <FilledStarIcon className="size-3.5 shrink-0 text-accent" />
                <span className="font-semibold">{car.rating}</span>
                {Number(car.reviewCount) > 0 && (
                  <span className="text-neutral-400 dark:text-neutral-500">
                    ({car.reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>

          <p className="mt-1 text-[13px] capitalize text-muted-foreground sm:text-sm">
            {specs.join(" · ")}
          </p>

          {car.unlimitedMileage && (
            <p className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-neutral-600 dark:text-neutral-300">
              <CheckIcon className="size-3.5 shrink-0 text-green-600 dark:text-green-500" />
              Unlimited mileage
            </p>
          )}

          {/* Footer: price + CTA */}
          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[21px] font-bold tabular-nums leading-none tracking-tight sm:text-[24px]">
                {formatAmountForDisplay(Number(car.pricePerDay), car.currency)}
              </span>
              <span className="text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
                /day
              </span>
            </div>

            <span
              className={cn(
                "hidden items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 py-1.5 text-[12px] font-semibold transition-colors duration-150 ease-out group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground dark:border-neutral-700 sm:inline-flex"
              )}
            >
              View details
              <ArrowIcon className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
