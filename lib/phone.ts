/**
 * Contact phone rules. A mobile number is required to book: the team arranges
 * delivery and documents over WhatsApp, straight from the booking notice.
 *
 * Same rule as the backend (`golden-exotic-store/src/modules/rental/contact-phone.ts`),
 * which also enforces it, so a number this accepts is never refused at payment.
 */

/** E.164 with a usable shape: "+" and 8-15 digits; +1 numbers must be real NANP. */
export function isValidContactPhone(value: string | null | undefined): boolean {
  const compact = (value ?? "").trim().replace(/[\s\-().]/g, "")
  if (!compact.startsWith("+")) return false
  const digits = compact.slice(1)
  if (!/^\d{8,15}$/.test(digits)) return false
  if (digits.startsWith("1") && !/^1[2-9]\d{2}[2-9]\d{6}$/.test(digits)) {
    return false
  }
  return true
}

export const CONTACT_PHONE_HINT =
  "We'll use it to reach you on WhatsApp about your rental."

export const CONTACT_PHONE_ERROR =
  "Please enter a valid mobile number, including the country code."
