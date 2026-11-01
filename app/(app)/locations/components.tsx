import { Suspense } from "react"
import Link from "next/link"

import type { SelectCar } from "@/lib/schema-types"
import { cn } from "@/lib/utils"

import { CarCard } from "../cars/components/car-card"

const chipClass =
  "inline-flex h-9 shrink-0 items-center rounded-pill border px-4 text-body-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:text-neutral-100"

/** Fila de enlaces a otras páginas: ciudades vecinas, áreas, marcas. */
export function LinkChips({
  label,
  links,
}: {
  label: string
  links: { href: string; name: string }[]
}) {
  if (links.length === 0) return null
  return (
    <nav aria-label={label}>
      <h2 className="text-subheading">{label}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={chipClass}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Migas visibles; las de JSON-LD van aparte. */
export function Breadcrumbs({
  trail,
}: {
  trail: { name: string; href?: string }[]
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-body-sm text-neutral-500 dark:text-neutral-400">
        {trail.map((crumb, i) => (
          <li key={crumb.name} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                {crumb.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-neutral-900 dark:text-neutral-100">
                {crumb.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function Section({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("mt-12", className)}>
      <h2 className="text-heading-sm">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export function FleetGrid({ cars }: { cars: SelectCar[] }) {
  if (cars.length === 0) {
    return (
      <p className="text-body text-neutral-500 dark:text-neutral-400">
        No cars are listed right now.{" "}
        <Link href="/cars" className="underline underline-offset-4">
          See the full fleet
        </Link>
        .
      </p>
    )
  }
  return (
    // CarCard lee las fechas de la URL (useSearchParams): necesita Suspense.
    <Suspense>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car, index) => (
          <CarCard key={car.id} car={car} priority={index < 3} />
        ))}
      </div>
    </Suspense>
  )
}

export function Faqs({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-neutral-200 rounded-card border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
      {faqs.map((faq) => (
        <details key={faq.question} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-body font-medium [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span
              aria-hidden
              className="text-neutral-400 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-2 text-body text-neutral-600 dark:text-neutral-400">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
