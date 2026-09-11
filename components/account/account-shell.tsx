import { ReactNode } from "react"

import { AccountNav } from "./account-nav"

/**
 * Shared chrome for the account dashboard pages (overview, reservations,
 * profile): a sidebar nav on desktop, a scrollable tab row on mobile, and a
 * content column. The existing reservation detail / documents pages keep their
 * own standalone layout and don't use this shell.
 */
export function AccountShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <aside className="mb-6 lg:mb-0">
          <AccountNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
