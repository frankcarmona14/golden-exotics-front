import type { Metadata } from "next"

import { NOINDEX_METADATA } from "@/lib/seo/metadata"
import { AppChromeHeader } from "@/components/app-chrome-header"

export const metadata: Metadata = NOINDEX_METADATA

export default function RentalDocumentsTokenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col [--site-header-height:60px]">
      <AppChromeHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  )
}
