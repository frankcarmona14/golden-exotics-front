import type { Metadata } from "next"
import Link from "next/link"
import { SERVICE_AREAS, SERVICE_CITIES } from "@/data/service-areas"

import { buildPageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = buildPageMetadata({
  title: "Locations - Exotic Car Rental Across South Florida",
  description:
    "Exotic and luxury car rental from Miami to West Palm Beach. Pick up in Miami or have the car brought to you in Miami Beach, Fort Lauderdale, Pompano Beach, Boca Raton and more.",
  path: "/locations",
})

export default function LocationsPage() {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-7xl px-5 pb-16 pt-8 sm:px-6 lg:pt-12"
    >
      <header className="max-w-2xl">
        <p className="text-caption font-semibold uppercase tracking-[0.2em] text-subtle">
          Locations
        </p>
        <h1 className="mt-1 text-heading-sm sm:text-heading">
          Exotic car rental across South Florida
        </h1>
        <p className="mt-1.5 text-body text-neutral-500 dark:text-neutral-400">
          From Miami-Dade up to Palm Beach County. Pick your city to see the
          fleet, where to drive and how pick-up and delivery work there.
        </p>
      </header>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {SERVICE_AREAS.map((area) => (
          <section key={area.slug}>
            <h2 className="text-heading-sm">
              <Link
                href={`/locations/${area.slug}`}
                className="hover:underline hover:underline-offset-4"
              >
                {area.name}
              </Link>
            </h2>
            <p className="mt-1 text-body-sm text-subtle">{area.county}</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {SERVICE_CITIES.filter((c) => c.areaSlug === area.slug).map(
                (city) => (
                  <li key={city.slug}>
                    <Link
                      href={`/locations/${city.slug}`}
                      className="text-body-sm text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
                    >
                      {city.name}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
