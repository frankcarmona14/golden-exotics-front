import { format, subDays } from "date-fns"

interface CancellationPolicyProps {
  checkinDate?: string
}

export function CancellationPolicy({ checkinDate }: CancellationPolicyProps) {
  const deadlineStr = checkinDate
    ? format(subDays(new Date(checkinDate), 2), "MMM d, yyyy")
    : null

  return (
    <>
      <h2 className="text-heading-sm">Cancellation policy</h2>
      <div className="pt-5">
        <p className="text-balance text-body text-neutral-700 dark:text-neutral-300">
          {deadlineStr ? (
            <>
              <strong>Free cancellation before {deadlineStr}</strong>. After that,
              the reservation is non-refundable.
            </>
          ) : (
            <>
              <strong>Free cancellation</strong> up to 48 hours before your rental
              start date. After that, the reservation is non-refundable.
            </>
          )}
        </p>
      </div>
    </>
  )
}
