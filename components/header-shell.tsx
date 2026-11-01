"use client"

import { ReactNode, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

/** Routes whose first section (`[data-header-overlay]`) runs under the bar. */
const OVERLAY_ROUTES = new Set(["/"])

/**
 * The sticky bar around the site nav. On a route that opens with a full-bleed
 * hero, it is transparent with white content while the hero is behind it, so
 * the video shows through in either theme, and takes its solid background back
 * once the hero has scrolled away. Children style themselves for the
 * transparent state with `group-data-[transparent]/header:`.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const overlayRoute = OVERLAY_ROUTES.has(pathname ?? "")
  // Starts transparent on those routes so the first paint already matches.
  const [overHero, setOverHero] = useState(overlayRoute)

  useEffect(() => {
    if (!overlayRoute) {
      setOverHero(false)
      return
    }
    const update = () => {
      const hero = document.querySelector("[data-header-overlay]")
      const bar = document.querySelector("[data-header-shell]")
      if (!hero || !bar) return setOverHero(false)
      // Solid a little before the hero's end: its bottom fades into the page,
      // and white text over that fade would lose its contrast.
      const heroBottom = hero.getBoundingClientRect().bottom
      setOverHero(heroBottom > bar.getBoundingClientRect().height + 120)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [overlayRoute])

  return (
    <div
      data-header-shell
      data-transparent={overHero || undefined}
      className={cn(
        "group/header sticky top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ease-out",
        overHero
          ? "bg-transparent"
          : "bg-[hsla(0,0%,100%,.88)] backdrop-blur-md backdrop-saturate-[1.8] dark:bg-background/80"
      )}
    >
      {children}
    </div>
  )
}
