import { formatDateRangeForDisplay } from "@/lib/dates"
import type { DeliveryAddress } from "@/lib/types/rental"

export function BookDetails({
  checkinDate,
  checkoutDate,
  checkinTime,
  checkoutTime,
  delivery = null,
  feePending = false,
}: {
  checkinDate: Date
  checkoutDate: Date
  checkinTime?: string
  checkoutTime?: string
  /**
   * Adónde se entrega el coche, o `null` si se recoge en la oficina.
   * Sin dirección, la descripción basta (P1-11).
   */
  delivery?: {
    address: DeliveryAddress | null
    description: string | null
  } | null
  /** El coste no va en esta reserva: se añade después. */
  feePending?: boolean
}) {
  if (!checkinDate || !checkoutDate) {
    throw new Error("Both check-in and check-out dates must be provided.")
  }

  const showTime = checkinTime != null && checkoutTime != null

  return (
    <>
      <h2 className="text-heading-sm">Your trip</h2>
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
            <strong>{delivery ? "Delivery to" : "Pickup"}</strong>
          </h3>
          {delivery ? (
            <>
              {delivery.address ? (
                <p>
                  {[delivery.address.address_1, delivery.address.address_2]
                    .filter(Boolean)
                    .join(", ")}
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {" "}
                    · {delivery.address.city} {delivery.address.postal_code}
                  </span>
                </p>
              ) : (
                <p>{delivery.description}</p>
              )}
              {delivery.address && delivery.description && (
                <p className="text-neutral-600 dark:text-neutral-400">
                  {delivery.description}
                </p>
              )}
              {feePending && (
                <p className="text-body-sm text-neutral-500 dark:text-neutral-400">
                  Delivery fee to be confirmed
                </p>
              )}
            </>
          ) : (
            <p>At our location</p>
          )}
        </div>
      </div>
    </>
  )
}
