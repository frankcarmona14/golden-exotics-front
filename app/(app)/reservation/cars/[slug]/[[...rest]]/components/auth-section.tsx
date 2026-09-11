"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import { CircleCheckIcon } from "@/components/icons/circle-check"

import { useGuest } from "./guest-context"

interface AuthSectionProps {
  isLoggedIn: boolean
  customerName?: string | null
  customerEmail?: string | null
  redirectTo?: string
}

export function AuthSection({
  isLoggedIn,
  customerName,
  customerEmail,
  redirectTo,
}: AuthSectionProps) {
  const { guest, setGuest } = useGuest()
  const [showGuestForm, setShowGuestForm] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")

  if (isLoggedIn) {
    return (
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
          <CircleCheckIcon className="size-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Logged in</h2>
          <p className="text-[15px] text-neutral-600 dark:text-neutral-400">
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
          <p className="text-[15px] text-neutral-600 dark:text-neutral-400">
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

    const trimmedEmail = email.trim()
    const trimmedFirst = firstName.trim()
    const trimmedLast = lastName.trim()
    const trimmedPhone = phone.trim()

    if (!trimmedEmail || !trimmedFirst || !trimmedLast) {
      setFormError("Email, first name and last name are required.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setFormError("Please enter a valid email address.")
      return
    }

    setGuest({
      email: trimmedEmail,
      first_name: trimmedFirst,
      last_name: trimmedLast,
      ...(trimmedPhone ? { phone: trimmedPhone } : {}),
    })
  }

  if (showGuestForm) {
    return (
      <div>
        <h2 className="text-[22px] font-semibold">Continue as guest</h2>
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-phone">
              Phone <span className="text-neutral-400">(optional)</span>
            </Label>
            <PhoneInput
              id="guest-phone"
              value={phone}
              onChange={setPhone}
            />
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Include the country code so we can reach you on WhatsApp if
              needed.
            </p>
          </div>

          {formError && (
            <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
          )}

          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="text-[15px]"
              onClick={() => {
                setShowGuestForm(false)
                setFormError(null)
              }}
            >
              Back
            </Button>
            <Button type="submit" size="lg" className="text-[15px]">
              Continue
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-[22px] font-semibold">
        Log in, sign up or reserve as guest
      </h2>
      <div className="pt-10">
        <div className="grid grid-cols-1 items-center justify-center gap-4">
          <Button className="w-full text-[15px]" size={"lg"} asChild>
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
            className="w-full text-[15px]"
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
            className="w-full text-[15px]"
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
