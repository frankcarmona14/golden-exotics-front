import type { CSSProperties } from "react"

/**
 * Photo framing set in the admin ("Photo framing" on the product): the point
 * that must stay in frame and how far to zoom. Stored per photo URL in
 * `product.metadata.image_framing`; the original photo is never cropped.
 *
 * Mirror of `src/admin/lib/image-framing.ts` in the backend. Keep the maths in
 * `framingStyles` identical, or the admin preview stops matching the store.
 */
export type ImageFraming = { x: number; y: number; zoom: number }

const MIN_ZOOM = 1
const MAX_ZOOM = 2.5

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

/** `null` when there is nothing usable: the photo then renders centred. */
export function normalizeFraming(value: unknown): ImageFraming | null {
  if (!value || typeof value !== "object") return null
  const raw = value as Partial<Record<keyof ImageFraming, unknown>>
  const num = (v: unknown, fallback: number) =>
    typeof v === "number" && Number.isFinite(v) ? v : fallback

  return {
    x: clamp(num(raw.x, 50), 0, 100),
    y: clamp(num(raw.y, 50), 0, 100),
    zoom: clamp(num(raw.zoom, 1), MIN_ZOOM, MAX_ZOOM),
  }
}

/** The framing saved for one of the product's photos, if any. */
export function framingFor(
  metadata: Record<string, unknown> | null | undefined,
  url: string | null | undefined
): ImageFraming | null {
  if (!url) return null
  const map = metadata?.image_framing
  if (!map || typeof map !== "object" || Array.isArray(map)) return null
  return normalizeFraming((map as Record<string, unknown>)[url])
}

/**
 * The wrapper scales from the focal point and the photo is positioned on that
 * same point, so the point stays put while zooming.
 */
export function framingStyles(f: ImageFraming): {
  wrapper: CSSProperties
  image: CSSProperties
} {
  const origin = `${f.x}% ${f.y}%`
  return {
    wrapper: { transform: `scale(${f.zoom})`, transformOrigin: origin },
    image: { objectPosition: origin },
  }
}
