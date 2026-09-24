"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { VariantProps } from "class-variance-authority"

import { Button, buttonVariants } from "@/components/ui/button"

interface BackButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string
  children?: React.ReactNode
}

/**
 * Un paso atrás en el flujo de reserva: ficha del coche → extras → pago.
 *
 * Desde el pago se vuelve a extras solo si se eligió algo allí (extras o
 * entrega): si no, esa pantalla se salta sola y redirigiría otra vez al pago,
 * dejando al cliente sin salida. En los demás casos, a la ficha del coche.
 */
export function BackButton({
  variant = "ghost",
  size = "icon",
  className,
  children,
}: BackButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleRedirect = () => {
    const isExtrasStep = pathname.endsWith("/extras")
    const carPath = pathname
      .replace(/\/extras$/, "")
      .replace("/reservation/cars", "/cars")

    const choseSomething =
      searchParams.has("addons") || searchParams.has("delivery")

    if (!isExtrasStep && choseSomething) {
      router.push(`${pathname}/extras?${searchParams.toString()}`)
      return
    }

    // La ficha del coche solo necesita las fechas: la selección de extras y
    // entrega no pinta nada allí.
    const tripParams = new URLSearchParams(searchParams)
    tripParams.delete("addons")
    tripParams.delete("delivery")
    router.push(`${carPath}?${tripParams.toString()}`)
  }

  return (
    <Button
      variant={variant}
      size={size}
      type="button"
      onClick={handleRedirect}
      className={className}
      aria-label="Back"
    >
      {children}
    </Button>
  )
}
