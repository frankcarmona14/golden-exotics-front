"use server"

import { getAuthToken } from "./customer"
import type {
  ApiResult,
  CustomerDocument,
  CustomerDocumentType,
  RentalDocumentState,
  ApiError,
} from "./rental-documents"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

async function authedHeaders(): Promise<Record<string, string> | null> {
  const token = await getAuthToken()
  if (!token) return null
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  }
  if (process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    h["x-publishable-api-key"] = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  }
  return h
}

async function call<T>(
  path: string,
  init: { method?: string; body?: unknown } = {}
): Promise<ApiResult<T>> {
  const headers = await authedHeaders()
  if (!headers) {
    return {
      ok: false,
      error: { code: "TOKEN_INVALID", message: "Inicia sesión para continuar." },
    }
  }

  let res: Response
  try {
    res = await fetch(`${MEDUSA_BACKEND_URL}${path}`, {
      method: init.method ?? "GET",
      headers,
      body: init.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    })
  } catch (err) {
    return {
      ok: false,
      error: {
        code: "NETWORK",
        message: err instanceof Error ? err.message : "Sin conexión.",
      },
    }
  }

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>

  if (!res.ok) {
    const code = (data?.code as ApiError["code"]) ?? "UNKNOWN"
    const message =
      (data?.message as string) || `Error ${res.status}: ${res.statusText}`
    return { ok: false, error: { code, message } }
  }

  return { ok: true, data: data as T }
}

export async function getMyRentalDocumentState(
  orderId: string
): Promise<ApiResult<RentalDocumentState>> {
  return call<RentalDocumentState>(
    `/store/me/rental-documents/${encodeURIComponent(orderId)}`
  )
}

export async function uploadMyRentalDocument(
  orderId: string,
  type: CustomerDocumentType,
  file: { filename: string; mime_type: string; content: string }
): Promise<
  ApiResult<{ document: CustomerDocument; transitioned_rental_ids: unknown }>
> {
  return call(
    `/store/me/rental-documents/${encodeURIComponent(orderId)}/upload`,
    {
      method: "POST",
      body: { type, file },
    }
  )
}
