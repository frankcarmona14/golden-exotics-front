"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  countries,
  type Country,
  DEFAULT_COUNTRY_ISO2,
  findCountryByE164,
  findCountryByIso2,
} from "@/lib/countries"

export interface PhoneInputProps {
  /** Full phone number in E.164 format (e.g. "+13055551234"). */
  value: string
  onChange: (value: string) => void
  /** ISO 3166-1 alpha-2 used when the value is empty. Defaults to US. */
  defaultCountry?: string
  /** Name for a hidden input so the value can be submitted via native forms. */
  name?: string
  id?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  className?: string
  "aria-invalid"?: boolean
}

function stripNonDigits(value: string): string {
  return value.replace(/\D+/g, "")
}

/** Format local digits with spaces every 3-4 chars so long numbers stay readable. */
function formatLocalDigits(digits: string): string {
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
  if (digits.length <= 10)
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10)}`
}

export function PhoneInput({
  value,
  onChange,
  defaultCountry = DEFAULT_COUNTRY_ISO2,
  name,
  id,
  placeholder,
  required,
  disabled,
  autoComplete = "tel-national",
  className,
  "aria-invalid": ariaInvalid,
}: PhoneInputProps) {
  const initialCountry = React.useMemo<Country>(() => {
    return (
      findCountryByE164(value) ??
      findCountryByIso2(defaultCountry) ??
      countries[0]
    )
  }, [value, defaultCountry])

  const [country, setCountry] = React.useState<Country>(initialCountry)
  const [localDigits, setLocalDigits] = React.useState<string>(() => {
    if (value.startsWith("+")) {
      return value.slice(1 + initialCountry.dial_code.length).replace(/\D+/g, "")
    }
    return ""
  })
  const [open, setOpen] = React.useState(false)

  // Keep internal state in sync when the consumer resets the value externally
  // (e.g. after guest form reset). We only react to empty external value to
  // avoid fighting controlled updates from our own onChange.
  React.useEffect(() => {
    if (value === "") {
      setLocalDigits("")
    }
  }, [value])

  const emit = React.useCallback(
    (nextCountry: Country, nextDigits: string) => {
      if (!nextDigits) {
        onChange("")
        return
      }
      onChange(`+${nextCountry.dial_code}${nextDigits}`)
    },
    [onChange],
  )

  const handleCountrySelect = (next: Country) => {
    setCountry(next)
    setOpen(false)
    emit(next, localDigits)
  }

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = stripNonDigits(e.target.value).slice(0, 15)
    setLocalDigits(digits)
    emit(country, digits)
  }

  return (
    <div
      className={cn(
        "flex h-10 w-full overflow-hidden rounded-tight border border-neutral-300 bg-white shadow-sm transition-colors focus-within:ring-2 focus-within:ring-neutral-950 focus-within:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:focus-within:ring-neutral-300",
        ariaInvalid &&
          "border-red-500 focus-within:ring-red-500 dark:border-red-500/70 dark:focus-within:ring-red-500/70",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label={`Country code: ${country.name} +${country.dial_code}`}
            className="flex h-full items-center gap-1.5 border-r border-neutral-200 bg-neutral-50/60 pl-3 pr-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 focus:outline-none disabled:pointer-events-none dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <span className="text-base leading-none" aria-hidden>
              {country.flag}
            </span>
            <span className="font-medium tabular-nums">
              +{country.dial_code}
            </span>
            <ChevronIcon className="size-3.5 text-neutral-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-[18rem] p-0"
        >
          <Command
            filter={(val, search) => {
              const q = search.toLowerCase().trim()
              if (!q) return 1
              const item = val.toLowerCase()
              return item.includes(q) ? 1 : 0
            }}
          >
            <CommandInput placeholder="Search country or code…" />
            <CommandList className="max-h-64">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((c) => {
                  const selected = c.iso2 === country.iso2
                  return (
                    <CommandItem
                      key={c.iso2}
                      value={`${c.name} +${c.dial_code} ${c.iso2}`}
                      onSelect={() => handleCountrySelect(c)}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="text-base leading-none" aria-hidden>
                        {c.flag}
                      </span>
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                        +{c.dial_code}
                      </span>
                      {selected && (
                        <CheckIcon className="size-4 text-neutral-700 dark:text-neutral-200" />
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <input
        type="tel"
        inputMode="tel"
        id={id}
        value={formatLocalDigits(localDigits)}
        onChange={handleLocalChange}
        placeholder={placeholder ?? "555 555 5555"}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={ariaInvalid}
        className="h-full flex-1 bg-transparent px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-500 dark:text-neutral-100 dark:placeholder:text-neutral-400"
      />

      {name && (
        <input
          type="hidden"
          name={name}
          value={localDigits ? `+${country.dial_code}${localDigits}` : ""}
        />
      )}
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
