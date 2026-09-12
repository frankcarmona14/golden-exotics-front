"use client"

import { useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { siteConfig } from "@/config/site"
import { login } from "@/lib/medusa/customer"
import { LoadingDots } from "@/components/loading-dots"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
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
      {pending ? <LoadingDots variant="button" /> : "Log in"}
    </Button>
  )
}

function sanitizeRedirect(target: string | null): string {
  if (!target) return "/"
  if (!target.startsWith("/") || target.startsWith("//")) return "/"
  return target
}

export function LoginForm() {
  const [state, formAction] = useFormState(login, {
    error: null,
    success: false,
  })
  const searchParams = useSearchParams()
  const redirectTo = sanitizeRedirect(searchParams.get("redirectTo"))

  useEffect(() => {
    if (state.success) {
      // Use window.location for a full page reload to ensure cookies are sent
      window.location.href = redirectTo
    }
  }, [state.success, redirectTo])

  return (
    <div className="w-full max-w-[440px]">
      {/* Card container */}
      <div className="rounded-2xl border border-neutral-200 bg-white px-8 pb-8 pt-10 shadow-none dark:border-neutral-800 dark:bg-neutral-950">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="Back to home">
            <CarhiveLogoNew className="h-9 w-auto" />
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Log in
          </h1>
          <p className="mt-1.5 text-[13px] text-neutral-500 dark:text-neutral-400">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4">
          {state.error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400"
            >
              {state.error}
            </div>
          )}

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
              spellCheck={false}
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[13px]">
                Password
              </Label>
              <a
                href={`mailto:${siteConfig.contact.email}?subject=Password%20reset`}
                className="text-[12px] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <PasswordInput
              id="password"
              name="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="h-11"
            />
          </div>

          <div className="pt-1">
            <SubmitButton />
          </div>
        </form>

        <Separator className="my-6" />

        {/* Footer links */}
        <p className="text-center text-[13px] text-neutral-500 dark:text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href={redirectTo !== "/" ? `/sign-up?redirectTo=${encodeURIComponent(redirectTo)}` : "/sign-up"}
            className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            Sign up
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
