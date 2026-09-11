import { LoadingDots } from "@/components/loading-dots"

export default function LoadingReservationPage() {
  return (
    <div className="flex h-dvh w-dvw flex-col items-center justify-center bg-white dark:bg-neutral-950">
      <LoadingDots variant="yellow" />
    </div>
  )
}
