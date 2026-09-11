"use server"

/**
 * Pago de un balance por link (F0-7).
 *
 * A esta página se llega desde un link que el operador copia en el admin, así
 * que no hay sesión, ni carrito, ni cliente identificado: lo único que se sabe
 * es el id de la payment collection, que es lo que autoriza a pagarla.
 */

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

function headers(): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" }
  if (process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    h["x-publishable-api-key"] = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  }
  return h
}

export interface PaymentCollectionSummary {
  id: string
  amount: number
  currency_code: string
  status: string
  paid: boolean
}

export interface PaymentCollectionRental {
  order_display_id: number | null
  vehicle: string | null
  starts_at: string | null
  ends_at: string | null
}

export async function getPaymentCollection(id: string): Promise<{
  payment_collection: PaymentCollectionSummary
  rental: PaymentCollectionRental
} | null> {
  try {
    const res = await fetch(
      `${MEDUSA_BACKEND_URL}/store/payment-collections/${id}`,
      { headers: headers(), cache: "no-store" }
    )
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.error("[PaymentLink] No se pudo leer la petición de pago:", err)
    return null
  }
}

/**
 * Abre la sesión de pago y devuelve el `client_secret` con el que cobrar.
 *
 * Se hace en el servidor y no en el navegador para no publicar la ruta de
 * creación de sesiones al cliente.
 */
export async function startPaymentCollectionSession(
  id: string
): Promise<{ ok: boolean; clientSecret?: string; error?: string }> {
  try {
    /**
     * Ruta de alquiler, no la estándar de Medusa. Es la que fuerza la captura
     * automática; con la estándar el dinero se quedaría retenido y el cobro no
     * llegaría a registrarse nunca.
     */
    const res = await fetch(
      `${MEDUSA_BACKEND_URL}/store/payment-collections/${id}/rental-payment-session`,
      {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({}),
      }
    )

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        ok: false,
        error: data?.message ?? "Could not start the payment.",
      }
    }

    const clientSecret = data?.client_secret

    if (!clientSecret) {
      return { ok: false, error: "Stripe did not return a payment secret." }
    }

    return { ok: true, clientSecret }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error"
    console.error("[PaymentLink] Error abriendo la sesión de pago:", message)
    return { ok: false, error: message }
  }
}
