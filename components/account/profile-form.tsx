"use client"

import { useEffect, useState } from "react"
import { useFormState, useFormStatus } from "react-dom"

import { updateCustomer } from "@/lib/medusa/customer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import { CONTACT_PHONE_HINT } from "@/lib/phone"
import { LoadingDots } from "@/components/loading-dots"

interface ProfileFormProps {
  email: string
  firstName: string
  lastName: string
  phone: string
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="text-body" disabled={pending}>
      {pending ? <LoadingDots variant="button" /> : "Save changes"}
    </Button>
  )
}

export function ProfileForm({
  email,
  firstName,
  lastName,
  phone: initialPhone,
}: ProfileFormProps) {
  const [state, formAction] = useFormState(updateCustomer, {
    error: null,
    success: false,
  })
  const [phone, setPhone] = useState(initialPhone)
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    if (!state.success) return
    setShowSaved(true)
    const timeout = setTimeout(() => setShowSaved(false), 3000)
    return () => clearTimeout(timeout)
  }, [state.success])

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div role="alert" className="rounded-tight border border-red-200 bg-red-50 px-4 py-3 text-body-sm text-red-600 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400">
          {state.error}
        </div>
      )}
      {showSaved && (
        <div role="status" className="rounded-tight border border-green-200 bg-green-50 px-4 py-3 text-body-sm text-green-700 duration-200 animate-in fade-in dark:border-green-800/50 dark:bg-green-950/30 dark:text-green-400">
          Your profile has been updated.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="first_name" className="text-body-sm">
            First name
          </Label>
          <Input
            id="first_name"
            name="first_name"
            defaultValue={firstName}
            autoComplete="given-name"
            className="h-11"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="last_name" className="text-body-sm">
            Last name
          </Label>
          <Input
            id="last_name"
            name="last_name"
            defaultValue={lastName}
            autoComplete="family-name"
            className="h-11"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-body-sm">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          className="h-11 cursor-not-allowed bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
          disabled
          readOnly
          aria-describedby="email-hint"
        />
        <p id="email-hint" className="text-caption text-neutral-500 dark:text-neutral-400">
          Contact support to change the email on your account.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-body-sm">
          Mobile phone
        </Label>
        {/* Hidden field carries the value into the server action */}
        <input type="hidden" name="phone" value={phone} />
        <PhoneInput
          id="phone"
          value={phone}
          onChange={setPhone}
          required
          aria-describedby="phone-hint"
        />
        <p id="phone-hint" className="text-caption text-neutral-500 dark:text-neutral-400">
          {CONTACT_PHONE_HINT}
        </p>
      </div>

      <div className="pt-1">
        <SubmitButton />
      </div>
    </form>
  )
}
