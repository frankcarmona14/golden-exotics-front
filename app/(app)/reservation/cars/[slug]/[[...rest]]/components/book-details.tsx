import { formatDateRangeForDisplay } from "@/lib/dates"

export function BookDetails({
  checkinDate,
  checkoutDate,
  checkinTime,
  checkoutTime,
}: {
  checkinDate: Date
  checkoutDate: Date
  checkinTime?: string
  checkoutTime?: string
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
      </div>
    </>
  )
}
