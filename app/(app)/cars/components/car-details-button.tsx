"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { SearchParams } from "@/lib/types"
import { constructUrlWithParams } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function CarDetailsButton({ carSlug }: { carSlug: string }) {
  const searchParams = useSearchParams()
  const newParams = new URLSearchParams(searchParams.toString())

  const location = searchParams.get(SearchParams.LOCATION)
  const checkin = searchParams.get(SearchParams.CHECKIN)
  const checkout = searchParams.get(SearchParams.CHECKOUT)

  if (location) newParams.set(SearchParams.LOCATION, location)
  if (checkin) newParams.set(SearchParams.CHECKIN, checkin)
  if (checkout) newParams.set(SearchParams.CHECKOUT, checkout)

  const href = constructUrlWithParams(`/cars/${carSlug}`, newParams)

  return (
    <Button
      variant={"secondary"}
      className="h-9 w-full hover:bg-neutral-900 hover:text-white dark:bg-white/[0.08] dark:hover:bg-white dark:hover:text-neutral-950"
      asChild
    >
      <Link href={href}>View Details</Link>
    </Button>
  )
}
