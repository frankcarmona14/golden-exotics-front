"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  CustomerDocument,
  CustomerDocumentType,
  GroupStatus,
  RentalDocumentState,
  RequiredGroup,
  getRentalDocumentState,
  resendRentalDocumentLink,
  uploadRentalDocument,
} from "@/lib/medusa/rental-documents"
import {
  getMyRentalDocumentState,
  uploadMyRentalDocument,
} from "@/lib/medusa/me-rental-documents"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeftIcon } from "@/components/icons/chevron-left"
import { CircleCheckIcon } from "@/components/icons/circle-check"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/png"]
const MAX_BYTES = 25 * 1024 * 1024
const COMPRESS_THRESHOLD_BYTES = 1 * 1024 * 1024 // compress images larger than 1 MB
const COMPRESS_MAX_DIMENSION = 2400 // longest edge after resize
const COMPRESS_JPEG_QUALITY = 0.88

const TYPE_LABELS: Record<CustomerDocumentType, string> = {
  id_front: "ID card (front)",
  id_back: "ID card (back)",
  passport: "Passport",
  license_front: "Driver's license (front)",
  license_back: "Driver's license (back)",
  insurance: "Vehicle insurance",
}

/**
 * Backend may return Spanish group labels (e.g. "Documento de identidad").
 * Translate to English by inferring the group from its document types so
 * the UI stays in a single language regardless of the locale that Medusa
 * happens to send.
 */
function translateGroupLabel(group: {
  id?: string
  label: string
  types?: ReadonlyArray<CustomerDocumentType>
  alternatives?: ReadonlyArray<{ types: CustomerDocumentType[] }>
  oneOf?: ReadonlyArray<{ types: ReadonlyArray<CustomerDocumentType> }>
}): string {
  const collectedTypes = new Set<string>()
  if (group.types) group.types.forEach((t) => collectedTypes.add(t))
  if (group.alternatives)
    group.alternatives.forEach((a) => a.types.forEach((t) => collectedTypes.add(t)))
  if (group.oneOf)
    group.oneOf.forEach((a) => a.types.forEach((t) => collectedTypes.add(t)))

  const has = (...t: CustomerDocumentType[]) =>
    t.some((x) => collectedTypes.has(x))

  if (has("id_front", "id_back", "passport")) return "Identity document"
  if (has("license_front", "license_back")) return "Driver's license"
  if (has("insurance")) return "Vehicle insurance"

  // Fallback to backend label when we can't infer the type.
  return group.label
}

const fileToBase64 = (f: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const r = reader.result as string
      const idx = r.indexOf(",")
      resolve(idx >= 0 ? r.slice(idx + 1) : r)
    }
    reader.onerror = () => reject(new Error("Could not read the file."))
    reader.readAsDataURL(f)
  })

/**
 * Downscale + re-encode an image File to JPEG so phone-camera photos don't
 * blow past upload limits. PDFs and small images are returned untouched.
 * If anything goes wrong (e.g. exotic/HEIC format the browser can't decode),
 * we silently fall back to the original file.
 */
const maybeCompressImage = async (f: File): Promise<File> => {
  if (!f.type.startsWith("image/")) return f
  if (f.size <= COMPRESS_THRESHOLD_BYTES) return f

  try {
    const bitmap = await createImageBitmap(f)
    const longest = Math.max(bitmap.width, bitmap.height)
    const scale = Math.min(1, COMPRESS_MAX_DIMENSION / longest)
    const w = Math.max(1, Math.round(bitmap.width * scale))
    const h = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return f
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close?.()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", COMPRESS_JPEG_QUALITY)
    )
    if (!blob) return f
    if (blob.size >= f.size) return f

    const newName = f.name.replace(/\.(png|jpg|jpeg|webp|heic|heif)$/i, ".jpg")
    return new File([blob], newName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    })
  } catch {
    return f
  }
}

const formatRange = (a: string, b: string) => {
  const fmt = (s: string) =>
    new Date(s).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  return `${fmt(a)} → ${fmt(b)}`
}

const formatRemaining = (
  iso: string | null
): { text: string; warn: boolean; expired: boolean } | null => {
  if (!iso) return null
  const ms = new Date(iso).getTime() - Date.now()
  if (ms <= 0) return { text: "Expired", warn: true, expired: true }
  const h = Math.floor(ms / (60 * 60 * 1000))
  const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
  return { text: `${h}h ${m}m`, warn: h < 6, expired: false }
}

const formatBytes = (b: number) => {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`
  return `${(b / (1024 * 1024)).toFixed(1)} MB`
}

const docOfType = (
  docs: CustomerDocument[],
  type: CustomerDocumentType
): CustomerDocument | undefined => {
  const filtered = docs.filter((d) => d.type === type)
  if (filtered.length === 0) return undefined
  return filtered.sort((a, b) =>
    b.updated_at.localeCompare(a.updated_at)
  )[0]
}

// ---------------------------------------------------------------------------
// Inline icons (SVG, currentColor — match local icon style)
// ---------------------------------------------------------------------------

const Spinner = (props: React.HTMLAttributes<SVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="animate-spin"
    aria-hidden="true"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

const UploadIcon = (props: React.HTMLAttributes<SVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const FileIcon = (props: React.HTMLAttributes<SVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

const ClockIcon = (props: React.HTMLAttributes<SVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  </svg>
)

const AlertIcon = (props: React.HTMLAttributes<SVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const XCircleIcon = (props: React.HTMLAttributes<SVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <line x1="9" y1="9" x2="15" y2="15" />
    <line x1="15" y1="9" x2="9" y2="15" />
  </svg>
)

// ---------------------------------------------------------------------------
// Props (discriminated by `mode`)
// ---------------------------------------------------------------------------

export type RentalDocumentsClientProps =
  | {
      mode: "token"
      token: string
      initialOrderDisplayId: string | null
    }
  | {
      mode: "auth"
      orderId: string
      /**
       * "account" renders inside the account dashboard (`AccountShell`), which
       * provides the page chrome and title: documents are stored per-customer
       * and shared across all reservations. Defaults to the per-booking page.
       */
      variant?: "account"
    }

export default function RentalDocumentsClient(
  props: RentalDocumentsClientProps
) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState<RentalDocumentState | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [uploadingType, setUploadingType] =
    useState<CustomerDocumentType | null>(null)
  const [resendOpen, setResendOpen] = useState(false)
  const [identityChoice, setIdentityChoice] = useState<"dni" | "passport">("dni")

  const refresh = useCallback(async () => {
    const r =
      props.mode === "token"
        ? await getRentalDocumentState(props.token)
        : await getMyRentalDocumentState(props.orderId)
    if (r.ok) {
      setState(r.data)
      setErrorCode(null)
      setErrorMessage("")
      const docs = r.data.current_documents
      if (docs.some((d) => d.type === "passport")) {
        setIdentityChoice("passport")
      } else if (
        docs.some((d) => d.type === "id_front" || d.type === "id_back")
      ) {
        setIdentityChoice("dni")
      }
    } else {
      setErrorCode(r.error.code)
      setErrorMessage(r.error.message)
      setState(null)
    }
    setLoading(false)
  }, [props])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleUpload = useCallback(
    async (type: CustomerDocumentType, file: File) => {
      if (!ALLOWED_MIME.includes(file.type)) {
        toast({
          title: "Unsupported format",
          description: "Only PDF, JPG, or PNG files are allowed.",
          variant: "destructive",
        })
        return
      }
      if (file.size > MAX_BYTES) {
        toast({
          title: "File too large",
          description: "Maximum 25 MB per document.",
          variant: "destructive",
        })
        return
      }
      setUploadingType(type)
      try {
        const compressed = await maybeCompressImage(file)
        const content = await fileToBase64(compressed)
        const result =
          props.mode === "token"
            ? await uploadRentalDocument(props.token, type, {
                filename: compressed.name,
                mime_type: compressed.type,
                content,
              })
            : await uploadMyRentalDocument(props.orderId, type, {
                filename: compressed.name,
                mime_type: compressed.type,
                content,
              })
        if (!result.ok) {
          if (result.error.code === "TOKEN_EXPIRED" && props.mode === "token") {
            setErrorCode("TOKEN_EXPIRED")
            setResendOpen(true)
          } else {
            toast({
              title: "Upload failed",
              description: result.error.message,
              variant: "destructive",
            })
          }
          return
        }
        toast({
          title: "Document uploaded",
          description: "We'll notify you once it has been reviewed.",
        })
        await refresh()
      } finally {
        setUploadingType(null)
      }
    },
    [props, refresh, toast]
  )

  const isAccountView = props.mode === "auth" && props.variant === "account"
  // Inside the account shell the page already has its padding and width.
  const pageClass = isAccountView
    ? "max-w-3xl"
    : "container mx-auto max-w-3xl px-4 py-10"

  // ---------- LOADING ----------
  if (loading) {
    return (
      <div className={cn(pageClass, "space-y-6")}>
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-40" />
      </div>
    )
  }

  // ---------- ERROR ----------
  if (errorCode === "TOKEN_EXPIRED" && props.mode === "token") {
    return (
      <ErrorScreen
        embedded={isAccountView}
        title="This link has expired"
        description="For your security, links expire after 48 hours. Request a new one and we'll email it to you."
        showResend
        onResend={() => setResendOpen(true)}
        resendOpen={resendOpen}
        setResendOpen={setResendOpen}
        initialOrderDisplayId={props.initialOrderDisplayId}
      />
    )
  }
  if (errorCode === "UNAUTHORIZED") {
    return (
      <ErrorScreen
        embedded={isAccountView}
        title="Session expired"
        description="Please sign in again to continue."
      />
    )
  }
  if (errorCode === "FORBIDDEN") {
    return (
      <ErrorScreen
        embedded={isAccountView}
        title="Access denied"
        description="This booking doesn't belong to your account."
      />
    )
  }
  if (errorCode === "TOKEN_INVALID" || errorCode === "ORDER_NOT_FOUND") {
    return (
      <ErrorScreen
        embedded={isAccountView}
        title="Invalid link"
        description={errorMessage}
        showResend={props.mode === "token"}
        onResend={() => setResendOpen(true)}
        resendOpen={resendOpen}
        setResendOpen={setResendOpen}
        initialOrderDisplayId={props.mode === "token" ? props.initialOrderDisplayId : null}
      />
    )
  }
  if (!state) {
    return (
      <ErrorScreen
        embedded={isAccountView}
        title="Something went wrong"
        description={errorMessage || "Please try again in a few minutes."}
        showResend={props.mode === "token"}
        onResend={() => setResendOpen(true)}
        resendOpen={resendOpen}
        setResendOpen={setResendOpen}
        initialOrderDisplayId={props.mode === "token" ? props.initialOrderDisplayId : null}
      />
    )
  }

  // ---------- RENDER ----------
  const remaining =
    props.mode === "token" ? formatRemaining(state.token_expires_at) : null
  const allApproved = state.status_summary.every((g) => g.satisfied_by_approved)
  const allUploaded = state.status_summary.every((g) => g.satisfied_by_uploaded)
  const inReview = state.rentals.some((r) => r.status === "documents_in_review")
  const totalGroups = state.status_summary.length
  const completedGroups = state.status_summary.filter(
    (g) => g.satisfied_by_approved || g.satisfied_by_uploaded
  ).length
  const progressPct = totalGroups
    ? Math.round((completedGroups / totalGroups) * 100)
    : 0

  const backHref =
    props.mode === "auth" && !isAccountView
      ? `/account/reservations/${props.orderId}`
      : null

  return (
    <div className={cn(pageClass, "space-y-7")}>
      {/* Back link */}
      {backHref && (
        <Link
          href={backHref}
          className="-ml-1 inline-flex items-center gap-1 rounded-sm px-1 py-0.5 text-sm text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 dark:focus-visible:ring-white"
        >
          <ChevronLeftIcon className="size-4" />
          Back to booking
        </Link>
      )}

      {/* Header */}
      <header className="space-y-3">
        {!isAccountView && (
          <div className="space-y-1.5">
            <h1 className="text-[26px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              Documents for booking{" "}
              <span className="text-neutral-500 dark:text-neutral-400">
                #{state.order.display_id}
              </span>
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {state.rentals.length === 1
                ? formatRange(
                    state.rentals[0].rental_start_date,
                    state.rentals[0].rental_end_date,
                  )
                : `${state.rentals.length} bookings linked to this order`}
            </p>
          </div>
        )}

        {/* Progress */}
        {!allApproved && totalGroups > 0 && (
          <div className="space-y-2 pt-1" aria-label="Progress">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600 dark:text-neutral-400">
                {completedGroups} of {totalGroups} requirements complete
              </span>
              <span className="font-medium tabular-nums text-neutral-900 dark:text-neutral-100">
                {progressPct}%
              </span>
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200/80 dark:bg-neutral-800/80"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPct}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-neutral-900 to-neutral-700 transition-[width] duration-500 ease-out dark:from-neutral-50 dark:to-neutral-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Token expiry — prominent when warn, subtle otherwise */}
        {remaining && !remaining.warn && (
          <p className="inline-flex items-center gap-1.5 pt-1 text-xs text-neutral-500 dark:text-neutral-400">
            <ClockIcon className="size-3.5" />
            This link expires in {remaining.text}
          </p>
        )}
      </header>

      {/* Prominent expiry banner when low */}
      {remaining && remaining.warn && !remaining.expired && (
        <Alert variant="warning">
          <ClockIcon />
          <AlertTitle>Link expires soon</AlertTitle>
          <AlertDescription>
            This link expires in {remaining.text}. Finish uploading or request
            a new one.
          </AlertDescription>
        </Alert>
      )}

      {/* aria-live region for upload status */}
      <div aria-live="polite" className="sr-only">
        {uploadingType ? `Uploading ${TYPE_LABELS[uploadingType]}` : ""}
      </div>

      {/* Banners */}
      {allApproved && (
        <Alert variant="success">
          <CircleCheckIcon />
          <AlertTitle>Documents approved</AlertTitle>
          <AlertDescription>
            Your documents have been approved. Enjoy your booking.
          </AlertDescription>
        </Alert>
      )}
      {!allApproved && allUploaded && inReview && (
        <Alert variant="info">
          <ClockIcon />
          <AlertTitle>Under review</AlertTitle>
          <AlertDescription>
            All set — your documents are under review. We&apos;ll email you
            within 24–48 hours.
          </AlertDescription>
        </Alert>
      )}

      {/* Status summary */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {state.status_summary.map((g) => (
          <SummaryCard key={g.id} group={g} />
        ))}
      </div>

      {/* Groups */}
      <div className="space-y-6">
        {state.required_groups.map((group) => (
          <GroupSection
            key={group.id}
            group={group}
            documents={state.current_documents}
            uploadingType={uploadingType}
            onUpload={handleUpload}
            identityChoice={identityChoice}
            setIdentityChoice={setIdentityChoice}
          />
        ))}
      </div>

      {/* Help */}
      <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50/80 p-5 text-sm dark:border-neutral-800 dark:bg-neutral-900/60">
        <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-neutral-300 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800" />
        <p className="mb-2.5 font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Why we ask for these documents
        </p>
        <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-400">
          <li className="flex gap-2.5">
            <BulletDot />
            <span>
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">
                ID card or passport
              </strong>
              {" — to verify your identity."}
            </span>
          </li>
          <li className="flex gap-2.5">
            <BulletDot />
            <span>
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">
                Driver&apos;s license
              </strong>
              {" — legal requirement to rent the vehicle."}
            </span>
          </li>
          <li className="flex gap-2.5">
            <BulletDot />
            <span>
              <strong className="font-medium text-neutral-800 dark:text-neutral-200">
                Insurance
              </strong>
              {" — proof of coverage for the booking."}
            </span>
          </li>
        </ul>
      </div>

      {/* Resend at bottom — only for token flow */}
      {props.mode === "token" && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Trouble with the link?
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setResendOpen(true)}
          >
            Request a new link
          </Button>
        </div>
      )}

      {props.mode === "token" && (
        <ResendDialog
          open={resendOpen}
          onOpenChange={setResendOpen}
          initialOrderDisplayId={
            state.order.display_id?.toString() ?? props.initialOrderDisplayId
          }
          initialEmail={state.customer.email ?? ""}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function SummaryCard({ group }: { group: GroupStatus }) {
  const { tone, label, Icon } = useMemo(() => {
    if (group.satisfied_by_approved)
      return {
        tone: "green" as const,
        label: "Approved",
        Icon: CircleCheckIcon,
      }
    const anyRejected =
      (group.rejected_types && group.rejected_types.length > 0) ||
      group.alternatives?.some((a) => a.rejected_types.length > 0)
    if (anyRejected)
      return { tone: "red" as const, label: "Rejected", Icon: XCircleIcon }
    if (group.satisfied_by_uploaded)
      return { tone: "blue" as const, label: "Under review", Icon: ClockIcon }
    return { tone: "amber" as const, label: "Pending", Icon: AlertIcon }
  }, [group])

  const dotClass = {
    green: "bg-emerald-500 dark:bg-emerald-400",
    red: "bg-red-500 dark:bg-red-400",
    blue: "bg-blue-500 dark:bg-blue-400",
    amber: "bg-amber-500 dark:bg-amber-400",
  }[tone]

  const iconClass = {
    green: "text-emerald-600 dark:text-emerald-300",
    red: "text-red-600 dark:text-red-300",
    blue: "text-blue-600 dark:text-blue-300",
    amber: "text-amber-600 dark:text-amber-300",
  }[tone]

  const labelClass = {
    green: "text-emerald-700 dark:text-emerald-300",
    red: "text-red-700 dark:text-red-300",
    blue: "text-blue-700 dark:text-blue-300",
    amber: "text-amber-700 dark:text-amber-300",
  }[tone]

  return (
    <div className="group/card relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-3.5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:border-neutral-700">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        <span className={`size-1.5 shrink-0 rounded-full ${dotClass}`} />
        <span className="truncate">{translateGroupLabel(group)}</span>
      </div>
      <div className={`mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold ${labelClass}`}>
        <Icon className={`size-3.5 ${iconClass}`} />
        {label}
      </div>
    </div>
  )
}

function BulletDot() {
  return (
    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
  )
}

function GroupSection({
  group,
  documents,
  uploadingType,
  onUpload,
  identityChoice,
  setIdentityChoice,
}: {
  group: RequiredGroup
  documents: CustomerDocument[]
  uploadingType: CustomerDocumentType | null
  onUpload: (type: CustomerDocumentType, file: File) => void
  identityChoice: "dni" | "passport"
  setIdentityChoice: (v: "dni" | "passport") => void
}) {
  const translatedLabel = translateGroupLabel(group)

  if (group.oneOf) {
    const dniAlt = group.oneOf.find((o) => o.key === "dni")
    const passportAlt = group.oneOf.find((o) => o.key === "passport")
    const activeTypes =
      identityChoice === "dni" ? dniAlt?.types ?? [] : passportAlt?.types ?? []

    const tabBase =
      "relative flex-1 inline-flex items-center justify-center min-h-[40px] px-4 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
    const tabActive =
      "bg-white text-neutral-900 shadow-sm ring-1 ring-black/5 dark:bg-neutral-900 dark:text-neutral-50 dark:ring-white/10"
    const tabInactive =
      "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"

    return (
      <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/70">
        <div className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
          <h2 className="text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            {translatedLabel}
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            Choose one option below.
          </p>
        </div>
        <div
          className="border-b border-neutral-200 px-5 py-3 dark:border-neutral-800"
          role="radiogroup"
          aria-label="Identity document type"
        >
          <div className="flex gap-1 rounded-lg bg-neutral-100/80 p-1 dark:bg-neutral-800/60">
            <button
              type="button"
              role="radio"
              aria-checked={identityChoice === "dni"}
              onClick={() => setIdentityChoice("dni")}
              className={`${tabBase} ${
                identityChoice === "dni" ? tabActive : tabInactive
              }`}
            >
              National ID
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={identityChoice === "passport"}
              onClick={() => setIdentityChoice("passport")}
              className={`${tabBase} ${
                identityChoice === "passport" ? tabActive : tabInactive
              }`}
            >
              Passport
            </button>
          </div>
        </div>
        <div className="space-y-3 p-5">
          {activeTypes.map((t) => (
            <UploadSlot
              key={t}
              type={t as CustomerDocumentType}
              document={docOfType(documents, t as CustomerDocumentType)}
              uploading={uploadingType === t}
              onUpload={onUpload}
            />
          ))}
        </div>
      </section>
    )
  }
  return (
    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/70">
      <div className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
        <h2 className="text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {translatedLabel}
        </h2>
      </div>
      <div className="space-y-3 p-5">
        {group.types?.map((t) => (
          <UploadSlot
            key={t}
            type={t as CustomerDocumentType}
            document={docOfType(documents, t as CustomerDocumentType)}
            uploading={uploadingType === t}
            onUpload={onUpload}
          />
        ))}
      </div>
    </section>
  )
}

function UploadSlot({
  type,
  document: doc,
  uploading,
  onUpload,
}: {
  type: CustomerDocumentType
  document: CustomerDocument | undefined
  uploading: boolean
  onUpload: (type: CustomerDocumentType, file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const onPick = () => inputRef.current?.click()
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) onUpload(type, f)
    e.target.value = ""
  }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) onUpload(type, f)
  }

  const status = doc?.status

  const statusStyles =
    status === "approved"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : status === "rejected"
        ? "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300"
        : "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"

  const badge = status && (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusStyles}`}
    >
      {status === "approved" ? (
        <CircleCheckIcon className="size-3" />
      ) : status === "rejected" ? (
        <XCircleIcon className="size-3" />
      ) : (
        <ClockIcon className="size-3" />
      )}
      <span>
        {status === "approved"
          ? "Approved"
          : status === "rejected"
            ? "Rejected"
            : "Under review"}
      </span>
    </span>
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-[13.5px] font-medium text-neutral-900 dark:text-neutral-100">
          {TYPE_LABELS[type]}
        </Label>
        {badge}
      </div>
      {status === "rejected" && doc?.rejection_reason && (
        <p className="text-xs text-red-600 dark:text-red-400">
          Reason: {doc.rejection_reason}
        </p>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        aria-busy={uploading}
        className={`rounded-lg border border-dashed p-4 transition-colors ${
          dragOver
            ? "border-neutral-900 bg-neutral-100/70 dark:border-neutral-200 dark:bg-neutral-800/60"
            : "border-neutral-300 bg-neutral-50/50 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-950/40 dark:hover:border-neutral-600"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          onChange={onChange}
          aria-label={`Upload ${TYPE_LABELS[type]}`}
        />
        {doc ? (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
              <FileIcon className="size-4" />
            </span>
            <a
              href={doc.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm font-medium text-neutral-800 underline underline-offset-4 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:text-neutral-100 dark:hover:text-white dark:focus-visible:ring-white"
            >
              View file
            </a>
            <span className="text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
              {formatBytes(doc.size_bytes)}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={onPick}
              disabled={uploading}
              className="ml-auto"
            >
              {uploading ? (
                <span className="inline-flex items-center gap-1.5">
                  <Spinner className="size-3.5" />
                  Uploading…
                </span>
              ) : status === "rejected" ? (
                "Try again"
              ) : (
                "Replace"
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2.5 py-2 text-center">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              <UploadIcon className="size-5" />
            </span>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Drag and drop your file here, or
            </p>
            <Button
              type="button"
              size="sm"
              onClick={onPick}
              disabled={uploading}
            >
              {uploading ? (
                <span className="inline-flex items-center gap-1.5">
                  <Spinner className="size-3.5" />
                  Uploading…
                </span>
              ) : (
                "Choose file"
              )}
            </Button>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              PDF, JPG, or PNG · max 25 MB
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function ErrorScreen({
  title,
  description,
  showResend,
  onResend,
  resendOpen,
  setResendOpen,
  initialOrderDisplayId,
  embedded,
}: {
  title: string
  description: string
  showResend?: boolean
  onResend?: () => void
  resendOpen?: boolean
  setResendOpen?: (b: boolean) => void
  initialOrderDisplayId?: string | null
  /** Inside the account shell: no page padding of its own. */
  embedded?: boolean
}) {
  return (
    <div
      className={cn(
        "mx-auto max-w-md space-y-4 text-center",
        embedded ? "py-8" : "container px-4 py-16"
      )}
    >
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
      {showResend && onResend && (
        <div className="flex justify-center gap-2 pt-2">
          <Button onClick={onResend}>Request a new link</Button>
        </div>
      )}
      {showResend && setResendOpen && (
        <ResendDialog
          open={resendOpen ?? false}
          onOpenChange={setResendOpen}
          initialOrderDisplayId={initialOrderDisplayId ?? null}
          initialEmail=""
        />
      )}
    </div>
  )
}

function ResendDialog({
  open,
  onOpenChange,
  initialOrderDisplayId,
  initialEmail,
}: {
  open: boolean
  onOpenChange: (b: boolean) => void
  initialOrderDisplayId: string | null
  initialEmail: string
}) {
  const { toast } = useToast()
  const [email, setEmail] = useState(initialEmail)
  const [orderId, setOrderId] = useState(initialOrderDisplayId ?? "")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setEmail(initialEmail)
    setOrderId(initialOrderDisplayId ?? "")
  }, [initialEmail, initialOrderDisplayId, open])

  const submit = async () => {
    if (!email.trim() || !orderId.trim()) {
      toast({
        title: "Required fields",
        description: "Please enter your email and order number.",
        variant: "destructive",
      })
      return
    }
    setLoading(true)
    await resendRentalDocumentLink(email.trim(), orderId.trim())
    setLoading(false)
    onOpenChange(false)
    toast({
      title: "If the details match, you'll get an email",
      description: "Check your inbox in a few minutes.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a new link</DialogTitle>
          <DialogDescription>
            We&apos;ll send a new link to the order&apos;s email if the details match.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="resend-email">Email</Label>
            <Input
              id="resend-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="resend-order">Order number</Label>
            <Input
              id="resend-order"
              inputMode="numeric"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="1234"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-1.5">
                <Spinner className="size-3.5" />
                Sending…
              </span>
            ) : (
              "Send"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
