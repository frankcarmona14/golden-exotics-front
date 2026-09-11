/**
 * Traduce los errores del add-to-cart de alquiler a algo que un cliente pueda
 * leer (F0-10).
 *
 * El backend habla en identificadores porque su interlocutor es un operador con
 * los logs delante: "Variant variant_01J... is already rented or held during
 * the requested period (2026-03-04T10:00:00.000Z to ...)". Enseñar eso en la
 * pantalla de pago no informa, asusta.
 *
 * Se empareja por texto y no por código porque `MedusaError` viaja como
 * `INVALID_DATA` / `NOT_ALLOWED` para media docena de causas distintas: el
 * código no distingue "fechas pisadas" de "faltan metadatos". Lo que no se
 * reconoce se devuelve tal cual, que es peor copy pero nunca información falsa.
 */
const RENTAL_ERROR_COPY: { match: RegExp; message: string }[] = [
  {
    // El caso que de verdad ve un cliente: otro carrito se le adelantó.
    match: /already rented or held during the requested period/i,
    message:
      "Someone just took these dates. Pick another date range, or try again in a few minutes in case their cart is abandoned.",
  },
  {
    match: /already in the cart with overlapping dates/i,
    message: "This car is already in your reservation for those dates.",
  },
  {
    match: /minimum rental (period|days)|min_rental_days/i,
    message: "Your dates are shorter than the minimum rental for this car.",
  },
  {
    match: /maximum rental (period|days)|max_rental_days/i,
    message: "Your dates are longer than the maximum rental for this car.",
  },
  {
    match: /is not rentable/i,
    message: "This car is not available for rental right now.",
  },
  {
    match: /requires rental_start_date|must have a quantity of 1/i,
    // Un fallo nuestro, no del cliente: no le pedimos que arregle nada.
    message:
      "We could not put this reservation together. Please try again, or contact us if it keeps happening.",
  },
]

export function translateRentalError(
  error: string | undefined,
  fallback = "Something went wrong. Please try again."
): string {
  if (!error) return fallback

  const copy = RENTAL_ERROR_COPY.find((entry) => entry.match.test(error))
  return copy ? copy.message : error
}
