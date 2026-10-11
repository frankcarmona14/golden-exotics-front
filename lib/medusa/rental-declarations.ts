"use server"

import { sdk } from "./sdk"

/**
 * Saves the renter's checkout declarations on the cart (P1-13): whether they
 * have their own auto insurance. Medusa copies it to the order, and the team's
 * Slack notice says when they don't, so coverage is arranged before pick-up.
 */
export async function saveRentalDeclarations(
  cartId: string,
  ownInsurance: boolean
): Promise<{ ok: boolean }> {
  try {
    await sdk.client.fetch(`/store/carts/${cartId}/rental-declarations`, {
      method: "POST",
      body: { own_insurance: ownInsurance },
    })
    return { ok: true }
  } catch (error) {
    // Never blocks the booking: worst case the team asks about insurance.
    console.error("[rental] Could not save checkout declarations:", error)
    return { ok: false }
  }
}
