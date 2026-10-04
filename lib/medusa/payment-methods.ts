"use server"

import { getAuthToken } from "./customer"

/**
 * Tarjetas guardadas del cliente (P1-6b): `/store/me/payment-methods`.
 *
 * En el servidor, con el token de la cookie, como el resto de rutas `/me`: el
 * navegador nunca ve el token. Los mensajes de error del backend se devuelven
 * tal cual porque están escritos para el cliente (p. ej. por qué no se puede
 * borrar una tarjeta).
 */

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export interface SavedPaymentMethod {
  id: string
  brand: string
  last4: string
  exp_month: number
  exp_year: number
  allow_redisplay: "always" | "limited" | "unspecified"
  /** Unix, segundos. */
  created: number
  is_default: boolean
  /** Respalda una reserva con algo pendiente de cobrar. */
  in_use: boolean
  /** Se ofrece en el checkout. */
  reusable: boolean
}

export type PaymentMethodsResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

async function call<T>(
  path: string,
  method: "GET" | "POST" | "DELETE" = "GET"
): Promise<PaymentMethodsResult<T>> {
  const token = await getAuthToken()
  if (!token) {
    return { ok: false, error: "Please sign in to manage your cards." }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  }
  if (process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] =
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  }

  let res: Response
  try {
    res = await fetch(`${MEDUSA_BACKEND_URL}${path}`, {
      method,
      headers,
      // Medusa valida el cuerpo de los POST: uno vacío es mejor que ninguno.
      body: method === "POST" ? "{}" : undefined,
      cache: "no-store",
    })
  } catch (err) {
    console.error("[PaymentMethods] Error de red:", err)
    return {
      ok: false,
      error: "We couldn't reach the server. Please try again.",
    }
  }

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>

  if (!res.ok) {
    const message =
      typeof data?.message === "string" && data.message
        ? data.message
        : "Something went wrong. Please try again."
    return { ok: false, error: message }
  }

  return { ok: true, data: data as T }
}

export async function listMyPaymentMethods(): Promise<
  PaymentMethodsResult<SavedPaymentMethod[]>
> {
  const res = await call<{ payment_methods?: SavedPaymentMethod[] }>(
    "/store/me/payment-methods"
  )
  if (!res.ok) return res
  return { ok: true, data: res.data.payment_methods ?? [] }
}

/** SetupIntent para añadir una tarjeta con el Payment Element. */
export async function createMyCardSetupIntent(): Promise<
  PaymentMethodsResult<{ clientSecret: string }>
> {
  const res = await call<{ client_secret?: string | null }>(
    "/store/me/payment-methods/setup-intent",
    "POST"
  )
  if (!res.ok) return res
  if (!res.data.client_secret) {
    return { ok: false, error: "We couldn't start adding a card. Please try again." }
  }
  return { ok: true, data: { clientSecret: res.data.client_secret } }
}

export async function setMyDefaultPaymentMethod(
  id: string
): Promise<PaymentMethodsResult<{ id: string }>> {
  return call(
    `/store/me/payment-methods/${encodeURIComponent(id)}/default`,
    "POST"
  )
}

export async function removeMyPaymentMethod(
  id: string
): Promise<PaymentMethodsResult<{ id: string }>> {
  return call(`/store/me/payment-methods/${encodeURIComponent(id)}`, "DELETE")
}
