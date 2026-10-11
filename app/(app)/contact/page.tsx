import type { Metadata } from "next"

import { getWhatsAppUrl, siteConfig } from "@/config/site"
import { ContactForm } from "@/components/contact/contact-form"

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Questions about a car, dates or delivery in South Florida? Send Golden Exotics a message and we'll get back to you shortly.",
  alternates: { canonical: "/contact" },
}

/** Contact page (P1-16): the form, and the direct channels that are configured. */
export default function ContactPage() {
  const { whatsapp, instagram, email } = siteConfig.contact
  const whatsAppUrl = getWhatsAppUrl(`Hi ${siteConfig.name}!`)

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:py-20">
      <div>
        <h1 className="text-heading-lg font-semibold tracking-tight">Contact us</h1>
        <p className="mt-3 text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
          Asking about a car, your dates or delivery? Send us a message and
          we&apos;ll get back to you shortly, usually on WhatsApp.
        </p>
        <p className="mt-3 text-body leading-relaxed text-neutral-600 dark:text-neutral-300">
          Pick up next to Miami International Airport, or have the car
          delivered across South Florida.
        </p>

        {(whatsapp || instagram || email) && (
          <ul className="mt-8 space-y-2 text-body-sm">
            {whatsapp && whatsAppUrl && (
              <li>
                <span className="text-neutral-500 dark:text-neutral-400">WhatsApp · </span>
                <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="font-medium underline-offset-4 hover:underline">
                  {whatsapp.display}
                </a>
              </li>
            )}
            {email && (
              <li>
                <span className="text-neutral-500 dark:text-neutral-400">Email · </span>
                <a href={`mailto:${email}`} className="font-medium underline-offset-4 hover:underline">
                  {email}
                </a>
              </li>
            )}
            {instagram && (
              <li>
                <span className="text-neutral-500 dark:text-neutral-400">Instagram · </span>
                <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="font-medium underline-offset-4 hover:underline">
                  @{instagram.handle}
                </a>
              </li>
            )}
          </ul>
        )}
      </div>

      <div className="relative rounded-card border border-border bg-card p-6 shadow-sm sm:p-8">
        <ContactForm />
      </div>
    </main>
  )
}
