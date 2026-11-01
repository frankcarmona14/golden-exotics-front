import Image from "next/image"
import Link from "next/link"
import heroPoster from "@/public/assets/images/hero/hero-poster.jpg"

import { Button } from "@/components/ui/button"

import { HeroVideo } from "./hero-video"

export async function Hero() {
  return (
    // Pulled up under the sticky nav, which goes transparent over it.
    <section data-header-overlay className="relative mt-[calc(var(--site-header-height)*-1)]">
      {/* Video background */}
      {/* La pantalla entera. `svh` y no `vh`: con la barra del navegador
          móvil visible, `vh` deja el botón por debajo. */}
      <div className="relative min-h-svh w-full overflow-hidden">
        {/* Media layers only. In dark the bottom fades out by mask, so the
            hero melts into the lit page background; a gradient painted in the
            flat page colour left a visible seam where the light begins. The
            content above (search panel) is outside the mask and stays solid. */}
        <div className="absolute inset-0 bg-neutral-900 dark:[mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
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
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 pt-[var(--site-header-height)]">
          {/* Accent line */}
          {/* <div className="mb-5 h-px w-12 bg-accent sm:mb-6 sm:w-16" /> */}

          {/* Subtitle */}
          {/* <p className="mb-3 text-caption font-semibold uppercase tracking-[0.3em] text-white/70 sm:mb-4 sm:text-xs sm:tracking-[0.35em]">
            Premium Car Rental
          </p> */}

          <h1 className="text-balance text-center text-heading font-semibold text-white sm:text-heading-lg lg:text-display xl:text-display-xl">
            Exotic &amp; Luxury Car Rental{" "}
            <span className="block text-accent">
              in Miami
            </span>
          </h1>
          <p className="mt-4 text-balance text-center text-subheading text-white/80 sm:mt-5 sm:text-heading-sm">
            Near the airport or at your door.
          </p>

          {/* Siempre sobre el vídeo: el anillo de foco claro de la página no
              se vería sobre el fondo oscuro. */}
          <Button
            asChild
            size="lg"
            className="mt-8 px-10 text-body focus-visible:ring-white focus-visible:ring-offset-black lg:mt-10"
          >
            <Link href="/cars">Book now</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
