/**
 * URL pública del sitio, sin barra final: la usan el canonical, el sitemap,
 * robots y el JSON-LD. NEXT_PUBLIC_SITE_URL la cambia por entorno (p. ej. un
 * preview); sin ella, el dominio de producción, para que un despliegue sin la
 * variable nunca mande a Google URLs ajenas.
 */
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://goldenexoticsclub.com"
).replace(/\/+$/, "")

export const siteConfig = {
  name: "Golden Exotics",
  url: siteUrl,
  author: {
    name: "eduamdev",
    url: "https://eduam.dev",
  },
  description:
    "Exotic and luxury car rental in Miami. Pick up next to Miami International Airport or have the car delivered across South Florida, with real daily prices and online booking.",
  links: {
    github: "https://github.com/eduamdev",
  },
  /**
   * Customer-facing contact channels. Update these with your real numbers
   * and handles — the phone number follows the E.164 digits-only format
   * expected by wa.me (no '+', spaces or dashes).
   */
  contact: {
    email: "support@carhive.com",
    whatsapp: {
      number: "13055551234",
      display: "+1 (305) 555-1234",
    },
    instagram: {
      handle: "carhive",
      url: "https://instagram.com/carhive",
    },
  },
}

export type SiteConfig = typeof siteConfig

/**
 * Builds a wa.me URL, optionally pre-filling the chat with a message.
 * Safe to call from server and client.
 */
export function getWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${siteConfig.contact.whatsapp.number}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}
