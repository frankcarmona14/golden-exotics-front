import { HeaderShell } from "@/components/header-shell"
import { SiteHeader } from "@/components/site-header"

/**
 * The primary site nav (logo, theme, account). Render once at the top of every
 * route layout so the bar is always visible and consistent.
 */
export function AppChromeHeader() {
  return (
    <HeaderShell>
      <div className="mx-auto flex h-[var(--site-header-height)] w-full min-w-0 max-w-none items-stretch px-5 sm:max-w-[90%] sm:px-0 2xl:max-w-8xl">
        <SiteHeader />
      </div>
    </HeaderShell>
  )
}
