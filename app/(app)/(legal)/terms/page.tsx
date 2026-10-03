import type { Metadata } from "next"
import Link from "next/link"

import {
  LegalCallout,
  LegalList,
  LegalPage,
  LegalSection,
} from "../_components/legal-page"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms and conditions that govern your use of Carhive's car rental services in Miami, Florida.",
  alternates: { canonical: "/terms" },
}

const lastUpdated = new Date("2026-04-01")

const toc = [
  { id: "acceptance", label: "1. Acceptance of terms" },
  { id: "eligibility", label: "2. Eligibility" },
  { id: "rental-agreement", label: "3. Rental agreement" },
  { id: "pricing-payment", label: "4. Pricing & payment" },
  { id: "insurance", label: "5. Insurance" },
  { id: "vehicle-use", label: "6. Vehicle use" },
  { id: "damage-liability", label: "7. Damage & liability" },
  { id: "cancellation", label: "8. Cancellation" },
  { id: "prohibited", label: "9. Prohibited conduct" },
  { id: "governing-law", label: "10. Governing law" },
  { id: "contact", label: "11. Contact" },
]

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="These Terms of Service (the “Terms”) govern your access to and use of Carhive's website, mobile application and vehicle rental services operated from Miami, Florida."
      lastUpdated={lastUpdated}
      toc={toc}
    >
      <LegalCallout variant="info">
        <p>
          <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
            Summary
          </strong>
          — Carhive is an online marketplace for short-term vehicle rentals.
          By reserving a vehicle you agree to these Terms, our{" "}
          <Link href="/privacy">Privacy Policy</Link>, our{" "}
          <Link href="/cancellation-policy">Cancellation Policy</Link> and the{" "}
          <Link href="/driver-requirements">Driver Requirements</Link>. This
          document is a legally binding contract between you and Carhive.
        </p>
      </LegalCallout>

      <LegalSection id="acceptance" title="1. Acceptance of terms">
        <p>
          By creating an account, making a reservation or otherwise using the
          Services, you acknowledge that you have read, understood and agree to
          be bound by these Terms and by all documents incorporated by reference
          herein. If you are entering into these Terms on behalf of a company or
          other legal entity, you represent that you have the authority to bind
          such entity.
        </p>
        <p>
          If you do not agree with any part of these Terms, you must discontinue
          use of the Services.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" title="2. Eligibility">
        <p>To use the Services you must:</p>
        <LegalList>
          <li>Be at least twenty-one (21) years of age;</li>
          <li>
            Hold a valid, unexpired driver&apos;s license issued by a U.S. state, a
            U.S. territory or an equivalent foreign jurisdiction recognized
            under Fla. Stat. § 322.04;
          </li>
          <li>
            Maintain continuous automobile liability insurance satisfying the
            minimum financial-responsibility limits required by Florida law, or
            purchase a qualifying protection plan offered through Carhive at
            checkout;
          </li>
          <li>
            Provide a valid credit or debit card in your name for the security
            deposit and final payment; and
          </li>
          <li>
            Not be prohibited from entering into contracts under applicable law.
          </li>
        </LegalList>
        <p>
          Additional eligibility criteria per vehicle category are described at{" "}
          <Link href="/driver-requirements">Driver Requirements</Link>.
        </p>
      </LegalSection>

      <LegalSection id="rental-agreement" title="3. Rental agreement">
        <p>
          Each reservation you complete on the Services creates a separate
          rental agreement between you (the “Renter”) and the owner of the
          vehicle (the “Host”), with Carhive acting as the booking platform and,
          where applicable, the payment processor. The rental agreement
          incorporates these Terms and any additional terms presented at
          checkout or at vehicle pick-up.
        </p>
        <p>
          You must present your driver&apos;s license and the payment card used for
          the reservation at pick-up. Failure to do so may result in denial of
          the rental without refund.
        </p>
      </LegalSection>

      <LegalSection id="pricing-payment" title="4. Pricing & payment">
        <p>
          All prices are displayed in U.S. dollars and include applicable
          Florida state sales tax (6%) and the Miami-Dade County surtax. Rental
          totals may include additional fees such as airport concession
          recovery, vehicle-license recovery, cleaning fees and security
          deposits, which are itemized before checkout.
        </p>
        <p>
          Payment is authorized at the time of booking. A refundable security
          deposit may be pre-authorized on your card prior to vehicle pick-up
          and released after return, subject to inspection.
        </p>
      </LegalSection>

      <LegalSection id="insurance" title="5. Insurance">
        <p>
          Florida law requires every driver to carry Personal Injury Protection
          (PIP) and Property Damage Liability (PDL) coverage. By completing a
          reservation you confirm that you either (a) hold a personal auto
          insurance policy that extends to rental vehicles with at least the
          minimum Florida limits, or (b) have purchased an optional protection
          plan offered by Carhive at checkout.
        </p>
        <p>
          Optional protection plans are not a substitute for an insurance
          policy. Coverage details, deductibles and exclusions are provided
          during checkout and in the plan documents delivered by email with
          your booking confirmation.
        </p>
      </LegalSection>

      <LegalSection id="vehicle-use" title="6. Vehicle use">
        <p>You agree that the vehicle will only be operated:</p>
        <LegalList>
          <li>
            By the Renter or by an authorized additional driver listed in the
            rental agreement;
          </li>
          <li>
            On paved roads within the continental United States, unless written
            permission is obtained from the Host;
          </li>
          <li>
            In compliance with all applicable traffic laws, including Fla. Stat.
            Chapter 316;
          </li>
          <li>
            In a safe and careful manner, without transporting hazardous
            materials or more passengers than the manufacturer&apos;s rated capacity.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection id="damage-liability" title="7. Damage & liability">
        <p>
          You are financially responsible for any damage to, loss of, or theft
          of the vehicle, its accessories and its keys that occurs during the
          rental period, subject to the deductible defined by your selected
          protection plan (if any).
        </p>
        <p>
          You are also responsible for all tolls, parking tickets, traffic
          violations and citations incurred during the rental period, plus a
          reasonable administrative fee for processing them.
        </p>
      </LegalSection>

      <LegalSection id="cancellation" title="8. Cancellation">
        <p>
          Cancellations and refunds are governed by our{" "}
          <Link href="/cancellation-policy">Cancellation Policy</Link>, which
          forms part of these Terms.
        </p>
      </LegalSection>

      <LegalSection id="prohibited" title="9. Prohibited conduct">
        <p>The following uses of the vehicle are strictly prohibited:</p>
        <LegalList>
          <li>Operating while impaired by alcohol, drugs or medication;</li>
          <li>
            Use for commercial transportation of passengers (e.g. rideshare)
            unless expressly authorized in the rental agreement;
          </li>
          <li>Racing, off-road driving, towing or pushing another vehicle;</li>
          <li>
            Transporting illegal items or using the vehicle in the commission
            of a crime;
          </li>
          <li>Smoking or vaping inside the vehicle;</li>
          <li>Sub-leasing the vehicle to any third party.</li>
        </LegalList>
        <p>
          Any violation may result in immediate termination of the rental,
          forfeiture of the security deposit and recovery of the vehicle at
          your expense.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" title="10. Governing law & dispute resolution">
        <p>
          These Terms are governed by the laws of the State of Florida, without
          regard to its conflict-of-laws rules. Exclusive venue for any dispute
          arising out of or related to these Terms shall lie in the state or
          federal courts located in Miami-Dade County, Florida, and the parties
          consent to the personal jurisdiction of those courts.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="11. Contact">
        <p>
          Questions about these Terms can be directed to our legal team at{" "}
          <a href="mailto:legal@carhive.com">legal@carhive.com</a>, or by mail
          to Carhive, 1 SE 3rd Ave, Miami, FL 33131, United States.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
