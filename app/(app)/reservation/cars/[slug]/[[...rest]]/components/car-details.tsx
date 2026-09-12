import type { SelectCar } from "@/lib/schema-types"
import { formatTimeForDisplay } from "@/lib/utils"

import CldImage from "@/components/cld-image"
import { FilledStarIcon } from "@/components/icons/filled-star"

export function CarDetails({
  car,
  checkinDate,
  checkoutDate,
  checkinTime,
  checkoutTime,
}: {
  car: SelectCar
  checkinDate?: Date
  checkoutDate?: Date
  checkinTime?: string
  checkoutTime?: string
}) {
  const isRentable = car.rentalConfiguration?.status === "active"
  const showTime = checkinTime != null && checkoutTime != null

  return (
    <div className="grid grid-cols-1 gap-5 min-[360px]:flex">
      <div className="relative aspect-square w-[100px] shrink-0">
        <CldImage
          src={car.imageUrl}
          alt={car.name}
          className="rounded-xl object-cover"
          fill
          sizes="200px"
          priority
        />
      </div>
      <div className="flex flex-col gap-1 text-balance capitalize">
        <strong className="font-medium leading-5">{car.name}</strong>
        <span className="text-[14px] leading-5">{car.transmission}</span>
        <span className="text-[14px] leading-5">{car.powertrain}</span>
        {Number(car.rating) > 0 && (
          <div className="flex flex-row items-center gap-0.5 text-[15px] tabular-nums">
            <FilledStarIcon className="size-3 shrink-0" />
            <strong className="font-medium">{car.rating}</strong>
            {Number(car.reviewCount) > 0 && (
              <span className="text-[14px]">({car.reviewCount} reviews)</span>
            )}
          </div>
        )}
        {isRentable && checkinDate && checkoutDate && (
          <span className="mt-1 text-[13px] normal-case text-neutral-500 dark:text-neutral-400">
            Rental:{" "}
            {checkinDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {showTime && checkinTime ? ` ${formatTimeForDisplay(checkinTime)}` : ""}
            {" – "}
            {checkoutDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {showTime && checkoutTime
              ? ` ${formatTimeForDisplay(checkoutTime)}`
              : ""}
          </span>
        )}
      </div>
    </div>
  )
}
