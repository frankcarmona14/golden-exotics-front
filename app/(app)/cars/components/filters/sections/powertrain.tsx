import { Dispatch, SetStateAction } from "react"

import { Separator } from "@/components/ui/separator"
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
      <h3 className="text-[15px] font-semibold">Powertrain</h3>
      <div className="pt-4">
        <ToggleGroup
          type="single"
          value={selectedFilters.powertrain ?? ""}
          onValueChange={(value) =>
            handlePowertrainChange(value as Powertrain | undefined)
          }
          className="grid min-h-12 w-full auto-cols-fr grid-flow-col gap-0 rounded-2xl border border-neutral-300 p-1 dark:border-neutral-700"
        >
          {powertrains.map(({ slug, name }) => (
            <ToggleGroupItem
              key={slug}
              value={slug}
              className="group relative m-0 size-full rounded-none p-0 text-neutral-900 first:rounded-l-xl last:rounded-r-xl hover:bg-none dark:text-neutral-100 [&>span]:data-[state=off]:border-transparent [&>span]:data-[state=on]:border-accent [&>span]:data-[state=off]:bg-transparent [&>span]:data-[state=on]:bg-accent [&>span]:data-[state=on]:text-accent-foreground"
            >
              <span className="flex size-full items-center justify-center rounded-xl border-2 border-transparent text-[14px] font-medium transition-colors">
                {name}
              </span>
              <Separator
                orientation="vertical"
                className="h-1/2 group-last:hidden"
              />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </section>
  )
}
