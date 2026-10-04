import type { RentalConfiguration } from "@/lib/types/rental"

/**
 * Tipos de dominio para Carhive.
 * Independientes de la capa de datos (antes en Drizzle; en el futuro desde Medusa).
 */

/**
 * Valor de `?location=` para recoger en la oficina. Cualquier otro valor es el
 * `code` de una zona de entrega.
 */
export const PICKUP_LOCATION = "pickup"

/** Una opción del campo *Pick-up / Drop-off* del buscador. */
export interface SearchLocation {
  /** Lo que viaja en `?location=`: `PICKUP_LOCATION` o el code de la zona. */
  value: string
  kind: "pickup" | "delivery"
  name: string
  /** Dirección de la oficina o descripción de la zona. */
  detail: string | null
  /** Coches que se entregan en la zona. `null` = todos (y siempre en la oficina). */
  productIds: string[] | null
}

export interface SelectCar {
  id: number
  slug: string
  name: string
  bodyStyle: string
  powertrain: string
  transmission: string
  seats: number
  description: string
  features: string[]
  rating: string
  reviewCount: string
  unlimitedMileage: boolean
  imageUrl: string
  images: string[]
  pricePerDay: string
  currency: string
  priceId: string | null
  /** ID original del producto en Medusa (ej. "prod_01J..."). Undefined para mock data. */
  medusaProductId?: string
  /** ID original del variant en Medusa (ej. "variant_01J..."). Undefined para mock data. */
  medusaVariantId?: string
  status: string | null
  metadata: Record<string, unknown> | null
  rentalConfiguration?: RentalConfiguration | null
  createdAt: Date
  updatedAt: Date
}
