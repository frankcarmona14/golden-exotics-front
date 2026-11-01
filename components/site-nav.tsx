"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const links = [
  { href: "/cars", label: "Cars" },
  { href: "/brands", label: "Brands" },
  { href: "/locations", label: "Locations" },
  { href: "/driver-requirements", label: "Requirements" },
]

export function SiteNav({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary" className={cn("flex items-center gap-1", className)}>
      {links.map((link) => {
        const active =
          pathname === link.href || pathname?.startsWith(`${link.href}/`)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-11 items-center rounded-full px-4 text-body font-medium transition-colors",
              active
                ? "text-foreground group-data-[transparent]/header:text-white"
                : "text-muted-foreground hover:text-foreground group-data-[transparent]/header:text-white/75 group-data-[transparent]/header:hover:text-white"
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

export { links as siteNavLinks }
