import Link from "next/link"

import { cn } from "@/lib/utils"

interface LegalNoticeProps {
  className?: string
}

/**
 * Implicit legal acceptance notice shown right above the pay/confirm button
 * at checkout. Mirrors the pattern used by Sixt, Hertz and Europcar: the user
 * acknowledges the Terms of Service, Privacy Policy and Cancellation Policy
 * by clicking the main CTA — there is no separate checkbox to tick.
 */
export function LegalNotice({ className }: LegalNoticeProps) {
  return (
    <p
      className={cn(
        "text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400",
        className,
      )}
    >
      By confirming your reservation, you acknowledge that you have read and
      accept our <LegalLink href="/terms">Terms of Service</LegalLink>, the{" "}
      <LegalLink href="/privacy">Privacy Policy</LegalLink> and the{" "}
      <LegalLink href="/cancellation-policy">Cancellation Policy</LegalLink>.
      The total rental amount will be charged to the payment method provided
      upon confirmation.
    </p>
  )
}

function LegalLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-neutral-700 underline underline-offset-2 hover:text-accent dark:text-neutral-300"
    >
      {children}
    </Link>
  )
}
