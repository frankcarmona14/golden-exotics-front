import { redirect } from "next/navigation"
import { getAuthToken } from "@/lib/medusa/customer"
import RentalDocumentsClient from "@/components/rental-documents/client"

export const dynamic = "force-dynamic"

export default async function ReservationDocumentsPage({
  params,
}: {
  params: { id: string }
}) {
  // Gate at the page level — anonymous users can't access this route at all.
  const authToken = await getAuthToken()
  if (!authToken) {
    redirect(
      `/sign-in?redirectTo=${encodeURIComponent(
        `/account/reservations/${params.id}/documents`,
      )}`,
    )
  }

  return (
    <main id="main-content">
      <RentalDocumentsClient mode="auth" orderId={params.id} />
    </main>
  )
}
