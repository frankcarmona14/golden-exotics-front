import type { RentalAddonSelection } from "@/lib/types/rental"

/**
 * Selección de extras como texto, para viajar en la URL y en la query de la API.
 *
 * `[{ code: "wifi", quantity: 2 }, { code: "gps" }]` -> `"wifi:2,gps"`.
 *
 * Vive fuera de `rental.ts` porque eso es un módulo `"use server"`: todo lo que
 * exporta tiene que ser una server action, y esto es una función pura que
 * necesitan también los componentes de cliente.
 *
 * La selección viaja **solo como códigos y cantidades**. Nunca precios: los
 * resuelve el backend contra su base de datos, porque un precio que llega del
 * navegador es un precio que cualquiera puede poner a 0.
 */
export function serializeAddonSelection(
  addons: RentalAddonSelection[] | undefined
): string {
  return (addons ?? [])
    .filter((addon) => (addon.quantity ?? 1) > 0)
    .map((addon) =>
      addon.quantity && addon.quantity !== 1
        ? `${addon.code}:${addon.quantity}`
        : addon.code
    )
    .join(",")
}

/** Lo contrario: `"wifi:2,gps"` -> `[{ code: "wifi", quantity: 2 }, ...]`. */
export function parseAddonSelection(
  raw: string | undefined | null
): RentalAddonSelection[] {
  if (!raw?.trim()) {
    return []
  }

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [code, quantity] = entry.split(":")
      const parsed = quantity === undefined ? 1 : Number(quantity)

      return {
        code: code.trim(),
        // Una cantidad ilegible se normaliza a 1 aquí porque esto lee una URL,
        // que el cliente puede haber tocado a mano. El backend vuelve a validar
        // la selección de todas formas.
        quantity: Number.isInteger(parsed) && parsed > 0 ? parsed : 1,
      }
    })
}
