import type {
  ServiceArea,
  ServiceCity,
} from "@/data/service-areas/types"

/**
 * Por debajo de esto una página de ciudad es plantilla con el nombre cambiado,
 * que es justo lo que Google trata como doorway page. Se cuenta solo la
 * entradilla porque es la parte que tiene que ser propia de la ciudad.
 */
export const MIN_INTRO_WORDS = 120

export type LocationPage =
  | { type: "area"; area: ServiceArea }
  | { type: "city"; city: ServiceCity; area: ServiceArea }

export function countWords(paragraphs: string[]): number {
  return paragraphs.join(" ").split(/\s+/).filter(Boolean).length
}

/**
 * Indexable = el cliente la ha dado por buena (`published`) y tiene texto
 * suficiente. Una ciudad además necesita sus sitios propios: sin ellos la
 * página no dice nada que no diga la del área.
 */
export function isIndexable(page: LocationPage): boolean {
  if (page.type === "area") {
    return page.area.status === "published" && page.area.intro.length > 0
  }
  const { city } = page
  return (
    city.status === "published" &&
    countWords(city.intro) >= MIN_INTRO_WORDS &&
    city.highlights.length >= 3
  )
}

export function findLocationPage(
  slug: string,
  areas: ServiceArea[],
  cities: ServiceCity[]
): LocationPage | undefined {
  const area = areas.find((a) => a.slug === slug)
  if (area) return { type: "area", area }
  const city = cities.find((c) => c.slug === slug)
  if (!city) return undefined
  const cityArea = areas.find((a) => a.slug === city.areaSlug)
  return cityArea ? { type: "city", city, area: cityArea } : undefined
}

/** H1 y base del <title>: un aeropuerto no es "in", es "at". */
export function locationHeading(page: LocationPage): string {
  if (page.type === "area") {
    return `Exotic Car Rental in the ${page.area.name}`
  }
  const { city } = page
  if (city.kind === "airport") return `Exotic Car Rental at ${city.name}`
  return `Exotic Car Rental in ${city.name}, FL`
}

/**
 * Zona de Medusa cuyo precio se enseña. Una ciudad no hereda la de su área: el
 * área de Miami llega hasta Homestead, y anunciar ahí el precio de la zona de
 * Miami sería prometer una entrega que nadie ha tarifado. Sin zona propia, la
 * entrega se ofrece bajo petición.
 */
export function deliveryZoneCodeFor(page: LocationPage): string | undefined {
  return page.type === "city"
    ? page.city.deliveryZoneCode
    : page.area.deliveryZoneCode
}

/**
 * Errores de datos que romperían el enlazado: slugs repetidos (dos páginas en
 * la misma URL), ciudades sin área o vecinos que no existen (enlace a un 404).
 * Lo comprueba `scripts/check-service-areas.ts`.
 */
export function validateServiceAreas(
  areas: ServiceArea[],
  cities: ServiceCity[]
): string[] {
  const errors: string[] = []
  const slugs = [...areas.map((a) => a.slug), ...cities.map((c) => c.slug)]
  const seen = new Set<string>()
  for (const slug of slugs) {
    if (seen.has(slug)) errors.push(`duplicate slug: ${slug}`)
    seen.add(slug)
  }
  const areaSlugs = new Set(areas.map((a) => a.slug))
  const citySlugs = new Set(cities.map((c) => c.slug))
  for (const city of cities) {
    if (!areaSlugs.has(city.areaSlug)) {
      errors.push(`${city.slug}: unknown area ${city.areaSlug}`)
    }
    for (const n of city.nearby) {
      if (!citySlugs.has(n)) errors.push(`${city.slug}: unknown nearby ${n}`)
      if (n === city.slug) errors.push(`${city.slug}: lists itself as nearby`)
    }
  }
  return errors
}
