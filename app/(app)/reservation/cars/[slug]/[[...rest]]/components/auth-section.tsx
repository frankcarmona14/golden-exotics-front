"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { saveCustomerPhone } from "@/lib/medusa/customer"
import {
  CONTACT_PHONE_ERROR,
  CONTACT_PHONE_HINT,
  isValidContactPhone,
} from "@/lib/phone"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import { CircleCheckIcon } from "@/components/icons/circle-check"

import { useGuest } from "./guest-context"

/** Input ids of the guest form, in the order they are checked. */
type GuestField =
  | "guest-first-name"
  | "guest-last-name"
  | "guest-email"
  | "guest-phone"

const GUEST_ERROR_ID = "guest-form-error"

interface AuthSectionProps {
  isLoggedIn: boolean
  customerName?: string | null
  customerEmail?: string | null
  /** The account's phone; a logged-in renter without a valid one must add it. */
  customerPhone?: string | null
  redirectTo?: string
}

export function AuthSection({
  isLoggedIn,
  customerName,
  customerEmail,
  customerPhone,
  redirectTo,
}: AuthSectionProps) {
  const { guest, setGuest } = useGuest()
  const [showGuestForm, setShowGuestForm] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [invalidField, setInvalidField] = useState<GuestField | null>(null)
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")

  if (isLoggedIn && !isValidContactPhone(customerPhone)) {
    return (
      <AddPhoneToAccount
        who={customerName || customerEmail || null}
        initialPhone={customerPhone ?? ""}
      />
    )
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
          <CircleCheckIcon className="size-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Logged in</h2>
          <p className="text-body text-neutral-600 dark:text-neutral-400">
            {customerName || customerEmail || "Ready to reserve"}
          </p>
        </div>
      </div>
    )
  }

  if (guest) {
    return (
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
          <CircleCheckIcon className="size-5 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">Reserving as guest</h2>
          <p className="text-body text-neutral-600 dark:text-neutral-400">
            {`${guest.first_name} ${guest.last_name}`.trim()} &middot; {guest.email}
          </p>
          <button
            type="button"
            className="mt-2 text-sm text-neutral-500 underline underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-100"
            onClick={() => {
              setGuest(null)
              setShowGuestForm(false)
              setEmail("")
              setFirstName("")
              setLastName("")
              setPhone("")
            }}
          >
            Change details
          </button>
        </div>
      </div>
    )
  }

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setInvalidField(null)

    // Marks the field, says why, and puts the cursor there.
    const fail = (field: GuestField, message: string) => {
      setInvalidField(field)
      setFormError(message)
      document.getElementById(field)?.focus()
    }

    const trimmedEmail = email.trim()
    const trimmedFirst = firstName.trim()
    const trimmedLast = lastName.trim()
    const trimmedPhone = phone.trim()

    const missing: GuestField | null = !trimmedFirst
      ? "guest-first-name"
      : !trimmedLast
        ? "guest-last-name"
        : !trimmedEmail
          ? "guest-email"
          : !trimmedPhone
            ? "guest-phone"
            : null
    if (missing) {
      fail(missing, "Email, first name, last name and mobile phone are required.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      fail("guest-email", "Please enter a valid email address.")
      return
    }

    if (!isValidContactPhone(trimmedPhone)) {
      fail("guest-phone", CONTACT_PHONE_ERROR)
      return
    }

    setGuest({
      email: trimmedEmail,
      first_name: trimmedFirst,
      last_name: trimmedLast,
      phone: trimmedPhone,
    })
  }

  if (showGuestForm) {
    return (
      <div>
        <h2 className="text-heading-sm">Continue as guest</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          You can reserve without creating an account. We&apos;ll use your email
          to send you the booking details.
        </p>
        <form onSubmit={handleGuestSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guest-first-name">First name</Label>
              <Input
                id="guest-first-name"
                aria-invalid={invalidField === "guest-first-name" || undefined}
                aria-describedby={
                  invalidField === "guest-first-name" ? GUEST_ERROR_ID : undefined
                }
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest-last-name">Last name</Label>
              <Input
                id="guest-last-name"
                aria-invalid={invalidField === "guest-last-name" || undefined}
                aria-describedby={
                  invalidField === "guest-last-name" ? GUEST_ERROR_ID : undefined
                }
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-email">Email</Label>
            <Input
              id="guest-email"
              aria-invalid={invalidField === "guest-email" || undefined}
              aria-describedby={
                invalidField === "guest-email" ? GUEST_ERROR_ID : undefined
              }
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-phone">Mobile phone</Label>
            <PhoneInput
              id="guest-phone"
              value={phone}
              onChange={setPhone}
              required
              aria-invalid={invalidField === "guest-phone" || undefined}
              aria-describedby={
                invalidField === "guest-phone"
                  ? `${GUEST_ERROR_ID} guest-phone-hint`
                  : "guest-phone-hint"
              }
            />
            <p
              id="guest-phone-hint"
              className="text-caption text-neutral-500 dark:text-neutral-400"
            >
              {CONTACT_PHONE_HINT}
            </p>
          </div>

          {formError && (
            <p
              id={GUEST_ERROR_ID}
              role="alert"
              className="text-sm text-red-600 dark:text-red-400"
            >
              {formError}
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="text-body"
              onClick={() => {
                setShowGuestForm(false)
                setFormError(null)
                setInvalidField(null)
              }}
            >
              Back
            </Button>
            <Button type="submit" size="lg" className="text-body">
              Continue
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-heading-sm">
        Log in, sign up or reserve as guest
      </h2>
      <div className="pt-10">
        <div className="grid grid-cols-1 items-center justify-center gap-4">
          <Button className="w-full text-body" size={"lg"} asChild>
            <Link
              href={
                redirectTo
                  ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`
                  : "/sign-in"
              }
            >
              Log in
            </Link>
          </Button>
          <Button
            variant={"outline"}
            className="w-full text-body"
            size={"lg"}
            asChild
          >
            <Link
              href={
                redirectTo
                  ? `/sign-up?redirectTo=${encodeURIComponent(redirectTo)}`
                  : "/sign-up"
              }
            >
              Sign up
            </Link>
          </Button>
          <Button
            variant={"ghost"}
            className="w-full text-body"
            size={"lg"}
            onClick={() => setShowGuestForm(true)}
          >
            Continue as guest
          </Button>
        </div>
      </div>
    </>
  )
}

/**
 * Accounts created while the phone was optional have none. It's required to
 * book, so it's asked here, saved on the account, and never asked again.
 */
function AddPhoneToAccount({
  who,
  initialPhone,
}: {
  who: string | null
  initialPhone: string
}) {
  const router = useRouter()
  const [phone, setPhone] = useState(initialPhone)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!isValidContactPhone(phone)) {
      setError(CONTACT_PHONE_ERROR)
      return
    }
    startTransition(async () => {
      const result = await saveCustomerPhone(phone)
      if (result.error) {
        setError(result.error)
        return
      }
      // Re-renders the page with the saved number, which unlocks payment.
      router.refresh()
    })
  }

  return (
    <div>
      <h2 className="text-heading-sm">Add your mobile number</h2>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        {who ? `Logged in as ${who}. ` : ""}We need a mobile number to reach
        you about this rental. We&apos;ll save it to your account.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="account-phone">Mobile phone</Label>
          <PhoneInput
            id="account-phone"
            value={phone}
            onChange={setPhone}
            required
            aria-invalid={!!error || undefined}
            aria-describedby={
              error
                ? "account-phone-error account-phone-hint"
                : "account-phone-hint"
            }
          />
          <p
            id="account-phone-hint"
            className="text-caption text-neutral-500 dark:text-neutral-400"
          >
            {CONTACT_PHONE_HINT}
          </p>
        </div>
        {error && (
          <p
            id="account-phone-error"
            role="alert"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="text-body" disabled={pending}>
          {pending ? "Saving…" : "Save and continue"}
        </Button>
      </form>
    </div>
  )
}
