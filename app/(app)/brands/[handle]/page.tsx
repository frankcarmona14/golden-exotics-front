import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SERVICE_AREAS } from "@/data/service-areas"

import {
  getBrandByHandle,
  getBrands,
  getCarsByBrand,
} from "@/db/queries/brand-repository"
import { buildPageMetadata, truncateForMeta } from "@/lib/seo/metadata"
import { buildBrandBreadcrumbJsonLd } from "@/lib/seo/structured-data"
import { Button } from "@/components/ui/button"
import { BrandNav } from "@/components/brand-nav"
import { JsonLd } from "@/components/json-ld"

import { CarCard } from "../../cars/components/car-card"
import { LinkChips } from "../../locations/components"

/** Las marcas y sus coches cambian desde el admin de Medusa. */
export const revalidate = 3600

interface BrandPageProps {
  params: { handle: string }
}

export async function generateStaticParams() {
  const brands = await getBrands()
  return brands.map((brand) => ({ handle: brand.handle }))
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const brand = await getBrandByHandle(params.handle)
  if (!brand) return {}

  return buildPageMetadata({
    title: `${brand.name} Rental in Miami`,
    description: truncateForMeta(
      brand.description ||
        `Rent a ${brand.name} in Miami. See every ${brand.name} in our fleet with real daily prices, check availability and book online.`
    ),
    path: `/brands/${brand.handle}`,
  })
}

export default async function BrandPage({ params }: BrandPageProps) {
  const [brand, brands, cars] = await Promise.all([
    getBrandByHandle(params.handle),
    getBrands(),
    getCarsByBrand(params.handle),
  ])

  if (!brand) notFound()

  const countLabel = cars.length === 1 ? "1 car" : `${cars.length} cars`

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-7xl px-5 pb-16 pt-6 sm:px-6 lg:pt-8"
    >
      <JsonLd data={buildBrandBreadcrumbJsonLd(brand)} />

      <BrandNav brands={brands} activeHandle={brand.handle} />

      <header
        className="relative mt-6 overflow-hidden rounded-card border border-white/[0.06] px-6 py-10 sm:px-10 sm:py-14"
        style={{
          background: `linear-gradient(145deg, ${brand.gradientFrom}, ${brand.gradientTo})`,
        }}
      >
        <div
          className="absolute -right-10 -top-10 size-48 rounded-full opacity-10 blur-3xl"
          style={{ background: brand.logoColor }}
        />
        <div className="relative max-w-2xl">
          <p className="text-caption font-semibold uppercase tracking-[0.25em] text-white/60">
            {countLabel}
          </p>
          <h1 className="mt-2 text-heading sm:text-heading-lg text-white">
            {brand.name}
          </h1>
          {brand.tagline && (
            <p className="mt-2 text-body font-medium italic text-white/50">
              &ldquo;{brand.tagline}&rdquo;
            </p>
          )}
          {brand.description && (
            <p className="mt-4 text-body leading-relaxed text-white/75">
              {brand.description}
            </p>
          )}
        </div>
        <div
          className="absolute bottom-0 left-0 h-[2px] w-full opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${brand.logoColor}, transparent)`,
          }}
        />
      </header>

      <section aria-label={`${brand.name} cars`} className="mt-8">
        {cars.length > 0 ? (
          // CarCard lee las fechas de la URL (useSearchParams): necesita Suspense.
          <Suspense>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {cars.map((car, index) => (
                <CarCard key={car.id} car={car} priority={index < 2} />
              ))}
            </div>
          </Suspense>
        ) : (
          <div className="rounded-card border border-dashed border-neutral-300 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900/40">
            <p className="text-body font-medium text-neutral-900 dark:text-neutral-100">
              No {brand.name} cars right now
            </p>
            <p className="mx-auto mt-1 max-w-sm text-body-sm text-neutral-500 dark:text-neutral-400">
              Take a look at the rest of the fleet in the meantime.
            </p>
            <Button asChild className="mt-5">
              <Link href="/cars">Explore cars</Link>
            </Button>
          </div>
        )}
      </section>
      <div className="mt-12">
        <LinkChips
          label={`Rent a ${brand.name} across South Florida`}
          links={SERVICE_AREAS.map((area) => ({
            href: `/locations/${area.slug}`,
            name: area.name,
          }))}
        />
      </div>
    </main>
  )
}
