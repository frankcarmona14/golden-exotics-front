import Link from "next/link"

import { Button } from "@/components/ui/button"

/**
 * Aviso de que este paso viene de un presupuesto (P1-1): fechas, extras,
 * entrega y precio están fijados y no se pueden cambiar aquí.
 */
export function QuoteLockedNote({
  token,
  className,
}: {
  token: string
  className?: string
}) {
  return (
    <p
      role="note"
      className={`rounded-tight border border-border bg-muted p-3 text-body-sm text-neutral-600 dark:text-neutral-400 ${className ?? ""}`}
    >
      Prices and options from your quote. To change the dates, extras or
      delivery, ask us for a new quote.{" "}
      <Link
        href={`/quote/${encodeURIComponent(token)}`}
        className="underline underline-offset-4"
      >
        View quote
      </Link>
    </p>
  )
}

/** Un presupuesto que ya no se puede reservar: caducado, cancelado, reservado. */
export function QuoteUnavailable({
  token,
  message,
}: {
  token: string
  message: string
}) {
  return (
    <main id="main-content" className="mx-auto w-full max-w-2xl px-5 py-20">
      <h1 className="text-heading-sm">
        This quote can&apos;t be booked
      </h1>
      <p className="mt-3 text-body leading-relaxed text-muted-foreground">
        {message}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {token && (
          <Button asChild>
            <Link href={`/quote/${encodeURIComponent(token)}`}>
              Back to your quote
            </Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href="/cars">Explore cars</Link>
        </Button>
      </div>
    </main>
  )
}
