export const siteConfig = {
  name: "Carhive",
  url: "https://carhive.eduam.dev",
  author: {
    name: "eduamdev",
    url: "https://eduam.dev",
  },
  description:
    "Explore the freedom of the open road with our premium car rental services! Discover a wide range of meticulously maintained vehicles, from sleek sedans to spacious SUVs, perfect for every occasion. With competitive prices, flexible rental options, and exceptional customer service, we make your journey unforgettable. Book your dream car today and embark on a seamless travel experience.",
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
