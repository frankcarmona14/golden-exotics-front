"use client"

import { useId } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface LicenseConfirmationProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  /** Optional declaration (P1-13): unchecked tells the team to offer coverage. */
  ownInsurance: boolean
  onOwnInsuranceChange: (checked: boolean) => void
  showError?: boolean
  className?: string
}

/**
 * Explicit consent block shown right above the pay/confirm button at
 * checkout.
 *
 * - Driver's license: required, a legally-binding self-declaration, hence a
 *   real checkbox rather than implicit acceptance.
 * - Own auto insurance: optional (P1-13). Renters without it can still book;
 *   the team's notice flags it so coverage is arranged before pick-up.
 */
export function LicenseConfirmation({
  checked,
  onCheckedChange,
  ownInsurance,
  onOwnInsuranceChange,
  showError = false,
  className,
}: LicenseConfirmationProps) {
  const checkboxId = useId()
  const insuranceId = useId()
  const hasError = showError && !checked

  return (
    <div
      className={cn(
        "rounded-card border border-neutral-200 bg-neutral-50/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/40",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          id={checkboxId}
          checked={checked}
          onCheckedChange={(value) => onCheckedChange(value === true)}
          className="mt-0.5"
        />
        <label
          htmlFor={checkboxId}
          className="cursor-pointer select-none text-body-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
        >
          I confirm that I hold a{" "}
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            valid driver&apos;s license
          </span>{" "}
          that meets all applicable legal requirements.
        </label>
      </div>

      <div className="mt-3 flex items-start gap-3 border-t border-neutral-200 pt-3 dark:border-neutral-800">
        <Checkbox
          id={insuranceId}
          checked={ownInsurance}
          onCheckedChange={(value) => onOwnInsuranceChange(value === true)}
          className="mt-0.5"
        />
        <label
          htmlFor={insuranceId}
          className="cursor-pointer select-none text-body-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
        >
          I have my own{" "}
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            auto insurance
          </span>{" "}
          that covers rental cars.{" "}
          <span className="text-neutral-500 dark:text-neutral-400">
            Optional. If you don&apos;t, we&apos;ll reach out about coverage before
            pick-up.
          </span>
        </label>
      </div>

      {hasError && (
        <div className="mt-3 flex items-start gap-2 rounded-tight bg-red-50 px-3 py-2 dark:bg-red-950/20">
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className="mt-0.5 size-3.5 shrink-0 text-red-500"
          >
            <path
              fillRule="evenodd"
              d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-caption leading-snug text-red-600 dark:text-red-400">
            You must confirm your driver&apos;s license before continuing with
            payment.
          </p>
        </div>
      )}
    </div>
  )
}
