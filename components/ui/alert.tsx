import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Tone-based alerts with first-class dark-mode pairings. Layout is flex
 * (icon | content) — drop an `<svg>` as the first child and it lines up
 * automatically with the title/description without absolute positioning.
 *
 * Tones include subtle tinted surfaces, a thin colored border, and a
 * matching foreground that meets WCAG 4.5:1 against both light and dark
 * surfaces.
 */
const alertVariants = cva(
  "relative flex w-full gap-3 rounded-xl border p-4 [&>svg]:mt-0.5 [&>svg]:size-5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 [&>svg]:text-neutral-700 dark:[&>svg]:text-neutral-300",
        info: "border-blue-200/80 bg-blue-50 text-blue-950 dark:border-blue-400/25 dark:bg-blue-500/[0.08] dark:text-blue-50 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-300",
        success:
          "border-emerald-200/80 bg-emerald-50 text-emerald-950 dark:border-emerald-400/25 dark:bg-emerald-500/[0.08] dark:text-emerald-50 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-300",
        warning:
          "border-amber-300/80 bg-amber-50 text-amber-950 dark:border-amber-400/30 dark:bg-amber-500/[0.08] dark:text-amber-50 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-300",
        destructive:
          "border-red-300/80 bg-red-50 text-red-950 dark:border-red-400/30 dark:bg-red-500/[0.08] dark:text-red-50 [&>svg]:text-red-600 dark:[&>svg]:text-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, children, ...props }, ref) => {
  // Auto-wrap non-svg children in a content column so the icon-then-text
  // layout always lines up without consumers having to add wrappers.
  const childArray = React.Children.toArray(children)
  const icon = childArray.find(
    (c) => React.isValidElement(c) && c.type === "svg",
  )
  const rest = childArray.filter((c) => c !== icon)

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon}
      <div className="min-w-0 flex-1 space-y-1">{rest}</div>
    </div>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "text-[15px] font-semibold leading-tight tracking-tight",
      className,
    )}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-[13.5px] leading-relaxed opacity-90 [&_p]:leading-relaxed",
      className,
    )}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
