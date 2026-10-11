"use client"

import {
  loadStripe,
  type Appearance,
  type CssFontSource,
  type StripePaymentElementOptions,
} from "@stripe/stripe-js"
import { useTheme } from "next-themes"

/**
 * Lo común a todos los Payment Element de la tienda (P1-6b): checkout, pago
 * del balance por link y alta de tarjetas en la cuenta.
 */

export const stripePublishableKey =
  typeof process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === "string"
    ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    : ""

/** Una sola instancia de Stripe.js para toda la tienda. */
export const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null

/**
 * Sin `locale`, Stripe usa el idioma del navegador y el formulario sale en
 * castellano dentro de una tienda en inglés. El día que la tienda hable varios
 * idiomas, esto pasa a salir del idioma de la página.
 */
export const STRIPE_LOCALE = "en" as const

/**
 * Fuentes que carga el iframe del Payment Element. El iframe no ve las
 * variables CSS ni las fuentes de la página (`var(--font-sans)` no resuelve y
 * el navegador cae a serif), así que Inter se carga aparte y se nombra tal cual.
 * Va en las `options` de cada `<Elements>`, junto a `appearance`.
 */
export const PAYMENT_ELEMENT_FONTS: CssFontSource[] = [
  {
    cssSrc:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
  },
]

/**
 * Apariencia del Payment Element según el tema de la página.
 *
 * A diferencia del CardElement, el Payment Element pinta sus propios campos con
 * fondo: con `transparent` y el tema claro, en modo oscuro las letras salen
 * negras sobre negro. `react-stripe-js` actualiza la apariencia en caliente
 * cuando cambia, así que cambiar de tema no obliga a remontar nada.
 */
export function usePaymentElementAppearance(): Appearance {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return {
    theme: isDark ? "night" : "stripe",
    variables: {
      colorPrimary: "#f8e33f",
      colorBackground: isDark ? "#171717" : "#ffffff",
      colorText: isDark ? "#fafafa" : "#0a0a0a",
      colorDanger: "#ef4444",
      borderRadius: "8px",
      fontFamily:
        'Inter, -apple-system, "Segoe UI", system-ui, Roboto, "Helvetica Neue", Arial, sans-serif',
    },
  }
}

/**
 * Métodos con los que se paga un alquiler en la tienda: checkout y pago del
 * balance por link.
 *
 * Tienen que poder **guardarse y cobrarse después sin el cliente delante**: el
 * balance, las millas y el retraso se cobran así (F0-7). Los fija el backend
 * en el PaymentIntent (`payment_method_types: ["card", "link"]`, P1-15); Apple
 * Pay y Google Pay son pagos con tarjeta desde el monedero, así que entran por
 * `card`. PayPal no: por Stripe solo existe para cuentas europeas, y fuera de
 * ellas va por la cuenta de PayPal del negocio, sin cobro diferido posible.
 *
 * Apple Pay, Google Pay y Link solo aparecen en dominios registrados en Stripe
 * (Settings → Payment method domains). Apple Pay, además, nunca en localhost.
 */
export const ACCEPTED_PAYMENT_METHOD_TYPES = [
  "card",
  "apple_pay",
  "google_pay",
  "link",
] as const

export function isAcceptedPaymentMethod(type: string): boolean {
  return (ACCEPTED_PAYMENT_METHOD_TYPES as readonly string[]).includes(type)
}

export const UNSUPPORTED_METHOD_MESSAGE =
  "This payment method can't be used for rentals. Please pay by card, Apple Pay, Google Pay or Link."

export const RENTAL_PAYMENT_ELEMENT_OPTIONS: StripePaymentElementOptions = {
  layout: "tabs",
  paymentMethodOrder: ["card", "apple_pay", "google_pay", "link"],
  wallets: { applePay: "auto", googlePay: "auto" },
}

/**
 * Lo que la tienda ya sabe del cliente (cuenta o datos de invitado). Se pasa al
 * Payment Element para que no lo pregunte otra vez: sin esto, el alta de Link
 * dentro del formulario pedía de nuevo email y teléfono.
 */
export function knownBillingDetails(contact: {
  email?: string | null
  name?: string | null
  phone?: string | null
}) {
  return {
    ...(contact.email ? { email: contact.email } : {}),
    ...(contact.name ? { name: contact.name } : {}),
    ...(contact.phone ? { phone: contact.phone } : {}),
  }
}
