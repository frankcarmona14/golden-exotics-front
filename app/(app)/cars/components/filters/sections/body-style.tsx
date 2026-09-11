import { Dispatch, SetStateAction } from "react"

import { Toggle } from "@/components/ui/toggle"
import { CarIcon } from "@/components/icons/car"
import { HatchbackIcon } from "@/components/icons/hatchback"
import { MinivanIcon } from "@/components/icons/minivan"
import { RoadsterIcon } from "@/components/icons/roadster"
import { SUVIcon } from "@/components/icons/suv"
import { TruckIcon } from "@/components/icons/truck"

import { BodyStyle, SelectedFilters } from "../types"

export const bodyStyles: {
  slug: BodyStyle
  name: string
  icon: (props: React.HTMLAttributes<SVGElement>) => JSX.Element
}[] = [
  {
    slug: "hatchback",
    name: "Hatchback",
    icon: HatchbackIcon,
  },
  { slug: "minivan", name: "Minivan", icon: MinivanIcon },
  {
    slug: "pickup-truck",
    name: "Pickup Truck",
    icon: TruckIcon,
  },
  {
    slug: "sports-car",
    name: "Sports Car",
    icon: RoadsterIcon,
  },
  { slug: "suv", name: "SUV", icon: SUVIcon },
  { slug: "sedan", name: "Sedan", icon: CarIcon },
]

interface BodyStyleFiltersProps {
  selectedFilters: SelectedFilters
  setSelectedFilters: Dispatch<SetStateAction<SelectedFilters>>
}

export function BodyStyleFilters({
  selectedFilters,
  setSelectedFilters,
}: BodyStyleFiltersProps) {
  const handleBodyStyleToggle = (bodyStyle: BodyStyle) => {
    setSelectedFilters((prevFilters) => {
      const bodyStylesSelected = prevFilters.bodyStyles.includes(bodyStyle)
        ? prevFilters.bodyStyles.filter((selected) => selected !== bodyStyle)
        : [...prevFilters.bodyStyles, bodyStyle]

      return { ...prevFilters, bodyStyles: bodyStylesSelected }
    })
  }

  return (
    <section>
      <h3 className="text-[15px] font-semibold">Body Style</h3>
      <div className="pt-4">
        <div className="flex flex-wrap items-center gap-2.5">
          {bodyStyles.map(({ slug, name, icon: Icon }) => (
            <Toggle
              key={slug}
              variant={"outline"}
              className="h-11 gap-2 rounded-full px-4"
              pressed={selectedFilters.bodyStyles.includes(slug)}
              onPressedChange={() => handleBodyStyleToggle(slug)}
            >
              <Icon className="size-[22px]" />
              <span className="text-[13px] font-medium">{name}</span>
            </Toggle>
          ))}
        </div>
      </div>
    </section>
  )
}
