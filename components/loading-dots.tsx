type LoadingDotsVariant = "default" | "button" | "yellow"

export function LoadingDots({
  variant = "default",
}: {
  /** default: page background. button: reserve button (light → light dots, dark → black). yellow: loading screen. */
  variant?: LoadingDotsVariant
}) {
  const dotClass =
    variant === "button"
      ? "bg-neutral-200 dark:bg-neutral-950"
      : variant === "yellow"
        ? "bg-amber-400"
        : "bg-neutral-800 dark:bg-neutral-200"
  return (
    <div className="flex gap-x-2">
      <div className={`size-2 animate-dot-pulse rounded-full ${dotClass}`} />
      <div
        className={`size-2 animate-dot-pulse rounded-full [animation-delay:0.15s] ${dotClass}`}
      />
      <div
        className={`size-2 animate-dot-pulse rounded-full [animation-delay:0.3s] ${dotClass}`}
      />
    </div>
  )
}
