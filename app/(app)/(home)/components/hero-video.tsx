"use client"

import { useEffect, useState } from "react"

/**
 * Vídeo de fondo del hero, encima del póster (que pinta `Hero` con next/image).
 *
 * Se monta después del evento `load`, no con la página: si el <video> está en
 * el HTML inicial, Chrome lo toma como elemento LCP y la métrica espera a sus
 * 3,4 MB (~4 s en móvil). Así el LCP es el póster y el vídeo entra con un
 * fundido cuando ya está reproduciéndose. Con "reducir movimiento" o ahorro de
 * datos no se carga: el póster ya es el mismo plano.
 */
export function HeroVideo() {
  const [enabled, setEnabled] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const saveData = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData
    if (reduceMotion || saveData) return

    const enable = () => setEnabled(true)
    if (document.readyState === "complete") {
      enable()
      return
    }
    window.addEventListener("load", enable, { once: true })
    return () => window.removeEventListener("load", enable)
  }, [])

  if (!enabled) return null

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      onPlaying={() => setPlaying(true)}
      className={`absolute inset-0 size-full scale-105 object-cover transition-opacity duration-700 ${
        playing ? "opacity-100" : "opacity-0"
      }`}
    >
      <source src="/assets/videos/header.mp4" type="video/mp4" />
    </video>
  )
}
