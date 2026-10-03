import type { Metadata } from "next"

import { NOINDEX_METADATA } from "@/lib/seo/metadata"

// Todo /reservation es el embudo de reserva y pago (extras, checkout, retorno
// de Stripe, confirmación): un solo layout aplica el noindex a todas sus rutas.
export const metadata: Metadata = NOINDEX_METADATA

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
