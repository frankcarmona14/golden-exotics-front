"use client"

import { logout } from "@/lib/medusa/customer"
import { cn } from "@/lib/utils"

export function LogoutButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => logout()}
      className={cn(
        "w-full cursor-pointer px-2 py-1.5 text-left text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300",
        className
      )}
    >
      Log out
    </button>
  )
}
