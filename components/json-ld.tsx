import { serializeJsonLd } from "@/lib/seo/structured-data"

/**
 * Inserta datos estructurados en el HTML del servidor. Va en el body y no en
 * <head> porque Google los lee igual y así cada página los declara junto a su
 * contenido, sin tocar los layouts.
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[]
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
