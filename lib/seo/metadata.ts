import type { Metadata } from "next"

import { siteConfig } from "@/config/site"
import type { SelectCar } from "@/lib/schema-types"
import { formatAmountForDisplay } from "@/lib/utils"

import { toAbsoluteImageUrl } from "./urls"

/** Imagen OG por defecto: la que Next sirve desde app/opengraph-image.png. */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image.png",
  alt: `${siteConfig.name} — exotic and luxury car rental in Miami`,
}

interface PageMetadataInput {
  title: string
  description: string
  /** Ruta canónica relativa al dominio, p. ej. "/cars". */
  path: string
  images?: { url: string; alt?: string; width?: number; height?: number }[]
  /** El título ya incluye la marca: no aplicar la plantilla "%s - Marca". */
  absoluteTitle?: boolean
}

/**
 * Metadata completa de una página indexable. Next sustituye openGraph y
 * twitter enteros (no los fusiona con el layout raíz), así que una página que
 * solo definiera el título perdería siteName, locale e imagen al compartirse;
 * por eso se construyen siempre completos desde aquí.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  images,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const ogImages = images && images.length > 0 ? images : [DEFAULT_OG_IMAGE]
  const fullTitle = absoluteTitle ? title : `${title} - ${siteConfig.name}`

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: siteConfig.name,
      url: path,
      title: fullTitle,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImages.map((image) => image.url),
    },
  }
}

/**
 * Flujos privados (reserva, pago, cuenta, auth, documentos): no aportan nada
 * en buscadores y algunos llevan IDs o tokens en la URL. robots.txt evita que
 * se rastreen; el noindex es la segunda capa para los crawlers que no respetan
 * robots.txt y para el día en que se quite algún Disallow.
 */
export const NOINDEX_METADATA: Metadata = {
  robots: { index: false, follow: false },
}

/** Recorta en un límite de palabra: Google corta las descripciones hacia ~155. */
export function truncateForMeta(text: string, maxLength = 155): string {
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= maxLength) return clean
  const cut = clean.slice(0, maxLength - 1)
  const lastSpace = cut.lastIndexOf(" ")
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:]$/, "")}…`
}

/** Precio diario listo para mostrar, o null si el coche no tiene precio. */
export function formatDailyPrice(
  car: Pick<SelectCar, "pricePerDay" | "currency">
) {
  const amount = Number(car.pricePerDay)
  if (!Number.isFinite(amount) || amount <= 0) return null
  return formatAmountForDisplay(amount, car.currency.toUpperCase())
}

/**
 * Metadata de la ficha de un coche. El título lleva modelo, ciudad y precio
 * porque son justo lo que se busca ("rent lamborghini urus miami") y lo que
 * hace clicar en el resultado; la descripción del producto completa el resto.
 */
export function buildCarMetadata(car: SelectCar): Metadata {
  const price = formatDailyPrice(car)
  const title = price
    ? `Rent ${car.name} in Miami from ${price}/day`
    : `Rent ${car.name} in Miami`

  const intro = price
    ? `Rent the ${car.name} in Miami from ${price} per day.`
    : `Rent the ${car.name} in Miami.`
  const description = truncateForMeta(
    car.description ? `${intro} ${car.description}` : intro
  )

  const imageSources =
    car.images.length > 0 ? car.images : [car.imageUrl].filter(Boolean)
  const mainImage = toAbsoluteImageUrl(imageSources[0])

  return buildPageMetadata({
    title,
    description,
    path: `/cars/${car.slug}`,
    images: mainImage
      ? [{ url: mainImage, alt: `${car.name} for rent in Miami` }]
      : undefined,
  })
}
