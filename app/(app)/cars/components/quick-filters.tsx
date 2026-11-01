"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { SearchParams } from "@/lib/types"
import { cn, constructUrlWithParams } from "@/lib/utils"
import { AutomaticGearboxIcon } from "@/components/icons/automatic-gearbox"
import { BatteryAutomotiveIcon } from "@/components/icons/battery-automotive"
import { RoadsterIcon } from "@/components/icons/roadster"
import { SUVIcon } from "@/components/icons/suv"

import { pillClassName } from "./pill"

type QuickFilter = {
  label: string
  param: SearchParams
  value: string
  /** `powertrain` admite un solo valor: marcar uno sustituye al otro. */
  single?: boolean
  icon?: (props: React.HTMLAttributes<SVGElement>) => JSX.Element
}

const QUICK_FILTERS: QuickFilter[] = [
  {
    label: "Sports car",
    param: SearchParams.BODY_STYLE,
    value: "sports-car",
    icon: RoadsterIcon,
  },
  { label: "SUV", param: SearchParams.BODY_STYLE, value: "suv", icon: SUVIcon },
  {
    label: "Automatic",
    param: SearchParams.TRANSMISSION,
    value: "automatic",
    icon: AutomaticGearboxIcon,
  },
  {
    label: "Electric",
    param: SearchParams.POWERTRAIN,
    value: "electric",
    single: true,
    icon: BatteryAutomotiveIcon,
  },
  {
    label: "Hybrid",
    param: SearchParams.POWERTRAIN,
    value: "hybrid",
    single: true,
  },
]

/**
 * Atajos a los filtros más buscados, siempre a la vista. Escriben en la URL
 * los mismos parámetros que el panel de filtros, así que los dos se ven
 * mutuamente.
 */
export function QuickFilters({
  onNavigate,
}: {
  onNavigate: (url: string) => void
}) {
  const searchParams = useSearchParams()

  const toggle = ({ param, value, single }: QuickFilter, active: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    if (single) {
      if (active) params.delete(param)
      else params.set(param, value)
    } else {
      const rest = params.getAll(param).filter((v) => v !== value)
      params.delete(param)
      rest.forEach((v) => params.append(param, v))
      if (!active) params.append(param, value)
    }
    onNavigate(constructUrlWithParams("/cars", params))
  }

  return (
    <>
      {QUICK_FILTERS.map((filter) => {
        const active = searchParams.getAll(filter.param).includes(filter.value)
        const Icon = filter.icon
        return (
          <button
            key={`${filter.param}-${filter.value}`}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(filter, active)}
            className={cn(
              pillClassName,
              active &&
                "bg-accent text-accent-foreground hover:bg-accent-hover dark:bg-accent dark:hover:bg-accent-hover"
            )}
          >
            {Icon && <Icon className="size-4 shrink-0" />}
            {filter.label}
          </button>
        )
      })}
    </>
  )
}
