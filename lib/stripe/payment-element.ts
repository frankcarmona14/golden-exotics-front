"use client"

import {
  loadStripe,
  type Appearance,
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
      fontFamily: "var(--font-sans), system-ui, sans-serif",
    },
  }
}

/**
 * Solo tarjeta en el Payment Element.
 *
 * Los PaymentIntent los crea el provider de Stripe de Medusa sin
 * `payment_method_types`, así que Stripe ofrece lo que esté activado en el
 * dashboard. El flujo de después (holds, completar el carrito, cobrar el
 * balance off-session) solo está probado con tarjeta: con el `clientSecret`
 * no se puede filtrar desde aquí, así que se pone la tarjeta primero, se
 * quitan los wallets y se bloquea el envío con cualquier otro método.
 */
export const CARD_ONLY_PAYMENT_ELEMENT_OPTIONS: StripePaymentElementOptions = {
  layout: "tabs",
  paymentMethodOrder: ["card"],
  wallets: { applePay: "never", googlePay: "never" },
}

export const NON_CARD_METHOD_MESSAGE =
  "We take cards only. Please choose Card to continue."
