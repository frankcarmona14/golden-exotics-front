"use client"

import { ReactNode, useCallback } from "react"
import { useRouter } from "next/navigation"

import { useCatalogTransition } from "./catalog-transition"
import { CatalogSort } from "./catalog-sort"
import { QuickFilters } from "./quick-filters"

/**
 * Fila de orden y filtros encima del listado. En móvil se desplaza en
 * horizontal y sangra hasta el borde de la pantalla, como un carrusel.
 */
export function CatalogToolbar({ filters }: { filters: ReactNode }) {
  const router = useRouter()
  const { startTransition } = useCatalogTransition()

  // replace, no push: marcar un atajo no es una página por la que el botón
  // atrás tenga que pasar.
  const navigate = useCallback(
    (url: string) => {
      startTransition(() => {
        router.replace(url, { scroll: false })
      })
    },
    [router, startTransition]
  )

  return (
    <div className="-mx-5 overflow-x-auto px-5 py-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max items-center gap-2">
        <CatalogSort />
        {filters}
        <span
          aria-hidden
          className="mx-1 h-6 w-px shrink-0 bg-neutral-200 dark:bg-white/10"
        />
        <QuickFilters onNavigate={navigate} />
      </div>
    </div>
  )
}
