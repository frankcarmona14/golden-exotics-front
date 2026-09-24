"use server"

import { cookies } from "next/headers"

import type { DeliveryAddress } from "@/lib/types/rental"

import { validateDeliveryAddress } from "./delivery"

/**
 * Dirección de entrega entre el paso de extras y el checkout (P0-3).
 *
 * La zona viaja en la URL (`delivery=miami`), igual que los extras, porque no
 * es un dato personal. La dirección **no**: en la URL acabaría en el historial
 * del navegador, en los logs y en la analítica. Va en una cookie httpOnly, como
 * el carrito en curso (`rental-cart.ts`), y la lee el servidor al preparar el
 * checkout.
 *
 * Dura lo bastante para rellenar el pago con calma. Si caduca, el checkout
 * devuelve al paso de extras en vez de reservar una entrega sin dirección.
 */
const DELIVERY_ADDRESS_COOKIE = "_ge_rental_delivery"
const DELIVERY_ADDRESS_COOKIE_MAX_AGE = 2 * 60 * 60

export async function saveDeliveryAddress(
  input: Partial<DeliveryAddress>
): Promise<{ ok: boolean; error?: string }> {
  const result = validateDeliveryAddress(input)

  if (!result.ok) {
    return { ok: false, error: result.error }
  }

  const cookieStore = await cookies()
  cookieStore.set(DELIVERY_ADDRESS_COOKIE, JSON.stringify(result.address), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: DELIVERY_ADDRESS_COOKIE_MAX_AGE,
    path: "/",
  })

  return { ok: true }
}

export async function getDeliveryAddress(): Promise<DeliveryAddress | null> {
  try {
    const cookieStore = await cookies()
    const raw = cookieStore.get(DELIVERY_ADDRESS_COOKIE)?.value

    if (!raw) {
      return null
    }

    // Se revalida al leer: la cookie la escribimos nosotros, pero la guarda el
    // navegador.
    const result = validateDeliveryAddress(JSON.parse(raw))
    return result.ok ? result.address : null
  } catch {
    return null
  }
}

export async function clearDeliveryAddress(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(DELIVERY_ADDRESS_COOKIE)
  } catch {
    /* Un Server Component no puede escribir cookies; caduca sola. */
  }
}
