import { LogoLink } from "./logoLink"
import { ThemeToggle } from "./theme-toggle"
import { UserMenuButton } from "./user-menu-button"

export function SiteHeader() {
  return (
    <header className="flex h-full w-full min-w-0 items-center justify-between gap-4">
      <LogoLink />
      <div className="inline-flex shrink-0 items-center gap-1 sm:gap-2">
        <ThemeToggle />
        <UserMenuButton />
      </div>
    </header>
  )
}
