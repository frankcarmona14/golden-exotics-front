"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { SearchParams } from "@/lib/types"
import { constructUrlWithParams } from "@/lib/utils"

const OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name" },
] as const

export function CatalogSort() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sort = searchParams.get(SearchParams.SORT) ?? "featured"

  return (
    <label className="inline-flex h-11 items-center gap-2 text-body-sm text-muted-foreground">
      <span className="hidden sm:inline">Sort</span>
      <select
        value={sort}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString())
          if (event.target.value === "featured") {
            params.delete(SearchParams.SORT)
          } else {
            params.set(SearchParams.SORT, event.target.value)
          }
          router.push(constructUrlWithParams("/cars", params))
        }}
        className="h-11 rounded-pill border border-input bg-background px-4 text-body-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
