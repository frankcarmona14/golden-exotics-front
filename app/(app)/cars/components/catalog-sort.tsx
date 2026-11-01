"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { SearchParams } from "@/lib/types"
import { constructUrlWithParams } from "@/lib/utils"
import { ChevronDownIcon } from "@/components/icons/chevron-down"

import { useCatalogTransition } from "./catalog-transition"
import { pillClassName } from "./pill"

const OPTIONS = [
  { value: "featured", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name" },
] as const

function SortIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 9l4 -4l4 4m-4 -4v14" />
      <path d="M21 15l-4 4l-4 -4m4 4v-14" />
    </svg>
  )
}

export function CatalogSort() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { startTransition } = useCatalogTransition()
  const sort = searchParams.get(SearchParams.SORT) ?? "featured"

  return (
    // El <select> nativo va encima, transparente: la pastilla es solo dibujo
    // y el menú sigue siendo el del sistema (rueda en iOS, teclado, lectores).
    <label
      className={`${pillClassName} relative pr-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring`}
    >
      <SortIcon className="size-4 shrink-0" />
      <span>
        {OPTIONS.find((option) => option.value === sort)?.label ??
          "Recommended"}
      </span>
      <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
      <span className="sr-only">Sort by</span>
      <select
        value={sort}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString())
          if (event.target.value === "featured") {
            params.delete(SearchParams.SORT)
          } else {
            params.set(SearchParams.SORT, event.target.value)
          }
          startTransition(() => {
            router.push(constructUrlWithParams("/cars", params), {
              scroll: false,
            })
          })
        }}
        className="absolute inset-0 cursor-pointer appearance-none opacity-0"
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
