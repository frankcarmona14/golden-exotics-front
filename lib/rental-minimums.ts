import type { RentalMinimumRule } from "@/lib/types/rental"

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
/** Semana de lunes a domingo: "Fri–Sun" es un tramo, no dos sueltos. */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

/** "Fri–Sun", "Sat", "Mon, Wed". */
function formatWeekdays(weekdays: number[]): string {
  const positions = Array.from(new Set(weekdays))
    .map((d) => WEEK_ORDER.indexOf(d))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b)
  const contiguous = positions.every((p, i) => i === 0 || p === positions[i - 1] + 1)
  const names = positions.map((p) => WEEKDAY_SHORT[WEEK_ORDER[p]])
  return contiguous && names.length > 2
    ? `${names[0]}–${names[names.length - 1]}`
    : names.join(", ")
}

/**
 * Lo que la ficha añade al "Min N days" del coche por las reglas por fecha
 * (P0-5): "2 on Fri–Sun", y un aviso genérico si alguna regla va por fechas
 * concretas, que no caben en una línea. Solo cuentan las que suben el mínimo.
 */
export function describeRuleMinimums(
  rules: RentalMinimumRule[],
  configMin: number
): string[] {
  const raising = rules.filter((r) => r.min_days > configMin)
  const byWeekday = raising.filter((r) => !r.start_date && !r.end_date)
  const dated = raising.filter((r) => r.start_date || r.end_date)

  const parts = byWeekday
    .sort((a, b) => a.min_days - b.min_days)
    .map((r) =>
      r.weekdays?.length
        ? `${r.min_days} on ${formatWeekdays(r.weekdays)}`
        : `${r.min_days} days`
    )
  if (dated.length) parts.push("longer on some dates")
  return parts
}
