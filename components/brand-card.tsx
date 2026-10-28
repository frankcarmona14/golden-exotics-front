import Image from "next/image"
import Link from "next/link"

import type { Brand } from "@/db/queries/brand-repository"
import { cn } from "@/lib/utils"

interface BrandCardProps {
  brand: Pick<
    Brand,
    | "handle"
    | "name"
    | "tagline"
    | "logoColor"
    | "gradientFrom"
    | "gradientTo"
    | "logoUrl"
    | "heroImage"
  >
  /** Coches de la marca; sin él la etiqueta dice "Premium". */
  carCount?: number
  /** Para la primera tarjeta visible: su foto puede ser el LCP. */
  priority?: boolean
  className?: string
}

/**
 * Tarjeta de una marca que lleva a su página. Apaisada a propósito: una
 * tarjeta vertical con la foto de un coche se confundía con la ficha de un
 * coche. Es un banner pequeño, con el logo y el nombre como protagonistas.
 */
export function BrandCard({
  brand,
  carCount,
  priority = false,
  className,
}: BrandCardProps) {
  const {
    handle,
    name,
    tagline,
    logoColor,
    gradientFrom,
    gradientTo,
    logoUrl,
    heroImage,
  } = brand
  const badge =
    carCount === undefined
      ? "Premium"
      : carCount === 1
        ? "1 car"
        : `${carCount} cars`

  return (
    <Link
      href={`/brands/${handle}`}
      className={cn(
        "group block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950",
        className
      )}
    >
      <div
        className="relative aspect-video overflow-hidden rounded-card border border-white/[0.06] sm:aspect-[16/7]"
        style={{
          background: `linear-gradient(145deg, ${gradientFrom}, ${gradientTo})`,
        }}
      >
        {heroImage && (
          <>
            <Image
              src={heroImage.url}
              alt={heroImage.alt}
              fill
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 ease-smooth motion-safe:group-hover:scale-[1.03]"
              style={{
                objectPosition: `${heroImage.focalX}% ${heroImage.focalY}%`,
              }}
            />
            {/* Oscurece el lado del texto para que se lea sobre cualquier foto. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/5" />
          </>
        )}

        {!heroImage && (
          <div
            className="absolute -right-10 -top-10 size-48 rounded-full opacity-10 blur-3xl"
            style={{ background: logoColor }}
          />
        )}

        <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
          <div className="max-w-[70%]">
            {logoUrl && (
              // Logo subido en el admin, en blanco sea cual sea su color.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt=""
                className="mb-3 h-7 w-auto max-w-[140px] object-contain sm:h-8"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            )}
            <h3 className="text-heading-sm text-white">{name}</h3>
            {tagline && (
              <p className="mt-1 text-body-sm font-medium italic text-white/60">
                &ldquo;{tagline}&rdquo;
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center rounded-pill border border-white/[0.28] bg-black/[0.28] px-3 py-1.5 text-caption font-bold uppercase tracking-[0.2em] text-neutral-50">
              {badge}
            </span>
            <span className="inline-flex items-center rounded-pill bg-white px-4 py-2 text-caption font-bold uppercase tracking-wider text-neutral-950 transition-transform duration-200 ease-smooth motion-safe:group-hover:translate-x-0.5">
              Explore →
            </span>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 h-[2px] w-full opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${logoColor}, transparent)`,
          }}
        />
      </div>
    </Link>
  )
}
