import Link from "next/link"
import { Metadata } from "next"
import { format } from "date-fns"

import { getCustomer } from "@/lib/medusa/customer"
import { getOrderRentals } from "@/lib/medusa/rental"
import { formatAmountForDisplay } from "@/lib/utils"
import { getWhatsAppUrl, siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Reservation confirmed",
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function CarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M4.5 7a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1ZM11 7.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Z" />
      <path fillRule="evenodd" d="M3.989 3.742A1.5 1.5 0 0 1 5.44 3h5.12a1.5 1.5 0 0 1 1.451.742l1.514 2.802A2.5 2.5 0 0 1 15 8.5v2a1.5 1.5 0 0 1-1 1.415V13a1 1 0 1 1-2 0v-1H4v1a1 1 0 1 1-2 0v-1.085A1.5 1.5 0 0 1 1 10.5v-2a2.5 2.5 0 0 1 1.475-1.956l1.514-2.802ZM5.44 4.5a.5.5 0 0 0-.484.247L3.91 6.5h8.18l-1.047-1.753A.5.5 0 0 0 10.56 4.5H5.44Z" clipRule="evenodd" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M8 1a.75.75 0 0 1 .544.235l5.25 5.5a.75.75 0 0 1-.07 1.085l-5.25 4.25a.75.75 0 0 1-.948 0l-5.25-4.25a.75.75 0 0 1-.07-1.085l5.25-5.5A.75.75 0 0 1 8 1Zm3.28 5.72a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-1.25-1.25a.75.75 0 1 1 1.06-1.06l.72.72 1.97-1.97a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
      <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M5.75 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM5 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM7.25 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM7.25 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM10.25 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
      <path fillRule="evenodd" d="M5.75 1a.75.75 0 0 1 .75.75V3h3V1.75a.75.75 0 0 1 1.5 0V3h1.25A1.75 1.75 0 0 1 14 4.75v7.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-7.5A1.75 1.75 0 0 1 3.75 3H5V1.75A.75.75 0 0 1 5.75 1Zm-2 4.25a.25.25 0 0 1 .25-.25h8.5a.25.25 0 0 1 .25.25V6h-9v-.75Z" clipRule="evenodd" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25a.75.75 0 0 0-1.5 0v3.5c0 .414.336.75.75.75h2.5a.75.75 0 0 0 0-1.5H8.75v-2.75Z" clipRule="evenodd" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.711.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.849.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M8 1a.75.75 0 0 1 .53.22l3 3a.75.75 0 1 1-1.06 1.06L8.75 3.56v6.69a.75.75 0 0 1-1.5 0V3.56L5.53 5.28a.75.75 0 0 1-1.06-1.06l3-3A.75.75 0 0 1 8 1ZM3 9.75a.75.75 0 0 0-1.5 0v3c0 .966.784 1.75 1.75 1.75h9.5A1.75 1.75 0 0 0 14.5 12.75v-3a.75.75 0 0 0-1.5 0v3a.25.25 0 0 1-.25.25h-9.5a.25.25 0 0 1-.25-.25v-3Z" clipRule="evenodd" />
    </svg>
  )
}

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), "MMM d, yyyy")
  } catch {
    return dateStr
  }
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: {
    rental_id?: string
    status?: string
    payment_intent?: string
    deposit?: string
    currency?: string
  }
}): Promise<JSX.Element> {
  const { rental_id, status, deposit: depositParam, currency: currencyParam } = searchParams
  const depositAmount = depositParam ? Number(depositParam) : null
  const depositCurrency = currencyParam ?? "usd"
  const isRentalSuccess = status === "success"

  // Fetch rental details and auth state in parallel.
  const [rentals, customer] = await Promise.all([
    rental_id ? getOrderRentals(rental_id) : Promise.resolve([]),
    getCustomer(),
  ])
  const rental = rentals[0] ?? null
  const isLoggedIn = !!customer

  const carName = rental?.product_variant?.product?.title ?? null
  const variantName = rental?.product_variant?.title ?? null
  const startDate = rental?.rental_start_date ?? null
  const endDate = rental?.rental_end_date ?? null
  const rentalDays = rental?.rental_days ?? null

  // Pre-filled WhatsApp message guests use to send their documents. We
  // always include the reservation id when we have one so the support team
  // can match the chat to the booking.
  const documentsWhatsAppMessage = rental_id
    ? `Hi Carhive! I'd like to send the documents for reservation #${rental_id}.`
    : `Hi Carhive! I'd like to send the documents for my reservation.`
  const documentsWhatsAppUrl = getWhatsAppUrl(documentsWhatsAppMessage)

  // General "questions?" WhatsApp CTA shown in the contact row (no
  // reservation-specific context, just open the chat).
  const contactWhatsAppUrl = getWhatsAppUrl(
    rental_id
      ? `Hi Carhive! I have a question about reservation #${rental_id}.`
      : undefined,
  )

  return (
    <div>
      <main className="flex min-h-[calc(100vh-var(--site-header-height)-200px)] items-center justify-center px-5 py-16">
        {isRentalSuccess ? (
          <div className="w-full max-w-lg">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-10 lg:p-12">
              {/* Background decoration */}
              <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-green-500/5 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-12 size-36 rounded-full bg-accent/5 blur-3xl" />

              <div className="relative flex flex-col items-center text-center">
                {/* Success icon */}
                <div className="flex size-20 items-center justify-center rounded-full bg-green-500/10 ring-8 ring-green-500/5 dark:ring-green-500/[0.03] sm:size-24">
                  <CheckIcon className="size-9 text-green-500 sm:size-10" />
                </div>

                <h1 className="mt-7 text-[22px] font-bold tracking-tight sm:text-2xl lg:text-[26px]">
                  Reservation confirmed!
                </h1>
                <p className="mt-2.5 max-w-sm text-balance text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {carName
                    ? `Your ${carName} is ready for you.`
                    : "Your car rental has been successfully booked."}
                  {" "}We&apos;ll send you a confirmation with all the details.
                </p>

                {/* Rental details card */}
                {(carName || startDate) && (
                  <div className="mt-8 w-full overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    {/* Car info header */}
                    {carName && (
                      <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-50 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-800/50">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                          <CarIcon className="size-5 text-accent" />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="truncate text-[15px] font-semibold text-neutral-900 dark:text-neutral-50">
                            {carName}
                          </p>
                          {variantName && variantName !== carName && (
                            <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                              {variantName}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Date/time details grid */}
                    {startDate && endDate && (
                      <div className="grid grid-cols-2 divide-x divide-neutral-100 dark:divide-neutral-800">
                        <div className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="size-3 text-neutral-400 dark:text-neutral-500" />
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                              Pick-up
                            </p>
                          </div>
                          <p className="mt-1 text-[14px] font-medium text-neutral-900 dark:text-neutral-100">
                            {formatDate(startDate)}
                          </p>
                        </div>
                        <div className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="size-3 text-neutral-400 dark:text-neutral-500" />
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                              Return
                            </p>
                          </div>
                          <p className="mt-1 text-[14px] font-medium text-neutral-900 dark:text-neutral-100">
                            {formatDate(endDate)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Duration */}
                    {rentalDays && rentalDays > 0 && (
                      <div className="flex items-center gap-2 border-t border-neutral-100 px-4 py-3 dark:border-neutral-800">
                        <ClockIcon className="size-3.5 text-neutral-400 dark:text-neutral-500" />
                        <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                          {rentalDays} day{rentalDays > 1 ? "s" : ""} rental
                        </p>
                      </div>
                    )}

                    {/* Deposit paid */}
                    {depositAmount != null && depositAmount > 0 && (
                      <div className="border-t border-neutral-100 px-4 py-3.5 dark:border-neutral-800">
                        <div className="flex items-center justify-between">
                          <p className="text-[13px] font-semibold text-neutral-700 dark:text-neutral-200">
                            Deposit paid
                          </p>
                          <p className="text-[14px] font-semibold text-neutral-900 dark:text-neutral-50">
                            {formatAmountForDisplay(depositAmount, depositCurrency)}
                          </p>
                        </div>
                        <p className="mt-1 text-[12px] text-neutral-400 dark:text-neutral-500">
                          Remaining balance due at vehicle pickup
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Info cards */}
                <div className="mt-4 w-full space-y-3">
                  {/* Reservation ID */}
                  {rental_id && (
                    <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-200/50 dark:bg-neutral-700/50">
                        <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400">#</span>
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                          Reservation ID
                        </p>
                        <p className="mt-0.5 truncate font-mono text-[12px] font-medium text-neutral-600 dark:text-neutral-300">
                          {rental_id}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Email notification */}
                  <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                      <MailIcon className="size-3.5 text-blue-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-[13px] text-neutral-600 dark:text-neutral-300">
                        Check your inbox for booking details
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact channels */}
                <div className="mt-5 w-full">
                  <p className="mb-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Need help? Reach us on
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={contactWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 transition-colors hover:border-[#25D366]/40 hover:bg-[#25D366]/5 dark:border-neutral-800 dark:bg-neutral-800/50 dark:hover:border-[#25D366]/40 dark:hover:bg-[#25D366]/10"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/10">
                        <WhatsAppIcon className="size-4 text-[#25D366]" />
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                          WhatsApp
                        </p>
                        <p className="truncate text-[13px] font-medium text-neutral-700 dark:text-neutral-200">
                          {siteConfig.contact.whatsapp.display}
                        </p>
                      </div>
                    </a>

                    <a
                      href={siteConfig.contact.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 transition-colors hover:border-pink-500/40 hover:bg-pink-500/5 dark:border-neutral-800 dark:bg-neutral-800/50 dark:hover:border-pink-500/40 dark:hover:bg-pink-500/10"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-pink-500/10">
                        <InstagramIcon className="size-4 text-pink-500" />
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                          Instagram
                        </p>
                        <p className="truncate text-[13px] font-medium text-neutral-700 dark:text-neutral-200">
                          @{siteConfig.contact.instagram.handle}
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Security note */}
                <div className="mt-6 flex items-center justify-center gap-1.5">
                  <ShieldIcon className="size-3.5 text-green-500" />
                  <p className="text-[12px] text-neutral-400 dark:text-neutral-500">
                    Payment secured &middot; Free cancellation available
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                  {isLoggedIn ? (
                    <Button
                      asChild
                      className="flex-1 rounded-xl bg-accent py-5 text-[14px] font-semibold text-accent-foreground shadow-[0_0_20px_rgba(248,227,63,0.15)] transition-all hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(248,227,63,0.25)]"
                    >
                      <Link
                        href={
                          rental_id
                            ? `/account/reservations/${rental_id}/documents`
                            : `/account/documents`
                        }
                      >
                        <span className="inline-flex items-center gap-2">
                          <UploadIcon className="size-4" />
                          Upload documents
                        </span>
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="flex-1 rounded-xl bg-[#25D366] py-5 text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(37,211,102,0.2)] transition-all hover:bg-[#20BA5A] hover:shadow-[0_0_30px_rgba(37,211,102,0.3)]"
                    >
                      <a
                        href={documentsWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="inline-flex items-center gap-2">
                          <WhatsAppIcon className="size-4" />
                          Send documents via WhatsApp
                        </span>
                      </a>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 rounded-xl border-neutral-200 py-5 text-[14px] dark:border-neutral-700"
                  >
                    <Link href="/">Go home</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-red-500/5 blur-3xl" />

              <div className="relative flex flex-col items-center text-center">
                <div className="flex size-20 items-center justify-center rounded-full bg-red-500/10 ring-8 ring-red-500/5 sm:size-24">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="size-9 text-red-500 sm:size-10">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </div>

                <h1 className="mt-7 text-[22px] font-bold tracking-tight sm:text-2xl lg:text-[26px]">
                  Something went wrong
                </h1>
                <p className="mt-2.5 max-w-sm text-balance text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  We couldn&apos;t confirm your reservation.
                  Please try again or contact support if the issue persists.
                </p>

                {rental_id && (
                  <div className="mt-6 w-full rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 dark:border-red-900/30 dark:bg-red-950/10">
                    <p className="font-mono text-[12px] text-red-600/70 dark:text-red-400/70">
                      Ref: {rental_id}
                    </p>
                  </div>
                )}

                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                  <Button asChild className="flex-1 rounded-xl py-5 text-[14px] font-semibold">
                    <Link href="/cars">Try again</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 rounded-xl border-neutral-200 py-5 text-[14px] dark:border-neutral-700">
                    <Link href="/">Go home</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
