export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCarBySlug } from "@/db/queries/car-repository"

import { getRentalQuote } from "@/lib/medusa/rental"
import {
  formatWallClock,
  quoteBookingHref,
  quoteItemBlocker,
  quoteItemToBreakdown,
} from "@/lib/quotes"
import { NOINDEX_METADATA } from "@/lib/seo/metadata"
import type { RentalQuote, RentalQuoteItem } from "@/lib/types/rental"
import { formatAmountForDisplay } from "@/lib/utils"
import CldImage from "@/components/cld-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import {
  DailyRate,
  PriceDetails,
} from "../../reservation/cars/[slug]/[[...rest]]/components/price-details"

/**
 * La URL lleva la llave del presupuesto: no se indexa ni se cuela en el
 * sitemap (que solo lista páginas públicas fijas y el catálogo).
 */
export const metadata: Metadata = {
  ...NOINDEX_METADATA,
  title: "Your quote",
}

/**
 * Zona del negocio. El admin guarda la caducidad como "fin del día elegido"; en
 * la hora de Miami ese día no se mueve, así que la fecha se pinta ahí.
 */
const BUSINESS_TIME_ZONE = "America/New_York"

function formatValidUntil(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: BUSINESS_TIME_ZONE,
  })
}

/** Mensaje de cabecera cuando el presupuesto ya no se puede reservar. */
const STATUS_NOTICE: Partial<
  Record<RentalQuote["status"], { title: string; body: string }>
> = {
  expired: {
    title: "This quote has expired",
    body: "The prices in this quote are no longer held. Contact us and we will send you a new one.",
  },
  cancelled: {
    title: "This quote was cancelled",
    body: "This quote is no longer valid. Contact us if you still want to rent one of these cars.",
  },
  accepted: {
    title: "You booked this quote",
    body: "Every car in this quote is already reserved. Check your email for the confirmation.",
  },
}

/**
 * Presupuesto público (P1-1).
 *
 * El operador manda el enlace con la llave; quien lo abre ve los coches con el
 * precio negociado y reserva cada uno en el flujo de siempre, con fechas,
 * extras y entrega fijados por el presupuesto.
 */
export default async function QuotePage({
  params,
}: {
  params: { token: string }
}) {
  const quote = await getRentalQuote(params.token)

  if (!quote) {
    notFound()
  }

  const notice = STATUS_NOTICE[quote.status]
  const currency = quote.currency_code
  const cars = await Promise.all(
    quote.items.map((item) =>
      item.handle ? getCarBySlug(item.handle) : Promise.resolve(undefined)
    )
  )

  return (
    <main id="main-content" className="px-5 pb-16 pt-8 md:py-16">
      <div className="mx-auto max-w-none sm:max-w-[90%] sm:px-0 xl:max-w-4xl">
        <header>
          <p className="text-[15px] text-neutral-500 dark:text-neutral-400">
            Your quote
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            {quote.first_name ? `Hi ${quote.first_name},` : "Hi,"} here is your
            price
          </h1>
          {quote.message && (
            <p className="mt-4 max-w-prose whitespace-pre-line text-[15px] leading-relaxed">
              {quote.message}
            </p>
          )}
          {quote.status === "sent" && (
            <p className="mt-4 text-[15px] text-neutral-600 dark:text-neutral-400">
              Valid until{" "}
              <strong className="font-medium text-neutral-900 dark:text-neutral-100">
                {formatValidUntil(quote.expires_at)}
              </strong>
            </p>
          )}
        </header>

        {notice && (
          <div
            role="status"
            className="mt-8 rounded-xl border border-border bg-muted p-4 text-[15px]"
          >
            <p className="font-medium">{notice.title}</p>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
              {notice.body}
            </p>
          </div>
        )}

        <ul className="mt-10 grid grid-cols-1 gap-8">
          {quote.items.map((item, index) => (
            <li key={item.id}>
              <QuoteItemCard
                quote={quote}
                item={item}
                currency={currency}
                imageUrl={cars[index]?.imageUrl ?? null}
              />
            </li>
          ))}
        </ul>

        {quote.items.length > 1 && (
          <section
            aria-labelledby="quote-totals"
            className="mt-10 rounded-xl border border-border p-6"
          >
            <h2 id="quote-totals" className="text-xl font-semibold">
              Quote total
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-3 tabular-nums">
              <div className="flex items-center justify-between text-[15px]">
                <span>
                  {quote.items.length} cars ({currency.toUpperCase()})
                </span>
                <span>
                  {formatAmountForDisplay(quote.totals.total, currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <strong>Due when you book</strong>
                <strong>
                  {formatAmountForDisplay(quote.totals.upfront, currency)}
                </strong>
              </div>
              <div className="flex items-center justify-between text-[15px]">
                <span>Balance</span>
                <span>
                  {formatAmountForDisplay(
                    Math.round(
                      (quote.totals.total - quote.totals.upfront) * 100
                    ) / 100,
                    currency
                  )}
                </span>
              </div>
              <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                Each car is booked and paid on its own.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

function QuoteItemCard({
  quote,
  item,
  currency,
  imageUrl,
}: {
  quote: RentalQuote
  item: RentalQuoteItem
  currency: string
  imageUrl: string | null
}) {
  const blocker = quoteItemBlocker(quote, item)
  const days = item.rental_days

  return (
    <article className="grid grid-cols-1 gap-8 rounded-xl border border-border p-6 md:grid-cols-[minmax(0,1fr)_minmax(260px,380px)]">
      <div>
        <div className="flex items-start gap-5">
          {imageUrl && (
            <div className="relative aspect-square w-[88px] shrink-0">
              <CldImage
                src={imageUrl}
                alt={item.vehicle}
                className="rounded-xl object-cover"
                fill
                sizes="176px"
              />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">{item.vehicle}</h2>
              {item.booked && <Badge variant="secondary">Booked</Badge>}
            </div>
            <p className="mt-1 text-[15px] tabular-nums">
              <DailyRate
                rate={{ price: item.daily_price, list: item.list_daily_price }}
                currency={currency}
              />
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 text-[15px]">
          <div>
            <dt className="font-medium">Pickup</dt>
            <dd className="text-neutral-600 dark:text-neutral-400">
              {formatWallClock(item.rental_start_date)}
            </dd>
          </div>
          <div>
            <dt className="font-medium">Return</dt>
            <dd className="text-neutral-600 dark:text-neutral-400">
              {formatWallClock(item.rental_end_date)}
            </dd>
          </div>
          <div>
            <dt className="font-medium">Duration</dt>
            <dd className="text-neutral-600 dark:text-neutral-400">
              {days} {days === 1 ? "day" : "days"}
            </dd>
          </div>
          <div>
            <dt className="font-medium">
              {item.delivery_zone ? "Delivery" : "Pickup location"}
            </dt>
            <dd className="text-neutral-600 dark:text-neutral-400">
              {item.delivery_zone
                ? (item.lines.find(
                    (line) => line.code === `delivery_${item.delivery_zone}`
                  )?.label ?? "Delivered to your address")
                : "At our location"}
            </dd>
          </div>
        </dl>

        <div className="mt-8">
          {item.booked ? null : blocker ? (
            <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
              {blocker}
            </p>
          ) : (
            <Button size="lg" asChild>
              <Link href={quoteBookingHref(quote.token, item)}>
                Book this car
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div>
        <Separator className="mb-6 md:hidden" />
        <PriceDetails
          title="Price"
          days={days}
          currency={currency}
          breakdown={quoteItemToBreakdown(item)}
          deposit={null}
          fallbackSubtotal={item.total}
        />
      </div>
    </article>
  )
}
