import type { DeliveryAddress } from "@/lib/types/rental"

/**
 * Normaliza y valida una dirección de entrega (P0-3).
 *
 * Vive fuera de los módulos `"use server"` por lo mismo que `addons.ts`: la
 * usan el formulario, para avisar antes de enviar, y la server action que la
 * guarda, que no se fía del navegador. El backend la valida una tercera vez al
 * añadir al carrito, y esa es la que manda.
 *
 * Devuelve la dirección limpia, o el motivo por el que no vale.
 */
export function validateDeliveryAddress(
  input: Partial<DeliveryAddress> | null | undefined
): { ok: true; address: DeliveryAddress } | { ok: false; error: string } {
  const trim = (value: unknown) =>
    typeof value === "string" ? value.trim() : ""

  const address_1 = trim(input?.address_1)
  const address_2 = trim(input?.address_2)
  const city = trim(input?.city)
  const postal_code = trim(input?.postal_code)
  const notes = trim(input?.notes)

  if (!address_1 || !city || !postal_code) {
    return {
      ok: false,
      error: "Enter the street address, city and ZIP code for the delivery.",
    }
  }

  // Mismos topes que el backend: mejor avisar aquí que ver fallar el pago.
  if (
    address_1.length > 255 ||
    address_2.length > 255 ||
    city.length > 120 ||
    postal_code.length > 20 ||
    notes.length > 500
  ) {
    return { ok: false, error: "One of the address fields is too long." }
  }

  return {
    ok: true,
    address: {
      address_1,
      ...(address_2 ? { address_2 } : {}),
      city,
      postal_code,
      ...(notes ? { notes } : {}),
    },
  }
}
