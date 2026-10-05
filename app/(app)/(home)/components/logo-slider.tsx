"use client"

import { useEffect, useMemo, useRef, useState } from "react"

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

/** Lo que la franja necesita de cada marca (ver brand-repository). */
export interface SliderBrand {
  handle: string
  name: string
  logoUrl: string | null
}

/**
 * Logos incluidos en el código para las marcas de la flota, por handle de
 * categoría. Se usan mientras no se suba uno en el admin (Brand images).
 */
const builtInLogos: Record<string, JSX.Element> = {
  lamborghini: <LamborghiniIcon style={{ height: "34px", flexShrink: 0 }} />,
  mclaren: <McLarenIcon style={{ height: "14px", flexShrink: 0 }} />,
  "mercedes-benz": (
    <MercedesBenzIcon style={{ height: "26px", flexShrink: 0 }} />
  ),
  cadillac: <CadillacIcon style={{ height: "22px", flexShrink: 0 }} />,
  bmw: <BMWIcon style={{ height: "28px", flexShrink: 0 }} />,
  chevrolet: <ChevroletIcon style={{ height: "20px", flexShrink: 0 }} />,
}

/**
 * Solo las marcas de la flota (las categorías de Medusa): una marca que no se
 * alquila no pinta nada aquí. Logo subido, si no el incluido; una marca sin
 * ninguno no sale.
 */
function toLogos(brands: SliderBrand[]): LogoData[] {
  return brands.flatMap(({ handle, name, logoUrl }) => {
    if (logoUrl) {
      return [
        {
          id: handle,
          icon: (
            // Monocromo como los incluidos: el color lo pone la franja. <img>
            // y no next/image porque puede ser un SVG.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={name}
              className="max-h-7 w-auto max-w-[110px] object-contain opacity-60"
              style={{ filter: "brightness(0)" }}
            />
          ),
        },
      ]
    }
    const icon = builtInLogos[handle]
    return icon ? [{ id: handle, icon }] : []
  })
}

function createClonedLogos(logos: LogoData[], totalClones: number): LogoData[] {
  return Array.from({ length: totalClones }).flatMap((_, index) =>
    logos.map(({ id, icon }) => ({
      id: `${id}-clone-${index + 1}`,
      icon,
    }))
  )
}

export function LogoSlider({ brands }: { brands: SliderBrand[] }) {
  const logosListRef = useRef<HTMLDivElement>(null)
  const [clonedLogos, setClonedLogos] = useState<LogoData[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const initialLogos = useMemo(() => toLogos(brands), [brands])

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
  }, [initialLogos])

  if (initialLogos.length === 0) return null

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
