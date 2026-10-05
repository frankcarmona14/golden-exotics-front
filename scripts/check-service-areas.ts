/**
 * Comprueba los datos de las páginas de ciudad antes de desplegar:
 * `pnpm check:locations`. Falla si hay slugs repetidos, vecinos que no
 * existen o una ciudad publicada que no llega al mínimo para indexarse.
 */
import { SERVICE_AREAS, SERVICE_CITIES } from "../data/service-areas"
import {
  countWords,
  findLocationPage,
  isIndexable,
  MIN_INTRO_WORDS,
  validateServiceAreas,
} from "../lib/seo/service-areas"

const errors = validateServiceAreas(SERVICE_AREAS, SERVICE_CITIES)

for (const city of SERVICE_CITIES) {
  const page = findLocationPage(city.slug, SERVICE_AREAS, SERVICE_CITIES)
  if (city.status === "published" && page && !isIndexable(page)) {
    errors.push(
      `${city.slug}: published but not indexable (${countWords(city.intro)}/${MIN_INTRO_WORDS} words, ${city.highlights.length} highlights)`
    )
  }
}

const published = [...SERVICE_AREAS, ...SERVICE_CITIES].filter(
  (p) => p.status === "published"
).length
console.log(
  `${SERVICE_AREAS.length} areas, ${SERVICE_CITIES.length} cities, ${published} published`
)

if (errors.length > 0) {
  console.error(errors.join("\n"))
  process.exit(1)
}
