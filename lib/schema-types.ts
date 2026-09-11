import type { RentalConfiguration } from "@/lib/types/rental"

/**
 * Tipos de dominio para Carhive.
 * Independientes de la capa de datos (antes en Drizzle; en el futuro desde Medusa).
 */

export interface SelectLocation {
  id: number
  slug: string
  name: string
  latitude: number
  longitude: number
  imageUrl: string | null
  featured: boolean
  createdAt: Date
  updatedAt: Date
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
