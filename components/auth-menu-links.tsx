"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

function useCurrentPath(): string {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isAuthRoute =
    pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up")
  if (!pathname || isAuthRoute) return "/"
  const query = searchParams?.toString()
  return query ? `${pathname}?${query}` : pathname
}

export function SignInMenuLink({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const redirectTo = useCurrentPath()
  const href =
    redirectTo && redirectTo !== "/"
      ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`
      : "/sign-in"
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

export function SignUpMenuLink({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const redirectTo = useCurrentPath()
  const href =
    redirectTo && redirectTo !== "/"
      ? `/sign-up?redirectTo=${encodeURIComponent(redirectTo)}`
      : "/sign-up"
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
