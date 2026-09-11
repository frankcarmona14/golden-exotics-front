import { LoadingDots } from "@/components/loading-dots"

export function MapSkeleton() {
  return (
    <div className="flex h-[calc(100dvh-var(--site-header-height)-var(--cars-toolbar-h))] items-center justify-center bg-[#ddd]">
      <LoadingDots />
    </div>
  )
}
