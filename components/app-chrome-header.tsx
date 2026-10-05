import { SiteHeader } from "@/components/site-header"

/**
 * The primary site nav (logo, theme, account). Render once at the top of every
 * route layout so the bar is always visible and consistent.
 */
export function AppChromeHeader() {
  return (
    <div className="sticky top-0 z-50 border-b border-black/10 bg-[hsla(0,0%,100%,.88)] shadow-[inset_0_-1px_0_0_#eaeaea] backdrop-blur-md backdrop-saturate-[1.8] dark:border-border dark:bg-background/80 dark:shadow-[inset_0_-1px_0_0_#2a2620]">
      <div className="mx-auto flex h-[var(--site-header-height)] w-full min-w-0 max-w-none items-stretch px-5 sm:max-w-[90%] sm:px-0 2xl:max-w-8xl">
        <SiteHeader />
      </div>
    </div>
  )
}
