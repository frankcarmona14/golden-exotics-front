import type { Metadata } from "next"
import Link from "next/link"

import {
  LegalCallout,
  LegalList,
  LegalPage,
  LegalSection,
} from "../_components/legal-page"

export const metadata: Metadata = {
  title: "Driver Requirements",
  description:
    "Age, license and insurance requirements to rent a vehicle through Carhive in Miami, Florida.",
}

const lastUpdated = new Date("2026-04-01")

const toc = [
  { id: "summary", label: "1. Summary" },
  { id: "age", label: "2. Minimum age" },
  { id: "license", label: "3. Driver's license" },
  { id: "insurance", label: "4. Insurance" },
  { id: "additional-drivers", label: "5. Additional drivers" },
  { id: "international", label: "6. International visitors" },
  { id: "verification", label: "7. Verification at pick-up" },
]

export default function DriverRequirementsPage() {
  return (
    <LegalPage
      title="Driver Requirements"
      subtitle="Before you book, please make sure you meet the minimum requirements to drive a vehicle rented through Carhive. These rules apply to all reservations picked up in Miami-Dade County."
      lastUpdated={lastUpdated}
      toc={toc}
    >
      <LegalCallout variant="warning">
        <p>
          <strong className="font-semibold">Important</strong> — The Renter is
          the person who makes and pays for the reservation. Only the Renter
          and drivers explicitly listed in the rental agreement are allowed to
          operate the vehicle. Allowing an unauthorized driver voids any
          protection plan.
        </p>
      </LegalCallout>

      <LegalSection id="summary" title="1. Summary">
        <LegalList>
          <li>Minimum age: 21 years (25 for premium and specialty vehicles).</li>
          <li>
            Valid, unexpired driver&apos;s license held for at least 12 consecutive
            months.
          </li>
          <li>
            Personal automobile insurance meeting Florida minimums, or a
            Carhive protection plan purchased at checkout.
          </li>
          <li>Valid credit or debit card in the Renter&apos;s name.</li>
        </LegalList>
      </LegalSection>

      <LegalSection id="age" title="2. Minimum age">
        <p>
          The minimum age to rent a standard vehicle is{" "}
          <strong>twenty-one (21) years</strong>. Drivers between 21 and 24
          years of age may be charged a young-driver fee, displayed
          transparently at checkout.
        </p>
        <p>
          Premium, exotic, luxury and specialty categories (SUV 7+, convertible
          sports, electric performance) require a minimum age of{" "}
          <strong>twenty-five (25) years</strong>.
        </p>
      </LegalSection>

      <LegalSection id="license" title="3. Driver's license">
        <p>
          You must hold a valid, unexpired driver&apos;s license issued by a U.S.
          state, a U.S. territory or an equivalent foreign authority recognized
          under Fla. Stat. § 322.04. The license must have been held for at
          least twelve (12) consecutive months and must not be suspended,
          revoked or subject to restrictions inconsistent with the vehicle
          class.
        </p>
        <p>
          Temporary, learner&apos;s and provisional licenses are not accepted.
        </p>
      </LegalSection>

      <LegalSection id="insurance" title="4. Insurance">
        <p>
          Florida law requires every driver to maintain Personal Injury
          Protection (PIP) and Property Damage Liability (PDL) coverage. You
          must either:
        </p>
        <LegalList ordered>
          <li>
            Present proof of an active personal auto insurance policy that
            extends coverage to rental vehicles with at least the Florida
            minimums; <em>or</em>
          </li>
          <li>
            Purchase one of the optional protection plans offered by Carhive
            at checkout.
          </li>
        </LegalList>
        <p>
          Carhive does not act as an insurance broker and does not sell
          insurance policies. Protection plans are commercial products and
          their terms, deductibles and exclusions are described during
          checkout.
        </p>
      </LegalSection>

      <LegalSection id="additional-drivers" title="5. Additional drivers">
        <p>
          You may add one additional driver free of charge if they are the
          spouse, domestic partner or co-employee of the Renter traveling on
          the same trip. Each additional driver must meet the same age,
          license and insurance requirements, be present at pick-up and sign
          the rental agreement.
        </p>
        <p>Further additional drivers may be added for a fee of USD 10 per day.</p>
      </LegalSection>

      <LegalSection id="international" title="6. International visitors">
        <p>
          If you hold a foreign driver&apos;s license, you may rent from Carhive
          provided that:
        </p>
        <LegalList>
          <li>
            The license is valid, in the Latin alphabet (or accompanied by an{" "}
            <abbr title="International Driving Permit">IDP</abbr>) and has been
            held for at least 12 months;
          </li>
          <li>
            You present your passport at pick-up;
          </li>
          <li>
            You are lawfully present in the United States under a valid visa
            or visa-waiver.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection id="verification" title="7. Verification at pick-up">
        <p>At pick-up, please bring with you:</p>
        <LegalList>
          <li>Your physical driver&apos;s license (not a picture);</li>
          <li>The payment card used for the reservation;</li>
          <li>Passport and IDP if you are an international visitor;</li>
          <li>Proof of insurance, if you declined Carhive&apos;s protection plan.</li>
        </LegalList>
        <p>
          Failure to present any required document may result in denial of the
          rental, subject to the{" "}
          <Link href="/cancellation-policy">Cancellation Policy</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
