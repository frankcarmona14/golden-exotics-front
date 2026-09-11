/**
 * Country data used by the phone number input. Ordered by a mix of
 * tourism/business relevance for a Miami-based rental operation
 * (Americas + top EU/UK + a few Asian hubs) — "popular" entries are
 * first so they rank high in the searchable picker.
 *
 * `dial_code` is the country calling code WITHOUT the leading `+`. The
 * phone input combines it as `+<dial_code><local_number>` to produce a
 * full E.164 value.
 */
export interface Country {
  iso2: string
  name: string
  dial_code: string
  flag: string
}

export const countries: Country[] = [
  { iso2: "US", name: "United States", dial_code: "1", flag: "🇺🇸" },
  { iso2: "CA", name: "Canada", dial_code: "1", flag: "🇨🇦" },
  { iso2: "MX", name: "Mexico", dial_code: "52", flag: "🇲🇽" },
  { iso2: "BR", name: "Brazil", dial_code: "55", flag: "🇧🇷" },
  { iso2: "AR", name: "Argentina", dial_code: "54", flag: "🇦🇷" },
  { iso2: "CO", name: "Colombia", dial_code: "57", flag: "🇨🇴" },
  { iso2: "VE", name: "Venezuela", dial_code: "58", flag: "🇻🇪" },
  { iso2: "PE", name: "Peru", dial_code: "51", flag: "🇵🇪" },
  { iso2: "CL", name: "Chile", dial_code: "56", flag: "🇨🇱" },
  { iso2: "EC", name: "Ecuador", dial_code: "593", flag: "🇪🇨" },
  { iso2: "UY", name: "Uruguay", dial_code: "598", flag: "🇺🇾" },
  { iso2: "PY", name: "Paraguay", dial_code: "595", flag: "🇵🇾" },
  { iso2: "BO", name: "Bolivia", dial_code: "591", flag: "🇧🇴" },
  { iso2: "CR", name: "Costa Rica", dial_code: "506", flag: "🇨🇷" },
  { iso2: "PA", name: "Panama", dial_code: "507", flag: "🇵🇦" },
  { iso2: "GT", name: "Guatemala", dial_code: "502", flag: "🇬🇹" },
  { iso2: "HN", name: "Honduras", dial_code: "504", flag: "🇭🇳" },
  { iso2: "SV", name: "El Salvador", dial_code: "503", flag: "🇸🇻" },
  { iso2: "NI", name: "Nicaragua", dial_code: "505", flag: "🇳🇮" },
  { iso2: "CU", name: "Cuba", dial_code: "53", flag: "🇨🇺" },
  { iso2: "DO", name: "Dominican Republic", dial_code: "1", flag: "🇩🇴" },
  { iso2: "PR", name: "Puerto Rico", dial_code: "1", flag: "🇵🇷" },
  { iso2: "JM", name: "Jamaica", dial_code: "1", flag: "🇯🇲" },
  { iso2: "HT", name: "Haiti", dial_code: "509", flag: "🇭🇹" },
  { iso2: "BS", name: "Bahamas", dial_code: "1", flag: "🇧🇸" },
  { iso2: "TT", name: "Trinidad and Tobago", dial_code: "1", flag: "🇹🇹" },
  { iso2: "ES", name: "Spain", dial_code: "34", flag: "🇪🇸" },
  { iso2: "GB", name: "United Kingdom", dial_code: "44", flag: "🇬🇧" },
  { iso2: "FR", name: "France", dial_code: "33", flag: "🇫🇷" },
  { iso2: "DE", name: "Germany", dial_code: "49", flag: "🇩🇪" },
  { iso2: "IT", name: "Italy", dial_code: "39", flag: "🇮🇹" },
  { iso2: "PT", name: "Portugal", dial_code: "351", flag: "🇵🇹" },
  { iso2: "NL", name: "Netherlands", dial_code: "31", flag: "🇳🇱" },
  { iso2: "BE", name: "Belgium", dial_code: "32", flag: "🇧🇪" },
  { iso2: "CH", name: "Switzerland", dial_code: "41", flag: "🇨🇭" },
  { iso2: "AT", name: "Austria", dial_code: "43", flag: "🇦🇹" },
  { iso2: "IE", name: "Ireland", dial_code: "353", flag: "🇮🇪" },
  { iso2: "SE", name: "Sweden", dial_code: "46", flag: "🇸🇪" },
  { iso2: "NO", name: "Norway", dial_code: "47", flag: "🇳🇴" },
  { iso2: "DK", name: "Denmark", dial_code: "45", flag: "🇩🇰" },
  { iso2: "FI", name: "Finland", dial_code: "358", flag: "🇫🇮" },
  { iso2: "IS", name: "Iceland", dial_code: "354", flag: "🇮🇸" },
  { iso2: "PL", name: "Poland", dial_code: "48", flag: "🇵🇱" },
  { iso2: "CZ", name: "Czech Republic", dial_code: "420", flag: "🇨🇿" },
  { iso2: "SK", name: "Slovakia", dial_code: "421", flag: "🇸🇰" },
  { iso2: "HU", name: "Hungary", dial_code: "36", flag: "🇭🇺" },
  { iso2: "RO", name: "Romania", dial_code: "40", flag: "🇷🇴" },
  { iso2: "BG", name: "Bulgaria", dial_code: "359", flag: "🇧🇬" },
  { iso2: "GR", name: "Greece", dial_code: "30", flag: "🇬🇷" },
  { iso2: "TR", name: "Turkey", dial_code: "90", flag: "🇹🇷" },
  { iso2: "RU", name: "Russia", dial_code: "7", flag: "🇷🇺" },
  { iso2: "UA", name: "Ukraine", dial_code: "380", flag: "🇺🇦" },
  { iso2: "IL", name: "Israel", dial_code: "972", flag: "🇮🇱" },
  { iso2: "AE", name: "United Arab Emirates", dial_code: "971", flag: "🇦🇪" },
  { iso2: "SA", name: "Saudi Arabia", dial_code: "966", flag: "🇸🇦" },
  { iso2: "QA", name: "Qatar", dial_code: "974", flag: "🇶🇦" },
  { iso2: "KW", name: "Kuwait", dial_code: "965", flag: "🇰🇼" },
  { iso2: "BH", name: "Bahrain", dial_code: "973", flag: "🇧🇭" },
  { iso2: "OM", name: "Oman", dial_code: "968", flag: "🇴🇲" },
  { iso2: "EG", name: "Egypt", dial_code: "20", flag: "🇪🇬" },
  { iso2: "MA", name: "Morocco", dial_code: "212", flag: "🇲🇦" },
  { iso2: "TN", name: "Tunisia", dial_code: "216", flag: "🇹🇳" },
  { iso2: "DZ", name: "Algeria", dial_code: "213", flag: "🇩🇿" },
  { iso2: "ZA", name: "South Africa", dial_code: "27", flag: "🇿🇦" },
  { iso2: "NG", name: "Nigeria", dial_code: "234", flag: "🇳🇬" },
  { iso2: "KE", name: "Kenya", dial_code: "254", flag: "🇰🇪" },
  { iso2: "CN", name: "China", dial_code: "86", flag: "🇨🇳" },
  { iso2: "JP", name: "Japan", dial_code: "81", flag: "🇯🇵" },
  { iso2: "KR", name: "South Korea", dial_code: "82", flag: "🇰🇷" },
  { iso2: "IN", name: "India", dial_code: "91", flag: "🇮🇳" },
  { iso2: "ID", name: "Indonesia", dial_code: "62", flag: "🇮🇩" },
  { iso2: "TH", name: "Thailand", dial_code: "66", flag: "🇹🇭" },
  { iso2: "VN", name: "Vietnam", dial_code: "84", flag: "🇻🇳" },
  { iso2: "PH", name: "Philippines", dial_code: "63", flag: "🇵🇭" },
  { iso2: "MY", name: "Malaysia", dial_code: "60", flag: "🇲🇾" },
  { iso2: "SG", name: "Singapore", dial_code: "65", flag: "🇸🇬" },
  { iso2: "HK", name: "Hong Kong", dial_code: "852", flag: "🇭🇰" },
  { iso2: "TW", name: "Taiwan", dial_code: "886", flag: "🇹🇼" },
  { iso2: "PK", name: "Pakistan", dial_code: "92", flag: "🇵🇰" },
  { iso2: "BD", name: "Bangladesh", dial_code: "880", flag: "🇧🇩" },
  { iso2: "AU", name: "Australia", dial_code: "61", flag: "🇦🇺" },
  { iso2: "NZ", name: "New Zealand", dial_code: "64", flag: "🇳🇿" },
]

export const DEFAULT_COUNTRY_ISO2 = "US"

/** Find a country by its ISO 3166-1 alpha-2 code (case-insensitive). */
export function findCountryByIso2(iso2: string): Country | undefined {
  const upper = iso2.toUpperCase()
  return countries.find((c) => c.iso2 === upper)
}

/**
 * Given a phone string in E.164 format (e.g. "+13055551234") return the
 * country whose dial_code matches the prefix. Ambiguous prefixes resolve
 * to the first match in the list (US beats Canada/DR/PR, which is the
 * right call for a Miami-based app).
 */
export function findCountryByE164(e164: string): Country | undefined {
  if (!e164.startsWith("+")) return undefined
  const digits = e164.slice(1)
  // Try longest prefix first so "+593" matches Ecuador before "+59" (nothing).
  const sorted = [...countries].sort(
    (a, b) => b.dial_code.length - a.dial_code.length,
  )
  return sorted.find((c) => digits.startsWith(c.dial_code))
}
