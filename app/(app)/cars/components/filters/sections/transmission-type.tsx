import { Dispatch, SetStateAction } from "react"

import { Toggle } from "@/components/ui/toggle"
import { AutomaticGearboxIcon } from "@/components/icons/automatic-gearbox"
import { ManualGearboxIcon } from "@/components/icons/manual-gearbox"

import { SelectedFilters, Transmission } from "../types"

const transmissions: {
  slug: Transmission
  name: string
  icon: (props: React.HTMLAttributes<SVGElement>) => JSX.Element
}[] = [
  {
    slug: "automatic",
    name: "Automatic",
    icon: AutomaticGearboxIcon,
  },
  { slug: "manual", name: "Manual", icon: ManualGearboxIcon },
]

interface TransmissionTypeFiltersProps {
  selectedFilters: SelectedFilters
  setSelectedFilters: Dispatch<SetStateAction<SelectedFilters>>
}

export function TransmissionTypeFilters({
  selectedFilters,
  setSelectedFilters,
}: TransmissionTypeFiltersProps) {
  const handleTransmissionToggle = (transmission: Transmission) => {
    setSelectedFilters((prevFilters) => {
      const transmissionsSelected = prevFilters.transmissions.includes(
        transmission
      )
        ? prevFilters.transmissions.filter(
            (selected) => selected !== transmission
          )
        : [...prevFilters.transmissions, transmission]

      return { ...prevFilters, transmissions: transmissionsSelected }
    })
  }

  return (
    <section>
      <h3 className="text-[15px] font-semibold">Transmission</h3>
      <div className="pt-4">
        <div className="flex flex-wrap items-center gap-2.5">
          {transmissions.map(({ slug, name, icon: Icon }) => (
            <Toggle
              key={slug}
              variant={"outline"}
              className="h-11 gap-2 rounded-full px-4"
              pressed={selectedFilters.transmissions.includes(slug)}
              onPressedChange={() => handleTransmissionToggle(slug)}
            >
              <Icon className="size-[22px] [stroke-width:1.5]" />
              <span className="text-[13px] font-medium">{name}</span>
            </Toggle>
          ))}
        </div>
      </div>
    </section>
  )
}
