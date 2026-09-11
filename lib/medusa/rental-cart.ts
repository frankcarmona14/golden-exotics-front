"use server"

import { cookies } from "next/headers"

/**
 * Carrito de alquiler en curso (F0-10).
 *
 * El backend exime al carrito que pregunta de sus propias retenciones
 * (`cart_id` en `rental-availability` y `rental-dates`), pero para eso hay que
 * saber qué carrito es. La storefront crea el carrito al entrar en la pantalla
 * de pago, así que sin recordarlo entre peticiones el cliente vuelve atrás,
 * recotiza y se encuentra su propio coche "no disponible".
 *
 * Vive lo mismo que el hold que representa: 30 minutos. Si caduca antes de
 * tiempo, lo único que se pierde es la exención — nunca una reserva.
 */
const RENTAL_CART_COOKIE = "_ge_rental_cart"
const RENTAL_CART_COOKIE_MAX_AGE = 30 * 60

export async function getRentalCartId(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get(RENTAL_CART_COOKIE)?.value ?? null
  } catch {
    return null
  }
}

export async function setRentalCartId(cartId: string): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.set(RENTAL_CART_COOKIE, cartId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: RENTAL_CART_COOKIE_MAX_AGE,
      path: "/",
    })
  } catch {
    /**
     * Un Server Component no puede escribir cookies. Recordar el carrito es una
     * mejora de la experiencia, no una condición para reservar: si no se puede
     * guardar, el cliente sigue pudiendo pagar.
     */
  }
}

export async function clearRentalCartId(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(RENTAL_CART_COOKIE)
  } catch {
    /* Ver setRentalCartId. */
  }
}
