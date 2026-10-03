import type { Metadata } from "next"
import Link from "next/link"

import {
  LegalCallout,
  LegalList,
  LegalPage,
  LegalSection,
} from "../_components/legal-page"

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description:
    "How, when and with what fees you can cancel or modify a Carhive reservation in Miami, Florida.",
  alternates: { canonical: "/cancellation-policy" },
}

const lastUpdated = new Date("2026-04-01")

const toc = [
  { id: "overview", label: "1. Overview" },
  { id: "free-window", label: "2. Free cancellation window" },
  { id: "late-cancellation", label: "3. Late cancellations" },
  { id: "no-show", label: "4. No-show" },
  { id: "modifications", label: "5. Modifications" },
  { id: "early-return", label: "6. Early returns" },
  { id: "host-cancellation", label: "7. Host cancellations" },
  { id: "extraordinary", label: "8. Extraordinary circumstances" },
  { id: "refund-timing", label: "9. Refund timing" },
  { id: "how-to-cancel", label: "10. How to cancel" },
]

export default function CancellationPolicyPage() {
  return (
    <LegalPage
      title="Cancellation Policy"
      subtitle="We understand that plans change. Our cancellation policy is designed to be fair to both Renters and Hosts, and is integrated into the Terms of Service."
      lastUpdated={lastUpdated}
      toc={toc}
    >
      <LegalCallout variant="info">
        <p>
          <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
            Quick reference
          </strong>
          — Cancel more than{" "}
          <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
            48 hours
          </strong>{" "}
          before pick-up for a full refund. Cancel within the 48-hour window
          and you&apos;ll receive 50% back. No-shows and same-day cancellations are
          non-refundable.
        </p>
      </LegalCallout>

      <LegalSection id="overview" title="1. Overview">
        <p>
          This Cancellation Policy applies to all reservations booked through
          Carhive. It forms part of our{" "}
          <Link href="/terms">Terms of Service</Link> and should be read
          together with them.
        </p>
      </LegalSection>

      <LegalSection id="free-window" title="2. Free cancellation window">
        <p>
          You may cancel any confirmed reservation free of charge if the
          cancellation is received at least <strong>48 hours</strong> before
          the scheduled pick-up time. The full amount charged — including
          taxes, fees and any protection plan — will be refunded to the
          original payment method.
        </p>
      </LegalSection>

      <LegalSection id="late-cancellation" title="3. Late cancellations (&lt; 48 hours)">
        <p>
          If you cancel within 48 hours of the scheduled pick-up time, you are
          entitled to a refund of <strong>50%</strong> of the rental subtotal.
          Taxes associated with the refunded amount are also returned. Any
          non-refundable service fees remain charged.
        </p>
      </LegalSection>

      <LegalSection id="no-show" title="4. No-show">
        <p>
          If you fail to appear at the pick-up location within two (2) hours of
          the reserved time and have not contacted the Host, the reservation is
          deemed a no-show. No-shows are <strong>non-refundable</strong>.
        </p>
      </LegalSection>

      <LegalSection id="modifications" title="5. Modifications">
        <p>
          Date, time, location or driver modifications are considered
          cancellation and re-booking, and follow the same timing rules above.
          Differences in price between the original and the modified booking
          will be charged or refunded accordingly.
        </p>
      </LegalSection>

      <LegalSection id="early-return" title="6. Early returns">
        <p>
          Returning the vehicle earlier than the scheduled drop-off time does
          not entitle you to a refund of the unused days or hours, unless
          explicitly stated on the booking page or agreed in writing with the
          Host.
        </p>
      </LegalSection>

      <LegalSection id="host-cancellation" title="7. Host cancellations">
        <p>
          If a Host cancels a confirmed reservation, you will receive a{" "}
          <strong>full refund</strong> plus a rebooking credit equal to 10% of
          the original subtotal that can be applied to a future reservation
          within 90 days. Carhive will also assist you in securing an
          equivalent replacement vehicle whenever possible.
        </p>
      </LegalSection>

      <LegalSection
        id="extraordinary"
        title="8. Extraordinary circumstances"
      >
        <p>
          Regardless of the timing above, Carhive may offer a full refund if
          the reservation is prevented by documented extraordinary
          circumstances, including:
        </p>
        <LegalList>
          <li>
            Natural disasters or severe weather officially declared an
            emergency (e.g. a National Hurricane Center hurricane warning for
            Miami-Dade);
          </li>
          <li>
            Mandatory evacuation orders or government travel bans affecting the
            pick-up location;
          </li>
          <li>
            Serious illness or death of the Renter or an immediate family
            member, with supporting documentation;
          </li>
          <li>
            Airline or rail cancellation to or from the pick-up city caused by
            carrier fault (not weather-based delays under three hours).
          </li>
        </LegalList>
        <p>
          Requests must be submitted within 72 hours of the triggering event at{" "}
          <a href="mailto:support@carhive.com">support@carhive.com</a>.
        </p>
      </LegalSection>

      <LegalSection id="refund-timing" title="9. Refund timing">
        <p>
          Eligible refunds are issued to the original payment method within 5–10
          business days of approval. The time it takes for the refund to appear
          on your statement depends on your card issuer.
        </p>
      </LegalSection>

      <LegalSection id="how-to-cancel" title="10. How to cancel">
        <p>You can cancel a reservation in two ways:</p>
        <LegalList ordered>
          <li>
            Log in to your Carhive account, go to{" "}
            <strong>My trips</strong>, select the reservation and click{" "}
            <strong>Cancel reservation</strong>; or
          </li>
          <li>
            Send an email to{" "}
            <a href="mailto:support@carhive.com">support@carhive.com</a> from
            the address associated with your booking, including the
            reservation number.
          </li>
        </LegalList>
        <p>
          A cancellation is only effective once you receive a written
          confirmation from Carhive.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
