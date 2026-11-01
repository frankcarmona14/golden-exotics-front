"use client"

import {
  cloneElement,
  isValidElement,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { DESKTOP_MEDIA_QUERY } from "@/lib/constants"
import { cn, constructUrlWithParams } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FiltersIcon } from "@/components/icons/filters"
import { ResponsiveModal } from "@/components/responsive-modal"

import { useCatalogTransition } from "../catalog-transition"
import { FiltersContent } from "./filters-content"
import {
  applyFiltersToParams,
  countActiveFilters,
  initializeFiltersFromParams,
  paramsKey,
} from "./lib/filters"
import { SelectedFilters } from "./types"
import { useCarCount } from "./use-car-count"

interface FiltersButtonProps {
  initialMinPrice: number
  initialMaxPrice: number
  trigger?: React.ReactNode
}

/**
 * En escritorio el panel deja ver el catálogo detrás, así que cada cambio se
 * aplica al momento y el botón solo cierra. En móvil tapa los resultados: los
 * cambios son un borrador hasta pulsar el botón. En los dos, el botón dice
 * cuántos coches hay con lo elegido.
 */
export function FiltersButton({
  initialMinPrice,
  initialMaxPrice,
  trigger,
}: FiltersButtonProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { startTransition } = useCatalogTransition()

  const initialFilters = useMemo(
    () =>
      initializeFiltersFromParams(
        searchParams,
        initialMinPrice,
        initialMaxPrice
      ),
    [searchParams, initialMinPrice, initialMaxPrice]
  )

  const [selectedFilters, setSelectedFilters] =
    useState<SelectedFilters>(initialFilters)

  const totalSelectedFilters = useMemo(
    () => countActiveFilters(searchParams, initialMinPrice, initialMaxPrice),
    [searchParams, initialMinPrice, initialMaxPrice]
  )

  const draftParams = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    applyFiltersToParams(params, selectedFilters, initialMinPrice, initialMaxPrice)
    return params
  }, [searchParams, selectedFilters, initialMinPrice, initialMaxPrice])

  const { count, isCounting } = useCarCount(
    draftParams.toString(),
    isModalOpen
  )

  const isLive = isDesktop && isModalOpen

  // URLs que el panel pidió y aún no han llegado. Cuando llega una es nuestro
  // propio eco y el estado ya va por delante (pueden haber marcado otra opción
  // entretanto), así que no debe pisarlo. Cualquier otro cambio de URL
  // (buscador, filtros rápidos, botón atrás) es la nueva verdad.
  const pendingRef = useRef(new Set<string>())

  useEffect(() => {
    if (pendingRef.current.delete(paramsKey(searchParams))) return
    pendingRef.current.clear()
    setSelectedFilters(initialFilters)
    // Solo cuando cambia la URL; initialFilters sale de ella.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters])

  useEffect(() => {
    if (!isLive || paramsKey(draftParams) === paramsKey(searchParams)) return
    pendingRef.current.add(paramsKey(draftParams))
    // replace: el botón atrás no debe deshacer los filtros casilla a casilla.
    startTransition(() => {
      router.replace(constructUrlWithParams("/cars", draftParams), {
        scroll: false,
      })
    })
    // searchParams fuera: cuando llega nuestro eco no hay nada que aplicar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLive, draftParams, router, startTransition])

  // El borrador arranca de la URL cada vez que se abre: uno que se quedó sin
  // aplicar en móvil no debe reaparecer como si fueran los filtros activos.
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) setSelectedFilters(initialFilters)
      setIsModalOpen(open)
    },
    [initialFilters]
  )

  const handleFiltersReset = useCallback(() => {
    setSelectedFilters({
      minPrice: initialMinPrice,
      maxPrice: initialMaxPrice,
      bodyStyles: [],
      powertrain: undefined,
      seats: undefined,
      transmissions: [],
    })
  }, [initialMinPrice, initialMaxPrice])

  const handleFiltersApply = useCallback(() => {
    setIsModalOpen(false)
    if (isDesktop) return
    startTransition(() => {
      router.push(constructUrlWithParams("/cars", draftParams), {
        scroll: false,
      })
    })
  }, [isDesktop, draftParams, router, startTransition])

  const triggerWithBadge = useMemo(() => {
    const badge = totalSelectedFilters > 0 && (
      <Badge variant="counter" className="absolute -right-2 -top-2">
        {totalSelectedFilters}
      </Badge>
    )

    if (isValidElement(trigger)) {
      return cloneElement(
        trigger as ReactElement<{
          className?: string
          children?: React.ReactNode
        }>,
        {
          className: `${trigger.props.className || ""} relative`, // Ensure it's positioned correctly for the badge
          children: (
            <>
              {trigger.props.children}
              {badge}
            </>
          ),
        }
      )
    }

    return (
      <Button
        variant="outline"
        className={cn(
          "relative flex h-[46px] items-center justify-center gap-x-2.5 rounded-[10px] px-4 text-body-sm transition-shadow",
          totalSelectedFilters > 0 && "ring-2 ring-accent"
        )}
      >
        <FiltersIcon className="size-5" />
        <span>Filters</span>
        {badge}
      </Button>
    )
  }, [trigger, totalSelectedFilters])

  return (
    <ResponsiveModal
      open={isModalOpen}
      onOpenChange={handleOpenChange}
      title="Filters"
      description="Refine your search by adjusting the filters below to find your perfect match."
      desktopVariant="sheet"
      trigger={triggerWithBadge}
      footer={
        <div className="flex w-full items-center justify-between gap-x-2 px-6">
          <ResetFiltersButton onReset={handleFiltersReset} />
          <ApplyFiltersButton
            onApply={handleFiltersApply}
            count={count}
            isCounting={isCounting}
            // En móvil, aplicar algo sin resultados solo lleva a una página vacía.
            disabled={!isDesktop && count === 0 && !isCounting}
          />
        </div>
      }
    >
      <FiltersContent
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        initialMinPrice={initialMinPrice}
        initialMaxPrice={initialMaxPrice}
      />
    </ResponsiveModal>
  )
}

function carCountLabel(count: number | null): string {
  if (count === null) return "Show cars"
  if (count === 0) return "No cars available"
  return count === 1 ? "Show 1 car" : `Show ${count} cars`
}

export function ApplyFiltersButton({
  onApply,
  count,
  isCounting,
  disabled,
}: {
  onApply: () => void
  count: number | null
  isCounting: boolean
  disabled?: boolean
}) {
  return (
    <Button
      size="lg"
      className="text-body tabular-nums"
      onClick={onApply}
      disabled={disabled}
      aria-busy={isCounting}
    >
      <span
        aria-live="polite"
        className={cn(
          "transition-opacity duration-200",
          isCounting && "opacity-60"
        )}
      >
        {carCountLabel(count)}
      </span>
    </Button>
  )
}

export function ResetFiltersButton({ onReset }: { onReset: () => void }) {
  return (
    <Button
      variant="ghost"
      className="-ml-2.5 px-2.5 text-body"
      onClick={onReset}
    >
      Clear all
    </Button>
  )
}
