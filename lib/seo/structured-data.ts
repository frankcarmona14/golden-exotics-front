import { siteConfig } from "@/config/site"
import type { SelectCar } from "@/lib/schema-types"

import { absoluteUrl, toAbsoluteImageUrl } from "./urls"

/**
 * Builders de JSON-LD (schema.org). Son funciones puras que reciben todo lo
 * que necesitan para poder probarse sin Next ni Medusa; el componente
 * <JsonLd> solo las serializa.
 */

type JsonLd = Record<string, unknown>

/** Ciudad donde se entregan los coches; la oferta se limita a ella. */
const SERVICE_AREA = {
  "@type": "City",
  name: "Miami",
  containedInPlace: { "@type": "State", name: "Florida" },
}

/**
 * Marcas que pueden aparecer en la flota. Medusa no guarda marca ni modelo por
 * separado, solo el título ("Lamborghini Urus"), así que se deducen de ahí.
 * Ordenadas de más larga a más corta para que "Land Rover" gane a "Rover".
 */
const KNOWN_MAKES = [
  "Mercedes-Benz",
  "Mercedes-AMG",
  "Rolls-Royce",
  "Aston Martin",
  "Alfa Romeo",
  "Land Rover",
  "Range Rover",
  "Lamborghini",
  "McLaren",
  "Maserati",
  "Cadillac",
  "Chevrolet",
  "Ferrari",
  "Bentley",
  "Porsche",
  "Bugatti",
  "Lincoln",
  "Genesis",
  "Jaguar",
  "Mercedes",
  "Hummer",
  "Lexus",
  "Tesla",
  "Rivian",
  "Lotus",
  "Dodge",
  "Audi",
  "Jeep",
  "Ford",
  "GMC",
  "BMW",
].sort((a, b) => b.length - a.length)

/** Marca y modelo a partir del título del producto, si la marca es conocida. */
export function parseMakeAndModel(name: string): {
  make?: string
  model?: string
} {
  const title = name.trim()
  const lower = title.toLowerCase()
  const make = KNOWN_MAKES.find(
    (m) => lower === m.toLowerCase() || lower.startsWith(`${m.toLowerCase()} `)
  )
  if (!make) return {}
  const model = title.slice(make.length).trim()
  return { make, model: model || undefined }
}

/**
 * Google lee los datos estructurados como JSON dentro de un <script>; un "</"
 * en la descripción de un coche cerraría la etiqueta antes de tiempo.
 */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
}

interface CarProductOptions {
  baseUrl?: string
  cloudinaryCloudName?: string
  sellerName?: string
}

/**
 * Ficha de coche como Product + Car. Google no tiene un resultado enriquecido
 * específico para alquiler (el de "vehicle listing" es solo para venta), así
 * que el que aplica es el de Product (fragmentos de producto), que exige una
 * Offer con precio. El tipo Car añade asientos, cambio y combustible para
 * otros consumidores del schema sin romper la validación de Product.
 *
 * El precio es por día: se expresa con UnitPriceSpecification (unitCode DAY)
 * y businessFunction LeaseOut, que es como schema.org distingue alquilar de
 * vender.
 *
 * No se incluye AggregateRating: rating/reviewCount vienen de metadata que se
 * escribe a mano en el admin, no de reseñas reales, y Google penaliza las
 * valoraciones que no salen de opiniones verificables de clientes.
 */
export function buildCarProductJsonLd(
  car: SelectCar,
  options: CarProductOptions = {}
): JsonLd {
  const baseUrl = options.baseUrl ?? siteConfig.url
  const url = absoluteUrl(`/cars/${car.slug}`, baseUrl)
  const { make, model } = parseMakeAndModel(car.name)

  const imageSources =
    car.images.length > 0 ? car.images : [car.imageUrl].filter(Boolean)
  const images = imageSources
    .map((src) =>
      toAbsoluteImageUrl(src, {
        baseUrl,
        cloudinaryCloudName: options.cloudinaryCloudName,
      })
    )
    .filter((src): src is string => Boolean(src))

  const product: JsonLd = {
    "@context": "https://schema.org",
    "@type": ["Product", "Car"],
    "@id": `${url}#product`,
    name: car.name,
    url,
    sku: car.slug,
    ...(car.description && { description: car.description }),
    ...(images.length > 0 && { image: images }),
    ...(make && { brand: { "@type": "Brand", name: make } }),
    ...(model && { model }),
    ...(car.bodyStyle && { bodyType: car.bodyStyle }),
    ...(car.seats > 0 && { vehicleSeatingCapacity: car.seats }),
    ...(car.transmission && { vehicleTransmission: car.transmission }),
    ...(car.powertrain && { fuelType: car.powertrain }),
  }

  // Sin precio no hay Offer válida: mejor un Product sin oferta que una con
  // precio 0, que Google marcaría como error o mostraría como "gratis".
  const price = Number(car.pricePerDay)
  if (Number.isFinite(price) && price > 0) {
    const priceCurrency = (car.currency || "usd").toUpperCase()
    const amount = price.toFixed(2)
    product.offers = {
      "@type": "Offer",
      url,
      price: amount,
      priceCurrency,
      // Solo los coches con configuración de alquiler activa se pueden
      // reservar online; la disponibilidad por fechas se comprueba al reservar.
      availability:
        car.rentalConfiguration?.status === "active"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: amount,
        priceCurrency,
        unitCode: "DAY",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: 1,
          unitCode: "DAY",
        },
      },
      areaServed: SERVICE_AREA,
      seller: {
        "@type": "Organization",
        name: options.sellerName ?? siteConfig.name,
        url: baseUrl,
      },
    }
  }

  return product
}

/** BreadcrumbList a partir de migas con ruta relativa; Google pide URLs absolutas. */
function buildBreadcrumbJsonLd(
  crumbs: { name: string; path: string }[],
  baseUrl: string
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path, baseUrl),
    })),
  }
}

/** Home › Cars › <coche>. */
export function buildCarBreadcrumbJsonLd(
  car: Pick<SelectCar, "name" | "slug">,
  options: { baseUrl?: string } = {}
): JsonLd {
  return buildBreadcrumbJsonLd(
    [
      { name: "Home", path: "/" },
      { name: "Cars", path: "/cars" },
      { name: car.name, path: `/cars/${car.slug}` },
    ],
    options.baseUrl ?? siteConfig.url
  )
}

/** Home › Brands › <marca>. */
export function buildBrandBreadcrumbJsonLd(
  brand: { name: string; handle: string },
  options: { baseUrl?: string } = {}
): JsonLd {
  return buildBreadcrumbJsonLd(
    [
      { name: "Home", path: "/" },
      { name: "Brands", path: "/brands" },
      { name: brand.name, path: `/brands/${brand.handle}` },
    ],
    options.baseUrl ?? siteConfig.url
  )
}

interface OrganizationInput {
  name: string
  url: string
  /** Ruta o URL del logo; Google pide un raster cuadrado de 112px o más. */
  logo: string
  telephone?: string
  email?: string
  address?: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  sameAs?: string[]
}

/**
 * Organización de la home. Solo pasa a AutoRental (un LocalBusiness) cuando
 * hay dirección real: Google exige dirección para LocalBusiness y un negocio
 * local sin ella es peor que una Organization correcta. Teléfono y dirección
 * no se rellenan por defecto porque los del código son datos de la plantilla.
 */
export function buildOrganizationJsonLd(input: OrganizationInput): JsonLd {
  const url = input.url.replace(/\/+$/, "")
  const isLocalBusiness = Boolean(input.address)
  return {
    "@context": "https://schema.org",
    "@type": isLocalBusiness ? "AutoRental" : "Organization",
    "@id": `${url}/#organization`,
    name: input.name,
    url,
    logo: absoluteUrl(input.logo, url),
    ...(isLocalBusiness && { image: absoluteUrl(input.logo, url) }),
    ...(input.telephone && { telephone: input.telephone }),
    ...(input.email && { email: input.email }),
    ...(input.address && {
      address: { "@type": "PostalAddress", ...input.address },
    }),
    ...(isLocalBusiness && { areaServed: SERVICE_AREA }),
    ...(input.sameAs && input.sameAs.length > 0 && { sameAs: input.sameAs }),
  }
}
