import type { SelectCar } from "@/lib/schema-types"
import {
  isMedusaConfigured,
  getMedusaProducts,
  getMedusaProductByHandle,
} from "@/lib/medusa"
import { mockCars } from "@/data/mock-data"

export async function getCars(): Promise<SelectCar[]> {
  if (isMedusaConfigured()) {
    console.log("[CarRepository] Medusa configured, fetching products...")
    const { products } = await getMedusaProducts()
    console.log(`[CarRepository] Got ${products.length} products from Medusa`)
    if (products.length > 0) {
      return products
    }
    console.log("[CarRepository] No products from Medusa, falling back to mock")
  } else {
    console.log("[CarRepository] Medusa not configured, using mock data")
  }
  // Fallback a datos mock
  return mockCars
}

/**
 * Obtiene un coche por slug.
 * En Medusa el slug equivale al "handle" del producto.
 */
export async function getCarBySlug(
  slug: SelectCar["slug"]
): Promise<SelectCar | undefined> {
  if (isMedusaConfigured()) {
    const car = await getMedusaProductByHandle(slug)
    if (car) {
      return car
    }
  }
  // Fallback a datos mock
  return mockCars.find((c) => c.slug === slug)
}
