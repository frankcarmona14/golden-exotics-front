"use client"

import { useEffect, useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { signup } from "@/lib/medusa/customer"
import { LoadingDots } from "@/components/loading-dots"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import { Separator } from "@/components/ui/separator"
import { CarhiveLogoNew } from "@/components/icons/carhive-logo-new"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      className="w-full text-[15px]"
      size="lg"
      disabled={pending}
    >
      {pending ? <LoadingDots variant="button" /> : "Create account"}
    </Button>
  )
}

function sanitizeRedirect(target: string | null): string {
  if (!target) return "/"
  if (!target.startsWith("/") || target.startsWith("//")) return "/"
  return target
}

export function RegisterForm() {
  const [state, formAction] = useFormState(signup, {
    error: null,
    success: false,
  })
  const [phone, setPhone] = useState("")
  const searchParams = useSearchParams()
  const redirectTo = sanitizeRedirect(searchParams.get("redirectTo"))

  useEffect(() => {
    if (state.success) {
      window.location.href = redirectTo
    }
  }, [state.success, redirectTo])

  return (
    <div className="w-full max-w-[440px]">
      {/* Card container */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-8 pb-8 pt-10 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="Back to home">
            <CarhiveLogoNew className="h-9 w-auto" />
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Create account
          </h1>
          <p className="mt-1.5 text-[13px] text-neutral-500 dark:text-neutral-400">
            Fill in your details to sign up
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="first_name" className="text-[13px]">
                First name
              </Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="John"
                required
                autoComplete="given-name"
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last_name" className="text-[13px]">
                Last name
              </Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Doe"
                required
                autoComplete="family-name"
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px]">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@email.com"
              required
              autoComplete="email"
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-[13px]">
              Phone (optional)
            </Label>
            <PhoneInput
              id="phone"
              name="phone"
              value={phone}
              onChange={setPhone}
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[13px]">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              className="h-11"
            />
          </div>

          <div className="pt-1">
            <SubmitButton />
          </div>

          <p className="text-center text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-500">
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-700 underline underline-offset-2 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              Terms of Service
            </Link>
            {" and "}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-700 underline underline-offset-2 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </form>

        <Separator className="my-6" />

        {/* Footer links */}
        <p className="text-center text-[13px] text-neutral-500 dark:text-neutral-400">
          Already have an account?{" "}
          <Link
            href={redirectTo !== "/" ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}` : "/sign-in"}
            className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            Log in
          </Link>
        </p>
      </div>

      {/* Outside card link */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-[13px] text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
        >
          &larr; Back to home
        </Link>
      </div>
    </div>
  )
}
