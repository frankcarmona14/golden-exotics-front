import Link from "next/link"

import { getCustomer } from "@/lib/medusa/customer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { SignInMenuLink } from "./auth-menu-links"
import { LogoutButton } from "./logout-button"
import { UserCircleIcon } from "./icons/user-circle"

/** Sin sesión, el botón de entrar; con sesión, la inicial del cliente y su menú. */
export async function UserMenuButton() {
  const customer = await getCustomer()

  if (!customer) {
    return (
      <SignInMenuLink className="inline-flex h-10 items-center rounded-pill border border-neutral-300 px-5 text-body-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 group-data-[transparent]/header:border-white/40 group-data-[transparent]/header:text-white group-data-[transparent]/header:hover:bg-white/15 group-data-[transparent]/header:focus-visible:ring-white dark:border-neutral-700 dark:text-neutral-50 dark:hover:bg-neutral-800 dark:focus-visible:ring-accent md:text-body">
        Log in
      </SignInMenuLink>
    )
  }

  const initials = [customer.first_name, customer.last_name]
    .map((name) => name?.trim().charAt(0))
    .filter(Boolean)
    .join("")
    .toUpperCase()
  const fullName = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(" ")

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="flex size-10 items-center justify-center rounded-full bg-neutral-900 text-body-sm font-medium text-white outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 group-data-[transparent]/header:bg-white group-data-[transparent]/header:text-neutral-900 group-data-[transparent]/header:focus-visible:ring-white group-data-[transparent]/header:focus-visible:ring-offset-0 dark:bg-white dark:text-neutral-900 dark:focus-visible:ring-accent dark:focus-visible:ring-offset-neutral-950"
      >
        {initials || <UserCircleIcon className="size-6 shrink-0" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
        collisionPadding={20}
      >
        <div className="px-2 py-1.5">
          {fullName && (
            <p className="truncate text-sm font-medium">{fullName}</p>
          )}
          <p className="truncate text-xs text-neutral-500">{customer.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account/reservations">My trips</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account">Account</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
