import { formatDateRangeForDisplay } from "@/lib/dates"
import type { DeliveryAddress } from "@/lib/types/rental"

export function BookDetails({
  checkinDate,
  checkoutDate,
  checkinTime,
  checkoutTime,
  deliveryAddress,
}: {
  checkinDate: Date
  checkoutDate: Date
  checkinTime?: string
  checkoutTime?: string
  /** Adónde se entrega el coche, o `null` si se recoge en la oficina (P0-3). */
  deliveryAddress?: DeliveryAddress | null
}) {
  if (!checkinDate || !checkoutDate) {
    throw new Error("Both check-in and check-out dates must be provided.")
  }

  const showTime = checkinTime != null && checkoutTime != null

  return (
    <>
      <h2 className="text-[22px] font-semibold">Your trip</h2>
      <div className="pt-5">
        <div className="space-y-1">
          <h3 className="text-base">
            <strong>{showTime ? "Dates & time" : "Dates"}</strong>
          </h3>
          <p>
            {formatDateRangeForDisplay(
              checkinDate.toISOString(),
              checkoutDate.toISOString()
            )}
            {showTime && (
              <span className="text-neutral-600 dark:text-neutral-400">
                {" "}
                · {checkinTime} – {checkoutTime}
              </span>
            )}
          </p>
        </div>
        <div className="mt-5 space-y-1">
          <h3 className="text-base">
            <strong>{deliveryAddress ? "Delivery to" : "Pickup"}</strong>
          </h3>
          {deliveryAddress ? (
            <p>
              {[deliveryAddress.address_1, deliveryAddress.address_2]
                .filter(Boolean)
                .join(", ")}
              <span className="text-neutral-600 dark:text-neutral-400">
                {" "}
                · {deliveryAddress.city} {deliveryAddress.postal_code}
              </span>
            </p>
          ) : (
            <p>At our location</p>
          )}
        </div>
      </div>
    </>
  )
}
