import type { MetadataRoute } from "next"
import { getActiveBrands } from "@/db/queries/brand-repository"
import { getCars } from "@/db/queries/car-repository"
import { SERVICE_AREAS, SERVICE_CITIES } from "@/data/service-areas"

import {
  findLocationPage,
  isIndexable,
} from "@/lib/seo/service-areas"
import { absoluteUrl } from "@/lib/seo/urls"

/**
 * El catálogo cambia desde el admin de Medusa: regenerar cada hora para que un
 * coche nuevo entre en el sitemap sin tener que redesplegar.
 */
export const revalidate = 3600

/**
 * Páginas públicas sin datos dinámicos. Los flujos privados no van aquí, ni los
 * presupuestos (/quote/[token]): su URL es la llave del cliente.
 */
const STATIC_PAGES: {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority: number
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/cars", changeFrequency: "daily", priority: 0.9 },
  { path: "/brands", changeFrequency: "weekly", priority: 0.7 },
  { path: "/locations", changeFrequency: "monthly", priority: 0.7 },
  { path: "/driver-requirements", changeFrequency: "yearly", priority: 0.4 },
  { path: "/cancellation-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cars, brands] = await Promise.all([getCars(), getActiveBrands()])

  const staticEntries = STATIC_PAGES.map((page) => ({
    url: absoluteUrl(page.path),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  // La Store API solo devuelve productos publicados, así que todo lo que llega
  // aquí tiene ficha pública. lastModified viene de Medusa para que Google
  // vuelva a rastrear la ficha cuando cambian precio o fotos.
  const carEntries = cars.map((car) => ({
    url: absoluteUrl(`/cars/${car.slug}`),
    lastModified: car.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const brandEntries = brands.map((brand) => ({
    url: absoluteUrl(`/brands/${brand.handle}`),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Solo las ciudades publicadas: un borrador lleva noindex y no pinta nada
  // en el sitemap (Search Console lo marcaría como contradicción).
  const locationEntries = [...SERVICE_AREAS, ...SERVICE_CITIES]
    .map(({ slug }) => findLocationPage(slug, SERVICE_AREAS, SERVICE_CITIES))
    .filter((page) => page !== undefined && isIndexable(page))
    .map((page) => ({
      url: absoluteUrl(
        `/locations/${page!.type === "area" ? page!.area.slug : page!.city.slug}`
      ),
      changeFrequency: "monthly" as const,
      priority: page!.type === "area" ? 0.7 : 0.6,
    }))

  return [
    ...staticEntries,
    ...brandEntries,
    ...locationEntries,
    ...carEntries,
  ]
}
