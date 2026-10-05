/**
 * Páginas de ciudad para SEO (SEO-2). El texto vive aquí y no en Medusa porque
 * el admin no tiene dónde guardar contenido editorial por ciudad; los precios
 * de entrega, en cambio, salen de las zonas de Medusa (`deliveryZoneCode`).
 *
 * Todo el texto es en inglés: es el idioma de la tienda.
 */

/**
 * `draft`: se publica la página pero con noindex y fuera del sitemap. Así el
 * cliente puede revisar el texto en la web real antes de enseñárselo a Google.
 * `published`: indexable.
 */
export type ContentStatus = "draft" | "published"

/** Un sitio concreto de la ciudad al que llevar el coche o por el que conducir. */
export interface Highlight {
  title: string
  text: string
}

export interface Faq {
  question: string
  answer: string
}

/**
 * Agrupa ciudades: Miami, Ft Lauderdale, Pompano Beach y West Palm Beach. Su
 * página hace de hub y enlaza a cada ciudad del área.
 */
export interface ServiceArea {
  /** URL: /locations/<slug>. Único entre áreas y ciudades. */
  slug: string
  /** "Fort Lauderdale Area". */
  name: string
  /** Para frases: "in the Fort Lauderdale area". */
  shortName: string
  county: string
  /** <title> y H1 ya van compuestos por la página; esto es solo la entradilla. */
  intro: string[]
  /** Zona de entrega de Medusa cuyo precio se enseña, si existe. */
  deliveryZoneCode?: string
  status: ContentStatus
}

export interface ServiceCity {
  /** URL: /locations/<slug>. Único entre áreas y ciudades. */
  slug: string
  /** Como se escribe en una búsqueda: "Miami Beach", "Coral Gables". */
  name: string
  areaSlug: string
  /**
   * `neighborhood` y `airport` cambian el H1 y el schema (un barrio no es un
   * municipio para schema.org).
   */
  kind: "city" | "neighborhood" | "airport"
  /** Dos o tres párrafos propios de esta ciudad. Nada de plantilla. */
  intro: string[]
  /** Tres o cuatro sitios reales de la ciudad. */
  highlights: Highlight[]
  /** Dos o tres preguntas propias de esta ciudad. */
  faqs: Faq[]
  /** Slugs de ciudades vecinas para el enlazado interno. */
  nearby: string[]
  /** Zona de Medusa cuyo precio se enseña. No se hereda del área. */
  deliveryZoneCode?: string
  status: ContentStatus
}
