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

import { SignInMenuLink, SignUpMenuLink } from "./auth-menu-links"
import { LogoutButton } from "./logout-button"
import { MenuIcon } from "./icons/menu"
import { UserCircleIcon } from "./icons/user-circle"
import { Button } from "./ui/button"

export async function UserMenuButton() {
  const customer = await getCustomer()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="link"
          className="h-11 min-w-11 p-1"
          aria-label="Open account menu"
        >
          <div className="flex items-center justify-center text-neutral-800 dark:text-neutral-200">
            <MenuIcon className="mr-1.5 size-4 shrink-0" />
            <UserCircleIcon className="size-6 shrink-0 md:size-7 xl:size-[30px]" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40 sm:w-48 lg:w-52"
        collisionPadding={20}
      >
        {customer ? (
          <>
            <div className="px-2 py-1.5">
              <p className="truncate text-sm font-medium">
                {customer.first_name} {customer.last_name}
              </p>
              <p className="truncate text-xs text-neutral-500">
                {customer.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/account">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/reservations">My reservations</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/profile">Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        ) : (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/cars">Cars</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/brands">Brands</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/driver-requirements">Requirements</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <SignUpMenuLink>Sign up</SignUpMenuLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <SignInMenuLink>Log in</SignInMenuLink>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
