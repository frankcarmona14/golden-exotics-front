"use client"

import { useEffect, useState } from "react"

import { useDebounce } from "@/hooks/use-debounce"

import { countAvailableCars } from "../../actions"

/**
 * Cuántos coches daría `query`, mientras `enabled`. Devuelve el último recuento
 * conocido mientras llega el siguiente, para que el botón no parpadee; `null`
 * hasta tener el primero.
 */
export function useCarCount(query: string, enabled: boolean) {
  const debouncedQuery = useDebounce(query, 200)
  const [count, setCount] = useState<number | null>(null)
  const [isCounting, setIsCounting] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let stale = false
    setIsCounting(true)
    countAvailableCars(debouncedQuery)
      .then((next) => {
        if (!stale) setCount(next)
      })
      // Sin recuento, el botón vuelve al texto genérico en vez de mentir.
      .catch(() => {
        if (!stale) setCount(null)
      })
      .finally(() => {
        if (!stale) setIsCounting(false)
      })
    return () => {
      stale = true
    }
  }, [debouncedQuery, enabled])

  return { count, isCounting: isCounting || query !== debouncedQuery }
}
