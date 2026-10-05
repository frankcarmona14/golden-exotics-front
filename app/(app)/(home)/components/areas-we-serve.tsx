import Link from "next/link"
import { SERVICE_AREAS, SERVICE_CITIES } from "@/data/service-areas"

/** Ciudades por área que se enseñan en la home; el resto, en su página. */
const CITIES_PER_AREA = 5

/**
 * Enlaces de la home a las áreas y a sus ciudades principales. La home es la
 * página con más autoridad del sitio: enlazar desde aquí es lo que hace que
 * Google encuentre y valore las páginas de ciudad.
 */
export function AreasWeServe() {
  return (
    <section>
      <div className="mx-auto max-w-none px-5 sm:max-w-[90%] sm:px-0 2xl:max-w-8xl">
        <p className="mb-2 text-caption font-semibold uppercase tracking-[0.2em] text-subtle">
          Areas we serve
        </p>
        <h2 className="text-balance text-heading-sm sm:text-heading lg:text-heading-lg">
          From Miami to Palm Beach
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_AREAS.map((area) => (
            <div
              key={area.slug}
              className="rounded-card border border-neutral-200 p-5 dark:border-neutral-800"
            >
              <h3 className="text-subheading">
                <Link
                  href={`/locations/${area.slug}`}
                  className="hover:underline hover:underline-offset-4"
                >
                  {area.name}
                </Link>
              </h3>
              <ul className="mt-3 space-y-1.5">
                {SERVICE_CITIES.filter((c) => c.areaSlug === area.slug)
                  .slice(0, CITIES_PER_AREA)
                  .map((city) => (
                    <li key={city.slug}>
                      <Link
                        href={`/locations/${city.slug}`}
                        className="text-body-sm text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                      >
                        {city.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <Link
          href="/locations"
          className="mt-6 inline-block text-body-sm font-medium underline underline-offset-4"
        >
          See all locations
        </Link>
      </div>
    </section>
  )
}
