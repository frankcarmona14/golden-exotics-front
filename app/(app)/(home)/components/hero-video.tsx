"use client"

import { useEffect, useRef, useState } from "react"

import { PlayerPauseIcon } from "@/components/icons/player-pause"
import { PlayerPlayIcon } from "@/components/icons/player-play"

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
  // Pausa del usuario (WCAG 2.2.2): el bucle dura más de 5 s y no se para solo.
  const [paused, setPaused] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

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

  const togglePaused = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play()
      setPaused(false)
    } else {
      video.pause()
      setPaused(true)
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
        onPlaying={() => setPlaying(true)}
        className={`absolute inset-0 size-full scale-105 object-cover transition-opacity duration-700 ${
          playing ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/assets/videos/header.mp4" type="video/mp4" />
      </video>
      {playing && (
        <button
          type="button"
          onClick={togglePaused}
          aria-label={paused ? "Play background video" : "Pause background video"}
          // En móvil tapaba el hero: ahí solo aparece al llegar con teclado o
          // lector de pantalla, que es quien de verdad lo necesita (WCAG 2.2.2).
          className="absolute right-3 top-3 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white/80 pointer-events-none opacity-0 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:pointer-events-auto sm:right-5 sm:top-5 sm:opacity-100"
        >
          {paused ? (
            <PlayerPlayIcon className="size-4" aria-hidden />
          ) : (
            <PlayerPauseIcon className="size-4" aria-hidden />
          )}
        </button>
      )}
    </>
  )
}
