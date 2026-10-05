import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SERVICE_AREAS, SERVICE_CITIES } from "@/data/service-areas"

import { getActiveBrands } from "@/db/queries/brand-repository"
import { getCars } from "@/db/queries/car-repository"
import { getWhatsAppUrl } from "@/config/site"
import { getRentalLocations } from "@/lib/medusa/rental"
import { buildPageMetadata, truncateForMeta } from "@/lib/seo/metadata"
import {
  deliveryZoneCodeFor,
  findLocationPage,
  isIndexable,
  locationHeading,
  type LocationPage,
} from "@/lib/seo/service-areas"
import {
  buildLocationBreadcrumbJsonLd,
  buildLocationServiceJsonLd,
} from "@/lib/seo/structured-data"
import { formatAmountForDisplay } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { JsonLd } from "@/components/json-ld"

import {
  Breadcrumbs,
  Faqs,
  FleetGrid,
  LinkChips,
  Section,
} from "../components"

/** El texto es estático, pero la flota y el precio de entrega vienen de Medusa. */
export const revalidate = 3600

interface LocationPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return [...SERVICE_AREAS, ...SERVICE_CITIES].map(({ slug }) => ({ slug }))
}

function getPage(slug: string) {
  return findLocationPage(slug, SERVICE_AREAS, SERVICE_CITIES)
}

function introOf(page: LocationPage): string[] {
  return page.type === "area" ? page.area.intro : page.city.intro
}

export async function generateMetadata({
  params,
}: LocationPageProps): Promise<Metadata> {
  const page = getPage(params.slug)
  if (!page) return {}

  const metadata = buildPageMetadata({
    title: locationHeading(page),
    description: truncateForMeta(introOf(page)[0] ?? ""),
    path: `/locations/${params.slug}`,
  })
  // Borrador: visible para que el cliente lo revise, pero fuera de Google.
  // follow sí, para que los enlaces de la página sigan contando.
  return isIndexable(page)
    ? metadata
    : { ...metadata, robots: { index: false, follow: true } }
}

export default async function LocationPageView({ params }: LocationPageProps) {
  const page = getPage(params.slug)
  if (!page) notFound()

  const [cars, brands, { pickup, delivery_zones }] = await Promise.all([
    getCars(),
    getActiveBrands(),
    getRentalLocations(),
  ])

  const { area } = page
  const placeName = page.type === "area" ? area.shortName : page.city.name
  const heading = locationHeading(page)
  const intro = introOf(page)
  const zoneCode = deliveryZoneCodeFor(page)
  const zone = zoneCode
    ? delivery_zones.find((z) => z.code === zoneCode)
    : undefined
  const pickupAddress = pickup
    ? [pickup.address_1, pickup.city, pickup.province]
        .filter(Boolean)
        .join(", ")
    : null

  const areaCities = SERVICE_CITIES.filter((c) => c.areaSlug === area.slug)
  const nearby =
    page.type === "city"
      ? page.city.nearby
          .map((slug) => SERVICE_CITIES.find((c) => c.slug === slug))
          .filter((c): c is (typeof SERVICE_CITIES)[number] => Boolean(c))
      : []
  const otherAreas = SERVICE_AREAS.filter((a) => a.slug !== area.slug)

  const trail =
    page.type === "area"
      ? [{ name: area.name, slug: area.slug }]
      : [
          { name: area.name, slug: area.slug },
          { name: page.city.name, slug: page.city.slug },
        ]

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-7xl px-5 pb-16 pt-6 sm:px-6 lg:pt-8"
    >
      <JsonLd data={buildLocationBreadcrumbJsonLd(trail)} />
      <JsonLd
        data={buildLocationServiceJsonLd({
          name: page.type === "area" ? area.name : page.city.name,
          slug: params.slug,
          placeType:
            page.type === "area"
              ? "AdministrativeArea"
              : page.city.kind === "city"
                ? "City"
                : "Place",
          description: truncateForMeta(intro[0] ?? ""),
        })}
      />

      <Breadcrumbs
        trail={[
          { name: "Home", href: "/" },
          { name: "Locations", href: "/locations" },
          ...trail.map((t, i) => ({
            name: t.name,
            href: i < trail.length - 1 ? `/locations/${t.slug}` : undefined,
          })),
        ]}
      />

      <header className="mt-6 max-w-3xl">
        <p className="text-caption font-semibold uppercase tracking-[0.2em] text-subtle">
          {page.type === "area" ? area.county : area.name}
        </p>
        <h1 className="mt-2 text-heading sm:text-heading-lg">{heading}</h1>
        <div className="mt-5 space-y-4">
          {intro.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="text-body leading-relaxed text-neutral-600 dark:text-neutral-300"
            >
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/cars">Browse the fleet</Link>
          </Button>
          <Button asChild variant="outline">
            <a
              href={getWhatsAppUrl(
                `Hi! I'd like to rent a car in ${placeName}.`
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Message us
            </a>
          </Button>
        </div>
      </header>

      <Section title={`Cars you can drive in ${placeName}`}>
        <FleetGrid cars={cars} />
      </Section>

      {page.type === "city" && page.city.highlights.length > 0 && (
        <Section title={`Where to take it in ${page.city.name}`}>
          <ul className="grid gap-4 sm:grid-cols-2">
            {page.city.highlights.map((h) => (
              <li
                key={h.title}
                className="rounded-card border border-neutral-200 p-5 dark:border-neutral-800"
              >
                <h3 className="text-subheading">{h.title}</h3>
                <p className="mt-1.5 text-body-sm text-neutral-600 dark:text-neutral-400">
                  {h.text}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {page.type === "area" && (
        <Section title={`Cities we serve in the ${area.name}`}>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {areaCities.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/locations/${city.slug}`}
                  className="block rounded-tight border border-neutral-200 px-4 py-3 text-body-sm font-medium transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
                >
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Pick-up and delivery">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-neutral-200 p-5 dark:border-neutral-800">
            <h3 className="text-subheading">Pick up in Miami</h3>
            <p className="mt-1.5 text-body-sm text-neutral-600 dark:text-neutral-400">
              {pickupAddress
                ? `Collect the car at our location: ${pickupAddress}.`
                : "Collect the car at our Miami location."}{" "}
              Choose it as your pick-up location when you search the fleet.
            </p>
          </div>
          <div className="rounded-card border border-neutral-200 p-5 dark:border-neutral-800">
            <h3 className="text-subheading">Delivery to {placeName}</h3>
            <p className="mt-1.5 text-body-sm text-neutral-600 dark:text-neutral-400">
              {zone
                ? `Delivery in the ${zone.name} zone costs ${formatAmountForDisplay(zone.price, "USD")}. Pick “${zone.name}” as your location when you book and it is added to your total.`
                : `We can bring the car to your home, hotel or the airport in ${placeName}. Message us with your dates and address and we will confirm it before you book.`}
            </p>
          </div>
        </div>
      </Section>

      {page.type === "city" && page.city.faqs.length > 0 && (
        <Section title={`Renting in ${page.city.name}: questions`}>
          <Faqs faqs={page.city.faqs} />
        </Section>
      )}

      <div className="mt-12 space-y-8">
        {nearby.length > 0 && (
          <LinkChips
            label="Nearby"
            links={nearby.map((c) => ({
              href: `/locations/${c.slug}`,
              name: c.name,
            }))}
          />
        )}
        <LinkChips
          label={page.type === "area" ? "Other areas" : "Areas we serve"}
          links={(page.type === "area" ? otherAreas : SERVICE_AREAS).map(
            (a) => ({ href: `/locations/${a.slug}`, name: a.name })
          )}
        />
        <LinkChips
          label="Rent by brand"
          links={brands.map((b) => ({
            href: `/brands/${b.handle}`,
            name: b.name,
          }))}
        />
      </div>
    </main>
  )
}
