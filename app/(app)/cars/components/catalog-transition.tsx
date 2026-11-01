"use client"

import {
  createContext,
  ReactNode,
  startTransition as reactStartTransition,
  TransitionStartFunction,
  useContext,
  useTransition,
} from "react"

import { cn } from "@/lib/utils"

interface CatalogTransition {
  isPending: boolean
  startTransition: TransitionStartFunction
}

const CatalogTransitionContext = createContext<CatalogTransition | null>(null)

/**
 * Una sola transición para todo /cars: filtros y orden navegan dentro de ella,
 * y el listado se atenúa mientras llega el resultado nuevo en vez de quedarse
 * quieto (o de saltar al esqueleto del Suspense).
 */
export function CatalogTransitionProvider({
  children,
}: {
  children: ReactNode
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <CatalogTransitionContext.Provider value={{ isPending, startTransition }}>
      {children}
    </CatalogTransitionContext.Provider>
  )
}

export function useCatalogTransition(): CatalogTransition {
  return (
    useContext(CatalogTransitionContext) ?? {
      isPending: false,
      startTransition: reactStartTransition,
    }
  )
}

export function CatalogResults({ children }: { children: ReactNode }) {
  const { isPending } = useCatalogTransition()

  return (
    <div
      aria-busy={isPending}
      className={cn(
        "flex flex-col gap-4 transition-opacity duration-200 lg:gap-5",
        isPending && "pointer-events-none opacity-50"
      )}
    >
      {children}
    </div>
  )
}
