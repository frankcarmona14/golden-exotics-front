"use server"

import { getCustomer, getAuthToken } from "./customer"
import {
  clearRentalCartId,
  getRentalCartId,
  setRentalCartId,
} from "./rental-cart"
import { serializeAddonSelection } from "./addons"
import { clearDeliveryAddress, getDeliveryAddress } from "./rental-delivery"
import { translateRentalError } from "./rental-errors"
import { getMedusaDefaultRegion } from "./store"
import type {
  DeliveryAddress,
  RentalAddon,
  RentalAddonSelection,
  RentalAvailabilityResponse,
  RentalDeliveryZone,
} from "@/lib/types/rental"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

/**
 * State the cars are picked up from, as the ISO province code Medusa matches
 * tax regions on.
 *
 * A car rental is taxed where the car is handed over, not where the renter
 * lives, and there is a single pickup location (see "Decisiones cerradas" in
 * the backlog) -- so this is a property of the business, not of the customer.
 * The day a second pickup point opens, this stops being one value.
 */
const PICKUP_PROVINCE = (process.env.PICKUP_PROVINCE || "fl").toLowerCase()

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function medusaHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] =
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  }
  if (token) {
    headers.authorization = `Bearer ${token}`
  }
  return headers
}

async function medusaFetch<T = Record<string, unknown>>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<{ ok: boolean; status: number; data: T; error?: string }> {
  const headers = await medusaHeaders()
  let res: Response
  try {
    res = await fetch(`${MEDUSA_BACKEND_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
  } catch (fetchErr) {
    const msg = fetchErr instanceof Error ? fetchErr.message : "Network error"
    console.error(`[medusaFetch] Network error on ${options.method ?? "GET"} ${path}:`, msg)
    return {
      ok: false,
      status: 0,
      data: {} as T,
      error: `Could not connect to Medusa backend: ${msg}`,
    }
  }
  const data = await res.json().catch(() => ({}) as T)
  if (!res.ok) {
    const rawMsg = (data as Record<string, unknown>).message as string | undefined
    const detailMsg = (data as Record<string, unknown>).detail as string | undefined
    const errorMsg = rawMsg || detailMsg || `Error ${res.status}: ${res.statusText}`
    console.error(`[medusaFetch] ${res.status} on ${options.method ?? "GET"} ${path}:`, errorMsg)
    return {
      ok: false,
      status: res.status,
      data,
      error: errorMsg,
    }
  }
  return { ok: true, status: res.status, data }
}

/**
 * Suelta las retenciones del carrito de alquiler anterior (F0-10).
 *
 * Cada visita a la pantalla de pago abre un carrito nuevo. El anterior se queda
 * con el coche retenido hasta que caduca, y como `ignore_cart_id` solo exime al
 * carrito que pregunta, el cliente que vuelve atrás a cambiar la hora se choca
 * con su propia reserva de hace un minuto.
 *
 * No es crítico: si la llamada falla, el hold caduca solo en 30 minutos. Por eso
 * no aborta el checkout.
 */
async function abandonPreviousRentalCart(): Promise<void> {
  const previousCartId = await getRentalCartId()
  if (!previousCartId) return

  const res = await medusaFetch(
    `/store/carts/${previousCartId}/rental-holds`,
    { method: "DELETE" }
  )
  if (!res.ok) {
    console.warn(
      "[Rental] Could not release holds of the previous cart",
      previousCartId,
      res.error
    )
  }
}

// ---------------------------------------------------------------------------
// Rental add-ons
// ---------------------------------------------------------------------------

/**
 * Extras que se pueden contratar con este coche.
 *
 * Devuelve lista vacía si falla: un extra que no se puede ofrecer no debe
 * impedir reservar el coche, que es lo que el cliente vino a hacer.
 */
export async function getRentalAddons(
  productId: string
): Promise<RentalAddon[]> {
  const { ok, data } = await medusaFetch<{ rental_addons: RentalAddon[] }>(
    `/store/products/${productId}/rental-addons`
  )

  if (!ok) {
    console.warn("[Rental] Could not load add-ons for", productId)
    return []
  }

  return data.rental_addons ?? []
}

/**
 * Zonas a las que se puede entregar este coche (P0-3).
 *
 * Lista vacía si falla, por lo mismo que los extras: sin entrega el cliente
 * todavía puede recoger el coche en la oficina.
 */
export async function getDeliveryZones(
  productId: string
): Promise<RentalDeliveryZone[]> {
  const { ok, data } = await medusaFetch<{
    delivery_zones: RentalDeliveryZone[]
  }>(`/store/products/${productId}/delivery-zones`)

  if (!ok) {
    console.warn("[Rental] Could not load delivery zones for", productId)
    return []
  }

  return data.delivery_zones ?? []
}

// ---------------------------------------------------------------------------
// Rental availability
// ---------------------------------------------------------------------------

export async function getRentalAvailability({
  productId,
  variantId,
  startDate,
  endDate,
  startTime,
  endTime,
  currencyCode,
  cartId,
  addons,
  deliveryZone,
}: {
  productId: string
  variantId: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  currencyCode?: string
  /** Por defecto, el carrito de alquiler en curso. Ver `rental-cart.ts`. */
  cartId?: string
  /** Solo códigos y cantidades: el precio lo resuelve el servidor. */
  addons?: RentalAddonSelection[]
  /** Código de la zona de entrega. Ausente = recogida en la oficina. */
  deliveryZone?: string | null
}): Promise<RentalAvailabilityResponse> {
  const params = new URLSearchParams({
    variant_id: variantId,
    start_date: startDate,
    end_date: endDate,
    start_time: startTime,
    end_time: endTime,
  })
  if (currencyCode) params.set("currency_code", currencyCode)

  const addonsParam = serializeAddonSelection(addons)
  if (addonsParam) params.set("addons", addonsParam)
  if (deliveryZone) params.set("delivery_zone", deliveryZone)

  // Sin esto, el cliente que ya tiene el coche retenido se ve a sí mismo como
  // "no disponible" en cuanto recotiza (F0-10).
  const askingCartId = cartId ?? (await getRentalCartId())
  if (askingCartId) params.set("cart_id", askingCartId)

  const { ok, data } = await medusaFetch<RentalAvailabilityResponse>(
    `/store/products/${productId}/rental-availability?${params}`
  )

  if (!ok) {
    return {
      available: false,
      checkFailed: true,
      message: (data as unknown as Record<string, unknown>).message as string ?? "Error checking availability",
    }
  }
  return data
}

// ---------------------------------------------------------------------------
// Order rental details (for confirmation page)
// ---------------------------------------------------------------------------

export interface OrderRentalDetails {
  id: string
  variant_id: string
  customer_id: string
  order_id: string
  rental_start_date: string
  rental_end_date: string
  rental_days: number
  status: string
  product_variant?: {
    id: string
    title: string
    product?: {
      id: string
      title: string
      thumbnail: string | null
    }
  }
}

export async function getOrderRentals(
  orderId: string
): Promise<OrderRentalDetails[]> {
  const { ok, data } = await medusaFetch<{ rentals: OrderRentalDetails[] }>(
    `/store/orders/${orderId}/rentals`
  )
  if (!ok) return []
  return data.rentals ?? []
}

// ---------------------------------------------------------------------------
// Booked dates for a variant (to show blocked days in calendar)
// ---------------------------------------------------------------------------

export interface BookedRange {
  start_date: string
  end_date: string
  status: string
}

export async function getRentalBookedDates({
  productId,
  variantId,
  month,
  cartId,
}: {
  productId: string
  variantId: string
  month?: string // YYYY-MM
  /** Por defecto, el carrito de alquiler en curso. Ver `rental-cart.ts`. */
  cartId?: string
}): Promise<BookedRange[]> {
  const params = new URLSearchParams({ variant_id: variantId })
  if (month) params.set("month", month)

  // El calendario no debe pintar en gris las fechas que este mismo cliente
  // tiene retenidas: serían casillas que no puede volver a elegir (F0-10).
  const askingCartId = cartId ?? (await getRentalCartId())
  if (askingCartId) params.set("cart_id", askingCartId)

  const { ok, data } = await medusaFetch<{ booked_ranges: BookedRange[] }>(
    `/store/products/${productId}/rental-dates?${params}`
  )

  if (!ok) return []
  return data.booked_ranges ?? []
}

// ---------------------------------------------------------------------------
// Create rental (cart-based flow from Medusa Product Rentals tutorial)
//
// 1. Create a cart
// 2. Add rental line-item via POST /store/carts/:id/line-items/rentals
// 3. Initialize payment session
// 4. Complete the cart via POST /store/rentals/:cart_id
// ---------------------------------------------------------------------------

export interface CreateRentalInput {
  product_id: string
  variant_id: string
  start_date: string
  end_date: string
  /** When date + time are used, pass pre-calculated days so backend receives correct count */
  rental_days?: number
  start_time?: string
  end_time?: string
  /**
   * Extras elegidos, solo código y cantidad.
   *
   * El precio NUNCA viaja desde aquí: lo resuelve el backend contra su base de
   * datos. Si lo mandásemos, cualquiera podría ponerse una sillita a 0 $.
   */
  addons?: RentalAddonSelection[]
  /**
   * Zona de entrega (P0-3). Solo el código: la dirección la pone el servidor
   * desde su cookie (`rental-delivery.ts`), así que nunca pasa por aquí.
   */
  delivery_zone?: string | null
}

/**
 * La entrega que va al carrito, o nada si se recoge en la oficina.
 *
 * Con zona y sin dirección se para aquí en vez de mandar la zona sola: el
 * backend la rechazaría igual, pero con un mensaje pensado para la API y
 * después de haber creado el carrito.
 */
async function resolveCartDelivery(
  zoneCode: string | null | undefined
): Promise<
  | { ok: true; delivery?: { zone_code: string; address: DeliveryAddress } }
  | { ok: false; error: string }
> {
  if (!zoneCode) {
    return { ok: true }
  }

  const address = await getDeliveryAddress()

  if (!address) {
    return {
      ok: false,
      error:
        "We need your delivery address again. Go back to the previous step and enter it.",
    }
  }

  return { ok: true, delivery: { zone_code: zoneCode, address } }
}

export interface GuestInfo {
  email: string
  first_name: string
  last_name: string
  phone?: string
}

/** Name and phone of whoever is renting, guest or logged-in customer alike. */
type CartContact = {
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
}

/**
 * Build the body for `POST /store/carts` for either a logged-in customer or
 * a guest.
 *
 * The address goes on **every** cart, not just guest ones. Two reasons:
 *
 * 1. Medusa resolves tax from `shipping_address.country_code`
 *    (`getItemTaxLinesStep` returns no tax lines at all without it) and it
 *    fails silently -- the order just comes out with zero tax. A logged-in
 *    customer used to hit exactly that.
 * 2. The address fields are what show up under the order details in admin.
 *    A guest customer is auto-created with the email only, and a logged-in
 *    customer's profile name never reached the order either.
 */
function buildCreateCartBody({
  regionId,
  countryCode,
  email,
  guest,
  customer,
}: {
  regionId: string
  countryCode: string | null
  email: string
  /** Set only when there is NO logged-in customer. */
  guest?: GuestInfo
  customer?: CartContact | null
}): Record<string, unknown> {
  const body: Record<string, unknown> = {
    region_id: regionId,
    email,
  }

  if (guest) {
    // Keep a copy in metadata for any backend subscriber/workflow that wants
    // to propagate the name/phone onto the auto-created guest customer record.
    body.metadata = {
      guest_first_name: guest.first_name,
      guest_last_name: guest.last_name,
      ...(guest.phone ? { guest_phone: guest.phone } : {}),
    }
  }

  // Medusa v2 requires country_code on an address; every other field is
  // optional, so we attach the name/phone we have and rely on the region's
  // default country.
  //
  // `province` is what makes a state-level tax region match (Medusa looks up
  // regions by country_code + province_code). It is the pickup state, not the
  // renter's -- only meaningful in the US, so it is left off anywhere else.
  if (countryCode) {
    const contact: CartContact = guest ?? customer ?? {}
    const address = {
      ...(contact.first_name ? { first_name: contact.first_name } : {}),
      ...(contact.last_name ? { last_name: contact.last_name } : {}),
      ...(contact.phone ? { phone: contact.phone } : {}),
      country_code: countryCode,
      ...(countryCode === "us" ? { province: PICKUP_PROVINCE } : {}),
    }
    body.billing_address = address
    body.shipping_address = address
  }

  return body
}

export interface CreateRentalResult {
  ok: boolean
  status: number
  data: Record<string, unknown>
  error?: string
}

/** Result of preparing checkout: cart created, payment session initialized. */
export interface PrepareRentalCheckoutResult {
  ok: boolean
  cartId?: string
  clientSecret?: string
  /** La tarjeta de este pago queda guardada para cobrar el balance (F0-7). */
  cardWillBeSaved?: boolean
  /**
   * Aviso que hay que enseñar cuando la tarjeta se guarda. Cobrar más tarde sin
   * haberlo advertido es motivo de disputa, y la gana el cliente.
   */
  disclosure?: string | null
  paymentProviderId?: string
  error?: string
}

/** Result of completing the rental cart (after payment confirmed). */
export interface CompleteRentalCartResult {
  ok: boolean
  order?: Record<string, unknown>
  error?: string
}

export async function createRental(
  input: CreateRentalInput,
  guest?: GuestInfo
): Promise<CreateRentalResult> {
  const customer = await getCustomer()
  const email = customer?.email ?? guest?.email
  if (!email) {
    return {
      ok: false,
      status: 400,
      data: {},
      error: "You must be logged in or provide guest details to make a reservation.",
    }
  }

  const region = await getMedusaDefaultRegion()
  if (!region) {
    return {
      ok: false,
      status: 500,
      data: {},
      error: "Could not determine region. Please try again.",
    }
  }

  const startDate = new Date(input.start_date)
  const endDate = new Date(input.end_date)
  let rentalDays: number
  if (input.rental_days != null && input.rental_days > 0) {
    rentalDays = input.rental_days
  } else if (
    input.start_time != null &&
    input.end_time != null &&
    /^\d{1,2}:\d{2}$/.test(input.start_time) &&
    /^\d{1,2}:\d{2}$/.test(input.end_time)
  ) {
    const [sh, sm] = input.start_time.split(":").map(Number)
    const [eh, em] = input.end_time.split(":").map(Number)
    const startDt = new Date(startDate)
    startDt.setHours(sh, sm ?? 0, 0, 0)
    const endDt = new Date(endDate)
    endDt.setHours(eh, em ?? 0, 0, 0)
    const ms = endDt.getTime() - startDt.getTime()
    rentalDays = ms <= 0 ? 1 : Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)))
  } else {
    const diffDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    rentalDays = Math.max(1, diffDays)
  }

  const cartDelivery = await resolveCartDelivery(input.delivery_zone)
  if (!cartDelivery.ok) {
    return { ok: false, status: 400, data: {}, error: cartDelivery.error }
  }

  try {
    // ---------------------------------------------------------------
    // Step 1: Create cart with customer email
    // ---------------------------------------------------------------
    console.log("[Rental] Step 1: Creating cart…")
    await abandonPreviousRentalCart()
    const cartRes = await medusaFetch<{ cart: Record<string, unknown> }>(
      "/store/carts",
      {
        method: "POST",
        body: buildCreateCartBody({
          regionId: region.id,
          countryCode: region.country_code,
          email,
          guest: guest && !customer ? guest : undefined,
          customer,
        }),
      }
    )
    if (!cartRes.ok) {
      console.error("[Rental] Failed to create cart:", cartRes.error)
      return { ...cartRes, data: cartRes.data as Record<string, unknown> }
    }
    const cartId = cartRes.data.cart?.id as string
    console.log("[Rental] Cart created:", cartId)
    await setRentalCartId(cartId)

    // ---------------------------------------------------------------
    // Step 2: Add rental line item
    // ---------------------------------------------------------------
    console.log("[Rental] Step 2: Adding rental item to cart…")
    const addItemRes = await medusaFetch<{ cart: Record<string, unknown> }>(
      `/store/carts/${cartId}/line-items/rentals`,
      {
        method: "POST",
        body: {
          variant_id: input.variant_id,
          quantity: 1,
          metadata: {
            rental_start_date: `${input.start_date}T${input.start_time || "10:00"}:00`,
            rental_end_date: `${input.end_date}T${input.end_time || "10:00"}:00`,
            rental_days: rentalDays,
          },
          ...(input.addons?.length ? { addons: input.addons } : {}),
          ...(cartDelivery.delivery ? { delivery: cartDelivery.delivery } : {}),
        },
      }
    )
    if (!addItemRes.ok) {
      console.error("[Rental] Failed to add item:", addItemRes.error)
      return {
        ...addItemRes,
        data: addItemRes.data as Record<string, unknown>,
        error: translateRentalError(addItemRes.error),
      }
    }
    console.log("[Rental] Item added to cart")

    // ---------------------------------------------------------------
    // Step 2b: Select a shipping option for the cart
    //
    // The Medusa Storefront checkout sets a shipping method before
    // payment. We auto-select the first available option.
    // ---------------------------------------------------------------
    console.log("[Rental] Step 2b: Setting shipping option…")
    const shippingOptsRes = await medusaFetch<{
      shipping_options: { id: string; name: string; amount: number }[]
    }>(`/store/shipping-options?cart_id=${cartId}`)

    if (shippingOptsRes.ok && shippingOptsRes.data.shipping_options?.length) {
      const option = shippingOptsRes.data.shipping_options[0]
      console.log("[Rental] Using shipping option:", option.id, option.name)

      const addShippingRes = await medusaFetch(
        `/store/carts/${cartId}/shipping-methods`,
        {
          method: "POST",
          body: { option_id: option.id },
        }
      )
      if (!addShippingRes.ok) {
        console.warn("[Rental] Could not set shipping method:", addShippingRes.error)
      } else {
        console.log("[Rental] Shipping method set")
      }
    } else {
      console.log("[Rental] No shipping options available — skipping")
    }

    // ---------------------------------------------------------------
    // Step 3: Initialize payment (following the Medusa Storefront pattern)
    //
    // The JS SDK's initiatePaymentSession does two things:
    //   a) If cart has no payment_collection → POST /store/payment-collections
    //   b) POST /store/payment-collections/:id/payment-sessions
    // We replicate that flow with raw fetch here.
    // ---------------------------------------------------------------
    console.log("[Rental] Step 3: Initializing payment…")

    // 3a. Retrieve the cart with payment_collection expanded
    const freshCartRes = await medusaFetch<{
      cart: {
        id: string
        total?: number
        payment_collection?: {
          id: string
          payment_sessions?: { id: string; provider_id: string }[]
        }
      }
    }>(`/store/carts/${cartId}?fields=+payment_collection.id,+payment_collection.payment_sessions.id,+payment_collection.payment_sessions.provider_id`)

    if (!freshCartRes.ok) {
      console.error("[Rental] Failed to fetch cart:", freshCartRes.error)
      return {
        ...freshCartRes,
        data: freshCartRes.data as Record<string, unknown>,
      }
    }

    let paymentCollectionId =
      freshCartRes.data.cart?.payment_collection?.id

    // 3b. If no payment collection exists, create one (like the JS SDK does)
    if (!paymentCollectionId) {
      console.log("[Rental] No payment collection on cart — creating one…")
      const createPcRes = await medusaFetch<{
        payment_collection: { id: string }
      }>("/store/payment-collections", {
        method: "POST",
        body: { cart_id: cartId },
      })

      if (!createPcRes.ok) {
        console.error(
          "[Rental] Failed to create payment collection:",
          createPcRes.error
        )
        return {
          ok: false,
          status: createPcRes.status,
          data: createPcRes.data as Record<string, unknown>,
          error:
            "Could not create payment collection. Make sure the region has a payment provider configured in Medusa Admin.",
        }
      }
      paymentCollectionId = createPcRes.data.payment_collection?.id
      console.log("[Rental] Payment collection created:", paymentCollectionId)
    }

    if (!paymentCollectionId) {
      return {
        ok: false,
        status: 400,
        data: {},
        error:
          "Payment collection could not be created. Check region configuration in Medusa Admin.",
      }
    }

    // Adjust payment collection to deposit amount if applicable
    const depositAdjustRes = await medusaFetch<{ adjusted: boolean }>(
      `/store/carts/${cartId}/deposit-payment`,
      { method: "POST" }
    )
    if (depositAdjustRes.ok && depositAdjustRes.data.adjusted) {
      console.log("[Rental] Payment collection adjusted to deposit amount")
    }

    // 3c. Discover available payment providers for the region
    const providersRes = await medusaFetch<{
      payment_providers: { id: string; is_enabled: boolean }[]
    }>(`/store/payment-providers?region_id=${region.id}`)

    let providerId = "pp_system_default"
    if (providersRes.ok && providersRes.data.payment_providers?.length) {
      providerId = providersRes.data.payment_providers[0].id
      console.log("[Rental] Using payment provider:", providerId)
    } else {
      console.log("[Rental] No providers found, falling back to pp_system_default")
    }

    // 3d. Create a payment session with the chosen provider
    const paySessionRes = await medusaFetch(
      `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
      {
        method: "POST",
        body: { provider_id: providerId },
      }
    )
    if (!paySessionRes.ok) {
      console.error(
        "[Rental] Failed to init payment session with",
        providerId,
        ":",
        paySessionRes.error
      )
      // Fallback: try pp_system_default if the discovered provider failed
      if (providerId !== "pp_system_default") {
        console.log("[Rental] Retrying with pp_system_default…")
        const fallbackRes = await medusaFetch(
          `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
          { method: "POST", body: { provider_id: "pp_system_default" } }
        )
        if (!fallbackRes.ok) {
          console.error("[Rental] Fallback also failed:", fallbackRes.error)
          return {
            ...fallbackRes,
            data: fallbackRes.data as Record<string, unknown>,
          }
        }
      } else {
        return {
          ...paySessionRes,
          data: paySessionRes.data as Record<string, unknown>,
        }
      }
    }
    console.log("[Rental] Payment session initialized")

    // ---------------------------------------------------------------
    // Step 4: Complete cart → create order + rental records
    // ---------------------------------------------------------------
    console.log("[Rental] Step 4: Completing cart…")
    const completeRes = await medusaFetch<{
      order: Record<string, unknown>
    }>(`/store/rentals/${cartId}`, { method: "POST" })

    if (!completeRes.ok) {
      console.error("[Rental] Failed to complete cart:", completeRes.error)
      return {
        ...completeRes,
        data: completeRes.data as Record<string, unknown>,
      }
    }

    console.log("[Rental] Rental created successfully!")
    return {
      ok: true,
      status: completeRes.status,
      data: completeRes.data as Record<string, unknown>,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error"
    console.error("[Rental] Error:", message)
    return { ok: false, status: 0, data: {}, error: message }
  }
}

// ---------------------------------------------------------------------------
// Prepare rental checkout (cart + payment session, no complete)
// Used when the storefront needs to collect payment (e.g. Stripe) before
// completing. Prefers Stripe provider when available.
// ---------------------------------------------------------------------------

export async function prepareRentalCheckout(
  input: CreateRentalInput,
  guest?: GuestInfo
): Promise<PrepareRentalCheckoutResult> {
  const customer = await getCustomer()
  const email = customer?.email ?? guest?.email
  if (!email) {
    return {
      ok: false,
      error: "You must be logged in or provide guest details to make a reservation.",
    }
  }

  const region = await getMedusaDefaultRegion()
  if (!region) {
    return { ok: false, error: "Could not determine region. Please try again." }
  }

  const startDate = new Date(input.start_date)
  const endDate = new Date(input.end_date)
  let rentalDays: number
  if (input.rental_days != null && input.rental_days > 0) {
    rentalDays = input.rental_days
  } else if (
    input.start_time != null &&
    input.end_time != null &&
    /^\d{1,2}:\d{2}$/.test(input.start_time) &&
    /^\d{1,2}:\d{2}$/.test(input.end_time)
  ) {
    const [sh, sm] = input.start_time.split(":").map(Number)
    const [eh, em] = input.end_time.split(":").map(Number)
    const startDt = new Date(startDate)
    startDt.setHours(sh, sm ?? 0, 0, 0)
    const endDt = new Date(endDate)
    endDt.setHours(eh, em ?? 0, 0, 0)
    const ms = endDt.getTime() - startDt.getTime()
    rentalDays =
      ms <= 0 ? 1 : Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)))
  } else {
    const diffDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    rentalDays = Math.max(1, diffDays)
  }

  const cartDelivery = await resolveCartDelivery(input.delivery_zone)
  if (!cartDelivery.ok) {
    return { ok: false, error: cartDelivery.error }
  }

  try {
    await abandonPreviousRentalCart()
    const cartRes = await medusaFetch<{ cart: { id: string } }>("/store/carts", {
      method: "POST",
      body: buildCreateCartBody({
        regionId: region.id,
        countryCode: region.country_code,
        email,
        guest: guest && !customer ? guest : undefined,
        customer,
      }),
    })
    if (!cartRes.ok) {
      return {
        ok: false,
        error: cartRes.error ?? "Failed to create cart",
      }
    }
    const cartId = cartRes.data.cart?.id
    if (!cartId) return { ok: false, error: "Cart ID missing" }
    await setRentalCartId(cartId)

    const addItemRes = await medusaFetch<{ cart: Record<string, unknown> }>(
      `/store/carts/${cartId}/line-items/rentals`,
      {
        method: "POST",
        body: {
          variant_id: input.variant_id,
          quantity: 1,
          metadata: {
            rental_start_date: `${input.start_date}T${input.start_time || "10:00"}:00`,
            rental_end_date: `${input.end_date}T${input.end_time || "10:00"}:00`,
            rental_days: rentalDays,
          },
          ...(input.addons?.length ? { addons: input.addons } : {}),
          ...(cartDelivery.delivery ? { delivery: cartDelivery.delivery } : {}),
        },
      }
    )
    if (!addItemRes.ok) {
      return {
        ok: false,
        error: translateRentalError(
          addItemRes.error,
          "Failed to add rental item to cart"
        ),
      }
    }

    const shippingOptsRes = await medusaFetch<{
      shipping_options: { id: string }[]
    }>(`/store/shipping-options?cart_id=${cartId}`)
    if (shippingOptsRes.ok && shippingOptsRes.data.shipping_options?.length) {
      const option = shippingOptsRes.data.shipping_options[0]
      await medusaFetch(`/store/carts/${cartId}/shipping-methods`, {
        method: "POST",
        body: { option_id: option.id },
      })
    }

    // ---------- Payment: REST-only via medusaFetch (no SDK) so we see the real Medusa response.
    const freshCartRes = await medusaFetch<{
      cart: {
        id: string
        payment_collection?: { id: string; payment_sessions?: { id: string; provider_id: string }[] }
      }
    }>(`/store/carts/${cartId}?fields=+payment_collection.id,+payment_collection.payment_sessions.id,+payment_collection.payment_sessions.provider_id`)

    if (!freshCartRes.ok) {
      return { ok: false, error: freshCartRes.error ?? "Could not retrieve the cart." }
    }

    let paymentCollectionId = freshCartRes.data.cart?.payment_collection?.id
    if (!paymentCollectionId) {
      const createPcRes = await medusaFetch<{ payment_collection: { id: string } }>(
        "/store/payment-collections",
        { method: "POST", body: { cart_id: cartId } }
      )
      if (!createPcRes.ok) {
        return {
          ok: false,
          error: createPcRes.error ?? "Could not create the payment collection. Check the region in Medusa Admin.",
        }
      }
      paymentCollectionId = createPcRes.data.payment_collection?.id
    }

    // If this cart has a deposit, adjust payment collection to deposit amount
    const depositRes = await medusaFetch<{ adjusted: boolean }>(
      `/store/carts/${cartId}/deposit-payment`,
      { method: "POST" }
    )
    if (depositRes.ok && depositRes.data.adjusted) {
      console.log("[Rental] Payment collection adjusted to deposit amount")
    }

    const providersRes = await medusaFetch<{
      payment_providers: { id: string; is_enabled?: boolean }[]
    }>(`/store/payment-providers?region_id=${region.id}`)

    console.log("[Rental] Payment providers (API REST):", JSON.stringify(providersRes.data.payment_providers ?? [], null, 2))

    const stripeProvider = providersRes.data.payment_providers?.find(
      (p) => p.is_enabled !== false && String(p.id).toLowerCase().includes("stripe")
    )
    const providerId = stripeProvider?.id ?? providersRes.data.payment_providers?.[0]?.id ?? "pp_stripe_stripe"

    console.log("[Rental] Creating payment session with provider_id (REST):", providerId)

    /**
     * Ruta de alquiler, no la estándar de Medusa (F0-7).
     *
     * Es la que crea el PaymentIntent con `setup_future_usage`, que es lo único
     * que hace que Stripe guarde la tarjeta para cobrar el balance más tarde.
     * Con la ruta estándar el pago sale bien y la tarjeta no se guarda: el
     * fallo no se ve hasta el día que hay que cobrar el resto.
     */
    const paySessionRes = await medusaFetch<{
      payment_collection?: { id: string; payment_sessions?: { id: string; provider_id?: string; data?: { client_secret?: string } }[] }
      card_will_be_saved?: boolean
      disclosure?: string | null
      reason?: string | null
    }>(`/store/carts/${cartId}/rental-payment-session`, {
      method: "POST",
      body: { provider_id: providerId },
    })

    if (!paySessionRes.ok) {
      console.error("[Rental] POST rental-payment-session failed:", paySessionRes.status, paySessionRes.error, paySessionRes.data)
      return {
        ok: false,
        error: paySessionRes.error ?? "Could not start the payment session with " + providerId + ". Check Stripe configuration in Medusa (region and STRIPE_API_KEY).",
      }
    }

    if (!paySessionRes.data.card_will_be_saved) {
      // No aborta el pago: se cobra igual y el balance se cobrará por otro medio.
      console.warn(
        "[Rental] La tarjeta NO se guardará para el balance. Motivo:",
        paySessionRes.data.reason
      )
    }

    const paymentCollection = paySessionRes.data.payment_collection
    const sessions = paymentCollection?.payment_sessions ?? []
    console.log("[Rental] Respuesta POST payment-sessions:", {
      status: paySessionRes.status,
      sessionsCount: sessions.length,
      providerIds: sessions.map((s) => s.provider_id),
      firstSessionHasData: !!sessions[0]?.data,
      dataKeys: sessions[0]?.data ? Object.keys(sessions[0].data) : [],
    })

    const activeProviderId = providerId
    const isStripe = activeProviderId.toLowerCase().includes("stripe")
    let clientSecret: string | undefined = sessions[0]?.data?.client_secret

    if (isStripe && !clientSecret) {
      const cartWithDataRes = await medusaFetch<{
        cart?: {
          payment_collection?: {
            payment_sessions?: { data?: { client_secret?: string } }[]
          }
        }
      }>(`/store/carts/${cartId}?fields=+payment_collection,+payment_collection.payment_sessions,+payment_collection.payment_sessions.data`)
      if (cartWithDataRes.ok) {
        const sess = cartWithDataRes.data.cart?.payment_collection?.payment_sessions
        clientSecret = sess?.[0]?.data?.client_secret
        console.log("[Rental] client_secret desde GET cart:", { sessionsCount: sess?.length, hasClientSecret: !!clientSecret })
      }
    }

    console.log("[Rental] Resumen final:", {
      activeProviderId,
      isStripe,
      hasClientSecret: !!clientSecret,
      clientSecretPreview: clientSecret ? `${clientSecret.slice(0, 14)}...` : null,
    })

    return {
      ok: true,
      cartId,
      clientSecret: clientSecret ?? undefined,
      paymentProviderId: activeProviderId,
      cardWillBeSaved: paySessionRes.data.card_will_be_saved ?? false,
      disclosure: paySessionRes.data.disclosure ?? null,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error"
    console.error("[Rental] prepareRentalCheckout error:", message)
    return { ok: false, error: message }
  }
}

export async function completeRentalCart(
  cartId: string
): Promise<CompleteRentalCartResult> {
  try {
    const res = await medusaFetch<{ order: Record<string, unknown> }>(
      `/store/rentals/${cartId}`,
      { method: "POST" }
    )
    if (!res.ok) {
      return {
        ok: false,
        error: translateRentalError(
          (res.data as { message?: string }).message,
          "Failed to complete reservation"
        ),
      }
    }
    /**
     * El carrito ya es un pedido: su hold lo sustituye el propio alquiler. Dejar
     * la cookie viva haría que la siguiente reserva intentase soltar holds de un
     * carrito completado.
     */
    await clearRentalCartId()
    // La dirección ya está en el alquiler: guardarla más sería retener un dato
    // personal sin motivo.
    await clearDeliveryAddress()
    return {
      ok: true,
      order: res.data.order,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error"
    return { ok: false, error: message }
  }
}
