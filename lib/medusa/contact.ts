"use server"

import { CONTACT_PHONE_ERROR, isValidContactPhone } from "@/lib/phone"
import { sdk } from "./sdk"

export type ContactFormState = {
  status: "idle" | "sent" | "error"
  error: string | null
}

/**
 * Sends the contact form (P1-16) to the backend, which posts it to the team's
 * Slack channel with the renter's number as a WhatsApp link.
 */
export async function sendContactRequest(
  _previous: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const field = (key: string) => String(formData.get(key) ?? "").trim()

  const name = field("name")
  const email = field("email")
  const phone = field("phone")
  const message = field("message")

  if (!name || !email || !phone || !message) {
    return { status: "error", error: "Please fill in every field." }
  }
  if (!isValidContactPhone(phone)) {
    return { status: "error", error: CONTACT_PHONE_ERROR }
  }

  try {
    await sdk.client.fetch("/store/contact-requests", {
      method: "POST",
      body: {
        name,
        email,
        phone,
        message,
        page_url: field("page_url") || undefined,
        product_id: field("product_id") || undefined,
        // Honeypot: empty for people, filled by bots. The backend drops those.
        website: field("website") || undefined,
      },
    })
  } catch (error) {
    const text = error instanceof Error ? error.message : ""
    return {
      status: "error",
      error: text || "We couldn't send your message. Please try again.",
    }
  }

  return { status: "sent", error: null }
}
