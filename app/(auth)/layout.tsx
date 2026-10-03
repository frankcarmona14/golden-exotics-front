import type { Metadata } from "next"

import { NOINDEX_METADATA } from "@/lib/seo/metadata"
import { AppChromeHeader } from "@/components/app-chrome-header"

export const metadata: Metadata = NOINDEX_METADATA

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col [--site-header-height:60px]">
      <AppChromeHeader />
      {children}
    </div>
  )
}
