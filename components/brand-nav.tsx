import Link from "next/link"

import type { Brand } from "@/db/queries/brand-repository"
import { cn } from "@/lib/utils"

const chipClass =
  "inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-body-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"

/**
 * Fila de marcas para saltar de una a otra. En móvil se desplaza en
 * horizontal en vez de partirse en varias líneas.
 */
export function BrandNav({
  brands,
  activeHandle,
}: {
  brands: Pick<Brand, "handle" | "name">[]
  activeHandle?: string
}) {
  return (
    <nav aria-label="Brands" className="-mx-5 sm:-mx-6">
      <ul className="flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
        <li>
          <Link
            href="/brands"
            className={cn(
              chipClass,
              "border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-100"
            )}
          >
            All brands
          </Link>
        </li>
        {brands.map((brand) => {
          const active = brand.handle === activeHandle
          return (
            <li key={brand.handle}>
              <Link
                href={`/brands/${brand.handle}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  chipClass,
                  active
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:text-neutral-100"
                )}
              >
                {brand.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
