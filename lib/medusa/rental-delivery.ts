"use server"

import { cookies } from "next/headers"

import type { DeliveryAddress } from "@/lib/types/rental"

import {
  validateDeliveryAddress,
  validateDeliveryRequest,
  type DeliveryRequest,
} from "./delivery"

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

async function writeDeliveryCookie(value: DeliveryRequest): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(DELIVERY_ADDRESS_COOKIE, JSON.stringify(value), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: DELIVERY_ADDRESS_COOKIE_MAX_AGE,
    path: "/",
  })
}

export async function saveDeliveryAddress(
  input: Partial<DeliveryAddress>
): Promise<{ ok: boolean; error?: string }> {
  const result = validateDeliveryAddress(input)

  if (!result.ok) {
    return { ok: false, error: result.error }
  }

  await writeDeliveryCookie({ address: result.address })
  return { ok: true }
}

/** Dirección, descripción, o las dos. La usa "Need delivery?". */
export async function saveDeliveryRequest(
  input: { address?: Partial<DeliveryAddress> | null; description?: string | null }
): Promise<{ ok: boolean; error?: string }> {
  const result = validateDeliveryRequest(input)

  if (!result.ok) {
    return { ok: false, error: result.error }
  }

  await writeDeliveryCookie(result.request)
  return { ok: true }
}

export async function getDeliveryRequest(): Promise<DeliveryRequest | null> {
  try {
    const cookieStore = await cookies()
    const raw = cookieStore.get(DELIVERY_ADDRESS_COOKIE)?.value

    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>

    // Cookies de antes de P1-11 guardaban la dirección plana.
    if (typeof parsed.address_1 === "string") {
      const address = validateDeliveryAddress(parsed as Partial<DeliveryAddress>)
      return address.ok ? { address: address.address } : null
    }

    const request = validateDeliveryRequest({
      address: parsed.address as Partial<DeliveryAddress> | undefined,
      description: typeof parsed.description === "string" ? parsed.description : undefined,
    })
    return request.ok ? request.request : null
  } catch {
    return null
  }
}

export async function getDeliveryAddress(): Promise<DeliveryAddress | null> {
  const saved = await getDeliveryRequest()
  return saved?.address ?? null
}

export async function clearDeliveryAddress(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(DELIVERY_ADDRESS_COOKIE)
  } catch {
    /* Un Server Component no puede escribir cookies; caduca sola. */
  }
}
