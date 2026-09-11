import RentalDocumentsClient from "@/components/rental-documents/client"

export const dynamic = "force-dynamic"

export default function RentalDocumentsPage({
  params,
  searchParams,
}: {
  params: { token: string }
  searchParams: { order?: string }
}) {
  return (
    <RentalDocumentsClient
      mode="token"
      token={params.token}
      initialOrderDisplayId={searchParams.order ?? null}
    />
  )
}
