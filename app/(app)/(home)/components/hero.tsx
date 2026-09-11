import { Suspense } from "react"

import { SearchPanelWrapper } from "@/components/search-panel-wrapper"
import { SearchPanelSkeleton } from "@/components/skeletons/search-panel"

export async function Hero() {
  return (
    <section className="relative">
      {/* Video background */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900 sm:aspect-video lg:aspect-[21/9]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 size-full scale-105 object-cover"
        >
          <source src="/assets/videos/header.mp4" type="video/mp4" />
        </video>

        {/* Multi-layer gradient overlays for cinematic feel */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5">
          {/* Accent line */}
          {/* <div className="mb-5 h-px w-12 bg-accent sm:mb-6 sm:w-16" /> */}

          {/* Subtitle */}
          {/* <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70 sm:mb-4 sm:text-xs sm:tracking-[0.35em]">
            Premium Car Rental
          </p> */}

          <h1 className="text-center text-3xl font-bold tracking-tight text-white drop-shadow-2xl sm:text-4xl md:text-5xl lg:text-6xl">
            Your Road Trip
            <span className="block bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-lg text-center text-sm leading-relaxed text-white/60 sm:mt-5 sm:text-base lg:max-w-xl">
            Discover luxury vehicles from the world&apos;s most iconic brands.
            Book seamlessly, drive confidently.
          </p>

          <div className="hidden w-full max-w-[860px] pt-8 md:block lg:pt-10">
            <Suspense fallback={<SearchPanelSkeleton />}>
              <SearchPanelWrapper />
            </Suspense>
          </div>
        </div>

        {/* Bottom fade to page background */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white from-5% via-white/80 to-transparent dark:from-neutral-950 dark:via-neutral-950/80 sm:h-44" />
      </div>
    </section>
  )
}
