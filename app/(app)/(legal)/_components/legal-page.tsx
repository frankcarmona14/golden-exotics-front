import Link from "next/link"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { ChevronLeftIcon } from "@/components/icons/chevron-left"

interface LegalPageProps {
  title: string
  subtitle?: string
  lastUpdated: Date
  toc?: { id: string; label: string }[]
  children: React.ReactNode
}

export function LegalPage({
  title,
  subtitle,
  lastUpdated,
  toc,
  children,
}: LegalPageProps) {
  return (
    <div className="mx-auto w-full max-w-none px-5 pb-24 pt-10 sm:max-w-[90%] sm:px-0 sm:pt-14 xl:max-w-6xl">
      {/* Back link */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-body-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          <ChevronLeftIcon className="size-4" />
          Back to home
        </Link>
      </div>

      {/* Header */}
      <header className="mb-10 border-b border-neutral-200 pb-8 dark:border-neutral-800">
        <p className="mb-3 text-caption font-semibold uppercase tracking-[0.12em] text-subtle">
          Legal
        </p>
        <h1 className="text-balance text-heading sm:text-heading-lg text-neutral-950 dark:text-neutral-50">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-balance text-body leading-relaxed text-neutral-600 dark:text-neutral-400">
            {subtitle}
          </p>
        )}
        <p className="mt-6 text-caption text-neutral-500 dark:text-neutral-500">
          Last updated:{" "}
          <time
            dateTime={lastUpdated.toISOString()}
            className="font-medium text-neutral-700 dark:text-neutral-300"
          >
            {format(lastUpdated, "MMMM d, yyyy")}
          </time>
        </p>
      </header>

      {/* Body: optional TOC + content */}
      <div
        className={cn(
          "grid gap-10",
          toc && toc.length > 0 && "lg:grid-cols-[220px_1fr] lg:gap-16"
        )}
      >
        {toc && toc.length > 0 && (
          <aside className="hidden lg:block">
            <nav className="sticky top-[calc(var(--site-header-height)+24px)]">
              <p className="mb-3 text-caption font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                On this page
              </p>
              <ul className="space-y-2 text-body-sm">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}

        <article
          className={cn(
            "max-w-none text-body leading-relaxed text-neutral-700 dark:text-neutral-300",
            "prose-headings:scroll-mt-[calc(var(--site-header-height)+16px)]"
          )}
        >
          {children}
        </article>
      </div>
    </div>
  )
}

interface LegalSectionProps {
  id: string
  title: string
  children: React.ReactNode
}

export function LegalSection({ id, title, children }: LegalSectionProps) {
  return (
    <section id={id} className="mb-10 scroll-mt-[calc(var(--site-header-height)+16px)]">
      <h2 className="mb-4 text-subheading sm:text-heading-sm text-neutral-950 dark:text-neutral-50">
        {title}
      </h2>
      <div className="space-y-4 text-body leading-relaxed [&_a]:font-medium [&_a]:text-neutral-950 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-accent dark:[&_a]:text-neutral-50">
        {children}
      </div>
    </section>
  )
}

interface LegalListProps {
  children: React.ReactNode
  ordered?: boolean
}

export function LegalList({ children, ordered }: LegalListProps) {
  const className =
    "ml-5 list-outside space-y-2 marker:text-neutral-400 dark:marker:text-neutral-500"
  if (ordered) {
    return <ol className={cn(className, "list-decimal")}>{children}</ol>
  }
  return <ul className={cn(className, "list-disc")}>{children}</ul>
}

export function LegalCallout({
  children,
  variant = "info",
}: {
  children: React.ReactNode
  variant?: "info" | "warning"
}) {
  return (
    <div
      className={cn(
        "my-6 rounded-card border p-5 text-body-sm leading-relaxed",
        variant === "info" &&
          "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-300",
        variant === "warning" &&
          "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200"
      )}
    >
      {children}
    </div>
  )
}
