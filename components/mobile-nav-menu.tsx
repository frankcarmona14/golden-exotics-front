"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { MenuIcon } from "./icons/menu"
import { siteNavLinks } from "./site-nav"

/** Los enlaces de `SiteNav` en pantallas donde no caben en la barra. */
export function MobileNavMenu({ className }: { className?: string }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label="Open menu"
        className={cn(
          "flex size-11 items-center justify-center rounded-full text-neutral-800 outline-none transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-950 group-data-[transparent]/header:text-white group-data-[transparent]/header:hover:bg-white/15 group-data-[transparent]/header:focus-visible:ring-white dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus-visible:ring-accent",
          className
        )}
      >
        <MenuIcon className="size-5 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48" collisionPadding={20}>
        {siteNavLinks.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href}>{link.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
