"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ContactForm } from "./contact-form"

/**
 * Pages where a floating button would get in the way: checkout and payment
 * (it would cover the pay button on mobile), the quote booking page, the
 * contact page itself and the auth screens.
 */
const HIDDEN_ON = [
  "/reservation",
  "/payment-collection",
  "/quote",
  "/contact",
  "/rental-documents",
  "/sign-in",
  "/sign-up",
]

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

/**
 * Quick-contact button in the corner (P1-16). Our own form in a dialog, not a
 * WhatsApp shortcut: the message reaches the team's Slack with the renter's
 * number as a WhatsApp link, so the team replies wherever suits them.
 */
export function ContactLauncher() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname() ?? ""

  if (HIDDEN_ON.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Contact us"
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-pill bg-accent px-4 py-3 text-body-sm font-semibold text-accent-foreground shadow-lg transition-[background-color,box-shadow] duration-150 ease-out hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
        >
          <ChatIcon className="size-5" />
          <span className="hidden sm:inline">Contact us</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact us</DialogTitle>
          <DialogDescription>
            Tell us what you&apos;re looking for and we&apos;ll get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        <ContactForm />
      </DialogContent>
    </Dialog>
  )
}
