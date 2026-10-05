import type { HttpTypes } from "@medusajs/types"

import type { SelectCar } from "@/lib/schema-types"
import type { RentalConfiguration } from "@/lib/types/rental"

import { sdk } from "./sdk"

/**
 * Whether the storefront is configured to use the Medusa backend.
 * Without a publishable key, SDK calls would fail.
 */
export function isMedusaConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY &&
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  )
}

/** Campos de producto que necesita `medusaProductToCar`. */
const PRODUCT_FIELDS =
  "*variants,*variants.calculated_price,+variants.inventory_quantity,+images,*rental_configuration,*categories"

// ---------------------------------------------------------------------------
// Medusa Product → SelectCar mapping
// ---------------------------------------------------------------------------

/**
 * Converts a Medusa product (StoreProduct) to the frontend's SelectCar type.
 *
 * Direct fields: title→name, handle→slug, thumbnail/images→imageUrl, etc.
 * Car fields: read from product.metadata (bodyStyle, powertrain, …).
 * Price: taken from the first variant with a calculated_price; Medusa v2
 * returns it in the currency's standard unit (dollars for USD).
 */
export function medusaProductToCar(
  product: HttpTypes.StoreProduct
): SelectCar {
  const meta = (product.metadata ?? {}) as Record<string, unknown>
  const variant = product.variants?.[0]

  // Price from the first variant
  const rawAmount = variant?.calculated_price?.calculated_amount
  const pricePerDay =
    rawAmount != null ? Number(rawAmount).toFixed(2) : "0.00"
  const currency =
    variant?.calculated_price?.currency_code ?? "usd"

  // Images: every URL from the product
  const allImages = (product.images ?? []).map((img) => img.url)
  const imageUrl =
    product.thumbnail ??
    allImages[0] ??
    ""

  // Features: may arrive as an array of strings or a comma-separated string
  let features: string[] = []
  if (Array.isArray(meta.features)) {
    features = meta.features.map(String)
  } else if (typeof meta.features === "string") {
    features = meta.features.split(",").map((f: string) => f.trim())
  }

  // Las marcas son las categorías de producto de Medusa. Si un coche está en
  // varias, manda la de nivel superior (una subcategoría no es una marca).
  const categories = product.categories ?? []
  const brandCategory =
    categories.find((c) => !c.parent_category_id) ?? categories[0]
  const brand = brandCategory
    ? { handle: brandCategory.handle, name: brandCategory.name }
    : null

  const rentalConfig = (product as unknown as Record<string, unknown>)
    .rental_configuration as RentalConfiguration | undefined

  return {
    id: hashStringToNumber(product.id),
    slug: product.handle ?? product.id,
    name: product.title,
    bodyStyle: String(meta.bodyStyle ?? "sedan"),
    powertrain: String(meta.powertrain ?? "gasoline"),
    transmission: String(meta.transmission ?? "automatic"),
    seats: Number(meta.seats ?? 5),
    description: product.description ?? "",
    features,
    rating: String(meta.rating ?? "0"),
    reviewCount: String(meta.reviewCount ?? "0"),
    unlimitedMileage: Boolean(meta.unlimitedMileage ?? false),
    imageUrl,
    images: allImages.length > 0 ? allImages : (imageUrl ? [imageUrl] : []),
    pricePerDay,
    currency,
    priceId: variant?.id ?? null,
    medusaProductId: product.id,
    medusaVariantId: variant?.id ?? undefined,
    status: product.status ?? "active",
    metadata: meta,
    rentalConfiguration: rentalConfig ?? null,
    brand,
    createdAt: product.created_at ? new Date(product.created_at) : new Date(),
    updatedAt: product.updated_at ? new Date(product.updated_at) : new Date(),
  }
}

/** Converts a Medusa string ID to a stable number (simple hash). */
function hashStringToNumber(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0 // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// ---------------------------------------------------------------------------
// Default region (cached in memory so we don't request it on every call)
// ---------------------------------------------------------------------------

let _defaultRegion: {
  id: string
  name: string
  currency_code: string
  country_code: string | null
} | null = null

/**
 * Gets the first region from the Medusa backend (id, name, currency_code,
 * and the iso_2 of its first country — used as default billing/shipping
 * country for guest checkouts). Cached in memory.
 */
async function getDefaultRegion(): Promise<{
  id: string
  name: string
  currency_code: string
  country_code: string | null
} | null> {
  if (_defaultRegion) return _defaultRegion
  try {
    const { regions } = await sdk.store.region.list({ limit: 1 })
    const region = regions?.[0]
    if (region) {
      const countries = (region as { countries?: { iso_2?: string }[] })
        .countries
      const countryCode = countries?.[0]?.iso_2?.toLowerCase() ?? null
      _defaultRegion = {
        id: region.id,
        name: (region as { name?: string }).name ?? region.id,
        currency_code:
          (region as { currency_code?: string }).currency_code ?? "usd",
        country_code: countryCode,
      }
      if (process.env.NODE_ENV === "development") {
        console.log(
          "[Medusa] Pricing region loaded:",
          _defaultRegion.name,
          `(${_defaultRegion.currency_code})`,
          "— id:",
          _defaultRegion.id,
          "— country:",
          _defaultRegion.country_code ?? "(none)",
        )
      }
      return _defaultRegion
    }
  } catch (error) {
    console.error("[Medusa] Error fetching default region:", error)
  }
  return null
}

/** Gets only the default region ID (for internal use). */
async function getDefaultRegionId(): Promise<string | null> {
  const region = await getDefaultRegion()
  return region?.id ?? null
}

/**
 * Returns the region currently used for pricing (id, name, currency_code).
 * Useful for UI display or debugging.
 */
export async function getMedusaDefaultRegion(): Promise<{
  id: string
  name: string
  currency_code: string
  country_code: string | null
} | null> {
  return getDefaultRegion()
}

// ---------------------------------------------------------------------------
// Store API helpers
// ---------------------------------------------------------------------------

/**
 * Lists products from the Medusa Store API and maps them to SelectCar[].
 *
 * Automatically gets the first region to compute prices.
 * You can pass an explicit `regionId` if you prefer.
 */
export async function getMedusaProducts(options?: {
  limit?: number
  offset?: number
  regionId?: string
  handle?: string
}): Promise<{ products: SelectCar[]; count: number }> {
  if (!isMedusaConfigured()) {
    return { products: [], count: 0 }
  }
  try {
    // Get region for the pricing context
    const regionId = options?.regionId ?? (await getDefaultRegionId())

    const query: Record<string, unknown> = {
      limit: options?.limit ?? 100,
      offset: options?.offset ?? 0,
      fields: PRODUCT_FIELDS,
    }

    if (regionId) {
      query.region_id = regionId
    }

    if (options?.handle) {
      query.handle = options.handle
    }

    const result = await sdk.store.product.list(query)

    const products = (result.products ?? []).map(medusaProductToCar)
    return { products, count: result.count ?? products.length }
  } catch (error) {
    console.error("[Medusa] Error fetching products:", error)
    return { products: [], count: 0 }
  }
}

/**
 * Gets a product by handle (slug) from Medusa.
 */
export async function getMedusaProductByHandle(
  handle: string,
  regionId?: string
): Promise<SelectCar | undefined> {
  if (!isMedusaConfigured()) return undefined
  try {
    // Get region for the pricing context
    const resolvedRegionId = regionId ?? (await getDefaultRegionId())

    const query: Record<string, unknown> = {
      handle,
      limit: 1,
      fields: PRODUCT_FIELDS,
    }

    if (resolvedRegionId) {
      query.region_id = resolvedRegionId
    }

    const result = await sdk.store.product.list(query)

    const product = result.products?.[0]
    if (!product) return undefined

    return medusaProductToCar(product)
  } catch (error) {
    console.error("[Medusa] Error fetching product by handle:", error)
    return undefined
  }
}

/**
 * Obtiene un producto por ID desde Medusa.
 */
export async function getMedusaProductById(
  id: string,
  regionId?: string
): Promise<SelectCar | undefined> {
  if (!isMedusaConfigured()) return undefined
  try {
    const resolvedRegionId = regionId ?? (await getDefaultRegionId())

    const query: Record<string, unknown> = {
      fields: PRODUCT_FIELDS,
    }

    if (resolvedRegionId) {
      query.region_id = resolvedRegionId
    }

    const { product } = await sdk.store.product.retrieve(id, query)
    if (!product) return undefined

    return medusaProductToCar(product)
  } catch (error) {
    console.error("[Medusa] Error fetching product by id:", error)
    return undefined
  }
}

/** Una marca tal como llega de Medusa: una categoría de producto de nivel superior. */
export interface MedusaBrandCategory {
  id: string
  handle: string
  name: string
  description: string
  rank: number
}

/**
 * Marcas: las categorías de producto de nivel superior, en el orden (`rank`)
 * que se les da en el admin. La Store API ya solo devuelve las activas y no
 * internas.
 */
export async function getMedusaBrandCategories(): Promise<
  MedusaBrandCategory[]
> {
  if (!isMedusaConfigured()) return []
  try {
    const { product_categories } = await sdk.store.category.list({
      parent_category_id: "null",
      fields: "id,handle,name,description,rank",
      limit: 100,
    })
    return (product_categories ?? [])
      .map((c) => ({
        id: c.id,
        handle: c.handle,
        name: c.name,
        description: c.description ?? "",
        rank: c.rank ?? 0,
      }))
      .sort((a, b) => a.rank - b.rank)
  } catch (error) {
    console.error("[Medusa] Error fetching brand categories:", error)
    return []
  }
}

/**
 * Lista regiones desde la Store API de Medusa.
 */
export async function getMedusaRegions(options?: {
  limit?: number
  offset?: number
}) {
  if (!isMedusaConfigured()) {
    return { regions: [], count: 0 }
  }
  try {
    const result = await sdk.store.region.list({
      limit: options?.limit ?? 100,
      offset: options?.offset ?? 0,
    })
    return result
  } catch (error) {
    console.error("[Medusa] Error fetching regions:", error)
    return { regions: [], count: 0 }
  }
}
