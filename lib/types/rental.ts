export interface RentalConfiguration {
  id: string
  product_id: string
  min_rental_days: number
  max_rental_days: number | null
  deposit_amount: number | null
  deposit_type: "fixed" | "percentage" | "none"
  status: "active" | "inactive"
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
}
