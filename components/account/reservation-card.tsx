import Link from "next/link"

import type { Reservation } from "@/lib/medusa/reservations"
import { cn, formatAmountForDisplay } from "@/lib/utils"
import { formatDateRangeForDisplay } from "@/lib/dates"

import { ReservationStatusBadge } from "./reservation-status-badge"

function CarGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M3.05 5.2A2 2 0 0 1 4.92 4h6.16a2 2 0 0 1 1.87 1.2l1.2 2.78c.55.2.95.73.95 1.36v2.41c0 .47-.38.85-.85.85h-.4a1.25 1.25 0 0 1-2.5 0H4.65a1.25 1.25 0 0 1-2.5 0h-.4A.85.85 0 0 1 .9 11.75V9.34c0-.63.4-1.16.95-1.36l1.2-2.78ZM4.92 5.5a.5.5 0 0 0-.46.3l-.9 2.07h8.88l-.9-2.07a.5.5 0 0 0-.46-.3H4.92Z" />
    </svg>
  )
}

function formatDates(start: string | null, end: string | null): string | null {
  if (!start || !end) return null
  try {
    return formatDateRangeForDisplay(start, end)
  } catch {
    return null
  }
}

export function ReservationCard({
  reservation,
  className,
}: {
  reservation: Reservation
  className?: string
}) {
  const {
    orderId,
    displayId,
    total,
    currency,
    carName,
    variantTitle,
    thumbnail,
    startDate,
    endDate,
    days,
    status,
  } = reservation

  const dates = formatDates(startDate, endDate)
  const needsDocuments = status === "awaiting_documents"

  return (
    <div
      className={cn(
        "group rounded-card border border-neutral-200 bg-white p-4 transition-[box-shadow,border-color] duration-200 ease-out hover:border-neutral-300 hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700 sm:p-5",
        className
      )}
    >
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="relative aspect-square size-20 shrink-0 overflow-hidden rounded-card bg-neutral-100 dark:bg-neutral-800 sm:size-24">
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt={carName}
              className="size-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-neutral-300 dark:text-neutral-600">
              <CarGlyph className="size-8" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-body font-semibold leading-tight tracking-tight">
                {carName}
              </h3>
              {variantTitle && variantTitle !== carName && (
                <p className="truncate text-body-sm text-neutral-500 dark:text-neutral-400">
                  {variantTitle}
                </p>
              )}
            </div>
            <ReservationStatusBadge status={status} className="shrink-0" />
          </div>

          <div className="mt-2 space-y-0.5 text-body-sm text-neutral-600 dark:text-neutral-400">
            {dates && (
              <p className="tabular-nums">
                {dates}
                {days != null && (
                  <span className="text-neutral-400 dark:text-neutral-500">
                    {" "}
                    · {days} {days === 1 ? "day" : "days"}
                  </span>
                )}
              </p>
            )}
            <p className="tabular-nums">
              {displayId != null && (
                <span className="text-neutral-400 dark:text-neutral-500">
                  #{displayId}
                </span>
              )}
              {total != null && currency && (
                <>
                  {displayId != null && " · "}
                  <span className="font-medium text-neutral-700 dark:text-neutral-200">
                    {formatAmountForDisplay(total, currency)}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-neutral-100 pt-3 text-body-sm font-medium dark:border-neutral-800">
        <Link
          href={`/account/reservations/${orderId}`}
          className="text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
        >
          View details
        </Link>
        <Link
          href="/account/documents"
          className={cn(
            "underline-offset-4 hover:underline",
            needsDocuments
              ? "text-amber-600 dark:text-amber-400"
              : "text-neutral-500 dark:text-neutral-400"
          )}
        >
          {needsDocuments ? "Upload documents →" : "My documents"}
        </Link>
      </div>
    </div>
  )
}
