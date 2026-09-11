import { ReactNode } from "react"
import { redirect } from "next/navigation"

import { getAuthToken } from "@/lib/medusa/customer"

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
