import { Dispatch, SetStateAction } from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Powertrain, SelectedFilters } from "../types"

const powertrains: {
  slug: Powertrain
  name: string
}[] = [
  {
    slug: "gasoline",
    name: "Gasoline",
  },
  { slug: "diesel", name: "Diesel" },
  { slug: "hybrid", name: "Hybrid" },
  {
    slug: "electric",
    name: "Electric",
  },
]

interface PowertrainFiltersProps {
  selectedFilters: SelectedFilters
  setSelectedFilters: Dispatch<SetStateAction<SelectedFilters>>
}

export function PowertrainFilters({
  selectedFilters,
  setSelectedFilters,
}: PowertrainFiltersProps) {
  const handlePowertrainChange = (powertrain: Powertrain | undefined) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      powertrain: powertrain ?? undefined,
    }))
  }

  return (
    <section>
      <h3 className="text-body font-semibold">Powertrain</h3>
      <div className="pt-4">
        <ToggleGroup
          type="single"
          value={selectedFilters.powertrain ?? ""}
          onValueChange={(value) =>
            handlePowertrainChange(value as Powertrain | undefined)
          }
          className="grid min-h-12 w-full auto-cols-fr grid-flow-col gap-0 rounded-pill bg-neutral-200/70 p-1 dark:bg-white/[0.06]"
        >
          {powertrains.map(({ slug, name }) => (
            <ToggleGroupItem
              key={slug}
              value={slug}
              className="group relative m-0 size-full rounded-none p-0 text-neutral-900 first:rounded-l-pill last:rounded-r-pill hover:bg-none dark:text-neutral-100 [&>span]:data-[state=off]:border-transparent [&>span]:data-[state=on]:border-accent [&>span]:data-[state=off]:bg-transparent [&>span]:data-[state=on]:bg-accent [&>span]:data-[state=on]:text-accent-foreground"
            >
              <span className="flex size-full items-center justify-center rounded-pill border-2 border-transparent text-body-sm font-medium transition-colors">
                {name}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </section>
  )
}
