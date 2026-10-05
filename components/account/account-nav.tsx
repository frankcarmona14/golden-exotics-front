"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { LogoutButton } from "@/components/logout-button"

interface NavItem {
  href: string
  label: string
  icon: (props: { className?: string }) => JSX.Element
}

function OverviewIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M6.5 2A1.5 1.5 0 0 1 8 3.5v2A1.5 1.5 0 0 1 6.5 7h-3A1.5 1.5 0 0 1 2 5.5v-2A1.5 1.5 0 0 1 3.5 2h3Zm6 0A1.5 1.5 0 0 1 14 3.5v2A1.5 1.5 0 0 1 12.5 7h-3A1.5 1.5 0 0 1 8 5.5v-2A1.5 1.5 0 0 1 9.5 2h3Zm-6 7A1.5 1.5 0 0 1 8 10.5v2A1.5 1.5 0 0 1 6.5 14h-3A1.5 1.5 0 0 1 2 12.5v-2A1.5 1.5 0 0 1 3.5 9h3Zm6 0A1.5 1.5 0 0 1 14 10.5v2a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 8 12.5v-2A1.5 1.5 0 0 1 9.5 9h3Z" />
    </svg>
  )
}

function CarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M3.05 5.2A2 2 0 0 1 4.92 4h6.16a2 2 0 0 1 1.87 1.2l1.2 2.78c.55.2.95.73.95 1.36v2.41c0 .47-.38.85-.85.85h-.4a1.25 1.25 0 0 1-2.5 0H4.65a1.25 1.25 0 0 1-2.5 0h-.4A.85.85 0 0 1 .9 11.75V9.34c0-.63.4-1.16.95-1.36l1.2-2.78ZM4.92 5.5a.5.5 0 0 0-.46.3l-.9 2.07h8.88l-.9-2.07a.5.5 0 0 0-.46-.3H4.92ZM3.5 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm9 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
    </svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1.5c-2.9 0-5.25 1.79-5.25 4 0 .55.45 1 1 1h8.5c.55 0 1-.45 1-1 0-2.21-2.35-4-5.25-4Z" />
    </svg>
  )
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M4 1.5A1.5 1.5 0 0 0 2.5 3v10A1.5 1.5 0 0 0 4 14.5h8a1.5 1.5 0 0 0 1.5-1.5V5.62a1.5 1.5 0 0 0-.44-1.06l-2.62-2.62a1.5 1.5 0 0 0-1.06-.44H4Zm1 5.25c0-.41.34-.75.75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 6.75Zm0 3c0-.41.34-.75.75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 9.75Z" />
    </svg>
  )
}

function CardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5V6h14V4.5A1.5 1.5 0 0 0 13.5 3h-11ZM15 7H1v4.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V7ZM3 10.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm5.75-.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z" />
    </svg>
  )
}

const NAV_ITEMS: NavItem[] = [
  { href: "/account", label: "Overview", icon: OverviewIcon },
  { href: "/account/reservations", label: "My reservations", icon: CarIcon },
  { href: "/account/documents", label: "Documents", icon: DocumentIcon },
  { href: "/account/payment-methods", label: "Payment methods", icon: CardIcon },
  { href: "/account/profile", label: "Profile", icon: UserIcon },
]

export function AccountNav({ className }: { className?: string }) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/account" ? pathname === "/account" : pathname.startsWith(href)

  return (
    <nav className={className} aria-label="Account">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 whitespace-nowrap rounded-tight px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out",
                  active
                    ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
                    : "text-neutral-500 hover:bg-neutral-100/70 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-100"
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    active ? "text-accent" : "text-current"
                  )}
                />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="mt-2 hidden border-t border-neutral-200 pt-2 dark:border-neutral-800 lg:block">
        <LogoutButton className="w-full justify-start rounded-tight px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100/70 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-100" />
      </div>
    </nav>
  )
}
