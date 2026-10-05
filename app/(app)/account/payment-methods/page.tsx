import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { getCustomer } from "@/lib/medusa/customer"
import { listMyPaymentMethods } from "@/lib/medusa/payment-methods"
import { AccountShell } from "@/components/account/account-shell"
import { PaymentMethodsManager } from "@/components/account/payment-methods-manager"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Payment methods",
}

/**
 * Tarjetas guardadas (P1-6b). Solo clientes con sesión: el layout de la cuenta
 * ya redirige sin token, y aquí se comprueba que el token sigue siendo bueno.
 */
export default async function PaymentMethodsPage() {
  const customer = await getCustomer()
  if (!customer) {
    redirect(
      `/sign-in?redirectTo=${encodeURIComponent("/account/payment-methods")}`
    )
  }

  const result = await listMyPaymentMethods()

  return (
    <AccountShell>
      <header className="mb-8">
        <p className="text-caption font-semibold uppercase tracking-[0.2em] text-subtle">
          Account
        </p>
        <h1 className="mt-1 text-heading-sm sm:text-heading">
          Payment methods
        </h1>
        <p className="mt-1.5 text-body text-neutral-500 dark:text-neutral-400">
          The cards you can use to book. Your default card is offered first.
        </p>
      </header>

      <div className="max-w-2xl">
        {/* `useSearchParams` (vuelta de Stripe) necesita su Suspense. */}
        <Suspense>
          <PaymentMethodsManager
            initialCards={result.ok ? result.data : []}
            initialError={result.ok ? null : result.error}
          />
        </Suspense>
      </div>
    </AccountShell>
  )
}
