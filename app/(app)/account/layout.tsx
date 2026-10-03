import { ReactNode } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { getAuthToken } from "@/lib/medusa/customer"
import { NOINDEX_METADATA } from "@/lib/seo/metadata"

export const metadata: Metadata = NOINDEX_METADATA

export const dynamic = "force-dynamic"

export default async function AccountLayout({
  children,
}: {
  children: ReactNode
}) {
  const token = await getAuthToken()
  if (!token) {
    redirect(`/sign-in?redirectTo=${encodeURIComponent("/account")}`)
  }

  return children
}
