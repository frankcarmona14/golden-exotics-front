import { getCars } from "@/db/queries/car-repository"
import { carBrands, type CarBrand } from "@/data/car-brands"

import { getMedusaBrandCategories, isMedusaConfigured } from "@/lib/medusa"
import type { SelectCar } from "@/lib/schema-types"
import { slugify } from "@/lib/utils"

/**
 * Una marca de la tienda. Nombre, handle y descripción salen de la categoría
 * de producto en Medusa; el lema, los colores de la tarjeta y una descripción
 * de respaldo, de `data/car-brands.ts`, que el admin no tiene dónde guardar.
 */
export interface Brand {
  handle: string
  name: string
  description: string
  tagline: string | null
  logoColor: string
  gradientFrom: string
  gradientTo: string
}

/** Colores para una marca nueva en Medusa que aún no está en car-brands.ts. */
const DEFAULT_STYLE = {
  logoColor: "#f8e33f",
  gradientFrom: "#171717",
  gradientTo: "#262626",
}

/**
 * El estilo se busca por handle y, si no, por nombre: así una marca sigue con
 * sus colores aunque su handle en Medusa no coincida con el slug de aquí.
 */
function findStyle(handle: string, name: string): CarBrand | undefined {
  const nameSlug = slugify(name)
  return (
    carBrands.find((b) => b.slug === handle) ??
    carBrands.find((b) => b.slug === nameSlug)
  )
}

function toBrand(input: {
  handle: string
  name: string
  description?: string
}): Brand {
  const style = findStyle(input.handle, input.name)
  return {
    handle: input.handle,
    name: input.name,
    description: input.description || style?.description || "",
    tagline: style?.tagline ?? null,
    logoColor: style?.logoColor ?? DEFAULT_STYLE.logoColor,
    gradientFrom: style?.gradientFrom ?? DEFAULT_STYLE.gradientFrom,
    gradientTo: style?.gradientTo ?? DEFAULT_STYLE.gradientTo,
  }
}

/**
 * Todas las marcas, en el orden del admin de Medusa. Sin Medusa (o sin
 * categorías) se usan las de `car-brands.ts`, igual que los coches caen a los
 * datos mock.
 */
export async function getBrands(): Promise<Brand[]> {
  if (isMedusaConfigured()) {
    const categories = await getMedusaBrandCategories()
    if (categories.length > 0) return categories.map(toBrand)
  }
  return carBrands.map((b) => toBrand({ handle: b.slug, name: b.name }))
}

export async function getBrandByHandle(
  handle: string
): Promise<Brand | undefined> {
  const brands = await getBrands()
  return brands.find((b) => b.handle === handle)
}

/** Los coches de una marca: los que tienen su categoría en Medusa. */
export async function getCarsByBrand(handle: string): Promise<SelectCar[]> {
  const cars = await getCars()
  return cars.filter((car) => car.brand?.handle === handle)
}

/** Cuántos coches tiene cada marca, por handle. */
export async function getBrandCarCounts(): Promise<Record<string, number>> {
  const cars = await getCars()
  const counts: Record<string, number> = {}
  for (const car of cars) {
    if (car.brand) counts[car.brand.handle] = (counts[car.brand.handle] ?? 0) + 1
  }
  return counts
}

/**
 * Las marcas que tienen al menos un coche: las únicas que se listan (home,
 * /brands, enlaces, sitemap). Una marca recién creada en Medusa sin coches
 * sería una página vacía, y eso es contenido pobre para Google y un callejón
 * sin salida para el cliente. Con datos mock (sin marca en los coches) se
 * devuelven todas.
 */
export async function getActiveBrands(): Promise<Brand[]> {
  const [brands, counts] = await Promise.all([getBrands(), getBrandCarCounts()])
  if (Object.keys(counts).length === 0) return brands
  return brands.filter((brand) => (counts[brand.handle] ?? 0) > 0)
}
