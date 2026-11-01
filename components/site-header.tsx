import { LogoLink } from "./logoLink"
import { MobileNavMenu } from "./mobile-nav-menu"
import { SiteNav } from "./site-nav"
import { ThemeToggle } from "./theme-toggle"
import { UserMenuButton } from "./user-menu-button"

export function SiteHeader() {
  return (
    <header className="flex h-full w-full min-w-0 items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4 lg:gap-10">
        <LogoLink />
        <SiteNav className="hidden md:flex" />
      </div>
      <div className="inline-flex shrink-0 items-center gap-1 sm:gap-2">
        <ThemeToggle />
        <UserMenuButton />
        <MobileNavMenu className="md:hidden" />
      </div>
    </header>
  )
}
