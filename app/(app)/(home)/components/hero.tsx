import { Suspense } from "react"
import Image from "next/image"
import heroPoster from "@/public/assets/images/hero/hero-poster.jpg"

import { SearchPanelWrapper } from "@/components/search-panel-wrapper"
import { SearchPanelSkeleton } from "@/components/skeletons/search-panel"

import { HeroVideo } from "./hero-video"

export async function Hero() {
  return (
    <section className="relative">
      {/* Video background */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900 sm:aspect-video lg:aspect-[21/9]">
        {/* El primer fotograma del vídeo como imagen prioritaria: es lo que
            Google mide como LCP. Sin ella, el LCP esperaba a que el vídeo
            decodificara su primer fotograma (~3 s más en móvil). */}
        <Image
          src={heroPoster}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          className="scale-105 object-cover"
        />
        <HeroVideo />

        {/* Multi-layer gradient overlays for cinematic feel */}
        <div className="pointer-events-none absolute inset-0 bg-black/40 dark:bg-black/50" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent dark:to-black/70" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5">
          {/* Accent line */}
          {/* <div className="mb-5 h-px w-12 bg-accent sm:mb-6 sm:w-16" /> */}

          {/* Subtitle */}
          {/* <p className="mb-3 text-caption font-semibold uppercase tracking-[0.3em] text-white/70 sm:mb-4 sm:text-xs sm:tracking-[0.35em]">
            Premium Car Rental
          </p> */}

          <h1 className="text-balance text-center text-heading font-semibold text-white sm:text-heading-lg lg:text-display xl:text-display-xl">
            Exotic &amp; Luxury Car Rental{" "}
            <span className="block bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent">
              in Miami
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-lg text-pretty text-center text-body-sm text-white/70 sm:mt-6 sm:text-body lg:max-w-xl">
            Pick up next to Miami International Airport or have the car
            delivered, from Miami Beach to Palm Beach. Real daily prices,
            booked online.
          </p>

          <div className="hidden w-full max-w-[860px] pt-8 md:block lg:pt-10">
            <Suspense fallback={<SearchPanelSkeleton />}>
              <SearchPanelWrapper />
            </Suspense>
          </div>
        </div>

        {/* Soft join into the page — dark only. In light it reads as a haze.
            `pointer-events-none` is load-bearing: this sits after the content
            layer, so without it the fade swallows every click on the bottom
            176px of the hero — which is exactly where the search panel is. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-t from-background from-5% via-background/80 to-transparent dark:block sm:h-44" />
      </div>
    </section>
  )
}
