import Link from "next/link"

import type { Brand } from "@/db/queries/brand-repository"
import { cn } from "@/lib/utils"

interface BrandCardProps {
  brand: Pick<
    Brand,
    "handle" | "name" | "tagline" | "logoColor" | "gradientFrom" | "gradientTo"
  >
  /** Coches de la marca; sin él la etiqueta dice "Premium". */
  carCount?: number
  className?: string
}

/** Tarjeta vertical de una marca que lleva a su página. */
export function BrandCard({ brand, carCount, className }: BrandCardProps) {
  const { handle, name, tagline, logoColor, gradientFrom, gradientTo } = brand
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
        className="relative aspect-[3/4] overflow-hidden rounded-card border border-white/[0.06] transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        style={{
          background: `linear-gradient(145deg, ${gradientFrom}, ${gradientTo})`,
        }}
      >
        {/* Decorative elements */}
        <div
          className="absolute -right-8 -top-8 size-32 rounded-full opacity-[0.07] blur-2xl"
          style={{ background: logoColor }}
        />
        <div
          className="absolute -bottom-12 -left-12 size-40 rounded-full opacity-5 blur-3xl"
          style={{ background: logoColor }}
        />

        <div className="relative flex h-full flex-col justify-between p-6">
          <div>
            <div className="mb-3 inline-flex items-center rounded-pill border border-white/[0.28] bg-black/[0.28] px-3 py-1.5 text-caption font-bold uppercase tracking-[0.2em] text-neutral-50">
              {badge}
            </div>
          </div>

          <div>
            <h3 className="text-heading-sm text-white">{name}</h3>
            {tagline && (
              <p className="mt-2 text-body-sm font-medium italic text-white/50">
                &ldquo;{tagline}&rdquo;
              </p>
            )}

            <div className="mt-5 flex items-center gap-2">
              <span className="inline-flex items-center rounded-pill bg-white px-4 py-2 text-caption font-bold uppercase tracking-wider text-neutral-950">
                Explore →
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
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
