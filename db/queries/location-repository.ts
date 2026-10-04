import { getRentalLocations } from "@/lib/medusa/rental"
import { PICKUP_LOCATION, type SearchLocation } from "@/lib/schema-types"

/**
 * Opciones del campo *Pick-up / Drop-off* del buscador, desde Medusa: primero
 * la oficina y después cada zona de entrega activa.
 */
export async function getLocations(): Promise<SearchLocation[]> {
  const { pickup, delivery_zones } = await getRentalLocations()

  const office: SearchLocation[] = pickup
    ? [
        {
          value: PICKUP_LOCATION,
          kind: "pickup",
          name: pickup.city ? `Pick up in ${pickup.city}` : pickup.name,
          detail:
            [pickup.address_1, pickup.city].filter(Boolean).join(", ") || null,
          productIds: null,
        },
      ]
    : []

  return [
    ...office,
    ...delivery_zones.map((zone) => ({
      value: zone.code,
      kind: "delivery" as const,
      name: zone.name,
      detail: zone.description,
      productIds: zone.product_ids,
    })),
  ]
}
