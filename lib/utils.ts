import { ReadonlyURLSearchParams } from "next/navigation"
import clsx, { ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"
import { format, isValid, parseISO } from "date-fns"

/* tailwind-merge has to be told about the design-system tokens, because it
   decides which classes conflict by parsing the class name itself.
   Left unconfigured it reads `text-body` as a *colour* — "body" is not a size
   it recognises — and so drops any `text-*` colour merged alongside it. That
   is how `text-primary-foreground` silently disappeared from buttons. */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      // Covers rounded-*, including the directional rounded-l-pill variants.
      borderRadius: ["tight", "card", "pill"],
      // Covers every spacing-based utility at once: p-, m-, gap-, space-…
      spacing: ["section", "section-lg"],
    },
    classGroups: {
      "font-size": [
        {
          text: [
            "caption",
            "body-sm",
            "body",
            "subheading",
            "heading-sm",
            "heading",
            "heading-lg",
            "display",
            "display-xl",
          ],
        },
      ],
      shadow: [{ shadow: ["lift", "floating"] }],
      // Without this, `ease-smooth` and `ease-out` both survive a merge and
      // the winner comes down to CSS source order.
      ease: [{ ease: ["smooth"] }],
      "max-w": [{ "max-w": ["page"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const setCSSVariable = (name: string, value: string): void => {
  if (typeof window !== "undefined") {
    document.documentElement?.style.setProperty(name, value)
  }
}

export const slugify = (str: string): string =>
  str
    .trim() // Trim leading/trailing whitespace
    .toLowerCase()
    .replace(/[^a-z0-9\s-]+/g, "") // Remove non-alphanumeric characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single one

export const constructUrlWithParams = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
): string => {
  const queryString = params.toString()
  return queryString ? `${pathname}?${queryString}` : pathname
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export const convertImageUrlToDataUrl = async (
  imageUrl: string
): Promise<string | null> => {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.statusText}`)

    const arrayBuffer = await response.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const contentType =
      response.headers.get("content-type") ?? "application/octet-stream"

    return `data:${contentType};base64,${base64}`
  } catch (error) {
    console.error("Error converting image URL to data URL:", error)
    return null
  }
}

export const formatTimeForDisplay = (time: string): string => {
  const [hours = 0, minutes = 0] = time.split(":").map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export const formatAmountForDisplay = (
  amount: number,
  currency: string,
): string => {
  if (isNaN(amount)) return ""
  const hasCents = amount % 1 !== 0
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  })
  return numberFormat.format(amount)
}

/**
 * Fecha para `?checkin=` / `?checkout=`: el día de calendario, `yyyy-MM-dd`.
 *
 * Nunca `toISOString()`: pasa a UTC, y la medianoche de un día en Europa es el
 * día anterior en UTC. Además el backend no acepta ese formato, y el catálogo,
 * al fallar la comprobación, dejaba el coche como disponible.
 */
export function toDateParam(date: Date) {
  return format(date, "yyyy-MM-dd")
}

/**
 * Lee `?checkin=` / `?checkout=` como día local. `new Date("2026-10-13")` es
 * medianoche UTC, que en Miami ya es el día 12. Acepta también los enlaces
 * viejos con timestamp ISO.
 */
export function fromDateParam(value: string | null | undefined) {
  if (!value) return undefined
  const date = parseISO(value)
  return isValid(date) ? date : undefined
}
