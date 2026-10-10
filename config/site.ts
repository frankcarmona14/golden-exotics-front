/**
 * URL pública del sitio, sin barra final: la usan el canonical, el sitemap,
 * robots y el JSON-LD. NEXT_PUBLIC_SITE_URL la cambia por entorno (p. ej. un
 * preview); sin ella, el dominio de producción, para que un despliegue sin la
 * variable nunca mande a Google URLs ajenas.
 */
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://goldenexoticsclub.com"
).replace(/\/+$/, "")

/** Digits only, for wa.me. Needs the country code: "+1 305 555 0100". */
function contactWhatsApp(): { number: string; display: string } | null {
  const raw = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP?.trim()
  if (!raw) return null
  const digits = raw.replace(/\D+/g, "")
  if (digits.length < 8 || digits.length > 15) return null
  const display =
    digits.length === 11 && digits.startsWith("1")
      ? `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
      : `+${digits}`
  return { number: digits, display }
}

function contactInstagram(): { handle: string; url: string } | null {
  const handle = process.env.NEXT_PUBLIC_CONTACT_INSTAGRAM?.trim().replace(/^@/, "")
  if (!handle) return null
  return { handle, url: `https://instagram.com/${handle}` }
}

function contactEmail(): string | null {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null
}

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
   * Golden Exotics' own contact channels, from env so they can't ship with the
   * template's placeholders again (the confirmation page showed
   * "+1 (305) 555-1234" and "@carhive"). A channel without its variable is
   * `null` and is simply not shown.
   */
  contact: {
    email: contactEmail(),
    whatsapp: contactWhatsApp(),
    instagram: contactInstagram(),
  },
}

export type SiteConfig = typeof siteConfig

/**
 * Builds a wa.me URL to Golden Exotics, optionally pre-filling the chat, or
 * `null` when no WhatsApp number is configured. Safe on server and client.
 */
export function getWhatsAppUrl(message?: string): string | null {
  const whatsapp = siteConfig.contact.whatsapp
  if (!whatsapp) return null
  const base = `https://wa.me/${whatsapp.number}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}
