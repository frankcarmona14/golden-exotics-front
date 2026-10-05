import { redirect } from "next/navigation"

import { getCustomer } from "@/lib/medusa/customer"
import { AccountShell } from "@/components/account/account-shell"
import { ProfileForm } from "@/components/account/profile-form"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const customer = await getCustomer()
  if (!customer) {
    redirect(`/sign-in?redirectTo=${encodeURIComponent("/account/profile")}`)
  }

  return (
    <AccountShell>
      <header className="mb-8">
        <p className="text-caption font-semibold uppercase tracking-[0.2em] text-subtle">
          Account
        </p>
        <h1 className="mt-1 text-heading-sm sm:text-heading">
          Profile
        </h1>
        <p className="mt-1.5 text-body text-neutral-500 dark:text-neutral-400">
          Update your personal details.
        </p>
      </header>

      <div className="max-w-xl rounded-card border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/60 sm:p-7">
        <ProfileForm
          email={customer.email ?? ""}
          firstName={customer.first_name ?? ""}
          lastName={customer.last_name ?? ""}
          phone={customer.phone ?? ""}
        />
      </div>
    </AccountShell>
  )
}
