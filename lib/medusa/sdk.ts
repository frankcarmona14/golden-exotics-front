import Medusa from "@medusajs/js-sdk"

// The Medusa backend runs on port 9000 by default
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

/**
 * Medusa JS SDK client for the storefront (v2.13+).
 *
 * Configuration matches the official Medusa starter (nextjs-starter-medusa).
 * No auth config is passed: the SDK defaults to JWT via localStorage, and
 * server-side requests (Server Components) don't need auth because the
 * publishableKey is enough for the Store API.
 *
 * @see https://github.com/medusajs/nextjs-starter-medusa/blob/main/src/lib/config.ts
 */
export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
