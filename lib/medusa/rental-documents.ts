"use server"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export type CustomerDocumentType =
  | "id_front"
  | "id_back"
  | "passport"
  | "license_front"
  | "license_back"
  | "insurance"

export type CustomerDocumentStatus = "pending" | "approved" | "rejected"

export type CustomerDocument = {
  id: string
  type: CustomerDocumentType
  status: CustomerDocumentStatus
  rejection_reason: string | null
  file_url: string
  mime_type: string
  size_bytes: number
  created_at: string
  updated_at: string
}

export type GroupAlternativeStatus = {
  key: string
  label: string
  types: CustomerDocumentType[]
  satisfied_by_approved: boolean
  satisfied_by_uploaded: boolean
  missing_types: CustomerDocumentType[]
  rejected_types: CustomerDocumentType[]
}

export type GroupStatus = {
  id: string
  label: string
  satisfied_by_approved: boolean
  satisfied_by_uploaded: boolean
  alternatives?: GroupAlternativeStatus[]
  missing_types?: CustomerDocumentType[]
  rejected_types?: CustomerDocumentType[]
}

export type RequiredGroup = {
  id: string
  label: string
  types?: ReadonlyArray<CustomerDocumentType>
  oneOf?: ReadonlyArray<{
    key: string
    types: ReadonlyArray<CustomerDocumentType>
    label: string
  }>
}

export type RentalDocumentState = {
  order: { id: string; display_id: number; created_at: string; currency_code: string }
  customer: { email: string | null; first_name: string | null; last_name: string | null }
  rentals: Array<{
    id: string
    status:
      | "awaiting_documents"
      | "documents_in_review"
      | "approved"
      | "change_requested"
      | "handed_off"
      | "returned"
      | "cancelled"
    rental_start_date: string
    rental_end_date: string
    rental_days: number
    variant_id: string
  }>
  required_groups: RequiredGroup[]
  current_documents: CustomerDocument[]
  status_summary: GroupStatus[]
  token_expires_at: string | null
}

export type ApiError = {
  code:
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "ORDER_NOT_FOUND"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NETWORK"
    | "UNKNOWN"
  message: string
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError }

function headers(): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" }
  if (process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    h["x-publishable-api-key"] = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  }
  return h
}

async function call<T>(
  path: string,
  init: { method?: string; body?: unknown } = {}
): Promise<ApiResult<T>> {
  let res: Response
  try {
    res = await fetch(`${MEDUSA_BACKEND_URL}${path}`, {
      method: init.method ?? "GET",
      headers: headers(),
      body: init.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    })
  } catch (err) {
    return {
      ok: false,
      error: {
        code: "NETWORK",
        message: err instanceof Error ? err.message : "Sin conexión con el servidor.",
      },
    }
  }

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>

  if (!res.ok) {
    const code = (data?.code as ApiError["code"]) ?? "UNKNOWN"
    const message =
      (data?.message as string) ||
      `Error ${res.status}: ${res.statusText}`
    return { ok: false, error: { code, message } }
  }

  return { ok: true, data: data as T }
}

export async function getRentalDocumentState(
  token: string
): Promise<ApiResult<RentalDocumentState>> {
  return call<RentalDocumentState>(
    `/store/rental-documents/${encodeURIComponent(token)}`
  )
}

export async function uploadRentalDocument(
  token: string,
  type: CustomerDocumentType,
  file: { filename: string; mime_type: string; content: string }
): Promise<ApiResult<{ document: CustomerDocument; transitioned_rental_ids: unknown }>> {
  return call(
    `/store/rental-documents/${encodeURIComponent(token)}/upload`,
    {
      method: "POST",
      body: { type, file },
    }
  )
}

export async function resendRentalDocumentLink(
  email: string,
  orderDisplayId: string | number
): Promise<ApiResult<{ ok: boolean }>> {
  return call(`/store/rental-documents/resend-link`, {
    method: "POST",
    body: { email, order_display_id: orderDisplayId },
  })
}
