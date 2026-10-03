export interface RentalConfiguration {
  id: string
  product_id: string
  min_rental_days: number
  max_rental_days: number | null
  deposit_amount: number | null
  deposit_type: "fixed" | "percentage" | "none"
  status: "active" | "inactive"
}

/** Cómo se cobra un add-on: una vez por reserva, o por cada día. */
export type RentalAddonChargeType = "once" | "per_day"

/**
 * Extra contratable, tal y como lo expone la tienda.
 *
 * No trae `stock`: el backend no lo valida todavía contra fechas, así que
 * enseñar ese número invitaría a confiar en él.
 */
export interface RentalAddon {
  code: string
  name: string
  description: string | null
  price: number
  charge_type: RentalAddonChargeType
}

/** Lo único que el cliente elige. El precio lo pone el servidor. */
export interface RentalAddonSelection {
  code: string
  quantity?: number
}

/**
 * Zona de entrega, tal y como la expone la tienda (P0-3).
 *
 * El precio se enseña para que el cliente elija; el que se cobra lo vuelve a
 * leer el backend al cotizar. De aquí solo viaja el `code`.
 */
export interface RentalDeliveryZone {
  code: string
  name: string
  description: string | null
  price: number
}

/**
 * Adónde se entrega el coche. Misma forma que valida el backend
 * (`DeliveryAddressSchema`).
 */
export interface DeliveryAddress {
  address_1: string
  address_2?: string
  city: string
  postal_code: string
  /** Indicaciones para el conductor: portal, conserje, hotel… */
  notes?: string
}

/** Una línea del desglose que devuelve el motor de precios. */
export interface RentalPriceLine {
  type: "base" | "addon" | "mileage" | "delivery" | "state_fee" | "adjustment"
  code: string
  label: string
  quantity: number
  unit_amount: number
  amount: number
  /** Impuesto de esta línea. Ausente cuando no le aplica ninguno. */
  tax_amount?: number
}

/**
 * Desglose del precio, calculado por el motor del backend.
 *
 * Es la única fuente de verdad del precio: la storefront lo pinta, no lo
 * recalcula. Cualquier cuenta que se hiciera aquí podría divergir de lo que se
 * cobra, que es justo el problema que el motor existe para evitar.
 */
export interface RentalPriceBreakdown {
  rental_days: number
  lines: RentalPriceLine[]
  subtotal: number
  tax_total: number
  total: number
  /** Todo lo que no es alquiler base: extras, fees, entrega e impuestos. */
  charges: number
  /**
   * A cobrar al reservar: pago a cuenta **más los cargos**.
   *
   * No es solo el depósito. Es la cifra que hay que enseñar como "due now",
   * porque es la que va a cobrar Stripe.
   */
  upfront: number
  /** Lo que queda para la recogida. Siempre `total - upfront`. */
  balance_due: number
}

/** One tier of the extra-mile price. Counts miles over the included ones. */
export interface RentalMileageTier {
  from: number
  /** `null` = no upper limit. Only the last tier. */
  to: number | null
  unit_amount: number
}

/**
 * Mileage terms for the car (P0-2), or `null` for unlimited miles.
 *
 * Not part of the total: extra miles are charged after the car comes back.
 * They are shown before paying because the card is kept on file to charge them.
 */
export interface RentalMileageTerms {
  label: string
  included_miles_per_day: number | null
  /** Already multiplied by the days booked. `null` = unlimited. */
  included_miles: number | null
  tiers: RentalMileageTier[]
  tax_rate: number | null
}

/** A note the operator wants every renter of a car to read (P1-5). Plain text. */
export interface GuestNote {
  id: string
  title: string | null
  body: string
}

export interface RentalAvailabilityResponse {
  available: boolean
  /**
   * True when availability could not be determined (network error, or the
   * product isn't configured as rentable in Medusa) rather than the variant
   * being affirmatively booked/unavailable for the dates. Callers that filter
   * inventory should fail open on this instead of hiding the car.
   */
  checkFailed?: boolean
  message?: string
  price?: {
    amount: number
    currency_code: string | null
  }
  deposit?: {
    amount: number
    currency_code: string | null
  } | null
  breakdown?: RentalPriceBreakdown
  mileage?: RentalMileageTerms | null
}
