import { cn } from "@/lib/utils"

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  awaiting_documents: {
    label: "Awaiting documents",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  },
  documents_in_review: {
    label: "Documents in review",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
  },
  approved: {
    label: "Confirmed",
    className:
      "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  },
  change_requested: {
    label: "Change requested",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  },
  handed_off: {
    label: "On trip",
    className:
      "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300",
  },
  returned: {
    label: "Completed",
    className:
      "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300",
  },
}

export function ReservationStatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const config = STATUS_MAP[status] ?? {
    label: status.replace(/_/g, " "),
    className:
      "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
