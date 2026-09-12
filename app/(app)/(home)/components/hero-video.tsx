"use client"

import { useEffect, useState } from "react"

export function HeroVideo() {
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduceMotion(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  return (
    <video
      autoPlay={!reduceMotion}
      loop={!reduceMotion}
      muted
      playsInline
      className="absolute inset-0 size-full scale-105 object-cover"
    >
      <source src="/assets/videos/header.mp4" type="video/mp4" />
    </video>
  )
}
