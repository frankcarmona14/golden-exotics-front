import type { Metadata } from "next"

import {
  getBrandCarCounts,
  getActiveBrands,
} from "@/db/queries/brand-repository"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { BrandCard } from "@/components/brand-card"

/** Las marcas cambian desde el admin de Medusa, como el catálogo. */
export const revalidate = 3600

export const metadata: Metadata = buildPageMetadata({
  title: "Car Brands",
  description:
    "Rent exotic and luxury cars in Miami by brand. Pick a brand and see every car we have from it, with real daily prices.",
  path: "/brands",
})

export default async function BrandsPage() {
  const [brands, carCounts] = await Promise.all([
    getActiveBrands(),
    getBrandCarCounts(),
  ])

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-7xl px-5 pb-16 pt-8 sm:px-6 lg:pt-12"
    >
      <header className="mb-8 max-w-2xl">
        <p className="text-caption font-semibold uppercase tracking-[0.2em] text-subtle">
          Explore brands
        </p>
        <h1 className="mt-1 text-heading-sm sm:text-heading">
          Drive the legends
        </h1>
        <p className="mt-1.5 text-body text-neutral-500 dark:text-neutral-400">
          Pick a brand to see every car we have from it.
        </p>
      </header>

      {brands.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
          {brands.map((brand, index) => (
            <BrandCard
              key={brand.handle}
              brand={brand}
              carCount={carCounts[brand.handle]}
              priority={index < 2}
            />
          ))}
        </div>
      ) : (
        <p className="text-body text-neutral-500 dark:text-neutral-400">
          No brands yet.
        </p>
      )}
    </main>
  )
}
