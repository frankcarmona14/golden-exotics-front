import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"

/**
 * Zonas privadas o transaccionales: no aportan a la búsqueda y rastrearlas
 * solo gasta presupuesto de rastreo (y alguna URL lleva IDs o tokens).
 */
const PRIVATE_PATHS = [
  "/account",
  "/reservation/",
  "/payment-collection/",
  "/rental-documents/",
  "/quote/",
  "/sign-in",
  "/sign-up",
  "/api-test",
  "/api/",
]

/**
 * Sustituye al robots.txt estático para poder apuntar al sitemap con el
 * dominio de NEXT_PUBLIC_SITE_URL. Se mantienen los bloqueos a crawlers de
 * entrenamiento de IA que ya tenía el fichero anterior.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ChatGPT-User", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
