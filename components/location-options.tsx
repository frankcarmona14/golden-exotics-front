"use client"

import type { SearchLocation } from "@/lib/schema-types"
import { cn } from "@/lib/utils"
import { CommandGroup, CommandItem } from "@/components/ui/command"
import { CheckIcon } from "@/components/icons/check"

/**
 * Opciones del campo *Pick-up / Drop-off*, en dos grupos: la oficina y las
 * zonas de entrega. Lo comparten el buscador de escritorio y el del móvil.
 *
 * Elegir la opción ya elegida la quita (vuelve a "cualquiera").
 */
export function LocationOptions({
  locations,
  selected,
  onSelect,
}: {
  locations: SearchLocation[]
  selected: string
  onSelect: (value: string) => void
}) {
  const groups = [
    { heading: "Pick up", items: locations.filter((l) => l.kind === "pickup") },
    { heading: "Delivery", items: locations.filter((l) => l.kind === "delivery") },
  ]

  return groups.map(
    ({ heading, items }) =>
      items.length > 0 && (
        <CommandGroup key={heading} heading={heading}>
          {items.map((loc) => (
            <CommandItem
              key={loc.value}
              // cmdk filtra por `value`: el nombre y el detalle, que es lo que
              // el cliente escribe. El código de la zona no lo conoce nadie.
              value={`${loc.name} ${loc.detail ?? ""}`}
              onSelect={() => onSelect(loc.value === selected ? "" : loc.value)}
            >
              <CheckIcon
                className={cn(
                  "mr-2 size-4 shrink-0",
                  selected === loc.value ? "opacity-100" : "opacity-0"
                )}
              />
              <div className="min-w-0">
                <p className="truncate text-foreground">{loc.name}</p>
                {loc.detail && (
                  <p className="truncate text-xs text-muted-foreground">
                    {loc.detail}
                  </p>
                )}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      )
  )
}
