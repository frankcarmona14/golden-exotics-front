"use client"

import { useEffect, useRef, useState } from "react"

import { CAR_LOGO_WIDTH, CLONE_SETS_COUNT } from "@/lib/constants"
import { cn, setCSSVariable } from "@/lib/utils"

import { BMWIcon } from "./car-logos/bmw"
import { CadillacIcon } from "./car-logos/cadillac"
import { ChevroletIcon } from "./car-logos/chevrolet"
import { LamborghiniIcon } from "./car-logos/lamborghini"
import { McLarenIcon } from "./car-logos/mclaren"
import { MercedesBenzIcon } from "./car-logos/mercedes-benz"

interface LogoData {
  id: string
  icon: JSX.Element
}

/**
 * Solo las marcas de la flota real (Lamborghini, McLaren, Mercedes-Benz con
 * AMG y Maybach, Cadillac, BMW, Chevrolet Corvette). Una marca que no se
 * alquila no pinta nada aquí: es una promesa que la web no cumple.
 */
const logoIcons: Record<string, JSX.Element> = {
  lamborghini: <LamborghiniIcon style={{ height: "34px", flexShrink: 0 }} />,
  mclaren: <McLarenIcon style={{ height: "14px", flexShrink: 0 }} />,
  mercedesBenz: <MercedesBenzIcon style={{ height: "26px", flexShrink: 0 }} />,
  cadillac: <CadillacIcon style={{ height: "22px", flexShrink: 0 }} />,
  bmw: <BMWIcon style={{ height: "28px", flexShrink: 0 }} />,
  chevrolet: <ChevroletIcon style={{ height: "20px", flexShrink: 0 }} />,
}

const initialLogos: LogoData[] = Object.entries(logoIcons).map(
  ([id, icon]) => ({ id, icon })
)

function createClonedLogos(logos: LogoData[], totalClones: number): LogoData[] {
  return Array.from({ length: totalClones }).flatMap((_, index) =>
    logos.map(({ id, icon }) => ({
      id: `${id}-clone-${index + 1}`,
      icon,
    }))
  )
}

export function LogoSlider() {
  const logosListRef = useRef<HTMLDivElement>(null)
  const [clonedLogos, setClonedLogos] = useState<LogoData[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const logoList = logosListRef.current

    if (logoList) {
      const totalLogos = initialLogos.length

      // IMPORTANT: This CSS Variable is used for the animate-slider keyframes
      setCSSVariable("--slider-total-clones", (CLONE_SETS_COUNT + 1).toString())

      setCSSVariable("--slider-total-logos", totalLogos.toString())
      setCSSVariable("--slider-logo-width", CAR_LOGO_WIDTH)
      setCSSVariable(
        "--slider-total-logo-width",
        `calc(var(--slider-total-logos) * var(--slider-logo-width) * (var(--slider-total-clones)))`
      )

      setClonedLogos(createClonedLogos(initialLogos, CLONE_SETS_COUNT))
      setIsVisible(true)
    }
  }, [])

  return (
    <div ref={logosListRef} className="animate-slider motion-reduce:animate-none">
      <div
        className={cn(
          "flex w-[var(--slider-total-logo-width)] items-center grayscale transition-opacity duration-300 dark:invert",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        {initialLogos.concat(clonedLogos).map(({ id, icon }) => (
          <div
            key={id}
            className="mx-5 inline-flex w-[var(--slider-logo-width)] items-center justify-center text-neutral-600"
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  )
}
