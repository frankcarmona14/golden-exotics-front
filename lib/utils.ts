import { ReadonlyURLSearchParams } from "next/navigation"
import clsx, { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
