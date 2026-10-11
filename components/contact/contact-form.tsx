"use client"

import { useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { sendContactRequest, type ContactFormState } from "@/lib/medusa/contact"
import { CONTACT_PHONE_HINT } from "@/lib/phone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import { LoadingDots } from "@/components/loading-dots"

const INITIAL: ContactFormState = { status: "idle", error: null }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full text-body" disabled={pending}>
      {pending ? <LoadingDots variant="button" /> : "Send message"}
    </Button>
  )
}

/**
 * Contact form (P1-16), shared by the /contact page and the floating contact
 * button. It says which page it was sent from, so a message from a car's page
 * tells the team which car the renter is asking about.
 */
export function ContactForm({ productId }: { productId?: string }) {
  const [state, formAction] = useFormState(sendContactRequest, INITIAL)
  const [phone, setPhone] = useState("")
  const pathname = usePathname()

  if (state.status === "sent") {
    return (
      <div role="status" className="rounded-card border border-border bg-muted px-5 py-6 text-center">
        <p className="text-body font-semibold">Thanks, we got your message.</p>
        <p className="mt-1.5 text-body-sm text-neutral-500 dark:text-neutral-400">
          We&apos;ll get back to you shortly, usually on WhatsApp.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p role="alert" className="text-body-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="contact-name">Name</Label>
        <Input id="contact-name" name="name" autoComplete="name" required maxLength={120} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-email">Email</Label>
        <Input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={200} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-phone">Mobile phone</Label>
        <PhoneInput id="contact-phone" name="phone" value={phone} onChange={setPhone} required />
        <p className="text-caption text-neutral-500 dark:text-neutral-400">{CONTACT_PHONE_HINT}</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          maxLength={4000}
          placeholder="Which car and dates are you thinking of?"
          className="flex w-full rounded-tight border border-input bg-background px-3 py-2 text-body-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {/* Honeypot: hidden from people and screen readers; bots fill it in. */}
      <div aria-hidden="true" className="absolute left-[-9999px] size-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="page_url" value={`${siteConfig.url}${pathname ?? ""}`} />
      {productId && <input type="hidden" name="product_id" value={productId} />}

      <SubmitButton />
    </form>
  )
}
